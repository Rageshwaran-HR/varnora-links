import Logo3D from "@/components/Logo3D";
import LinkCard from "@/components/LinkCard";
import { SOCIAL_LINKS } from "@/lib/constants";
import { FaWhatsapp, FaGlobe, FaInstagram, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <header className="flex flex-col items-center w-full max-w-lg mb-8">
        {/* 3D Logo */}
        <div className="mb-6">
          <Logo3D />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-2 gold-text-shadow">
          <span className="text-[#D4AF37]">Varnora</span>
        </h1>
        
        <p className="text-lg text-center mb-4 max-w-md tracking-wide">
          Web Development & Creative Design – Design That Speaks.
        </p>
        
        <div className="h-1 w-20 gold-gradient rounded-full mb-8"></div>
      </header>

      {/* Links */}
      <main className="w-full max-w-md space-y-4 mb-10">
        <LinkCard
          icon={FaWhatsapp}
          iconBgColor="bg-green-600"
          title="WhatsApp"
          description="Contact me directly"
          href={SOCIAL_LINKS.whatsapp}
        />
        
        <LinkCard
          icon={FaGlobe}
          iconBgColor="bg-[#D4AF37]"
          title="Company Website"
          description="Visit our official website"
          href={SOCIAL_LINKS.website}
        />
        
        <LinkCard
          icon={FaInstagram}
          iconBgColor="bg-gradient-to-tr from-purple-600 to-yellow-400"
          title="Instagram"
          description="Follow our creative journey"
          href={SOCIAL_LINKS.instagram}
        />
        
        <LinkCard
          icon={FaLinkedinIn}
          iconBgColor="bg-blue-700"
          title="LinkedIn"
          description="Connect professionally"
          href={SOCIAL_LINKS.linkedin}
        />
        
        <LinkCard
          icon={FaEnvelope}
          iconBgColor="bg-red-500"
          title="Email Me"
          description="Let's discuss your project"
          href={SOCIAL_LINKS.email}
        />
        
        <LinkCard
          icon={FaMapMarkerAlt}
          iconBgColor="bg-blue-500"
          title="Business Location"
          description="Find us on Google Maps"
          href={SOCIAL_LINKS.location}
        />
      </main>

      {/* Company Details */}
      <section className="glass-effect rounded-xl p-6 max-w-md w-full mb-8">
        <h2 className="text-xl font-bold text-[#D4AF37] mb-3 text-center">About Varnora</h2>
        <p className="text-sm text-gray-300 leading-relaxed text-center">
          Varnora specializes in crafting distinctive web experiences and creative designs that blend aesthetics with functionality. 
          Our passion lies in transforming ideas into digital realities that not only look stunning but also perform exceptionally.
          With an eye for detail and commitment to excellence, we deliver solutions that truly speak to your audience.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center w-full max-w-lg mt-auto">
        <div className="h-px w-20 gold-gradient mx-auto mb-4"></div>
        <p className="text-xs text-gray-400">
          Designed by <span className="text-[#D4AF37]">Varnora</span> &copy; {currentYear}
        </p>
      </footer>
    </div>
  );
}
