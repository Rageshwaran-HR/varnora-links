import { useState } from "react";
import { motion } from "framer-motion";
import VarnoraLogo from "@/components/VarnoraLogo";
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <motion.header 
        className="flex flex-col items-center w-full max-w-2xl mb-10 pt-4"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 3D Logo */}
        <motion.div 
          className="mb-8"
          variants={item}
        >
          <VarnoraLogo size="lg" animated={true} glowEffect={true} />
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-6xl font-bold tracking-tight text-center mb-4 gold-text-shadow title-font"
          variants={item}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F5E7A3] via-[#D4AF37] to-[#B8860B]">
            VARNORA
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-center mb-6 max-w-xl tracking-wide text-white/80 body-font"
          variants={item}
        >
          Web Development & Creative Design – <i>Design That Speaks</i>
        </motion.p>
        
        <motion.div 
          className="h-1 w-32 gold-gradient rounded-full mb-10"
          variants={item}
        />
      </motion.header>

      {/* Links */}
      <motion.main 
        className="w-full max-w-xl space-y-4 mb-12"
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
            variant="outline" 
            className="group relative border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10"
          >
            <FaUserShield className="mr-2 text-[#D4AF37] group-hover:animate-pulse" />
            <span>Admin Access</span>
          </Button>
        </Link>
      </motion.div>

      {/* Company Details */}
      <motion.section 
        className="glass-dark rounded-xl p-8 max-w-2xl w-full mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold gold-text mb-4 text-center title-font">About Varnora</h2>
        <p className="text-lg text-white/70 leading-relaxed text-center body-font">
          Varnora specializes in crafting distinctive web experiences and creative designs that blend aesthetics with functionality. 
          Our passion lies in transforming ideas into digital realities that not only look stunning but also perform exceptionally.
          With an eye for detail and commitment to excellence, we deliver solutions that truly speak to your audience.
        </p>
      </motion.section>
      
      {/* Admin Login Modal */}
      <AdminLoginModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </div>
  );
}
