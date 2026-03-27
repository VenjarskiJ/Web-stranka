import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import SkillNetwork from './SkillNetwork';

const translations = {
  en: {
    title: "Interactive Data",
    tabNetwork: "Skill Network",
    tabHeatmap: "Skill Matrix",
    tabSkills: "Proficiency Radar",
    tabPerformance: "KRAFT vs SIFT/ORB",
    descNetwork: "Interactive force-directed graph showing the dynamic connections between my core domains and specific technical skills.",
    descHeatmap: "Interactive matrix showing the strength and overlap of my skills across different professional domains. Hover to explore.",
    descSkills: "A multidimensional view of my technical expertise across different domains.",
    descPerformance: "Precision comparison showing KRAFT's state-of-the-art 98.9% accuracy on human-centric datasets.",
    domains: ['Computer Vision', 'Software Eng.', 'Education & Research'],
    skills: ['Python & C++', '3D Reconstruction', 'Signal Processing', 'Deep Learning', 'Mentoring'],
    radarData: [
      { subject: 'Computer Vision', A: 95, fullMark: 100 },
      { subject: 'Signal Processing', A: 90, fullMark: 100 },
      { subject: '3D Reconstruction', A: 92, fullMark: 100 },
      { subject: 'Machine Learning', A: 85, fullMark: 100 },
      { subject: 'Software Eng.', A: 88, fullMark: 100 },
      { subject: 'Teaching', A: 95, fullMark: 100 },
    ]
  },
  sk: {
    title: "Interaktívne dáta",
    tabNetwork: "Sieť zručností",
    tabHeatmap: "Matica zručností",
    tabSkills: "Radar odbornosti",
    tabPerformance: "KRAFT vs SIFT/ORB",
    descNetwork: "Interaktívny graf ukazujúci dynamické prepojenia medzi mojimi hlavnými oblasťami a špecifickými technickými zručnosťami.",
    descHeatmap: "Interaktívna matica ukazujúca silu a prekrytie mojich zručností v rôznych profesionálnych oblastiach. Prejdite myšou pre preskúmanie.",
    descSkills: "Viacrozmerný pohľad na moju technickú odbornosť v rôznych oblastiach.",
    descPerformance: "Porovnanie presnosti ukazujúce 98,9% úspešnosť metódy KRAFT na datasetoch zameraných na ľudí.",
    domains: ['Počítačové videnie', 'Softvérové inž.', 'Vzdelávanie a výskum'],
    skills: ['Python a C++', '3D Rekonštrukcia', 'Spracovanie signálov', 'Hlboké učenie', 'Mentorovanie'],
    radarData: [
      { subject: 'Počítačové videnie', A: 95, fullMark: 100 },
      { subject: 'Spracovanie signálov', A: 90, fullMark: 100 },
      { subject: '3D Rekonštrukcia', A: 92, fullMark: 100 },
      { subject: 'Strojové učenie', A: 85, fullMark: 100 },
      { subject: 'Softvérové inž.', A: 88, fullMark: 100 },
      { subject: 'Vyučovanie', A: 95, fullMark: 100 },
    ]
  }
};

const performanceData = [
  { name: 'Dataset 1', SIFT: 65, ORB: 55, KRAFT: 98.9 },
  { name: 'Dataset 2', SIFT: 70, ORB: 60, KRAFT: 98.5 },
  { name: 'Dataset 3', SIFT: 68, ORB: 58, KRAFT: 99.1 },
  { name: 'Dataset 4', SIFT: 72, ORB: 62, KRAFT: 98.7 },
  { name: 'Dataset 5', SIFT: 69, ORB: 59, KRAFT: 99.0 },
];

// Data for the new Heatmap
const matrixData = [
  [95, 90, 40], // Python & C++
  [100, 80, 60], // 3D Recon
  [70, 60, 100], // Signal Processing
  [90, 85, 50], // Deep Learning
  [60, 70, 95], // Mentoring
];

interface InteractiveChartsProps {
  lang: 'en' | 'sk';
}

