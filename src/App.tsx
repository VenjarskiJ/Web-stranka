import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, BookOpen, Code, Award, GraduationCap, Cpu, Layers, Activity, MonitorPlay, Check, Moon, Sun, Globe, X } from 'lucide-react';
import SignalBackground from './components/SignalBackground';
import Profile3D from './components/Profile3D';
import InteractiveCharts from './components/InteractiveCharts';
import ContactModal from './components/ContactModal';

const translations = {
  en: {
    about: "About",
    skills: "Skills",
    research: "Research",
    publications: "Publications",
    contact: "Contact",
    subtitle: "Researcher | Educator | Developer",
    tagline: "I build <span class='text-gradient'>3D realities</span> from 2D pixels.",
    description: "Specializing in <strong>Novel View Synthesis</strong>, <strong>3D Scene Reconstruction</strong>, and <strong>Multimedia Signal Processing</strong>. Bridging the gap between academic research, university education, and practical software development.",
    viewResearch: "View Research",
    getInTouch: "Get in Touch",
    emailCopied: "Email Copied!",
    learnMore: "Learn More",
    aboutMe: "About Me",
    aboutP1: "I received my M.S. degree in telecommunications from the <strong>Slovak University of Technology in Bratislava (STU)</strong> in 2021, where I am currently pursuing my Ph.D. degree.",
    aboutP2: "As a Research Assistant at the <strong>Institute of Multimedia Information and Communication Technologies</strong>, my work spans across multiple domains. I am a researcher focusing on foundational computer vision techniques, a software developer building robust pipelines, and an educator teaching core university courses.",
    aboutP3: "My current research involves leveraging robust feature matching and depth-aware image stitching for <strong>Novel View Synthesis (NVS)</strong>. I specifically address the challenge of generating virtual camera perspectives from sparse camera arrays for applications in real-time immersive telepresence.",
    education: "Education",
    phd: "Ph.D. in Telecommunications",
    phdDate: "Slovak University of Technology (2021 - Present)",
    ms: "M.S. in Telecommunications",
    msDate: "Slovak University of Technology (2019 - 2021)",
    technicalArsenal: "Technical Arsenal",
    cv3d: "Computer Vision & 3D",
    cv3d_1: "Novel View Synthesis (NVS)",
    cv3d_2: "3D Scene Reconstruction",
    cv3d_3: "Feature Matching (KRAFT, SIFT)",
    cv3d_4: "Depth Estimation & DIBR",
    cv3d_5: "Image Stitching",
    sp: "Signal Processing",
    sp_1: "Analog & Digital Signals",
    sp_2: "Fourier Analysis",
    sp_3: "Frequency Domain Filtering",
    sp_4: "Multimedia Processing",
    sp_5: "University Educator (DSP 1 & 2)",
    ai: "AI & Machine Learning",
    ai_1: "Neural Radiance Fields (NeRF)",
    ai_2: "3D Gaussian Splatting (3DGS)",
    ai_3: "PyTorch & Deep Learning",
    ai_4: "MediaPipe & YOLO",
    ai_5: "DeepLabV3",
    se: "Software Engineering",
    se_1: "Python & C++",
    se_2: "OpenCV & NumPy",
    se_3: "React & Web Technologies",
    se_4: "CUDA Optimization",
    se_5: "Git & Version Control",
    selectedPubs: "Selected Publications",
    abstract: "Abstract:",
    letsConnect: "Let's Connect",
    connectDesc: "Whether you want to discuss computer vision, 3D reconstruction, signal processing, or potential collaborations, my inbox is always open.",
    sayHello: "Say Hello",
    footer: "Built with React & Tailwind."
  },
  sk: {
    about: "O mne",
    skills: "Zručnosti",
    research: "Výskum",
    publications: "Publikácie",
    contact: "Kontakt",
    subtitle: "Výskumník | Pedagóg | Vývojár",
    tagline: "Tvorím <span class='text-gradient'>3D realitu</span> z 2D pixelov.",
    description: "Špecializujem sa na <strong>Novel View Synthesis</strong>, <strong>3D rekonštrukciu scén</strong> a <strong>spracovanie multimediálnych signálov</strong>. Spájam akademický výskum, univerzitné vzdelávanie a praktický vývoj softvéru.",
    viewResearch: "Pozrieť výskum",
    getInTouch: "Kontaktovať",
    emailCopied: "E-mail skopírovaný!",
    learnMore: "Zistiť viac",
    aboutMe: "O mne",
    aboutP1: "Inžiniersky titul (Ing.) v odbore telekomunikácie som získal na <strong>Slovenskej technickej univerzite v Bratislave (STU)</strong> v roku 2021, kde v súčasnosti pokračujem v doktorandskom štúdiu.",
    aboutP2: "Ako výskumný pracovník v <strong>Ústave multimediálnych informačných a komunikačných technológií</strong> sa venujem viacerým oblastiam. Som výskumník zameraný na techniky počítačového videnia, softvérový vývojár a pedagóg vyučujúci profilové univerzitné predmety.",
    aboutP3: "Môj súčasný výskum zahŕňa využitie robustného párovania príznakov a spájania obrazov s ohľadom na hĺbku pre <strong>Novel View Synthesis (NVS)</strong>. Špecificky sa zaoberám problémom generovania virtuálnych pohľadov z riedkych kamerových polí pre aplikácie v imerzívnej teleperezencii v reálnom čase.",
    education: "Vzdelanie",
    phd: "PhD. v odbore Telekomunikácie",
    phdDate: "Slovenská technická univerzita (2021 - Súčasnosť)",
    ms: "Ing. v odbore Telekomunikácie",
    msDate: "Slovenská technická univerzita (2019 - 2021)",
    technicalArsenal: "Technický arzenál",
    cv3d: "Počítačové videnie a 3D",
    cv3d_1: "Novel View Synthesis (NVS)",
    cv3d_2: "3D rekonštrukcia scén",
    cv3d_3: "Párovanie príznakov (KRAFT, SIFT)",
    cv3d_4: "Odhad hĺbky & DIBR",
    cv3d_5: "Spájanie obrazov (Stitching)",
    sp: "Spracovanie signálov",
    sp_1: "Analógové a digitálne signály",
    sp_2: "Fourierova analýza",
    sp_3: "Filtrovanie vo frekvenčnej oblasti",
    sp_4: "Spracovanie multimédií",
    sp_5: "Univerzitný pedagóg (ČSS 1 & 2)",
    ai: "UI a Strojové učenie",
    ai_1: "Neural Radiance Fields (NeRF)",
    ai_2: "3D Gaussian Splatting (3DGS)",
    ai_3: "PyTorch & Deep Learning",
    ai_4: "MediaPipe & YOLO",
    ai_5: "DeepLabV3",
    se: "Softvérové inžinierstvo",
    se_1: "Python & C++",
    se_2: "OpenCV & NumPy",
    se_3: "React & Web technológie",
    se_4: "Optimalizácia v CUDA",
    se_5: "Git & Verzovanie",
    selectedPubs: "Vybrané publikácie",
    abstract: "Abstrakt:",
    letsConnect: "Spojme sa",
    connectDesc: "Či už chcete diskutovať o počítačovom videní, 3D rekonštrukcii, spracovaní signálov alebo o potenciálnej spolupráci, moja schránka je vždy otvorená.",
    sayHello: "Napísať správu",
    footer: "Vytvorené v React & Tailwind."
  }
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'en' | 'sk'>('en');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'research', 'publications', 'contact'];
      // Offset by 1/3 of the window height to trigger earlier when scrolling down
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[lang];

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContactModalOpen(true);
  };
  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30">
      {/* Animated Backgrounds */}
      <SignalBackground />
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>
      <div className="bg-blob blob-4"></div>
      <div className="bg-blob blob-5"></div>
      <div className="bg-blob blob-6"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0 border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">JV.</span>
          <div className="hidden md:flex gap-2 text-sm font-medium text-slate-600 dark:text-white/70 relative">
            {['about', 'skills', 'research', 'publications', 'contact'].map((section) => (
              <a 
                key={section}
                href={`#${section}`} 
                className={`relative px-4 py-2 rounded-full transition-colors ${
                  activeSection === section 
                    ? 'text-slate-900 dark:text-white' 
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeSection === section && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-slate-200/50 dark:bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {t[section as keyof typeof t]}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'sk' : 'en')}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Globe size={16} />
              {lang.toUpperCase()}
            </button>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-200 dark:bg-white/10 transition-colors text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col md:flex-row justify-center items-center gap-12 relative pb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h2 className="text-purple-600 dark:text-purple-400 font-mono text-sm md:text-base mb-4 tracking-wider uppercase">
              {t.subtitle}
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tighter mb-4 text-slate-900 dark:text-white">
              Jaroslav Venjarski.
            </h1>
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-500 dark:text-white/50 tracking-tighter mb-8 leading-tight"
              dangerouslySetInnerHTML={{ __html: t.tagline }}
            />
            <p 
              className="text-lg md:text-xl text-slate-600 dark:text-white/70 max-w-2xl leading-relaxed mb-10"
              dangerouslySetInnerHTML={{ __html: t.description }}
            />
            <div className="flex flex-wrap gap-4">
              <a href="#research" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-lg dark:shadow-none">
                <BookOpen size={20} />
                {t.viewResearch}
              </a>
              <button onClick={handleContactClick} className="px-8 py-4 glass glass-hover font-bold rounded-full flex items-center gap-2 cursor-pointer text-slate-900 dark:text-white">
                <Mail size={20} />
                {t.getInTouch}
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full flex justify-center md:justify-end"
          >
            <Profile3D />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 dark:text-white/30"
          >
            <ChevronDown size={32} />
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">{t.aboutMe}</h2>
              <div className="h-[1px] bg-slate-200 dark:bg-white/20 flex-grow"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6 text-slate-600 dark:text-white/70 text-lg leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t.aboutP1 }}></p>
                <p dangerouslySetInnerHTML={{ __html: t.aboutP2 }}></p>
                <p dangerouslySetInnerHTML={{ __html: t.aboutP3 }}></p>
              </div>
              
              <div className="glass p-8 rounded-3xl space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-400">
                    <GraduationCap size={24} /> {t.education}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{t.phd}</div>
                      <div className="text-sm text-slate-500 dark:text-white/50">{t.phdDate}</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{t.ms}</div>
                      <div className="text-sm text-slate-500 dark:text-white/50">{t.msDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">{t.technicalArsenal}</h2>
              <div className="h-[1px] bg-slate-200 dark:bg-white/20 flex-grow"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Skill Category 1 */}
              <div className="glass p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <MonitorPlay className="text-cyan-400 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-4">{t.cv3d}</h3>
                <ul className="space-y-2 text-slate-600 dark:text-white/70">
                  <li>{t.cv3d_1}</li>
                  <li>{t.cv3d_2}</li>
                  <li>{t.cv3d_3}</li>
                  <li>{t.cv3d_4}</li>
                  <li>{t.cv3d_5}</li>
                </ul>
              </div>

              {/* Skill Category 2 */}
              <div className="glass p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <Activity className="text-pink-400 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-4">{t.sp}</h3>
                <ul className="space-y-2 text-slate-600 dark:text-white/70">
                  <li>{t.sp_1}</li>
                  <li>{t.sp_2}</li>
                  <li>{t.sp_3}</li>
                  <li>{t.sp_4}</li>
                  <li>{t.sp_5}</li>
                </ul>
              </div>

              {/* Skill Category 3 */}
              <div className="glass p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <Layers className="text-purple-400 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-4">{t.ai}</h3>
                <ul className="space-y-2 text-slate-600 dark:text-white/70">
                  <li>{t.ai_1}</li>
                  <li>{t.ai_2}</li>
                  <li>{t.ai_3}</li>
                  <li>{t.ai_4}</li>
                  <li>{t.ai_5}</li>
                </ul>
              </div>

              {/* Skill Category 4 */}
              <div className="glass p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <Cpu className="text-blue-400 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-4">{t.se}</h3>
                <ul className="space-y-2 text-slate-600 dark:text-white/70">
                  <li>{t.se_1}</li>
                  <li>{t.se_2}</li>
                  <li>{t.se_3}</li>
                  <li>{t.se_4}</li>
                  <li>{t.se_5}</li>
                </ul>
              </div>
            </div>

            <div className="mt-12">
              <InteractiveCharts lang={lang} />
            </div>
          </motion.div>
        </section>

        {/* Research & Projects Section */}
        <section id="research" className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t.research}</h2>
              <div className="h-[1px] bg-slate-200 dark:bg-white/20 flex-grow"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Project 1 */}
              <div 
                className="glass glass-hover p-8 rounded-3xl flex flex-col h-full group hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/50 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedProject({
                  title: "KRAFT Algorithm",
                  description: "Keypoint Robust and Adaptive Feature Tracking. A novel, computationally efficient feature matching algorithm designed for small-baseline stereo scenarios. Achieves state-of-the-art 98.9% precision on human-centric datasets by combining adaptive gradient thresholding with Quadrant Normalized Cross-Correlation (Q-NCC).",
                  tags: ["Feature Matching", "Stereo Vision", "C++ / Python"],
                  icon: <Award size={32} className="text-purple-500" />
                })}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <Award size={28} />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-white/40 px-3 py-1 border border-black/10 dark:border-white/10 rounded-full">Q1 Journal</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">KRAFT Algorithm</h3>
                <p className="text-slate-600 dark:text-white/60 mb-6 flex-grow">
                  <strong>Keypoint Robust and Adaptive Feature Tracking.</strong> A novel, computationally efficient feature matching algorithm designed for small-baseline stereo scenarios.
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-300">Feature Matching</span>
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-300">Stereo Vision</span>
                  </div>
                  <button className="text-sm font-bold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    {t.learnMore} <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Project 2 */}
              <div 
                className="glass glass-hover p-8 rounded-3xl flex flex-col h-full group hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/50 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedProject({
                  title: "Novel View Synthesis (NVS)",
                  description: "Developed multiple pipelines for generating virtual camera perspectives from sparse camera arrays (2-4 cameras). Explored Hybrid Warping with Pose-Based Body Synthesis, Depth Image-Based Rendering (DIBR) with semantic completion, and Reference-Based Semantic Synthesis to solve the gaze-correction problem in telepresence.",
                  tags: ["DIBR", "Delaunay Triangulation", "MediaPipe"],
                  icon: <Code size={32} className="text-blue-500" />
                })}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <Code size={28} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Novel View Synthesis (NVS)</h3>
                <p className="text-slate-600 dark:text-white/60 mb-6 flex-grow">
                  Developed multiple pipelines for generating virtual camera perspectives from sparse camera arrays (2-4 cameras) to solve the gaze-correction problem.
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-300">DIBR</span>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-300">MediaPipe</span>
                  </div>
                  <button className="text-sm font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    {t.learnMore} <ExternalLink size={14} />
                  </button>
                </div>
              </div>
              
              {/* Project 3 */}
              <div 
                className="glass glass-hover p-8 rounded-3xl flex flex-col h-full group hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] dark:hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-pink-500/50 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedProject({
                  title: "Depth-Aware Image Stitching",
                  description: "Advanced stitching methods for 3D scenes with pronounced parallax. Replaced global homography with explicit 2.5D domain stitching using Layered Depth Images (LDI) and disparity maps (SGBM, RAFT-Stereo) to eliminate geometric artifacts in close-range 3D object reconstruction.",
                  tags: ["OpenCV", "Depth Estimation", "Image Stitching"],
                  icon: <Code size={32} className="text-pink-500" />
                })}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <Code size={28} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Depth-Aware Image Stitching</h3>
                <p className="text-slate-600 dark:text-white/60 mb-6 flex-grow">
                  Advanced stitching methods for 3D scenes with pronounced parallax. Replaced global homography with explicit 2.5D domain stitching using Layered Depth Images (LDI).
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-mono text-pink-600 dark:text-pink-300">OpenCV</span>
                    <span className="text-xs font-mono text-pink-600 dark:text-pink-300">Depth Estimation</span>
                  </div>
                  <button className="text-sm font-bold text-pink-600 dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    {t.learnMore} <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Project 4 */}
              <div 
                className="glass glass-hover p-8 rounded-3xl flex flex-col h-full group hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/50 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedProject({
                  title: "Academic Supervision & Teaching",
                  description: "Actively supervising Bachelor and Team projects at STU. Teaching core university courses including Analog and Digital Signal Processing 1 & 2. Guiding students in researching depth map interpolation, 3D scene reconstruction using Instant-NGP, and real-time computer vision pipelines.",
                  tags: ["Mentorship", "Signal Processing", "Research"],
                  icon: <GraduationCap size={32} className="text-emerald-500" />
                })}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <GraduationCap size={28} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Academic Supervision & Teaching</h3>
                <p className="text-slate-600 dark:text-white/60 mb-6 flex-grow">
                  Actively supervising Bachelor and Team projects at STU. Teaching core university courses including Analog and Digital Signal Processing 1 & 2.
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-300">Mentorship</span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-300">Signal Processing</span>
                  </div>
                  <button className="text-sm font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    {t.learnMore} <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">{t.selectedPubs}</h2>
              <div className="h-[1px] bg-slate-200 dark:bg-white/20 flex-grow"></div>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "KRAFT: Keypoint Robust and Adaptive Feature Tracking",
                  authors: "Jaroslav Venjarski, Gregor Rozinaj, Ivan Minárik, Šimon Tibenský",
                  venue: "IEEE Access, Vol. 14 (2026)",
                  summary: "Introduced KRAFT, a computationally efficient feature matching algorithm tailored for small-baseline stereo scenarios. By combining adaptive gradient thresholding with Quadrant Normalized Cross-Correlation (Q-NCC), it achieves a state-of-the-art 98.9% precision on human-centric datasets, outperforming established methods like SIFT and ORB.",
                  link: "#"
                },
                {
                  title: "Novel View Synthesis using Landmark-based Warping",
                  authors: "Jaroslav Venjarski, Richard Filák, Vivek Dwivedi, Stanislav Šidla, Gregor Rozinaj",
                  venue: "Proceedings ELMAR-2025, Zadar, Croatia",
                  summary: "Developed a lightweight, real-time method to synthesize a seamless mid-view facial image from two side views. By extending MediaPipe's Face Mesh to cover the entire head and applying Delaunay triangulation with affine warping, this approach eliminates the need for heavy 3D models or deep learning training.",
                  link: "#"
                },
                {
                  title: "Keypoint-Based Foreground-Background Image Segmentation",
                  authors: "Jaroslav Venjarski, Ľuboš Likó, Šimon Tibenský, Marek Vančo, Gregor Rozinaj",
                  venue: "Proceedings ELMAR-2024, Zadar, Croatia",
                  summary: "Explored synergistic combinations of image segmentation methods for shifted stereo images. Proposed an innovative algorithm leveraging keypoints and contours for precise foreground extraction, offering a practical alternative to traditional methods like GrabCut.",
                  link: "#"
                },
                {
                  title: "Analyzing Classical and LDI Depth-Aware Image Stitching for Enhanced Virtual View Representation",
                  authors: "Jaroslav Venjarski, Šimon Tibenský, Gregor Rozinaj",
                  venue: "30th International Conference on Systems, Signals and Image Processing (IWSSIP), 2023",
                  summary: "Conducted a comparative analysis between classical OpenCV-based stitching and depth-aware techniques using Layered Depth Images (LDI). Demonstrated that incorporating depth maps significantly reduces artifacts and geometric distortions in 3D scene reconstructions.",
                  link: "#"
                },
                {
                  title: "Automatic image stitching for stereo spherical image",
                  authors: "Jaroslav Venjarski, Vivek Dwivedi, Gregor Rozinaj",
                  venue: "Proceedings of ELMAR-2022, Zadar, Croatia",
                  summary: "Investigated fully automated image stitching using invariant local features. Identified limitations of traditional 2D stitching in close-range 3D scenarios and proposed adjustments incorporating depth estimation to achieve superior 3D spherical reconstructions.",
                  link: "#"
                }
              ].map((pub, i) => (
                <div key={i} className="glass p-6 md:p-8 rounded-2xl flex flex-col gap-4 group hover:border-purple-500/30 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{pub.title}</h3>
                      <p className="text-slate-500 dark:text-white/60 text-sm mb-3">{pub.authors}</p>
                      <p className="text-purple-400/80 text-sm font-mono mb-4">{pub.venue}</p>
                    </div>
                    <a href={pub.link} className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:bg-white/10 rounded-full transition-colors shrink-0">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  <div className="bg-white/80 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    <p className="text-slate-700 dark:text-white/80 text-sm leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">{t.abstract}</strong> {pub.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.letsConnect}</h2>
            <p className="text-slate-500 dark:text-white/60 text-lg mb-10">
              {t.connectDesc}
            </p>
            <button 
              onClick={handleContactClick}
              className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white dark:bg-white dark:text-black font-bold rounded-full text-lg hover:scale-105 transition-all mb-12 cursor-pointer shadow-xl dark:shadow-none"
            >
              <Mail size={24} />
              {t.sayHello}
            </button>
            
            <div className="flex justify-center gap-6">
              <a href="https://www.researchgate.net/profile/Jaroslav-Venjarski" target="_blank" rel="noreferrer" className="p-4 glass glass-hover rounded-full text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">
                <span className="font-bold font-mono">RG</span>
              </a>
              <a href="https://orcid.org/0000-0001-7944-4891" target="_blank" rel="noreferrer" className="p-4 glass glass-hover rounded-full text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">
                <span className="font-bold font-mono">iD</span>
              </a>
              <a href="#" className="p-4 glass glass-hover rounded-full text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">
                <Github size={24} />
              </a>
              <a href="#" className="p-4 glass glass-hover rounded-full text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">
                <Linkedin size={24} />
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-8 text-center text-slate-500 dark:text-white/40 text-sm">
        <p>© {new Date().getFullYear()} Jaroslav Venjarski. {t.footer}</p>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-gray-200 dark:bg-white/10 transition-colors"
              >
                <X size={24} className="text-slate-500 dark:text-white/50" />
              </button>
              
              <div className="mb-6">
                {selectedProject.icon}
              </div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{selectedProject.title}</h3>
              <p className="text-slate-600 dark:text-white/70 text-lg leading-relaxed mb-8">
                {selectedProject.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white dark:bg-white/5 text-slate-700 dark:text-white/70 border border-slate-200 dark:border-transparent shadow-sm dark:shadow-none rounded-full text-sm font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        lang={lang} 
      />
    </div>
  );
}
