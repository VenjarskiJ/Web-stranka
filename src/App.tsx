import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  Code2,
  Cpu,
  ExternalLink,
  Github,
  Globe2,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Network,
  ScanLine,
  Sun,
  X,
} from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import ContactModal from './components/ContactModal';
import HeroDrone from './components/HeroDrone';
import { DecodeText, Reveal, SectionHeading } from './components/MotionPrimitives';
import Profile3D from './components/Profile3D';
import SignalBackground from './components/SignalBackground';

const InteractiveCharts = lazy(() => import('./components/InteractiveCharts'));

type Language = 'en' | 'sk';
type Theme = 'dark' | 'light';

type Project = {
  index: string;
  title: string;
  description: string;
  detail: string;
  tags: string[];
  metric: string;
  metricLabel: string;
  accent: 'cyan' | 'violet' | 'pink' | 'emerald';
  icon: typeof ScanLine;
};

const copy = {
  en: {
    nav: { about: 'About', skills: 'Expertise', research: 'Research', publications: 'Publications', contact: 'Contact' },
    status: 'Open to research collaboration',
    role: 'Researcher · Educator · Research Engineer',
    heroLead: 'Researching what',
    heroAccent: 'machines can see.',
    heroTail: 'Building what people can experience.',
    heroDescription:
      'I connect computer vision, signal processing, 3D technologies, and research engineering to turn demanding ideas into clear, working systems.',
    viewResearch: 'See how I work',
    contactMe: 'Start a conversation',
    scroll: 'Scroll to explore',
    visualLabel: 'SPATIAL RESEARCH INTERFACE',
    heroMetrics: [
      { value: 'Research', label: 'from questions to evidence' },
      { value: 'Engineering', label: 'from concepts to working systems' },
      { value: 'Education', label: 'from complexity to understanding' },
    ],
    aboutEyebrow: 'Research profile',
    aboutTitle: 'Between pixels and spatial intelligence',
    aboutDescription: 'A researcher, educator, and developer working where geometry, vision, and signals converge.',
    aboutP1:
      'I earned my M.S. in Telecommunications at the Slovak University of Technology in Bratislava in 2021 and continued there with doctoral research in 3D computer vision, getting my Ph.D.',
    aboutP2:
      'At the Institute of Multimedia Information and Communication Technologies, I combine fundamental research, robust software pipelines, and university teaching.',
    aboutP3:
      'My current work focuses on depth-aware image stitching and robust feature matching for Novel View Synthesis — generating convincing virtual viewpoints from sparse camera arrays for real-time telepresence.',
    education: 'Academic trajectory',
    phd: 'Ph.D. · Telecommunications',
    phdDate: 'Slovak University of Technology · 2021–2026',
    masters: 'M.S. · Telecommunications',
    mastersDate: 'Slovak University of Technology · 2019–2021',
    base: 'Bratislava, Slovakia',
    institute: 'IMICT · Faculty of Electrical Engineering & IT',
    skillsEyebrow: 'Capability map',
    skillsTitle: 'A technical stack built for 3D problems',
    skillsDescription: 'From signal foundations to neural rendering and real-time implementation.',
    interactiveLabel: 'Interactive research data',
    researchEyebrow: 'Selected systems',
    researchTitle: 'Research translated into working methods',
    researchDescription: 'Focused projects that turn difficult spatial-vision problems into measurable, efficient pipelines.',
    inspect: 'Inspect system',
    publicationsEyebrow: 'Research output',
    publicationsTitle: 'Selected publications',
    publicationsDescription: 'Peer-reviewed work spanning feature matching, virtual views, segmentation, and depth-aware imaging.',
    abstract: 'Contribution',
    viewProfile: 'Research profile',
    contactEyebrow: 'Initialize collaboration',
    contactTitle: 'Let’s build the next viewpoint.',
    contactDescription:
      'Research partnership, computer vision consultation, academic collaboration, or an ambitious 3D product — tell me what you are trying to see.',
    sendMessage: 'Send a message',
    footer: 'Researching the space between captured pixels and reconstructed reality.',
    close: 'Close',
  },
  sk: {
    nav: { about: 'O mne', skills: 'Expertíza', research: 'Výskum', publications: 'Publikácie', contact: 'Kontakt' },
    status: 'Otvorený výskumnej spolupráci',
    role: 'Výskumník · Pedagóg · Výskumný vývojár',
    heroLead: 'Skúmam, čo dokážu',
    heroAccent: 'vidieť stroje.',
    heroTail: 'Tvorím to, čo môžu zažiť ľudia.',
    heroDescription:
      'Prepájam počítačové videnie, spracovanie signálov, 3D technológie a výskumný vývoj, aby som náročné myšlienky menil na zrozumiteľné a funkčné systémy.',
    viewResearch: 'Pozrieť, ako pracujem',
    contactMe: 'Začať rozhovor',
    scroll: 'Posuňte sa a preskúmajte',
    visualLabel: 'PRIESTOROVÉ VÝSKUMNÉ ROZHRANIE',
    heroMetrics: [
      { value: 'Výskum', label: 'od otázok k dôkazom' },
      { value: 'Vývoj', label: 'od konceptov k funkčným systémom' },
      { value: 'Vzdelávanie', label: 'od zložitosti k porozumeniu' },
    ],
    aboutEyebrow: 'Výskumný profil',
    aboutTitle: 'Medzi pixelmi a priestorovou inteligenciou',
    aboutDescription: 'Výskumník, pedagóg a vývojár na prieniku geometrie, počítačového videnia a signálov.',
    aboutP1:
      'Inžiniersky titul v odbore telekomunikácie som získal na Slovenskej technickej univerzite v Bratislave v roku 2021 a následne som pokračoval doktorandským výskumom v oblasti 3D počítačového videnia, vdaka ktorému som získal titul PhD.',
    aboutP2:
      'Na Ústave multimediálnych informačných a komunikačných technológií prepájam základný výskum, robustné softvérové riešenia a univerzitné vzdelávanie.',
    aboutP3:
      'V súčasnosti sa venujem spájaniu obrazov s využitím hĺbkových informácií a robustnému párovaniu príznakov pre syntézu nových pohľadov z riedkych kamerových polí v teleprezencii v reálnom čase.',
    education: 'Akademická dráha',
    phd: 'PhD. · Telekomunikácie',
    phdDate: 'Slovenská technická univerzita · 2021–2026',
    masters: 'Ing. · Telekomunikácie',
    mastersDate: 'Slovenská technická univerzita · 2019–2021',
    base: 'Bratislava, Slovensko',
    institute: 'ÚMKT · Fakulta elektrotechniky a informatiky',
    skillsEyebrow: 'Mapa schopností',
    skillsTitle: 'Technický základ pre náročné 3D problémy',
    skillsDescription: 'Od teórie signálov cez neurónové vykresľovanie až po implementáciu v reálnom čase.',
    interactiveLabel: 'Interaktívne výskumné dáta',
    researchEyebrow: 'Vybrané systémy',
    researchTitle: 'Výskum pretavený do funkčných metód',
    researchDescription: 'Projekty, ktoré premieňajú náročné úlohy priestorového videnia na merateľné a efektívne riešenia.',
    inspect: 'Preskúmať systém',
    publicationsEyebrow: 'Výskumné výstupy',
    publicationsTitle: 'Vybrané publikácie',
    publicationsDescription: 'Recenzované práce z oblasti párovania príznakov, virtuálnych pohľadov, segmentácie a hĺbkového zobrazovania.',
    abstract: 'Prínos',
    viewProfile: 'Výskumný profil',
    contactEyebrow: 'Inicializovať spoluprácu',
    contactTitle: 'Vytvorme ďalší pohľad.',
    contactDescription:
      'Výskumné partnerstvo, konzultácia v oblasti počítačového videnia, akademická spolupráca alebo ambiciózny 3D produkt — povedzte mi, čo potrebujete vidieť.',
    sendMessage: 'Napísať správu',
    footer: 'Skúmam priestor medzi zachytenými pixelmi a rekonštruovanou realitou.',
    close: 'Zavrieť',
  },
} as const;

