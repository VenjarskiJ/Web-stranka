import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: string;
  radius: number;
  description?: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

const data = {
  nodes: [
    // Domains
    { id: 'Computer Vision', group: 'domain', radius: 30, description: 'Core expertise in analyzing and understanding visual data.' },
    { id: 'Signal Processing', group: 'domain', radius: 30, description: 'Processing and analyzing analog and digital signals.' },
    { id: 'Software Eng.', group: 'domain', radius: 30, description: 'Building robust, scalable, and efficient software systems.' },
    { id: 'AI & ML', group: 'domain', radius: 30, description: 'Applying machine learning models to solve complex problems.' },
    
    // Skills
    { id: 'Novel View Synthesis', group: 'skill', radius: 15, description: 'Generating new views of a scene from a given set of images.' },
    { id: '3D Reconstruction', group: 'skill', radius: 15, description: 'Reconstructing 3D scenes from 2D images.' },
    { id: 'Feature Matching', group: 'skill', radius: 15, description: 'Identifying corresponding points across different images (KRAFT, SIFT).' },
    { id: 'NeRF', group: 'skill', radius: 15, description: 'Neural Radiance Fields for view synthesis.' },
    { id: '3DGS', group: 'skill', radius: 15, description: '3D Gaussian Splatting for real-time rendering.' },
    { id: 'PyTorch', group: 'skill', radius: 15, description: 'Deep learning framework.' },
    { id: 'Python', group: 'skill', radius: 15, description: 'Primary programming language for research and ML.' },
    { id: 'C++', group: 'skill', radius: 15, description: 'High-performance computing and real-time systems.' },
    { id: 'React', group: 'skill', radius: 15, description: 'Frontend development for interactive web applications.' },
    { id: 'DSP', group: 'skill', radius: 15, description: 'Digital Signal Processing techniques.' },
    { id: 'Filters', group: 'skill', radius: 15, description: 'Analog and digital filter design.' },
  ],
  links: [
    // Domain to Skill
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
    
    // Cross-connections
    { source: 'Novel View Synthesis', target: 'NeRF', value: 1 },
    { source: '3D Reconstruction', target: '3DGS', value: 1 },
    { source: 'Feature Matching', target: 'C++', value: 1 },
    { source: 'PyTorch', target: 'Python', value: 1 },
    { source: 'Computer Vision', target: 'AI & ML', value: 3 },
    { source: 'Signal Processing', target: 'Computer Vision', value: 1 },
  ]
};

const translations = {
  en: {
    hoverPrompt: "Hover over a node to see details or drag to interact with the network.",
    domain: "domain",
    skill: "skill",
    nodes: {
      "Computer Vision": "Core expertise in analyzing and understanding visual data.",
      "Signal Processing": "Processing and analyzing analog and digital signals.",
      "Software Eng.": "Building robust, scalable, and efficient software systems.",
      "AI & ML": "Applying machine learning models to solve complex problems.",
      "Novel View Synthesis": "Generating new views of a scene from a given set of images.",
      "3D Reconstruction": "Reconstructing 3D scenes from 2D images.",
      "Feature Matching": "Identifying corresponding points across different images (KRAFT, SIFT).",
      "NeRF": "Neural Radiance Fields for view synthesis.",
      "3DGS": "3D Gaussian Splatting for real-time rendering.",
      "PyTorch": "Deep learning framework.",
      "Python": "Primary programming language for research and ML.",
      "C++": "High-performance computing and real-time systems.",
      "React": "Frontend development for interactive web applications.",
      "DSP": "Digital Signal Processing techniques.",
      "Filters": "Analog and digital filter design."
    },
    labels: {
      "Computer Vision": "Computer Vision",
      "Signal Processing": "Signal Processing",
      "Software Eng.": "Software Eng.",
      "AI & ML": "AI & ML",
      "Novel View Synthesis": "Novel View Synthesis",
      "3D Reconstruction": "3D Reconstruction",
      "Feature Matching": "Feature Matching",
      "NeRF": "NeRF",
      "3DGS": "3DGS",
      "PyTorch": "PyTorch",
      "Python": "Python",
      "C++": "C++",
      "React": "React",
      "DSP": "DSP",
      "Filters": "Filters"
    }
  },
  sk: {
    hoverPrompt: "Prejdite myšou nad uzol pre zobrazenie detailov alebo potiahnite pre interakciu so sieťou.",
    domain: "oblasť",
    skill: "zručnosť",
    nodes: {
      "Computer Vision": "Hlavná odbornosť v analýze a porozumení vizuálnych dát.",
      "Signal Processing": "Spracovanie a analýza analógových a digitálnych signálov.",
      "Software Eng.": "Budovanie robustných, škálovateľných a efektívnych softvérových systémov.",
      "AI & ML": "Aplikovanie modelov strojového učenia na riešenie zložitých problémov.",
      "Novel View Synthesis": "Generovanie nových pohľadov na scénu z daného súboru obrázkov.",
      "3D Reconstruction": "Rekonštrukcia 3D scén z 2D obrázkov.",
      "Feature Matching": "Identifikácia zodpovedajúcich bodov naprieč rôznymi obrázkami (KRAFT, SIFT).",
      "NeRF": "Neurónové polia žiarenia pre syntézu pohľadov.",
      "3DGS": "3D Gaussian Splatting pre vykresľovanie v reálnom čase.",
      "PyTorch": "Rámec pre hlboké učenie.",
      "Python": "Hlavný programovací jazyk pre výskum a ML.",
      "C++": "Vysokovýkonné výpočty a systémy v reálnom čase.",
      "React": "Vývoj frontendu pre interaktívne webové aplikácie.",
      "DSP": "Techniky digitálneho spracovania signálov.",
      "Filters": "Návrh analógových a digitálnych filtrov."
    },
    labels: {
      "Computer Vision": "Počítačové videnie",
      "Signal Processing": "Spracovanie signálov",
      "Software Eng.": "Softvérové inž.",
      "AI & ML": "UI a ML",
      "Novel View Synthesis": "Syntéza nových pohľadov",
      "3D Reconstruction": "3D Rekonštrukcia",
      "Feature Matching": "Párovanie príznakov",
      "NeRF": "NeRF",
      "3DGS": "3DGS",
      "PyTorch": "PyTorch",
      "Python": "Python",
      "C++": "C++",
      "React": "React",
      "DSP": "DSP",
      "Filters": "Filtre"
    }
  }
};

