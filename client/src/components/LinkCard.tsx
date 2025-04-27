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
          className={`${iconBgColor} rounded-md p-3 flex items-center justify-center mr-4 transition-transform duration-300 ease-in-out ${
            isHovered ? "scale-110" : ""
          }`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold gold-text title-font">
            {title}
          </h3>
          <p className="text-sm text-white/70 max-w-[200px] truncate">
            {description}
          </p>
        </div>
        <motion.div
          className="gold-text text-xl font-bold"
          animate={{ x: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          →
        </motion.div>
      </div>
    </motion.div>
  );
}