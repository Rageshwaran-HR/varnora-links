import { useEffect, useRef } from "react";
import actualLogo from "../assets/varnora-actual-logo.jpg";

interface ActualLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  glowEffect?: boolean;
}

export default function ActualLogo({ 
  className = "", 
  size = "md", 
  animated = false,
  glowEffect = false
}: ActualLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  
  // Size mapping
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40"
  };
  
  // Animation effect
  useEffect(() => {
    if (!animated || !logoRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      
      const rect = logoRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (x - centerX) / (rect.width / 2) * 10;
      const tiltY = (y - centerY) / (rect.height / 2) * -10;
      
      logoRef.current.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    };
    
    const handleMouseLeave = () => {
      if (!logoRef.current) return;
      logoRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };
    
    logoRef.current.addEventListener('mousemove', handleMouseMove);
    logoRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (!logoRef.current) return;
      logoRef.current.removeEventListener('mousemove', handleMouseMove);
      logoRef.current.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animated, logoRef]);
  
  return (
    <div 
      ref={logoRef}
      className={`relative transition-transform duration-200 ease-out ${sizeClasses[size]} ${className} ${
        animated ? "cursor-pointer hover:z-10" : ""
      } ${glowEffect ? "animate-glow" : ""}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <img 
        src={actualLogo} 
        alt="Varnora Logo" 
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
}