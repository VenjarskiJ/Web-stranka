import * as d3 from 'd3';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  group: 'domain' | 'skill';
  radius: number;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum;
  target: string | NodeDatum;
  value: number;
}

const nodes: NodeDatum[] = [
  { id: 'Computer Vision', group: 'domain', radius: 27 },
  { id: 'Signal Processing', group: 'domain', radius: 27 },
  { id: 'Software Eng.', group: 'domain', radius: 27 },
  { id: 'AI & ML', group: 'domain', radius: 27 },
  { id: 'Novel View Synthesis', group: 'skill', radius: 13 },
  { id: '3D Reconstruction', group: 'skill', radius: 13 },
  { id: 'Feature Matching', group: 'skill', radius: 13 },
  { id: 'NeRF', group: 'skill', radius: 13 },
  { id: '3DGS', group: 'skill', radius: 13 },
  { id: 'PyTorch', group: 'skill', radius: 13 },
  { id: 'Python', group: 'skill', radius: 13 },
  { id: 'C++', group: 'skill', radius: 13 },
  { id: 'React', group: 'skill', radius: 13 },
  { id: 'DSP', group: 'skill', radius: 13 },
  { id: 'Filters', group: 'skill', radius: 13 },
];

const links: LinkDatum[] = [
  { source: 'Computer Vision', target: 'Novel View Synthesis', value: 2 },
  { source: 'Computer Vision', target: '3D Reconstruction', value: 2 },
  { source: 'Computer Vision', target: 'Feature Matching', value: 2 },
  { source: 'AI & ML', target: 'NeRF', value: 2 },
  { source: 'AI & ML', target: '3DGS', value: 2 },
  { source: 'AI & ML', target: 'PyTorch', value: 2 },
  { source: 'Software Eng.', target: 'Python', value: 2 },
  { source: 'Software Eng.', target: 'C++', value: 2 },
  { source: 'Software Eng.', target: 'React', value: 2 },
  { source: 'Signal Processing', target: 'DSP', value: 2 },
  { source: 'Signal Processing', target: 'Filters', value: 2 },
  { source: 'Novel View Synthesis', target: 'NeRF', value: 1 },
  { source: '3D Reconstruction', target: '3DGS', value: 1 },
  { source: 'Feature Matching', target: 'C++', value: 1 },
  { source: 'PyTorch', target: 'Python', value: 1 },
  { source: 'Computer Vision', target: 'AI & ML', value: 3 },
  { source: 'Signal Processing', target: 'Computer Vision', value: 1 },
];