interface SkillNetworkProps {
  lang: 'en' | 'sk';
}

export default function SkillNetwork({ lang }: SkillNetworkProps) {
  const t = translations[lang];
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove(); // Clear previous render

    // Create a copy of the data to avoid mutating the original
    const nodes = data.nodes.map(d => ({ ...d })) as Node[];
    const links = data.links.map(d => ({ ...d })) as Link[];

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius((d: any) => d.radius + 10));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(156, 163, 175, 0.3)') // gray-400 with opacity
      .attr('stroke-width', d => Math.sqrt(d.value));

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Node circles
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.group === 'domain' ? '#a855f7' : '#06b6d4') // purple-500 : cyan-500
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'cursor-pointer transition-all duration-300')
      .on('mouseover', (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).attr('stroke', '#f472b6').attr('stroke-width', 4); // pink-400
        
        // Highlight connected links
        link.attr('stroke', l => (l.source === d || l.target === d) ? '#f472b6' : 'rgba(156, 163, 175, 0.1)')
            .attr('stroke-width', l => (l.source === d || l.target === d) ? 2 : 1);
      })
      .on('mouseout', (event) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).attr('stroke', '#fff').attr('stroke-width', 2);
        link.attr('stroke', 'rgba(156, 163, 175, 0.3)').attr('stroke-width', d => Math.sqrt(d.value));
      });

    // Node labels
    node.append('text')
      .text(d => t.labels[d.id as keyof typeof t.labels] || d.id)
      .attr('x', 0)
      .attr('y', d => d.radius + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('class', 'text-xs font-semibold pointer-events-none fill-gray-700 dark:fill-gray-300');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      svg.attr('width', newWidth).attr('height', newHeight);
      simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <div ref={containerRef} className="w-full h-[350px] md:h-[450px] bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
      
      {/* Tooltip / Info Panel */}
      <div className="mt-4 h-20 w-full flex items-center justify-center text-center px-4">
        {hoveredNode ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-lg"
          >
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">
              {t.labels[hoveredNode.id as keyof typeof t.labels] || hoveredNode.id} <span className="text-xs font-normal text-gray-500 dark:text-gray-400 uppercase ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{t[hoveredNode.group as 'domain' | 'skill'] || hoveredNode.group}</span>
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t.nodes[hoveredNode.id as keyof typeof t.nodes] || hoveredNode.description}</p>
          </motion.div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            {t.hoverPrompt}
          </p>
        )}
      </div>
    </div>
  );
}
