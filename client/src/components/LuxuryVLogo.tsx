import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import vLogoSvg from "../assets/varnora-v-logo.svg";

interface LuxuryVLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  glowEffect?: boolean;
}

export default function LuxuryVLogo({ 
  className = "", 
  size = "md", 
  animated = true,
  glowEffect = true
}: LuxuryVLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  // Determine size classes
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };
  
  // 3D tilt effect
  useEffect(() => {
    if (!animated || !logoRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center (-1 to 1)
      const relativeX = (e.clientX - centerX) / (rect.width / 2);
      const relativeY = (e.clientY - centerY) / (rect.height / 2);
      
      // Apply rotation (limited range)
      const maxRotation = 15;
      setRotation({
        x: -relativeY * maxRotation, // Invert Y for natural rotation
        y: relativeX * maxRotation,
      });
    };
    
    const handleMouseLeave = () => {
      // Reset rotation when mouse leaves
      setRotation({ x: 0, y: 0 });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    logoRef.current.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (logoRef.current) {
        logoRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [animated]);
  
  return (
    <motion.div 
      ref={logoRef}
      className={`relative ${sizeClasses[size]} ${className}`}
      style={{
        perspective: "1000px",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className={`w-full h-full transition-transform duration-200 ease-out ${
          animated ? "" : "transform-none"
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <img 
          src={vLogoSvg} 
          alt="Varnora V Logo" 
          className={`w-full h-full object-contain ${glowEffect ? "animate-glow" : ""}`}
        />
      </div>
    </motion.div>
  );
}