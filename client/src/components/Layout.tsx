import { ReactNode, useEffect, useState } from "react";
import ParticleBackground from "./ParticleBackground";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loader behavior
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-background flex justify-center items-center z-50 transition-opacity duration-500">
          <div className="w-20 h-20 border-5 border-white/10 rounded-full border-t-[#D4AF37] animate-spin"></div>
        </div>
      )}
      
      {/* Particles Background */}
      <ParticleBackground />
      
      {/* Content */}
      <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
}
