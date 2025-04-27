import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FaHome, FaInfoCircle, FaPalette, FaLink, FaSignOutAlt } from "react-icons/fa";
import VarnoraLogo from "../VarnoraLogo";
import { useAuth } from "@/hooks/use-auth";

export default function AdminSidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  
  const navItems = [
    { icon: FaHome, label: "Dashboard", href: "/admin" },
    { icon: FaInfoCircle, label: "Company Info", href: "/admin/company-info" },
    { icon: FaPalette, label: "Appearance", href: "/admin/appearance" },
    { icon: FaLink, label: "Manage Links", href: "/admin/links" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="h-screen w-64 bg-black border-r border-gray-800 flex flex-col">
      <div className="p-4 flex items-center justify-center border-b border-gray-800">
        <div className="flex items-center justify-center p-2">
          <VarnoraLogo size="sm" animated={false} />
        </div>
        <h1 className="text-xl font-bold ml-2 gold-text">Admin</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                  location === item.href 
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30" 
                    : "text-gray-300 hover:bg-gray-800/60"
                }`}>
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="flex items-center px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-gray-800/60 transition-all"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}