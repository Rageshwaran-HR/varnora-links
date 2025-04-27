import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { openLink } from "@/lib/utils";

interface LinkCardProps {
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  href: string;
  onClick?: () => void;
}

export default function LinkCard({
  icon,
  iconBgColor,
  title,
  description,
  href,
  onClick,
}: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Execute any custom onClick handler if provided
    if (onClick) {
      onClick();
    } else {
      // Default behavior: open the link
      openLink(href);
    }
  };

  return (
    <motion.div
      className="link-card rounded-lg overflow-hidden cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex items-center p-5 bg-black/70 border border-[#D4AF37]/30 rounded-lg overflow-hidden">
        {/* Gold shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1500 ease-in-out"></div>
        
        <div
          className={`${iconBgColor} rounded-full p-4 flex items-center justify-center mr-5 transition-all duration-300 ease-in-out shadow-md ${
            isHovered ? "scale-110 shadow-lg shadow-[#D4AF37]/30" : ""
          }`}
        >
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F5E7A3] via-[#D4AF37] to-[#B8860B] title-font">
            {title}
          </h3>
          <p className="text-sm text-white/80 body-font">
            {description}
          </p>
        </div>
        
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/20"
          animate={{ 
            x: isHovered ? 0 : 10, 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-bold text-lg">→</span>
        </motion.div>
      </div>
    </motion.div>
  );
}