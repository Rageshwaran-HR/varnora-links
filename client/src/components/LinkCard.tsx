import { useState } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { openLink } from "@/lib/utils";

interface LinkCardProps {
  icon: IconType;
  iconBgColor: string;
  title: string;
  description: string;
  href: string;
  onClick?: () => void;
}

export default function LinkCard({
  icon: Icon,
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
      className="link-card glass-card rounded-lg overflow-hidden cursor-pointer gold-shine"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center p-4">
        <div
          className={`${iconBgColor} rounded-full p-3.5 flex items-center justify-center mr-4 transition-all duration-300 ease-in-out shadow-md ${
            isHovered ? "scale-110 shadow-lg shadow-[#D4AF37]/20" : ""
          }`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#F5E7A3] via-[#D4AF37] to-[#B8860B] title-font">
            {title}
          </h3>
          <p className="text-sm text-white/80 max-w-[200px] truncate">
            {description}
          </p>
        </div>
        <motion.div
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black"
          animate={{ 
            x: isHovered ? 0 : 10, 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-bold">→</span>
        </motion.div>
      </div>
    </motion.div>
  );
}