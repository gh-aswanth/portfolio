import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Server, 
  ShieldCheck, 
  Mail, 
  Linkedin, 
  Github, 
  Brain, 
  ChevronRight,
  Terminal as TerminalIcon,
  ExternalLink,
  Sparkles,
  Bot,
  Database,
  Workflow,
  Code
} from 'lucide-react';
import Background3D from './components/Background3D';
import BinaryRain from './components/BinaryRain';
import CustomCursor from './components/CustomCursor';
import SummaryBoard from './components/SummaryBoard';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300",
        scrolled ? "glass py-3" : "bg-transparent backdrop-blur-sm md:backdrop-blur-none"
      )}
    >
      <div className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary transition-colors">
          <Sparkles size={18} className="text-primary" />
        </div>
        <div className="text-xl font-bold mono gradient-text tracking-tighter">Aswanth Babu | Senior Software Engineer & LLM Architect</div>
      </div>
      <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold">
        {['about', 'summary', 'skills', 'projects', 'contact'].map((item) => (
          <a key={item} href={`#${item === 'summary' ? 'summary-board' : item}`} className="relative hover:text-primary transition-colors group">
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </a>
        ))}
      </div>
      <div className="md:hidden">
          <Bot className="text-primary animate-pulse" />
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const text = "Hey There!!";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 40); 
    return () => clearInterval(timer);
  }, [text]);

  const skillIcons = [
    { icon: <Brain size={32} />, label: "NEURAL_NETS", color: "text-primary", delay: 0 },
    { icon: <Cpu size={32} />, label: "COMPUTE_OPT", color: "text-secondary", delay: 1.5 },
    { icon: <Database size={32} />, label: "VECTOR_DB", color: "text-white", delay: 3 },
    { icon: <Workflow size={32} />, label: "AGENT_ORCH", color: "text-primary", delay: 4.5 },
    { icon: <Sparkles size={32} />, label: "GEN_AI", color: "text-secondary", delay: 6 },
    { icon: <ShieldCheck size={32} />, label: "SECURE_LLM", color: "text-white", delay: 7.5 },
    { icon: <Server size={32} />, label: "AZURE_CLOUD", color: "text-primary", delay: 9 },
    { icon: <Bot size={32} />, label: "AGENTIC_AI", color: "text-secondary", delay: 10.5 },
    { icon: <Code size={32} />, label: "FAST_API", color: "text-white", delay: 12 },
  ];

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center px-6 pt-20 text-center relative overflow-hidden">

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px]"
          />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10"
      >
        <div className="mono text-[10px] md:text-xs text-primary mb-6 inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]">
          <TerminalIcon size={14} />
          {displayText}<span className="animate-pulse">|</span>
        </div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-none uppercase"
        >
          GENAI PLATFORM<br />
          <span className="gradient-text neon-text">ARCHITECT</span>
        </motion.h1>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >

          <a href="#contact" className="px-10 py-4 glass glass-hover font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-primary/20">
            Get in Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator & Skill Icons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
      >
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-[10px] uppercase tracking-[0.3em] mono">Scroll</span>
          <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-0.5 h-12 bg-gradient-to-b from-primary to-transparent"
          />
        </div>

        {/* Horizontal Skill Icons */}
        <div className="relative group">
          <div className="flex items-center gap-4 px-6 py-3 glass rounded-2xl border-white/5 backdrop-blur-md relative z-10">
            {skillIcons.map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                }}
                transition={{ 
                  opacity: { delay: 1.2 + idx * 0.1 },
                  y: { delay: 1.2 + idx * 0.1 }
                }}
                whileHover={{ scale: 1.2, y: -5, transition: { duration: 0.2 } }}
                className={cn("cursor-help transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]", skill.color)}
                title={skill.label}
              >
                {React.cloneElement(skill.icon, { size: 20 })}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const About = () => (
  <section id="about" className="py-32 px-6 max-w-7xl mx-auto relative">
    <div className="grid lg:grid-cols-2 gap-20 items-center">
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase italic">
            Pioneering the<br />
            <span className="gradient-text not-italic">AI Frontier</span>
        </h2>
        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
          <p>
            With over six years of specialized experience in <span className="text-white">Python development</span>, I've evolved from building enterprise applications to architecting the next generation of intelligent platforms.
          </p>
          <p>
            My focus lies at the intersection of <span className="text-white">Generative AI</span> and robust engineering. I specialize in the entire AI lifecycle—from RAG/KAG patterns and vector database optimization to deploying multi-modal agentic frameworks.
          </p>
          <div className="flex gap-6 pt-4">
             <div className="flex flex-col">
                <span className="text-primary font-bold text-3xl">6+</span>
                <span className="text-xs uppercase tracking-widest mono">Years Exp</span>
             </div>
             <div className="w-px h-12 bg-white/10" />
             <div className="flex flex-col">
                <span className="text-primary font-bold text-3xl">50+</span>
                <span className="text-xs uppercase tracking-widest mono">AI Models</span>
             </div>
             <div className="w-px h-12 bg-white/10" />
             <div className="flex flex-col">
                <span className="text-primary font-bold text-3xl">Azure</span>
                <span className="text-xs uppercase tracking-widest mono">Cloud Native</span>
             </div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { icon: <Brain />, title: "Intelligence", desc: "Agentic Frameworks & LLM Orchestration" },
          { icon: <Database />, title: "Knowledge", desc: "Vector DBs & Knowledge-Augmented Generation" },
          { icon: <Workflow />, title: "Pipeline", desc: "Robust ETL & AI-Native Data Engineering" },
          { icon: <Code />, title: "Core", desc: "Production-ready Python & Microservices" }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass glass-hover p-8 rounded-2xl group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                {React.cloneElement(item.icon, { className: "text-primary", size: 24 })}
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Expertise = () => {
  const skills = [
    {
      title: "Generative AI & LLMs",
      icon: <Cpu size={32} />,
      items: ["LangChain / Pydantic-AI", "Agentic Orchestration", "Vector Search (Qdrant/HNSW)", "RAG/KAG Patterns", "Fine-tuning & LoRA"],
      color: "from-primary/20 to-transparent",
      accent: "primary"
    },
    {
      title: "Enterprise Systems",
      icon: <Server size={32} />,
      items: ["Python (FastAPI, Flask)", "Azure Cloud Architect", "Scalable ETL Pipelines", "Distributed Systems", "Secure Auth (JWT/OKTA)"],
      color: "from-secondary/20 to-transparent",
      accent: "secondary"
    },
    {
      title: "Engineering Quality",
      icon: <ShieldCheck size={32} />,
      items: ["CI/CD Automation", "Docker & Kubernetes", "SonarQube & Security", "High-Coverage Testing", "Real-time WebSockets"],
      color: "from-white/10 to-transparent",
      accent: "white"
    }
  ];

  return (
    <section id="skills" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase">Core <span className="gradient-text">Expertise</span></h2>
            <p className="text-gray-500 mono uppercase tracking-widest text-sm">Engineered for Scalability & Intelligence</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((skill, idx) => (
            <motion.div 
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className={cn(
                "glass p-10 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 min-h-[450px]",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 hover:before:opacity-100 before:transition-opacity",
                skill.color
              )}
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-8 p-4 w-fit rounded-2xl bg-white/5 text-primary group-hover:scale-110 transition-transform">
                    {skill.icon}
                </div>
                <h3 className="text-2xl font-bold mb-10 uppercase">{skill.title}</h3>
                
                <div className="relative flex-grow">
                  <AnimatePresence>
                    {skill.items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: (idx * 0.2) + (i * 0.1),
                          duration: 0.5
                        }}
                        viewport={{ once: true }}
                        className="mb-6 flex items-center gap-4 group/item cursor-default"
                      >
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.5, 1],
                            boxShadow: [
                              "0 0 0px rgba(0, 242, 255, 0)",
                              "0 0 15px rgba(0, 242, 255, 0.5)",
                              "0 0 0px rgba(0, 242, 255, 0)"
                            ]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.5 
                          }}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            skill.accent === 'primary' ? "bg-primary" : 
                            skill.accent === 'secondary' ? "bg-secondary" : "bg-white"
                          )} 
                        />
                        <span className="text-sm md:text-lg text-gray-400 group-hover/item:text-white transition-colors mono uppercase tracking-wider">
                          {item}
                        </span>
                        
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ delay: (idx * 0.2) + (i * 0.1) + 0.3 }}
                          className={cn(
                            "h-[1px] flex-grow origin-left opacity-20",
                            skill.accent === 'primary' ? "bg-primary" : 
                            skill.accent === 'secondary' ? "bg-secondary" : "bg-white"
                          )}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] mono text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                    <div className="w-10 h-[1px] bg-primary" />
                    System Validated
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group relative h-full glass rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all duration-500"
  >
    <div className="p-8 md:p-12 flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div className={cn("px-4 py-1 rounded-full text-[10px] mono uppercase tracking-[0.2em] font-bold border", project.borderColor, project.accent)}>
            {project.tag}
        </div>
        <div className="p-3 rounded-full bg-white/5 text-gray-500 group-hover:text-primary transition-colors">
            <ExternalLink size={20} />
        </div>
      </div>

      <h3 className="text-3xl font-bold mb-6 leading-tight group-hover:text-primary transition-colors uppercase">
        {project.title}
      </h3>

      <p className="text-gray-400 text-lg leading-relaxed mb-10 flex-grow">
        {project.description}
      </p>

      <div className="flex gap-4 items-center">
          <div className="h-px bg-white/10 flex-grow" />
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary cursor-pointer"
          >
            Case Study <ChevronRight size={16} />
          </motion.div>
      </div>
    </div>

    <div className={cn("absolute bottom-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40", project.glowColor)} />
  </motion.div>
);

