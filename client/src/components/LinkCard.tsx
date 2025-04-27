import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

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
  onClick
}: LinkCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="link-card glass-effect rounded-xl py-4 px-5 flex items-center gap-4 hover:border-[#D4AF37] group w-full"
    >
      <span className={cn("w-10 h-10 flex items-center justify-center rounded-full text-white", iconBgColor)}>
        <Icon className="text-xl" />
      </span>
      
      <div className="flex-1">
        <h3 className="font-medium group-hover:text-[#D4AF37] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400">
          {description}
        </p>
      </div>
      
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-[#D4AF37] opacity-70 group-hover:opacity-100 transition-opacity" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
          clipRule="evenodd" 
        />
      </svg>
    </a>
  );
}
