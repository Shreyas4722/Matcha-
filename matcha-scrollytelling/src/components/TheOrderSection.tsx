"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export default function TheOrderSection() {
   const containerRef = useRef<HTMLDivElement>(null);

   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end end"]
   });

   const sectionOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
   const sectionY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

   const [activeSize, setActiveSize] = useState("Regular");
   const [activeMilk, setActiveMilk] = useState("Oat");

   return (
      <section ref={containerRef} className="relative w-full h-[200vh] bg-[#050505]">
         <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

            <motion.div style={{ opacity: sectionOpacity, y: sectionY }} className="w-full max-w-7xl h-[80vh] flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 gap-16">

               {/* 3D Visual */}
               <div className="relative w-full lg:w-1/2 h-full flex items-center justify-center">
                  <div className="relative w-full max-w-md aspect-[3/4]">
                     <Image src="/images/3d_order_drink.png" alt="Awwwards 3D Layered Matcha" fill className="object-contain" />
                  </div>
               </div>

               {/* Glassmorphism Order Card */}
               <div className="w-full lg:w-1/2 max-w-lg">
                  <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl p-10 flex flex-col gap-8 shadow-2xl">

                     <div>
                        <h2 className="text-4xl font-extrabold tracking-tighter text-white/90">The Artisan Dirty Matcha</h2>
                        <p className="text-white/60 mt-2 text-sm tracking-wide">A cinematic collision of ceremonial grade Uji matcha, purified crystalline ice, and reserve espresso.</p>
                     </div>

                     {/* Configuration */}
                     <div className="flex flex-col gap-6">

                        {/* Size */}
                        <div>
                           <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">Size</p>
                           <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                              {["Small", "Regular", "Large"].map((size) => (
                                 <button
                                    key={size}
                                    onClick={() => setActiveSize(size)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeSize === size ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
                                 >
                                    {size}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Milk */}
                        <div>
                           <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">Milk Base</p>
                           <div className="flex gap-2">
                              {["Oat", "Almond", "Whole Dairy"].map((milk) => (
                                 <button
                                    key={milk}
                                    onClick={() => setActiveMilk(milk)}
                                    className={`flex-1 py-3 text-sm font-medium rounded-xl border transition-all ${activeMilk === milk ? "border-[#5D8233] bg-[#5D8233]/10 text-[#5D8233]" : "border-white/10 text-white/40 hover:border-white/30"}`}
                                 >
                                    {milk}
                                 </button>
                              ))}
                           </div>
                        </div>

                     </div>

                     {/* Action */}
                     <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <p className="text-3xl font-black text-white/90">$8.50</p>

                        <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold tracking-tight hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(93,130,51,0.5)] border border-transparent hover:border-[#5D8233]">
                           <ShoppingBag className="w-5 h-5" />
                           Add to Bag
                        </button>
                     </div>

                  </div>
               </div>

            </motion.div>

         </div>
      </section>
   );
}
