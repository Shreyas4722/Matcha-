"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import Image from "next/image";

const FRAME_COUNT = 120;

export default function TheDrinkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001,
  });

  // MAPPING FOR 550vh parent:
  // 0 - 200vh (0 to 0.363): Frame 0 - 119
  // 200vh - 550vh: Frame 119
  const frameIndexTransformer = useTransform(smoothProgress, [0, 0.363, 1], [0, FRAME_COUNT - 1, FRAME_COUNT - 1]);
  
  // Canvas Opacity: Starts fading out at 400vh (0.727) to 550vh (1.0)
  const canvasOpacity = useTransform(smoothProgress, [0.65, 0.85], [1, 0]);

  // Eruption Text (0 - 200vh) -> (0 - 0.363)
  const heroOpacity = useTransform(smoothProgress, [0, 0.1, 0.25, 0.35], [0, 1, 1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.1, 0.25, 0.35], [50, 0, 0, -50]);

  // Anatomy Text (200vh - 400vh) -> (0.363 - 0.727)
  const anatomyOpacity = useTransform(smoothProgress, [0.4, 0.5, 0.65, 0.75], [0, 1, 1, 0]);

  // The Ritual Setup (400vh - 550vh) -> (0.727 - 1.0)
  const ritualOpacity = useTransform(smoothProgress, [0.75, 0.85, 0.95, 1.0], [0, 1, 1, 0.8]);
  const ritualY = useTransform(smoothProgress, [0.75, 0.85], [100, 0]);

  // Image preloading
  useEffect(() => {
    let active = true;
    const loadedImages: HTMLImageElement[] = [];
    let count = 0;
    const preload = async () => {
      for (let i = 0; i < FRAME_COUNT; i++) loadedImages.push(new window.Image());
      const promises = loadedImages.map((img, i) => new Promise<void>((resolve) => {
        img.src = `/sequence/frame_${i + 1}.jpg`;
        img.onload = () => { if (!active) return; count++; setLoadedCount(count); resolve(); };
        img.onerror = () => { count++; setLoadedCount(count); resolve(); };
      }));
      await Promise.all(promises);
      if (active) { setImages(loadedImages); setIsLoaded(true); }
    };
    preload();
    return () => { active = false; loadedImages.forEach(img => { img.src = ""; }); };
  }, []);

  // Canvas Drawing RAF
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    let currentFrame = -1;
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    const nativeImgWidth = images[0]?.width || 1080;
    const nativeImgHeight = images[0]?.height || 1080;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvasWidth = canvas.width;
      canvasHeight = canvas.height;
      currentFrame = -1;
    };

    const drawFrame = () => {
      const floatIndex = frameIndexTransformer.get();
      const nextFrameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(floatIndex)));
      if (nextFrameIndex !== currentFrame) {
        const img = images[nextFrameIndex];
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.fillStyle = "#050505";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          const scale = Math.min(canvasWidth / nativeImgWidth, canvasHeight / nativeImgHeight);
          const drawWidth = nativeImgWidth * scale;
          const drawHeight = nativeImgHeight * scale;
          const dx = (canvasWidth - drawWidth) / 2;
          const dy = (canvasHeight - drawHeight) / 2;
          ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
          currentFrame = nextFrameIndex;
        }
      }
      animationFrameId = requestAnimationFrame(drawFrame);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    animationFrameId = requestAnimationFrame(drawFrame);
    return () => { window.removeEventListener("resize", updateCanvasSize); cancelAnimationFrame(animationFrameId); };
  }, [isLoaded, images, frameIndexTransformer]);

  return (
    <section ref={containerRef} className="relative w-full h-[550vh] bg-[#050505]">
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
          <div className="w-64 h-1 bg-white/20 rounded overflow-hidden">
            <div className="h-full bg-[#5D8233] transition-all duration-300" style={{ width: `${(loadedCount / FRAME_COUNT) * 100}%` }} />
          </div>
          <p className="mt-4 text-white/50 text-sm tracking-widest font-mono uppercase">Preloading Sequence {Math.round((loadedCount / FRAME_COUNT) * 100)}%</p>
        </div>
      )}

      {/* STICKY RENDERER */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* CANVAS */}
        <motion.canvas ref={canvasRef} style={{ opacity: canvasOpacity }} className="absolute inset-0 w-full h-full object-contain touch-none pointer-events-none" />

        {/* SECTION 1: HERO ERUPTION */}
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center z-10 px-4">
          <h1 className="text-5xl md:text-8xl lg:text-[200px] font-extrabold tracking-tighter text-white/90 drop-shadow-2xl leading-none">CRAFTED <br className="hidden md:block"/> CHAOS</h1>
          <p className="mt-8 text-xl md:text-3xl font-light text-white/60 tracking-widest uppercase">The perfect collision of earth and energy.</p>
          <div className="mt-16 flex flex-col items-center">
             <span className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent block mb-4"></span>
             <span className="text-xs tracking-[0.3em] uppercase text-white/40">Scroll to Explore</span>
          </div>
        </motion.div>

        {/* SECTION 2: THE ANATOMY */}
        <motion.div style={{ opacity: anatomyOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
           <div className="relative w-full max-w-7xl h-full flex items-center justify-between px-8 md:px-16">
              
              <div className="flex flex-col gap-32">
                <div className="max-w-xs">
                  <h3 className="text-3xl font-bold tracking-tighter mb-2 text-white/90">Stone-Ground Uji Matcha</h3>
                  <p className="text-white/60">100% Organic, Ceremonial Grade from Uji, Japan.</p>
                  <div className="w-16 h-px bg-[#5D8233] mt-6"></div>
                </div>
                <div className="max-w-xs">
                  <h3 className="text-3xl font-bold tracking-tighter mb-2 text-white/90">Crystalline Ice</h3>
                  <p className="text-white/60">Slow-frozen for 48 hours for zero dilution during chaos.</p>
                  <div className="w-16 h-px bg-white/20 mt-6"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="max-w-xs text-right">
                  <h3 className="text-3xl font-bold tracking-tighter mb-2 text-white/90">Double-Shot Ristretto</h3>
                  <p className="text-white/60">Hand-pressed, low acidity reserve espresso.</p>
                  <div className="w-16 h-px bg-[#5D8233] mt-6 ml-auto"></div>
                </div>
              </div>

           </div>
        </motion.div>

        {/* SECTION 3: THE RITUAL */}
        <motion.div style={{ opacity: ritualOpacity, y: ritualY }} className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 md:px-16 bg-[#050505]">
           <div className="max-w-7xl w-full flex flex-col items-center">
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-16 text-center text-white/90">
               Whisked. Poured.<br/><span className="text-[#5D8233]">Perfected.</span>
             </h2>

             {/* Bento Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[50vh] md:h-[60vh]">
                <div className="relative rounded-2xl overflow-hidden group">
                   <Image src="/images/bento_whisk.png" alt="Matcha Whisk" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end">
                      <p className="text-white/90 font-bold text-2xl tracking-tight">The Chasen</p>
                      <p className="text-white/60 text-sm tracking-wide">100-prong bamboo craft</p>
                   </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden group">
                   <Image src="/images/bento_pour.png" alt="Espresso Pour" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end">
                      <p className="text-white/90 font-bold text-2xl tracking-tight">The Extraction</p>
                      <p className="text-white/60 text-sm tracking-wide">20g Dose, 9-Bar Pressure</p>
                   </div>
                </div>
             </div>

           </div>
        </motion.div>

      </div>
    </section>
  );
}
