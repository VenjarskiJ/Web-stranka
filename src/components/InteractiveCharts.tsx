import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SkillNetwork from './SkillNetwork';

type Tab = 'network' | 'heatmap' | 'skills' | 'performance';

const translations = {
  en: {
    title: 'Research telemetry',
    tabs: { network: 'Skill network', heatmap: 'Domain matrix', skills: 'Capability radar', performance: 'KRAFT benchmark' },
    descriptions: {
      network: 'Force-directed view of the links between core research domains and implementation skills.',
      heatmap: 'Overlap between technical capabilities and the contexts in which they create the most value.',
      skills: 'A multidimensional view of research and engineering proficiency.',
      performance: 'Precision comparison for KRAFT and established local-feature baselines on human-centric datasets.',
    },
    domains: ['Computer vision', 'Software eng.', 'Education'],
    skills: ['Python & C++', '3D reconstruction', 'Signal processing', 'Deep learning', 'Mentoring'],
    radar: [
      { subject: 'Vision', value: 95 }, { subject: 'Signals', value: 90 }, { subject: '3D', value: 92 },
      { subject: 'ML', value: 85 }, { subject: 'Software', value: 88 }, { subject: 'Teaching', value: 95 },
    ],
    dataset: 'Dataset',
  },
  sk: {
    title: 'Výskumná telemetria',
    tabs: { network: 'Sieť zručností', heatmap: 'Matica oblastí', skills: 'Radar schopností', performance: 'Benchmark KRAFT' },
    descriptions: {
      network: 'Silovo riadený pohľad na väzby medzi hlavnými výskumnými oblasťami a implementačnými zručnosťami.',
      heatmap: 'Prekrytie technických schopností a oblastí, v ktorých prinášajú najväčšiu hodnotu.',
      skills: 'Viacrozmerný pohľad na výskumnú a inžiniersku expertízu.',
      performance: 'Porovnanie presnosti metódy KRAFT a zavedených lokálnych príznakov na dátach zameraných na človeka.',
    },
    domains: ['Počítačové videnie', 'Softvérové inž.', 'Vzdelávanie'],
    skills: ['Python a C++', '3D rekonštrukcia', 'Spracovanie signálov', 'Hlboké učenie', 'Mentorovanie'],
    radar: [
      { subject: 'Videnie', value: 95 }, { subject: 'Signály', value: 90 }, { subject: '3D', value: 92 },
      { subject: 'ML', value: 85 }, { subject: 'Softvér', value: 88 }, { subject: 'Výučba', value: 95 },
    ],
    dataset: 'Dáta',
  },
} as const;

const performanceData = [
  { name: '01', SIFT: 65, ORB: 55, KRAFT: 98.9 },
  { name: '02', SIFT: 70, ORB: 60, KRAFT: 98.5 },
  { name: '03', SIFT: 68, ORB: 58, KRAFT: 99.1 },
  { name: '04', SIFT: 72, ORB: 62, KRAFT: 98.7 },
  { name: '05', SIFT: 69, ORB: 59, KRAFT: 99.0 },
];

const matrix = [
  [95, 90, 40],
  [100, 80, 60],
  [70, 60, 100],
  [90, 85, 50],
  [60, 70, 95],
];

function DataTooltip({ active, payload, label, datasetLabel }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; datasetLabel: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span>{datasetLabel} {label}</span>
      {payload.map((item) => <div key={item.name}><i style={{ background: item.color }} /><strong>{item.name}</strong><b>{item.value}%</b></div>)}
    </div>
  );
}

export default function InteractiveCharts({ lang }: { lang: 'en' | 'sk' }) {
  const [activeTab, setActiveTab] = useState<Tab>('network');
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  const gradientId = useId().replace(/:/g, '');
  const t = translations[lang];
  const tabs: Tab[] = ['network', 'heatmap', 'skills', 'performance'];
  const radarData: Array<{ subject: string; value: number }> = t.radar.map((item) => ({ ...item }));

  return (
    <div className="data-console glass">
      <div className="data-console__header">
        <div>
          <span>DATA_CORE / LIVE</span>
          <h3>{t.title}</h3>
        </div>
        <div className="data-tabs" role="tablist" aria-label={t.title}>
          {tabs.map((tab, index) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={activeTab === tab ? 'is-active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              <span>0{index + 1}</span>{t.tabs[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="data-console__viewport" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="data-console__panel"
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.28 }}
          >
            {activeTab === 'network' && <SkillNetwork lang={lang} />}

            {activeTab === 'heatmap' && (
              <div className="matrix-chart">
                <div className="matrix-chart__inner">
                  <div className="matrix-chart__header"><span />{t.domains.map((domain) => <strong key={domain}>{domain}</strong>)}</div>
                  {t.skills.map((skill, row) => (
                    <div className="matrix-chart__row" key={skill}>
                      <strong>{skill}</strong>
                      {t.domains.map((_, column) => {
                        const value = matrix[row][column];
                        const isActive = hoveredCell?.[0] === row && hoveredCell?.[1] === column;
                        const isRelated = hoveredCell && (hoveredCell[0] === row || hoveredCell[1] === column);
                        return (
                          <motion.button
                            key={`${row}-${column}`}
                            aria-label={`${skill}: ${t.domains[column]} ${value}%`}
                            onPointerEnter={() => setHoveredCell([row, column])}
                            onPointerLeave={() => setHoveredCell(null)}
                            animate={{ opacity: hoveredCell && !isRelated ? 0.25 : 1, scale: isActive ? 1.08 : 1 }}
                            style={{ '--value': value / 100 } as React.CSSProperties}
                          >
                            <span>{value}</span><i />
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="rechart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <defs>
                      <radialGradient id={`radar-${gradientId}`}><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.58" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0.12" /></radialGradient>
                      <filter id={`radar-glow-${gradientId}`}><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    </defs>
                    <PolarGrid stroke="rgba(112,180,205,.18)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8ca0b3', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="value" stroke="#4de9ff" strokeWidth={2} fill={`url(#radar-${gradientId})`} fillOpacity={0.72} filter={`url(#radar-glow-${gradientId})`} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="rechart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 24, right: 24, bottom: 10, left: -8 }}>
                    <defs>
                      <filter id={`line-glow-${gradientId}`}><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    </defs>
                    <CartesianGrid strokeDasharray="2 8" stroke="rgba(112,180,205,.16)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(130,155,175,.38)" tick={{ fill: '#7f92a5', fontSize: 10, fontFamily: 'IBM Plex Mono' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[40, 100]} stroke="rgba(130,155,175,.38)" tick={{ fill: '#7f92a5', fontSize: 10, fontFamily: 'IBM Plex Mono' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<DataTooltip datasetLabel={t.dataset} />} cursor={{ stroke: 'rgba(77,233,255,.26)', strokeDasharray: '3 4' }} />
                    <Line type="monotone" dataKey="SIFT" stroke="#8b9aab" strokeWidth={1.4} dot={{ r: 3, fill: '#8b9aab', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="ORB" stroke="#f472b6" strokeWidth={1.4} dot={{ r: 3, fill: '#f472b6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="KRAFT" stroke="#4de9ff" strokeWidth={2.7} dot={{ r: 4, fill: '#071019', stroke: '#4de9ff', strokeWidth: 2 }} activeDot={{ r: 7 }} filter={`url(#line-glow-${gradientId})`} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="data-console__description">{t.descriptions[activeTab]}</p>
    </div>
  );
}