const expertise = {
  en: [
    { code: 'CV.01', title: 'Computer Vision & 3D', icon: ScanLine, accent: 'cyan', skills: ['Novel View Synthesis', '3D Reconstruction', 'Feature Matching', 'Depth Estimation', 'Image Stitching'] },
    { code: 'SP.02', title: 'Signal Processing', icon: Activity, accent: 'pink', skills: ['Analog & Digital Signals', 'Fourier Analysis', 'Frequency-domain Filtering', 'Multimedia Processing', 'DSP Education'] },
    { code: 'AI.03', title: 'AI & Neural Rendering', icon: BrainCircuit, accent: 'violet', skills: ['NeRF', '3D Gaussian Splatting', 'PyTorch', 'MediaPipe & YOLO', 'DeepLabV3'] },
    { code: 'SE.04', title: 'Research Engineering', icon: Code2, accent: 'emerald', skills: ['Python & C++', 'OpenCV & NumPy', 'React', 'CUDA Optimization', 'Git'] },
  ],
  sk: [
    { code: 'CV.01', title: 'Počítačové videnie a 3D', icon: ScanLine, accent: 'cyan', skills: ['Syntéza nových pohľadov', '3D rekonštrukcia', 'Párovanie príznakov', 'Odhad hĺbky', 'Spájanie obrazov'] },
    { code: 'SP.02', title: 'Spracovanie signálov', icon: Activity, accent: 'pink', skills: ['Analógové a digitálne signály', 'Fourierova analýza', 'Frekvenčné filtrovanie', 'Spracovanie multimédií', 'Výučba DSP'] },
    { code: 'AI.03', title: 'UI a neurónové vykresľovanie', icon: BrainCircuit, accent: 'violet', skills: ['NeRF', '3D Gaussian Splatting', 'PyTorch', 'MediaPipe a YOLO', 'DeepLabV3'] },
    { code: 'SE.04', title: 'Výskumný softvér', icon: Code2, accent: 'emerald', skills: ['Python a C++', 'OpenCV a NumPy', 'React', 'Optimalizácia CUDA', 'Git'] },
  ],
} as const;

