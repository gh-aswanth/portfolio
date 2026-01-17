import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, Brain, Workflow, Code, ShieldCheck, Sparkles, Bot, Layers } from 'lucide-react';

const SummaryBoard = () => {
  const summaryText = "Accomplished Python developer with over 7 years of experience, specializing in enterprise applications and generative AI technologies. Expert in developing complex chatbots using customised knowledge bases, and multi-modal capabilities such as image search and real-time voice systems. Skilled in crafting enduring enterprise architectures and pipelines with Python and third-party services. Proficient in deploying applications with CI/CD pipelines, utilising tools like SonarQube for ensuring quality, and comprehensive test coverage. Committed to creating intelligent, high-quality solutions that effectively align with business goals, and enhance user experiences.";
  
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < summaryText.length) {
      const timeout = setTimeout(() => {
        setDisplayedSummary(prev => prev + summaryText[index]);
        setIndex(prev => prev + 1);
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const skills = [
    { category: "Frameworks & Optimization", items: ["FastAPI", "Flask", "async", "multi-processing", "threading", "AWS Lambda", "Azure Durable Functions"], icon: <Cpu className="text-primary" /> },
    { category: "AI & Agents", items: ["Langgraph", "CrewAI", "Pydantic-AI", "Semantic-kernel", "MCP", "A2A", "Agent Automation"], icon: <Brain className="text-secondary" /> },
    { category: "LLMs & Models", items: ["OpenAI (Assistance, Vector Store, Function Calling)", "Groq", "Anthropic (Claude)", "Google", "Mistral", "TogetherAI", "FireworkAI", "Cohere", "Embedding & Reranking (FastEmbed, Cross-encoders)"], icon: <Bot className="text-primary" /> },
    { category: "Search & Retrieval", items: ["RAG", "KAG", "HyDE", "SQE", "SR", "DRSS", "Colpali VLLM", "Qdrant (Similarity, Hybrid, Multistage)"], icon: <Database className="text-secondary" /> },
    { category: "Data & Processing", items: ["PostgreSQL", "MySQL", "MongoDB", "ETL Pipeline", "YOLO (Fine-tuning)", "OCR (Tesseract, Docling, EasyOCR, RapidOCR)", "Real-time Communication (WebSockets, Socket.IO)"], icon: <Layers className="text-primary" /> },
    { category: "DevOps & Security", items: ["JWT (Custom Encryption)", "OKTA", "OTP", "Docker", "Azure (Document Intelligence, CosmosDB, Service Bus Queue)", "Azure CI/CD", "SonarQube"], icon: <ShieldCheck className="text-secondary" /> },
  ];

  return (
    <section id="summary-board" className="py-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <Terminal size={400} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass p-8 md:p-12 rounded-3xl border border-primary/20 relative"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Terminal className="text-primary" size={24} />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">
            About <span className="gradient-text">Me</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Summary Text Area */}
          <div className="lg:col-span-2">
            <div className="mono text-sm md:text-base leading-relaxed text-gray-400 min-h-[300px] p-6 rounded-2xl bg-primary/5 border border-primary/30 relative shadow-[0_0_25px_rgba(0,242,255,0.1)] transition-all hover:shadow-[0_0_35px_rgba(0,242,255,0.15)] group/text">
              <div className="absolute inset-0 bg-primary/2 rounded-2xl pointer-events-none" />
              <div className="absolute top-2 right-4 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <p>
                {displayedSummary}
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-5 ml-1 bg-primary align-middle"
                />
              </p>
            </div>
          </div>

          {/* Stats/Quick Glance */}
          <div className="space-y-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-2"
            >
              <span className="text-4xl font-bold text-primary">7+ Years</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 mono">Professional Experience</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10 flex flex-col gap-2"
            >
              <span className="text-4xl font-bold text-secondary">Expert</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 mono">LLM & GenAI Architect</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2"
            >
              <span className="text-4xl font-bold text-white">CI/CD</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 mono">Quality First Approach</span>
            </motion.div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <Sparkles className="text-primary" />
            <h3 className="text-2xl font-bold uppercase tracking-widest">Core Expertise</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-2xl border border-white/5 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                    {skill.icon}
                  </div>
                  <h4 className="font-bold text-sm uppercase tracking-wider">{skill.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SummaryBoard;
