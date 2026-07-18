import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const MAX_YAW = 72;
const VIEW_COUNT = 17;
const VIEW_URLS = Array.from(
  { length: VIEW_COUNT },
  (_, index) => `./avatar/multiview/portrait-${String(index).padStart(2, '0')}.webp?v=2`,
);

type Profile3DProps = {
  theme: 'dark' | 'light';
  lang: 'en' | 'sk';
};

export default function Profile3D({ theme, lang }: Profile3DProps) {
  const root = useRef<HTMLDivElement>(null);
  const targetYaw = useRef(0);
  const currentYaw = useRef(0);
  const lastInputAt = useRef(performance.now());
  const drag = useRef({ active: false, startX: 0, startYaw: 0 });
  const [yaw, setYawState] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    VIEW_URLS.forEach((url) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = url;
    });
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const animate = (time: number) => {
      const idle = !reducedMotion && !drag.current.active && time - lastInputAt.current > 1700
        ? Math.sin(time * 0.00055) * 3.2
        : 0;
      const destination = targetYaw.current + idle;
      currentYaw.current += (destination - currentYaw.current) * (reducedMotion ? 0.34 : 0.11);
      setYawState(currentYaw.current);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [reducedMotion]);

  const setYaw = (next: number) => {
    targetYaw.current = Math.max(-MAX_YAW, Math.min(MAX_YAW, next));
    lastInputAt.current = performance.now();
  };

  const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = root.current?.getBoundingClientRect();
    if (!bounds) return;
    if (drag.current.active) {
      const delta = (event.clientX - drag.current.startX) / Math.max(bounds.width, 1);
      setYaw(drag.current.startYaw + delta * MAX_YAW * 2.35);
      return;
    }
    const normalized = ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 2 - 1;
    setYaw(normalized * MAX_YAW);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { active: true, startX: event.clientX, startYaw: targetYaw.current };
    setIsInteracting(true);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current.active = false;
    setIsInteracting(false);
  };

  const handlePointerLeave = () => {
    if (drag.current.active) return;
    setYaw(0);
    setIsInteracting(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') setYaw(0);
    else setYaw(targetYaw.current + (event.key === 'ArrowRight' ? 9 : -9));
  };

  const view = useMemo(() => {
    const position = (yaw + MAX_YAW) / (MAX_YAW * 2) * (VIEW_COUNT - 1);
    const lower = Math.max(0, Math.min(VIEW_COUNT - 1, Math.floor(position)));
    const upper = Math.max(0, Math.min(VIEW_COUNT - 1, lower + 1));
    const rawBlend = upper === lower ? 0 : position - lower;
    // Keep faces crisp: even a brief dissolve between two real camera views
    // creates a visible double image around the eyes and jaw.
    const blend = rawBlend < 0.5 ? 0 : 1;

    return { lower, upper, blend };
  }, [yaw]);

  const roundedYaw = Math.round(yaw);
  const copy = lang === 'en'
    ? {
        label: 'Interactive multi-view portrait of Jaroslav Venjarski. Move or drag horizontally to rotate; use arrow keys for precise rotation.',
        drag: 'DRAG TO ROTATE',
        move: 'MOVE',
        mode: theme === 'dark' ? 'HOLOGRAPHIC CAPTURE' : 'NATURAL CAPTURE',
      }
    : {
        label: 'Interaktívny viacpohľadový portrét Jaroslava Venjarského. Pohybom alebo ťahaním do strán ho otočíte; presne ho ovládate šípkami.',
        drag: 'ŤAHOM OTOČIŤ',
        move: 'POHYB',
        mode: theme === 'dark' ? 'HOLOGRAFICKÝ ZÁZNAM' : 'PRIRODZENÝ ZÁZNAM',
      };

  return (
    <div
      ref={root}
      className={`profile-hologram profile-hologram--${theme}${isInteracting ? ' is-interacting' : ''}`}
      role="group"
      tabIndex={0}
      aria-label={copy.label}
      onPointerMove={updateFromPointer}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      <div className="profile-hologram__stage">
        <div className="profile-hologram__aura" aria-hidden="true" />
        <div className="profile-hologram__grid" aria-hidden="true" />
        <div
          className="profile-hologram__portrait"
          style={{
            '--portrait-yaw': `${yaw * 0.065}deg`,
            '--portrait-shift': `${yaw * -0.022}%`,
          } as CSSProperties}
          aria-hidden="true"
        >
          <div className="profile-hologram__depth-shadow" />
          <img
            src={VIEW_URLS[view.lower]}
            alt=""
            draggable={false}
            decoding="async"
            fetchPriority="high"
            style={{ opacity: 1 - view.blend }}
          />
          <img
            src={VIEW_URLS[view.upper]}
            alt=""
            draggable={false}
            decoding="async"
            style={{ opacity: view.blend }}
          />
          <div className="profile-hologram__surface" />
        </div>

        <div className="profile-hologram__scan" aria-hidden="true" />
        <div className="profile-hologram__hud profile-hologram__hud--top">
          <span>MULTI-VIEW SELF / 17 REAL VIEWS</span>
          <span className="status-dot">LIVE DEPTH PORTRAIT</span>
        </div>
        <div className="profile-hologram__hud profile-hologram__hud--bottom">
          <span>VIEW {roundedYaw > 0 ? '+' : ''}{roundedYaw}°</span>
          <span>{copy.mode}</span>
        </div>
        <div className="profile-hologram__projector" aria-hidden="true"><span /><span /><span /></div>
      </div>

      <div className="profile-hologram__rotate-hint" aria-hidden="true">
        <span>{copy.drag}</span>
        <i><b style={{ left: `${50 + (yaw / MAX_YAW) * 44}%` }} /></i>
        <span>← {copy.move} →</span>
      </div>
    </div>
  );
}
