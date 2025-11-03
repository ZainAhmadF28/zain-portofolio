// src/components/Preloader.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Instagram } from 'lucide-react';
import DotGrid from './DotGrid';
import Spline from '@splinetool/react-spline';

const Preloader = ({ onFinished }) => {
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  // 1. State baru untuk melacak status loading Spline
  const [isAssetLoaded, setIsAssetLoaded] = useState(false);
  const fullText = "www.zainahmadfahrezi.com";

  // 2. Fungsi yang akan dipanggil saat Spline selesai dimuat
  const handleAssetLoad = () => {
    setIsAssetLoaded(true);
  };

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(initialTimer);
  }, []);

  // 3. Modifikasi efek utama untuk memeriksa status loading aset
  useEffect(() => {
    if (showContent) {
      // Logika animasi mengetik (tidak berubah)
      if (typedText.length < fullText.length) {
        const typingTimer = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 120);
        return () => clearTimeout(typingTimer);
      } 
      // KONDISI BARU: transisi keluar hanya jika teks selesai diketik DAN aset sudah dimuat
      else if (typedText.length === fullText.length && isAssetLoaded) {
        const exitTimer = setTimeout(() => {
          setFadeOut(true);
          setTimeout(onFinished, 1000); // Tunggu animasi fade-out
        }, 1500); // Jeda setelah semua selesai
        return () => clearTimeout(exitTimer);
      }
    }
    // Tambahkan isAssetLoaded ke dependency array
  }, [typedText, showContent, fullText, onFinished, isAssetLoaded]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          exit={{
            opacity: 0,
            filter: 'blur(10px)',
            transition: { duration: 1, ease: 'easeInOut' }
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white bg-[#060010]"
        >
          <DotGrid />
          
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
              className="text-center relative z-10 p-4"
            >
              <div className="flex justify-center mb-2 mt-[-24px] md:mt-[-32px]">
                <div className="w-[320px] h-[180px] md:w-[480px] md:h-[260px]">
                  {/* 4. Tambahkan prop onLoad ke komponen Spline */}
                  <Spline 
                    scene="https://prod.spline.design/FcZ66SFMX1YbF-0I/scene.splinecode" 
                    onLoad={handleAssetLoad}
                  />
                </div>
              </div>
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } }}
                className="text-4xl md:text-6xl font-moderniz font-bold mb-4"
              >
                Zain Ahmad Fahrezi
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.5 } }}
                className="font-cascadia text-lg md:text-xl text-gray-400 mb-8 break-all"
              >
                <span>{typedText}</span>
                <span className="animate-blink">|</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }}
                className="flex justify-center gap-6"
              >
                <a href="https://github.com/zainahmadf28" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffdc] transition-all duration-300 transform hover:scale-110">
                  <Github size={32} />
                </a>
                <a href="https://www.linkedin.com/in/zain-ahmad-fahrezi-7a8a912a7/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffdc] transition-all duration-300 transform hover:scale-110">
                  <Linkedin size={32} />
                </a>
                <a href="https://www.instagram.com/zainahmadf" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffdc] transition-all duration-300 transform hover:scale-110">
                  <Instagram size={32} />
                </a>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;