const projects: Record<Language, Project[]> = {
  en: [
    { index: '01', title: 'KRAFT Algorithm', description: 'Robust, adaptive keypoint tracking for small-baseline stereo.', detail: 'KRAFT combines adaptive gradient thresholding with Quadrant Normalized Cross-Correlation to deliver computationally efficient feature matching for human-centric, small-baseline stereo scenarios.', tags: ['Feature Matching', 'Q-NCC', 'Stereo Vision'], metric: '98.9%', metricLabel: 'precision', accent: 'cyan', icon: Network },
    { index: '02', title: 'Novel View Synthesis', description: 'Virtual camera perspectives from only two to four physical cameras.', detail: 'Multiple lightweight pipelines combine landmark-based warping, DIBR, semantic completion, and pose-aware synthesis to correct gaze and generate convincing intermediate viewpoints for telepresence.', tags: ['DIBR', 'MediaPipe', 'Delaunay'], metric: '2–4', metricLabel: 'camera inputs', accent: 'violet', icon: Layers3 },
    { index: '03', title: 'Depth-Aware Stitching', description: '2.5D scene stitching designed for pronounced parallax.', detail: 'Layered Depth Images, SGBM, and RAFT-Stereo replace a single global homography with depth-aware warping, reducing geometric artifacts in close-range 3D reconstruction.', tags: ['OpenCV', 'LDI', 'RAFT-Stereo'], metric: '2.5D', metricLabel: 'scene model', accent: 'pink', icon: ScanLine },
    { index: '04', title: 'Academic Supervision', description: 'Teaching and guiding applied computer vision and signal-processing projects.', detail: 'Supervision of bachelor and team projects at STU, including depth-map interpolation, Instant-NGP scene reconstruction, and real-time computer-vision pipelines, alongside core DSP courses.', tags: ['Mentorship', 'DSP', 'Research'], metric: 'DSP', metricLabel: 'courses 1 & 2', accent: 'emerald', icon: GraduationCap },
  ],
  sk: [
    { index: '01', title: 'Algoritmus KRAFT', description: 'Robustné adaptívne sledovanie kľúčových bodov pre stereo s malou bázou.', detail: 'KRAFT kombinuje adaptívne prahovanie gradientu s kvadrantovou normalizovanou krížovou koreláciou a prináša výpočtovo efektívne párovanie príznakov v stereo scénach zameraných na človeka.', tags: ['Párovanie príznakov', 'Q-NCC', 'Stereo videnie'], metric: '98,9 %', metricLabel: 'presnosť', accent: 'cyan', icon: Network },
    { index: '02', title: 'Syntéza nových pohľadov', description: 'Virtuálne kamerové pohľady iba z dvoch až štyroch fyzických kamier.', detail: 'Ľahké riešenia kombinujú deformáciu podľa orientačných bodov, DIBR, sémantické dopĺňanie a syntézu podľa pózy na korekciu pohľadu a tvorbu vierohodných medzipohľadov pre teleprezenciu.', tags: ['DIBR', 'MediaPipe', 'Delaunay'], metric: '2–4', metricLabel: 'vstupné kamery', accent: 'violet', icon: Layers3 },
    { index: '03', title: 'Hĺbkovo orientované spájanie', description: 'Spájanie 2,5D scén navrhnuté pre výraznú paralaxu.', detail: 'Vrstvené hĺbkové obrazy, SGBM a RAFT-Stereo nahrádzajú jednu globálnu homografiu deformáciou rešpektujúcou hĺbku, čím znižujú geometrické artefakty pri 3D rekonštrukcii zblízka.', tags: ['OpenCV', 'LDI', 'RAFT-Stereo'], metric: '2,5D', metricLabel: 'model scény', accent: 'pink', icon: ScanLine },
    { index: '04', title: 'Akademické vedenie', description: 'Výučba a vedenie projektov z počítačového videnia a spracovania signálov.', detail: 'Vedenie bakalárskych a tímových projektov na STU v oblastiach interpolácie hĺbkových máp, rekonštrukcie pomocou Instant-NGP a spracovania obrazu v reálnom čase spolu s výučbou profilových predmetov DSP.', tags: ['Mentorovanie', 'DSP', 'Výskum'], metric: 'DSP', metricLabel: 'predmety 1 a 2', accent: 'emerald', icon: GraduationCap },
  ],
};

