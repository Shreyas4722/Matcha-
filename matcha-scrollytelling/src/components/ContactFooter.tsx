"use client";

import { useForm } from "react-hook-form";
import { ArrowRight, AtSign, MapPin } from "lucide-react";

type ContactFormData = {
  name: string;
  email: string;
};

export default function ContactFooter() {
  const { register, handleSubmit, reset, formState: { isSubmitting, isSubmitSuccessful } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Simulate server action delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Joined:", data);
    reset();
  };

  return (
    <footer className="relative w-full h-screen bg-[#050505] flex flex-col justify-between border-t border-white/5 pt-32 pb-8 px-8 md:px-16 z-30">
        
       <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between gap-16">
          
          {/* Form */}
          <div className="max-w-md w-full">
             <h2 className="text-5xl font-black tracking-tighter text-white/90 mb-4">Join the Roastery List.</h2>
             <p className="text-white/60 mb-8 tracking-wide">Early access to limited small-batch reserve drops.</p>

             {isSubmitSuccessful ? (
                <div className="bg-[#5D8233]/10 border border-[#5D8233]/30 p-6 rounded-xl">
                   <p className="text-[#5D8233] font-medium">Welcome to the inner circle.</p>
                </div>
             ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                   <div>
                      <input 
                         {...register("name", { required: true })}
                         placeholder="Your Name"
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                      />
                   </div>
                   <div>
                      <input 
                         {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                         placeholder="Email Address"
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                      />
                   </div>
                   <button 
                      disabled={isSubmitting}
                      className="w-full group bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                   >
                     {isSubmitting ? "Joining..." : "Join"}
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </form>
             )}
          </div>

          {/* Links */}
          <div className="flex flex-col items-start md:items-end justify-between">
              <div className="space-y-4 text-left md:text-right">
                 <h3 className="text-xl font-bold text-white/80">Experience The Craft</h3>
                 <p className="text-white/40 flex items-center gap-2 justify-start md:justify-end cursor-pointer hover:text-white transition-colors">
                    <MapPin className="w-4 h-4"/>
                    Find a Cafe
                 </p>
                 <p className="text-white/40 flex items-center gap-2 justify-start md:justify-end cursor-pointer hover:text-white transition-colors">
                    <AtSign className="w-4 h-4"/>
                    @artisandirtymatcha
                 </p>
              </div>
          </div>

       </div>

       {/* Bottom Legal */}
       <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-center text-white/30 text-xs tracking-widest uppercase border-t border-white/10 pt-8 mt-16">
          <p>© 2026 The Artisan Dirty Matcha. All Rights Reserved.</p>
          <p className="mt-4 md:mt-0">Premium Scrollytelling Experience</p>
       </div>

    </footer>
  );
}
