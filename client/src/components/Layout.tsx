import { ReactNode, useEffect, useState } from "react";
import ParticleBackground from "./ParticleBackground";
import VarnoraLogo from "./VarnoraLogo";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  const isAdminPage = location.startsWith('/admin');

  useEffect(() => {
    // Simulate loader behavior
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative luxury-scrollbar">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-black flex flex-col justify-center items-center z-50 transition-all duration-500">
          <div className="relative">
            <VarnoraLogo size="lg" glowEffect={true} className="mb-10 animate-float" />
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-48 h-12 bg-gradient-radial from-[#D4AF37]/30 to-transparent blur-xl"></div>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold gold-text mb-6 animate-pulse-slow title-font tracking-wider">VARNORA</h2>
            <div className="w-48 h-1.5 bg-black/60 overflow-hidden rounded-full border border-[#D4AF37]/20">
              <div className="h-full gold-gradient-animated animate-gradient-x bg-size-200"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Particles Background */}
      <ParticleBackground />
      
      {/* Content */}
      <div className={`transition-all duration-700 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Admin header banner - only shows on admin pages */}
        {isAdminPage && (
          <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#0a0a0a] via-[#D4AF37] to-[#0a0a0a] h-1 z-50" />
        )}
        
        {children}
        
        {/* Footer - don't show on admin pages */}
        {!isAdminPage && (
          <footer className="py-6 mt-auto z-10 relative">
            <div className="container mx-auto px-4">
              <div className="border-t border-[#D4AF37]/20 pt-6 flex flex-col md:flex-row justify-between items-center">
                <div className="text-white/60 text-sm mb-4 md:mb-0">
                  © {new Date().getFullYear()} Varnora. All rights reserved.
                </div>
                <div className="text-white/60 text-sm">
                  Designed with ♥ by <span className="gold-text">Varnora</span>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