const publications = [
  { year: '2026', title: 'KRAFT: Keypoint Robust and Adaptive Feature Tracking', authors: 'Jaroslav Venjarski, Gregor Rozinaj, Ivan Minárik, Šimon Tibenský', venue: 'IEEE Access · Vol. 14', summary: 'An efficient feature-matching method for small-baseline stereo that combines adaptive gradient thresholds with Q-NCC and reaches 98.9% precision on human-centric datasets.' },
  { year: '2025', title: 'Novel View Synthesis using Landmark-based Warping', authors: 'Jaroslav Venjarski, Richard Filák, Vivek Dwivedi, Stanislav Šidla, Gregor Rozinaj', venue: 'ELMAR · Zadar, Croatia', summary: 'A lightweight real-time method for synthesizing a seamless middle facial view using extended face landmarks, Delaunay triangulation, and affine warping.' },
  { year: '2024', title: 'Keypoint-Based Foreground-Background Image Segmentation', authors: 'Jaroslav Venjarski, Ľuboš Likó, Šimon Tibenský, Marek Vančo, Gregor Rozinaj', venue: 'ELMAR · Zadar, Croatia', summary: 'A practical segmentation method that combines keypoints and contours for precise foreground extraction in shifted stereo imagery.' },
  { year: '2023', title: 'Analyzing Classical and LDI Depth-Aware Image Stitching for Enhanced Virtual View Representation', authors: 'Jaroslav Venjarski, Šimon Tibenský, Gregor Rozinaj', venue: 'IWSSIP · 30th International Conference', summary: 'A comparative analysis showing how Layered Depth Images reduce artifacts and geometric distortion compared with classical stitching.' },
  { year: '2022', title: 'Automatic image stitching for stereo spherical image', authors: 'Jaroslav Venjarski, Vivek Dwivedi, Gregor Rozinaj', venue: 'ELMAR · Zadar, Croatia', summary: 'An investigation of automated local-feature stitching and the depth-related limitations of traditional 2D methods in close-range 3D scenes.' },
];