const Projects = () => {
  const projects = [
    {
      tag: "Agentic AI",
      title: "Multi-Modal Enterprise Agentic Ecosystem",
      description: "An end-to-end AI platform featuring autonomous agents capable of real-time voice interaction, image search, and document reasoning.",
      accent: "text-primary",
      borderColor: "border-primary/30",
      glowColor: "bg-primary"
    },
    {
      tag: "Vector Search",
      title: "HNSW Optimized Knowledge Retrieval",
      description: "High-performance vector search implementation using HNSW algorithms and Qdrant for ultra-fast, context-aware enterprise RAG.",
      accent: "text-secondary",
      borderColor: "border-secondary/30",
      glowColor: "bg-secondary"
    },
    {
        tag: "Computer Vision",
        title: "Real-Time Computer Vision & OCR Integration",
        description: "High-performance system combining YOLO-based detection and Docling/Tesseract OCR for industrial workflow automation.",
        accent: "text-white",
        borderColor: "border-white/30",
        glowColor: "bg-white"
    },
    {
        tag: "Data Architecture",
        title: "Intelligent ETL & Database Architect for LLMs",
        description: "Robust data engineering solution designed to transform unstructured legacy data into LLM-ready formats with Azure cloud scaling.",
        accent: "text-primary",
        borderColor: "border-primary/30",
        glowColor: "bg-primary"
    }
  ];

  return (
    <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 italic uppercase">Selected<br /><span className="gradient-text not-italic">Innovations</span></h2>
            <p className="text-gray-500 text-lg">Pushing the boundaries of what's possible with Generative AI and Enterprise Engineering.</p>
        </div>
        <div className="hidden md:block pb-4">
            <div className="mono text-xs text-gray-600 uppercase tracking-widest">Archive 2020-2026</div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-32 px-6 relative overflow-hidden">
    <div className="absolute inset-0 z-0 bg-primary/5 mask-fade-top opacity-50" />
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-8xl font-bold mb-10 tracking-tighter uppercase">
            LET'S <span className="gradient-text">COLLABORATE</span>
        </h2>
        <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
            I'm always open to discussing advanced AI architectures, enterprise automation, or revolutionary GenAI projects.
        </p>
      </motion.div>
      
      <div className="flex flex-wrap justify-center gap-6 md:gap-12">
        {[
          { icon: <Mail />, text: "Email", href: "mailto:aswanth.babu@outlook.com" },
          { icon: <Linkedin />, text: "LinkedIn", href: "https://www.linkedin.com/in/iamaswanth/" },
          { icon: <Github />, text: "GitHub", href: "https://github.com/gh-aswanth" }
        ].map((link, idx) => (
          <motion.a 
            key={idx}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href={link.href}
            className="flex items-center gap-3 px-8 py-4 glass rounded-2xl text-xl font-bold transition-all hover:bg-primary hover:text-black group uppercase"
          >
            {React.cloneElement(link.icon, { size: 24, className: "group-hover:scale-110 transition-transform" })}
            {link.text}
          </motion.a>
        ))}
      </div>
      
      <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 mono text-[10px] text-gray-600 uppercase tracking-[0.3em]">
        <div>© 2026 AI PORTFOLIO</div>
        <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
        </div>
        <div>GenAI Developer</div>
      </div>
    </div>
  </section>
);

const App = () => {
  const [hasError, setHasError] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  useEffect(() => {
    const handleError = (error) => {
      console.error("Global error caught:", error);
      setHasError(true);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white p-10">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Something went wrong</h1>
          <p className="text-gray-400 mb-8">The futuristic elements encountered a temporal paradox. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-black font-bold rounded-xl"
          >
            Reboot System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased selection:bg-primary selection:text-black min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[#030303] -z-30" />
      <div className="noise-overlay" />
      <Background3D />
      {/*<BinaryRain />*/}
      <CustomCursor />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <SummaryBoard />
        <Expertise />
        <Contact />
      </main>
    </div>
  );
};

export default App;
