import { useState } from "react";
import { motion } from "framer-motion";
import VarnoraLogo from "@/components/VarnoraLogo";
import ActualLogo from "@/components/ActualLogo";
import LinkCard from "@/components/LinkCard";
import { SOCIAL_LINKS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import AdminLoginModal from "@/components/admin/AdminLoginModal";
import { FaWhatsapp, FaGlobe, FaInstagram, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt, FaUserShield } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const headerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.2
      }
    }
  };
  
  const copiedToast = () => {
    toast({
      title: "Contact Information Copied",
      description: "The contact information has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-4 sm:px-6 lg:px-8 relative z-10">
      

      {/* V Logo for Links Section */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ActualLogo size="lg" animated={true} glowEffect={true} />
      </motion.div>
      
      {/* Links */}
      <motion.main 
        className="w-full max-w-xl space-y-4 mb-12 mt-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <LinkCard
            icon={FaWhatsapp}
            iconBgColor="bg-green-600"
            title="WhatsApp"
            description="Contact us directly"
            href={SOCIAL_LINKS.whatsapp}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <LinkCard
            icon={FaGlobe}
            iconBgColor="bg-[#D4AF37]"
            title="Company Website"
            description="Visit our official website"
            href={SOCIAL_LINKS.website}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <LinkCard
            icon={FaInstagram}
            iconBgColor="bg-gradient-to-tr from-purple-600 to-yellow-400"
            title="Instagram"
            description="Follow our creative journey"
            href={SOCIAL_LINKS.instagram}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <LinkCard
            icon={FaLinkedinIn}
            iconBgColor="bg-blue-700"
            title="LinkedIn"
            description="Connect professionally"
            href={SOCIAL_LINKS.linkedin}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <LinkCard
            icon={FaEnvelope}
            iconBgColor="bg-red-500"
            title="Email Us"
            description="Let's discuss your project"
            href={SOCIAL_LINKS.email}
            onClick={() => {
              navigator.clipboard.writeText("info@varnora.com");
              copiedToast();
            }}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <LinkCard
            icon={FaMapMarkerAlt}
            iconBgColor="bg-blue-500"
            title="Business Location"
            description="Find us on Google Maps"
            href={SOCIAL_LINKS.location}
          />
        </motion.div>
      </motion.main>

      {/* Admin access button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mb-12"
      >
        <Link to="/auth">
          <Button 
            className="gold-gradient-animated text-black font-semibold btn-3d px-8 py-4 rounded-md shadow-lg"
          >
            <FaUserShield className="mr-2 h-5 w-5 text-black" />
            <span className="tracking-wider">ADMIN ACCESS</span>
          </Button>
        </Link>
      </motion.div>

      {/* Company Details */}
      <motion.section 
        className="glass-dark rounded-xl p-8 max-w-2xl w-full mb-14 border border-[#D4AF37]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="h-0.5 w-20 gold-gradient rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F5E7A3] via-[#D4AF37] to-[#B8860B] mb-4 text-center title-font">
          About Varnora
        </h2>
        <p className="text-lg text-white/80 leading-relaxed text-center body-font">
          Varnora specializes in crafting distinctive web experiences and creative designs that blend aesthetics with functionality. 
          Our passion lies in transforming ideas into digital realities that not only look stunning but also perform exceptionally.
          With an eye for detail and commitment to excellence, we deliver solutions that truly speak to your audience.
        </p>
        <div className="flex justify-center mt-4">
          <div className="h-0.5 w-20 gold-gradient rounded-full"></div>
        </div>
      </motion.section>
      
      {/* Footer */}
      <motion.div 
        className="w-full text-center mb-6 text-white/50 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p>Designed by Varnora | © {new Date().getFullYear()} All Rights Reserved</p>
      </motion.div>
      
      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </div>
  );
}