const navIds = ['about', 'skills', 'research', 'publications', 'contact'] as const;

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<(typeof navIds)[number]>('about');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, 92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0.32]);
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as (typeof navIds)[number]);
      },
      { rootMargin: '-22% 0px -60%', threshold: [0.08, 0.3, 0.6] },
    );

    navIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const nav = useMemo(() => navIds.map((id) => ({ id, label: t.nav[id] })), [t]);
  const toggleLanguage = () => setLang((current) => current === 'en' ? 'sk' : 'en');
  const openContact = () => setIsContactOpen(true);

  return (
    <div className="site-shell">
      <SignalBackground />
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />

      <nav className="top-nav" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Jaroslav Venjarski — home">
          <span>JV</span><i />
        </a>

        <div className="nav-links">
          {nav.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={activeSection === id ? 'is-active' : ''}>
              <span>0{navIds.indexOf(id) + 1}</span>{label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button onClick={toggleLanguage} className="utility-button" aria-label={lang === 'en' ? 'Switch to Slovak' : 'Prepnúť do angličtiny'}>
            <Globe2 size={16} />
            <span>{lang.toUpperCase()}</span>
          </button>
          <button onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} className="icon-button" aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="icon-button mobile-menu-button" aria-label="Open navigation">
            <Menu size={19} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
            <button onClick={() => setIsMenuOpen(false)} className="icon-button mobile-menu__close" aria-label="Close navigation"><X size={20} /></button>
            {nav.map(({ id, label }, index) => (
              <a key={id} href={`#${id}`} onClick={() => setIsMenuOpen(false)}><span>0{index + 1}</span>{label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main id="top" className="site-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <HeroDrone />
          <motion.div className="hero-copy" style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div className="availability-pill" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="availability-pill__pulse" />{t.status}
            </motion.div>
            <motion.p className="hero-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>{t.role}</motion.p>
            <h1 id="hero-title">
              <span>{t.heroLead}</span>
              <span className="hero-gradient"><DecodeText text={t.heroAccent} /></span>
              <span>{t.heroTail}</span>
            </h1>
            <motion.p className="hero-description" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.7 }}>
              {t.heroDescription}
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
              <a className="button-primary" href="#research">{t.viewResearch}<ArrowDownRight size={18} /></a>
              <button className="button-secondary" onClick={openContact}>{t.contactMe}<ArrowUpRight size={18} /></button>
            </motion.div>
          </motion.div>

          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.18 }}>
            <div className="hero-visual__label"><span>{t.visualLabel}</span><i /></div>
            <Profile3D theme={theme} />
          </motion.div>

          <div className="hero-metrics">
            {t.heroMetrics.map((metric, index) => (
              <motion.div key={metric.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + index * 0.1 }}>
                <strong>{metric.value}</strong><span>{metric.label}</span>
              </motion.div>
            ))}
          </div>

          <a className="scroll-cue" href="#about"><ChevronDown size={16} /><span>{t.scroll}</span></a>
        </section>

        <div className="signal-rail" aria-hidden="true">
          <span>NERF</span><i /><span>3DGS</span><i /><span>NVS</span><i /><span>DEPTH</span><i /><span>Q-NCC</span><i /><span>CUDA</span>
        </div>

        <section id="about" className="content-section">
          <SectionHeading index="01" eyebrow={t.aboutEyebrow} title={t.aboutTitle} description={t.aboutDescription} />
          <div className="about-grid">
            <Reveal className="about-copy">
              <p className="about-copy__lead">{t.aboutP1}</p>
              <p>{t.aboutP2}</p>
              <p>{t.aboutP3}</p>
            </Reveal>
            <Reveal className="academic-panel cyber-panel" delay={0.12}>
              <div className="panel-index"><GraduationCap size={21} /><span>{t.education}</span></div>
              <div className="timeline-item"><i /><div><strong>{t.phd}</strong><span>{t.phdDate}</span></div></div>
              <div className="timeline-item"><i /><div><strong>{t.masters}</strong><span>{t.mastersDate}</span></div></div>
              <div className="identity-readout">
                <div><span>BASE</span><strong>{t.base}</strong></div>
                <div><span>NODE</span><strong>{t.institute}</strong></div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="skills" className="content-section">
          <SectionHeading index="02" eyebrow={t.skillsEyebrow} title={t.skillsTitle} description={t.skillsDescription} />
          <div className="expertise-grid">
            {expertise[lang].map((area, index) => {
              const Icon = area.icon;
              return (
                <Reveal key={area.code} className={`expertise-card cyber-panel accent-${area.accent}`} delay={index * 0.08}>
                  <div className="expertise-card__head"><span>{area.code}</span><Icon size={25} /></div>
                  <h3>{area.title}</h3>
                  <ul>{area.skills.map((skill) => <li key={skill}><Check size={13} />{skill}</li>)}</ul>
                  <div className="expertise-card__scan" />
                </Reveal>
              );
            })}
          </div>
          <Reveal className="interactive-module" delay={0.1}>
            <div className="interactive-module__label"><Cpu size={16} /><span>{t.interactiveLabel}</span><i /></div>
            <Suspense fallback={<div className="data-console-skeleton" aria-label="Loading interactive research data"><i /><i /><i /></div>}>
              <InteractiveCharts lang={lang} />
            </Suspense>
          </Reveal>
        </section>

        <section id="research" className="content-section">
          <SectionHeading index="03" eyebrow={t.researchEyebrow} title={t.researchTitle} description={t.researchDescription} />
          <div className="projects-grid">
            {projects[lang].map((project, index) => {
              const Icon = project.icon;
              return (
                <Reveal key={project.index} delay={index * 0.07}>
                  <button className={`project-card cyber-panel accent-${project.accent}`} onClick={() => setSelectedProject(project)}>
                    <div className="project-card__top"><span>{project.index} / 04</span><Icon size={25} /></div>
                    <div className="project-card__metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-card__footer"><span>{t.inspect}</span><ArrowUpRight size={17} /></div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="publications" className="content-section">
          <SectionHeading index="04" eyebrow={t.publicationsEyebrow} title={t.publicationsTitle} description={t.publicationsDescription} />
          <div className="publication-list">
            {publications.map((publication, index) => (
              <Reveal key={publication.title} className="publication-row" delay={Math.min(index * 0.06, 0.2)}>
                <div className="publication-row__year"><span>{publication.year}</span><i /></div>
                <div className="publication-row__body">
                  <p className="publication-row__venue">{publication.venue}</p>
                  <h3>{publication.title}</h3>
                  <p className="publication-row__authors">{publication.authors}</p>
                  <p className="publication-row__summary"><strong>{t.abstract}.</strong> {publication.summary}</p>
                </div>
                <a href="https://www.researchgate.net/profile/Jaroslav-Venjarski" target="_blank" rel="noreferrer" aria-label={`${t.viewProfile}: ${publication.title}`}>
                  <ExternalLink size={18} />
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <Reveal className="contact-console cyber-panel">
            <div className="contact-console__meta"><span>05 / CONTACT</span><span className="status-dot">CHANNEL OPEN</span></div>
            <p>{t.contactEyebrow}</p>
            <h2>{t.contactTitle}</h2>
            <p className="contact-console__description">{t.contactDescription}</p>
            <button className="contact-launch" onClick={openContact}><Mail size={21} />{t.sendMessage}<ArrowUpRight size={19} /></button>
            <div className="social-links">
              <a href="https://www.researchgate.net/profile/Jaroslav-Venjarski" target="_blank" rel="noreferrer"><span>RG</span>ResearchGate<ArrowUpRight size={14} /></a>
              <a href="https://orcid.org/0000-0001-7944-4891" target="_blank" rel="noreferrer"><span>iD</span>ORCID<ArrowUpRight size={14} /></a>
              <a href="https://github.com/" target="_blank" rel="noreferrer"><Github size={16} />GitHub<ArrowUpRight size={14} /></a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={16} />LinkedIn<ArrowUpRight size={14} /></a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand-mark" href="#top"><span>JV</span><i /></a>
        <p>© {new Date().getFullYear()} Jaroslav Venjarski · {t.footer}</p>
        <a href="#top">TOP <ArrowUpRight size={14} /></a>
      </footer>

      <AnimatePresence>
        {selectedProject && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSelectedProject(null)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="project-modal-title" className={`project-modal cyber-panel accent-${selectedProject.accent}`} initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 18 }} onMouseDown={(event) => event.stopPropagation()}>
              <button className="icon-button project-modal__close" onClick={() => setSelectedProject(null)} aria-label={t.close}><X size={20} /></button>
              <span className="project-modal__index">SYSTEM / {selectedProject.index}</span>
              <selectedProject.icon size={34} />
              <h3 id="project-modal-title">{selectedProject.title}</h3>
              <p>{selectedProject.detail}</p>
              <div className="project-modal__metric"><strong>{selectedProject.metric}</strong><span>{selectedProject.metricLabel}</span></div>
              <div className="tag-list">{selectedProject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} lang={lang} />
    </div>
  );
}
