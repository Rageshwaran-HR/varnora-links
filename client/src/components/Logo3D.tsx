import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface Logo3DProps {
  className?: string;
}

export default function Logo3D({ className }: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // Create simple 3D rotation effect for the logo
    const container = containerRef.current;
    
    if (!container) return;
    
    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    // Update rotation based on mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation angle based on mouse distance from center
      targetRotationX = -((e.clientY - centerY) / 30);
      targetRotationY = ((e.clientX - centerX) / 30);
    };
    
    // Animation loop
    const animate = () => {
      // Smooth easing towards target rotation
      rotationX += (targetRotationX - rotationX) * 0.1;
      rotationY += (targetRotationY - rotationY) * 0.1;
      
      if (logoRef.current) {
        logoRef.current.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      }
      
      requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={cn("w-32 h-32 perspective-[1000px] animate-float", className)}
    >
      <div className="w-full h-full gold-glow relative transform-style-preserve-3d transition-transform duration-300 ease-in-out">
        <img 
          ref={logoRef}
          src="/src/assets/varnora-logo.svg" 
          alt="Varnora Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to displaying the SVG directly if image loading fails
            const target = e.target as HTMLImageElement;
            target.outerHTML = `
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <g transform="translate(10,10) scale(0.9)">
                  <path d="M100 0 L200 180 L0 180 Z" fill="#D4AF37" />
                  <path d="M100 40 L160 160 L40 160 Z" fill="#0A0A0A" />
                  <path d="M100 80 L130 140 L70 140 Z" fill="#D4AF37" />
                </g>
              </svg>
            `;
          }}
        />
      </div>
    </div>
  );
}
