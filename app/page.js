'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Squares from './components/Squares';
import TextGenerateEffect from "./components/text-generate-effect";
import GradientText from './components/GradientText';
import { AnimatedGradientTextDemo } from './components/AnimatedGradientTextDemo';
import Lanyard from './components/Lanyard/Lanyard';
import Skills from './components/Skills';
import { ButtonMovingBorder } from './components/MovingBorderButton';
import { motion } from "framer-motion";
import { FaGithub, FaInstagram, FaLinkedin, FaDownload, FaBriefcase, FaCode, FaCertificate, FaGlobe, FaArrowRight, FaCube } from 'react-icons/fa';
import ProfileCard from './components/ProfileCard/ProfileCard';
import { IconCloud } from './components/IconCloud';
import Spline from '@splinetool/react-spline';
import { VelocityScroll } from './components/VelocityScroll';
import ProjectSection from './components/ProjectSection';
import Contact from './components/Contact';
import Image from 'next/image';

export default function HomePage() {
  // State untuk mengontrol visibilitas aset 3D (default: aktif)
  const [is3dEnabled, setIs3dEnabled] = useState(true);

  // Fungsi untuk toggle state
  const toggle3dAssets = () => {
    setIs3dEnabled(prev => !prev);
  };

  // Data untuk card statistik
  const stats = [
    { icon: <FaCode />, value: "13", title: "TOTAL PROJECTS", description: "Innovative web solutions crafted" },
    { icon: <FaCertificate />, value: "13", title: "CERTIFICATES", description: "Professional skills validated" },
    { icon: <FaGlobe />, value: "3", title: "YEARS OF EXPERIENCE", description: "Continuous learning journey" },
  ];

  return (
    <div className="relative min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text overflow-hidden">
      {/* LAPISAN 1: BACKGROUND ANIMASI */}
      <div className="absolute inset-0 z-0">
        <Squares speed={0.3} squareSize={35} direction="diagonal" borderColor="rgba(255, 255, 255, 0.03)" hoverFillColor="rgba(31, 137, 187, 0.53)" />
      </div>
      
      {/* Tombol untuk mengaktifkan/menonaktifkan aset 3D */}
      <button
        onClick={toggle3dAssets}
        title={`Toggle 3D Assets (${is3dEnabled ? 'On' : 'Off'})`}
        className={`fixed top-24 right-4 z-50 p-3 rounded-full border backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-110
          ${is3dEnabled
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_2px_#00ffdc80]'
            : 'bg-slate-800/50 border-slate-700 text-slate-400'
          }`}
      >
        <FaCube className="h-5 w-5" />
      </button>

      {/* HEADER FIXED DI ATAS MAIN */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="relative z-10 px-8 max-w-7xl mx-auto">
        {/* BAGIAN HERO */}
        <section id="home" className="flex flex-col md:flex-row items-center gap-10 pt-20 pb-16 lg:pt-0 lg:pb-20">
          {/* Blok Teks */}
          <div className="flex-1 text-light-text dark:text-dark-text space-y-6 pt-16 md:pt-40 order-last md:order-none">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}>
                <AnimatedGradientTextDemo />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }} className="text-4xl md:text-4xl font-moderniz font-bold leading-tight select-none text-light-heading dark:text-dark-heading" style={{ textShadow: `2px 2px 0 var(--tw-shadow-color-1), 4px 4px 0 var(--tw-shadow-color-2), 0 4px 12px var(--tw-shadow-color-3), 0 1px 0 var(--tw-shadow-color-4)` }}>
                WELCOME TO MY
                <span style={{ display: 'block', marginTop: '0.4em' }}>PORTFOLIO</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}>
                <GradientText colors={["#40f2ffff", "#4079ff", "#40fffcff", "#4079ff", "#40f9ffff"]} animationSpeed={3} className="custom-class font-cascadia font-bold" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}>
                <TextGenerateEffect words={'I craft responsive and visually engaging websites using React, Tailwind CSS, and modern web technologies.'} />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}>
                <Skills />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }} className="flex flex-row gap-4 mt-8">
                <a href="https://github.com/ZainAhmadF28" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900/[0.8] text-white transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:shadow-[0_0_24px_2px_#00ffdc]">
                    <FaGithub className="h-6 w-6 text-slate-400 transition-all duration-300 group-hover:text-cyan-300" />
                </a>
                <a href="https://instagram.com/zain.ahmadf" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900/[0.8] text-white transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:shadow-[0_0_24px_2px_#00ffdc]">
                    <FaInstagram className="h-6 w-6 text-slate-400 transition-all duration-300 group-hover:text-cyan-300" />
                </a>
                <a href="https://linkedin.com/in/zainahmadfahrezi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900/[0.8] text-white transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:shadow-[0_0_24px_2px_#00ffdc]">
                    <FaLinkedin className="h-6 w-6 text-slate-400 transition-all duration-300 group-hover:text-cyan-300" />
                </a>
            </motion.div>
          </div>

          {/* Blok Gambar/3D */}
          <div className="flex-1 flex items-center justify-center order-first md:order-last">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} className="relative w-full max-w-md h-96 flex items-center justify-center">
              {is3dEnabled ? (
                <Spline scene="https://prod.spline.design/UIL0P8J7jz9z3HXY/scene.splinecode" className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src="/src/assets/images/ZAINFIX.png"
                    alt="Zain Ahmad Fahrezi"
                    width={300}
                    height={300}
                    className="rounded-full border-4 border-cyan-400 shadow-[0_0_24px_2px_#00ffdc]"
                    priority
                  />
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* SECTION LANYARD/DISCORD */}
        <section id="lanyard" className="py-10">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }}>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <Lanyard userId="680363465755148318" />
              </div>
              {is3dEnabled && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-md h-96">
                    <IconCloud iconSlugs={["typescript", "javascript", "react", "html5", "css3", "nodejs", "express", "mongodb", "git", "github", "vscode", "figma"]} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* STATISTIK CARDS */}
        <section id="stats" className="py-16">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }} viewport={{ once: true }}>
                  <ProfileCard icon={stat.icon} value={stat.value} title={stat.title} description={stat.description} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PROJECT SECTION */}
        <ProjectSection />

        {/* CONTACT SECTION */}
        <Contact />

        {/* VELOCITY SCROLL */}
        <section className="py-10">
          <VelocityScroll text="ZAIN AHMAD FAHREZI • FULL STACK DEVELOPER • REACT SPECIALIST • " default_velocity={2} className="font-moderniz text-4xl font-bold text-light-heading dark:text-dark-heading" />
        </section>
      </main>
    </div>
  );
}