const translations = {
  en: {
    prompt: 'Hover or drag a data core to inspect its connections.',
    domain: 'Core domain',
    skill: 'Technical node',
    labels: {
      'Computer Vision': 'Computer Vision', 'Signal Processing': 'Signal Processing', 'Software Eng.': 'Software Eng.', 'AI & ML': 'AI & ML',
      'Novel View Synthesis': 'Novel View Synthesis', '3D Reconstruction': '3D Reconstruction', 'Feature Matching': 'Feature Matching', NeRF: 'NeRF', '3DGS': '3DGS', PyTorch: 'PyTorch', Python: 'Python', 'C++': 'C++', React: 'React', DSP: 'DSP', Filters: 'Filters',
    },
    descriptions: {
      'Computer Vision': 'Interpreting visual data through geometry, correspondence, and scene understanding.',
      'Signal Processing': 'Analyzing and transforming analog, digital, and multimedia signals.',
      'Software Eng.': 'Building efficient research pipelines and reliable real-time systems.',
      'AI & ML': 'Applying learning-based representations to challenging visual problems.',
      'Novel View Synthesis': 'Generating virtual camera views from sparse observations.',
      '3D Reconstruction': 'Recovering spatial structure and geometry from 2D imagery.',
      'Feature Matching': 'Robust correspondence estimation with KRAFT, SIFT, and related methods.',
      NeRF: 'Neural radiance fields for continuous scene representation.',
      '3DGS': 'Fast scene synthesis with differentiable Gaussian primitives.',
      PyTorch: 'Research prototyping and training of deep neural networks.',
      Python: 'Primary language for research, automation, and machine learning.',
      'C++': 'High-performance implementation for real-time processing.',
      React: 'Interactive research interfaces and visual tools.',
      DSP: 'Digital signal analysis, transforms, and systems.',
      Filters: 'Design and application of analog and digital filters.',
    },
  },
  sk: {
    prompt: 'Prejdite nad dátové jadro alebo ho potiahnite a preskúmajte jeho väzby.',
    domain: 'Hlavná oblasť',
    skill: 'Technický uzol',
    labels: {
      'Computer Vision': 'Počítačové videnie', 'Signal Processing': 'Spracovanie signálov', 'Software Eng.': 'Softvérové inž.', 'AI & ML': 'UI a ML',
      'Novel View Synthesis': 'Syntéza nových pohľadov', '3D Reconstruction': '3D rekonštrukcia', 'Feature Matching': 'Párovanie príznakov', NeRF: 'NeRF', '3DGS': '3DGS', PyTorch: 'PyTorch', Python: 'Python', 'C++': 'C++', React: 'React', DSP: 'DSP', Filters: 'Filtre',
    },
    descriptions: {
      'Computer Vision': 'Interpretácia vizuálnych dát pomocou geometrie, korešpondencie a porozumenia scéne.',
      'Signal Processing': 'Analýza a transformácia analógových, digitálnych a multimediálnych signálov.',
      'Software Eng.': 'Tvorba efektívnych výskumných riešení a spoľahlivých systémov v reálnom čase.',
      'AI & ML': 'Využitie učených reprezentácií pri náročných vizuálnych problémoch.',
      'Novel View Synthesis': 'Generovanie virtuálnych kamerových pohľadov z riedkych pozorovaní.',
      '3D Reconstruction': 'Obnova priestorovej štruktúry a geometrie z 2D obrazov.',
      'Feature Matching': 'Robustný odhad korešpondencie metódami KRAFT, SIFT a ďalšími.',
      NeRF: 'Neurónové polia žiarenia pre spojitú reprezentáciu scény.',
      '3DGS': 'Rýchla syntéza scén pomocou diferencovateľných gaussovských primitív.',
      PyTorch: 'Prototypovanie a trénovanie hlbokých neurónových sietí.',
      Python: 'Hlavný jazyk pre výskum, automatizáciu a strojové učenie.',
      'C++': 'Vysokovýkonné implementácie pre spracovanie v reálnom čase.',
      React: 'Interaktívne výskumné rozhrania a vizualizačné nástroje.',
      DSP: 'Analýza digitálnych signálov, transformácie a systémy.',
      Filters: 'Návrh a použitie analógových a digitálnych filtrov.',
    },
  },
} as const;

