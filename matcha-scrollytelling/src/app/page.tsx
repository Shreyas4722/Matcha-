import TheDrinkSection from "@/components/TheDrinkSection";
import TheOrderSection from "@/components/TheOrderSection";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <main className="relative w-full bg-[#050505]">
      
      {/* 
        Section 1: 550vh
        - Hero Eruption Canvas (0 to 200vh)
        - Anatomy Details (200vh to 400vh)
        - The Ritual Bento Grid (400vh to 550vh)
      */}
      <TheDrinkSection />

      {/* 
        Section 2: 200vh
        - The Order Station with 3D product & glassmorphism form overlay
      */}
      <TheOrderSection />

      {/* 
        Section 3: 100vh
        - Contact Form & Footer anchoring the journey
      */}
      <ContactFooter />

    </main>
  );
}