export default function InteractiveCharts({ lang }: InteractiveChartsProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'network' | 'heatmap' | 'skills' | 'performance'>('network');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const renderHeatmap = () => (
    <div className="w-full h-full flex flex-col justify-center items-center overflow-x-auto py-4">
      <div className="min-w-max">
        {/* Header Row */}
        <div className="flex mb-3">
          <div className="w-32 md:w-40"></div>
          {t.domains.map((domain, dIdx) => (
            <div 
              key={domain} 
              className={`w-20 md:w-28 text-center text-xs md:text-sm font-bold transition-colors duration-300 ${hoveredCol === dIdx ? 'text-cyan-500 dark:text-cyan-400' : 'text-gray-500 dark:text-white/60'}`}
            >
              {domain}
            </div>
          ))}
        </div>
        {/* Matrix Rows */}
        {t.skills.map((skill, sIdx) => (
          <div key={skill} className="flex items-center mb-3">
            <div className={`w-32 md:w-40 text-right pr-6 text-xs md:text-sm font-bold transition-colors duration-300 ${hoveredRow === sIdx ? 'text-purple-500 dark:text-purple-400' : 'text-gray-500 dark:text-white/60'}`}>
              {skill}
            </div>
            {t.domains.map((_, dIdx) => {
              const value = matrixData[sIdx][dIdx];
              const isHovered = hoveredRow === sIdx || hoveredCol === dIdx;
              const isExactHover = hoveredRow === sIdx && hoveredCol === dIdx;
              const isDimmed = (hoveredRow !== null || hoveredCol !== null) && !isHovered;
              
              // Calculate color based on value (mix of purple and cyan)
              const r = Math.round(168 - (value / 100) * (168 - 6));   // 168 (purple) -> 6 (cyan)
              const g = Math.round(85 + (value / 100) * (182 - 85));   // 85 (purple) -> 182 (cyan)
              const b = Math.round(247 + (value / 100) * (212 - 247)); // 247 (purple) -> 212 (cyan)
              
              return (
                <div key={`${sIdx}-${dIdx}`} className="w-20 md:w-28 flex justify-center px-1">
                  <motion.div
                    onMouseEnter={() => { setHoveredRow(sIdx); setHoveredCol(dIdx); }}
                    onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}
                    className="relative flex items-center justify-center rounded-lg cursor-pointer border border-gray-200 dark:border-white/10 shadow-lg"
                    style={{
                      width: '100%',
                      height: '40px',
                      backgroundColor: `rgba(${r}, ${g}, ${b}, ${value / 100})`,
                      opacity: isDimmed ? 0.2 : 1,
                      transform: isExactHover ? 'scale(1.15)' : 'scale(1)',
                      zIndex: isExactHover ? 10 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span className={`text-white text-xs font-bold transition-opacity duration-300 ${isExactHover ? 'opacity-100' : 'opacity-0'}`}>
                      {value}%
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="glass p-6 md:p-8 rounded-3xl w-full">
      <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6">
        <h3 className="text-2xl font-bold">{t.title}</h3>
        <div className="flex flex-wrap justify-center bg-gray-100 dark:bg-black/30 p-1 rounded-2xl border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'network' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.tabNetwork}
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'heatmap' ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg' : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.tabHeatmap}
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'skills' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.tabSkills}
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'performance' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.tabPerformance}
          </button>
        </div>
      </div>

      <div className="h-[350px] md:h-[450px] w-full">
        {activeTab === 'network' && <SkillNetwork lang={lang} />}
        {activeTab === 'heatmap' && renderHeatmap()}
        {activeTab === 'skills' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={t.radarData}>
              <PolarGrid stroke="currentColor" className="text-gray-200 dark:text-white/10" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-gray-600 dark:text-white/70" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Proficiency"
                dataKey="A"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.4}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
        {activeTab === 'performance' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" vertical={false} className="text-gray-200 dark:text-white/10" />
              <XAxis dataKey="name" stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-gray-500 dark:text-white/50" />
              <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} domain={[40, 100]} className="text-gray-500 dark:text-white/50" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="SIFT" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="ORB" stroke="#f472b6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="KRAFT" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-white/50">
        {activeTab === 'network' && t.descNetwork}
        {activeTab === 'heatmap' && t.descHeatmap}
        {activeTab === 'skills' && t.descSkills}
        {activeTab === 'performance' && t.descPerformance}
      </div>
    </div>
  );
}