export default function SkillNetwork({ lang }: { lang: 'en' | 'sk' }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeDatum | null>(null);
  const t = translations[lang];

  useEffect(() => {
    const svgElement = svgRef.current;
    const container = containerRef.current;
    if (!svgElement || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const compact = width < 620;
    const svg = d3.select(svgElement).attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const graphNodes = nodes.map((node) => ({ ...node, radius: compact ? node.radius * 0.8 : node.radius }));
    const graphLinks = links.map((link) => ({ ...link }));
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient').attr('id', 'network-link-gradient').attr('x1', '0%').attr('x2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#5b21b6');
    gradient.append('stop').attr('offset', '52%').attr('stop-color', '#22d3ee');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#7c3aed');
    const glow = defs.append('filter').attr('id', 'network-core-glow').attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
    glow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const simulation = d3.forceSimulation(graphNodes)
      .force('link', d3.forceLink<NodeDatum, LinkDatum>(graphLinks).id((node) => node.id).distance(compact ? 62 : 88).strength(0.72))
      .force('charge', d3.forceManyBody().strength(compact ? -170 : -280))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<NodeDatum>().radius((node) => node.radius + (compact ? 13 : 24)));

    const link = svg.append('g').attr('class', 'network-links')
      .selectAll('line').data(graphLinks).join('line')
      .attr('stroke', 'url(#network-link-gradient)')
      .attr('stroke-width', (datum) => Math.max(0.8, datum.value * 0.7))
      .attr('stroke-opacity', 0.36)
      .attr('stroke-dasharray', (datum) => datum.value === 1 ? '3 7' : '5 8');

    const node = svg.append('g').attr('class', 'network-nodes')
      .selectAll<SVGGElement, NodeDatum>('g').data(graphNodes).join('g')
      .attr('class', (datum) => `network-node network-node--${datum.group}`)
      .style('cursor', 'grab')
      .call(d3.drag<SVGGElement, NodeDatum>()
        .on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }));

    node.append('circle')
      .attr('class', 'network-node__pulse')
      .attr('r', (datum) => datum.radius + 7)
      .attr('fill', 'none')
      .attr('stroke', (datum) => datum.group === 'domain' ? '#a78bfa' : '#22d3ee')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 0.24);

    node.append('circle')
      .attr('class', 'network-node__core')
      .attr('r', (datum) => datum.radius)
      .attr('fill', (datum) => datum.group === 'domain' ? 'rgba(124,58,237,.72)' : 'rgba(6,182,212,.72)')
      .attr('stroke', (datum) => datum.group === 'domain' ? '#c4b5fd' : '#67e8f9')
      .attr('stroke-width', 1.2)
      .attr('filter', 'url(#network-core-glow)')
      .on('pointerenter', (event, datum) => {
        setHoveredNode(datum);
        d3.select(event.currentTarget).transition().duration(180).attr('r', datum.radius * 1.16).attr('stroke-width', 2.5);
        link.attr('stroke-opacity', (item) => item.source === datum || item.target === datum ? 0.95 : 0.06)
          .attr('stroke-width', (item) => item.source === datum || item.target === datum ? 2.4 : 0.7);
      })
      .on('pointerleave', (event, datum) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).transition().duration(220).attr('r', datum.radius).attr('stroke-width', 1.2);
        link.attr('stroke-opacity', 0.36).attr('stroke-width', (item) => Math.max(0.8, item.value * 0.7));
      });

    node.append('circle').attr('r', (datum) => Math.max(2.3, datum.radius * 0.17)).attr('fill', '#e6fbff').attr('pointer-events', 'none');
    node.append('text')
      .text((datum) => t.labels[datum.id as keyof typeof t.labels] ?? datum.id)
      .attr('y', (datum) => datum.radius + (compact ? 13 : 17))
      .attr('text-anchor', 'middle')
      .attr('class', 'network-node__label')
      .attr('pointer-events', 'none');

    simulation.on('tick', () => {
      graphNodes.forEach((datum) => {
        datum.x = Math.max(datum.radius + 58, Math.min(width - datum.radius - 58, datum.x ?? width / 2));
        datum.y = Math.max(datum.radius + 18, Math.min(height - datum.radius - 28, datum.y ?? height / 2));
      });
      link
        .attr('x1', (datum) => (datum.source as NodeDatum).x ?? 0)
        .attr('y1', (datum) => (datum.source as NodeDatum).y ?? 0)
        .attr('x2', (datum) => (datum.target as NodeDatum).x ?? 0)
        .attr('y2', (datum) => (datum.target as NodeDatum).y ?? 0);
      node.attr('transform', (datum) => `translate(${datum.x ?? 0},${datum.y ?? 0})`);
    });

    const observer = new ResizeObserver(() => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      svg.attr('width', nextWidth).attr('height', nextHeight);
      simulation.force('center', d3.forceCenter(nextWidth / 2, nextHeight / 2)).alpha(0.2).restart();
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      simulation.stop();
    };
  }, [lang, t.descriptions, t.labels]);

  return (
    <div className="skill-network">
      <div ref={containerRef} className="skill-network__viewport">
        <div className="skill-network__grid" aria-hidden="true" />
        <svg ref={svgRef} role="img" aria-label="Interactive skill network" />
        <span className="skill-network__readout">FORCE_GRAPH / 15 NODES / 17 LINKS</span>
      </div>
      <div className="skill-network__info" aria-live="polite">
        <AnimatePresence mode="wait">
          {hoveredNode ? (
            <motion.div key={hoveredNode.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
              <span>{hoveredNode.group === 'domain' ? t.domain : t.skill}</span>
              <strong>{t.labels[hoveredNode.id as keyof typeof t.labels]}</strong>
              <p>{t.descriptions[hoveredNode.id as keyof typeof t.descriptions]}</p>
            </motion.div>
          ) : (
            <motion.p key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{t.prompt}</motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
