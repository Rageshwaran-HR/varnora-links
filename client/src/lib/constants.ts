// Social media and contact links
export const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/1234567890",  // Replace with actual WhatsApp link
  website: "https://varnora.com",         // Replace with actual website
  instagram: "https://instagram.com/varnora", // Replace with actual Instagram
  linkedin: "https://linkedin.com/company/varnora", // Replace with actual LinkedIn
  email: "mailto:info@varnora.com",       // Replace with actual email
  location: "https://maps.google.com/?q=Varnora+Office" // Replace with actual location
};

// Add an SVG version of the Varnora logo that can be embedded directly
export const VARNORA_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5E7A3" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#B8860B" />
    </linearGradient>
  </defs>
  <g transform="translate(30, 50)">
    <path d="M270,50 L480,500 L60,500 Z" fill="none" stroke="url(#gold-gradient)" stroke-width="20" />
    <path d="M270,120 L420,450 L120,450 Z" fill="none" stroke="url(#gold-gradient)" stroke-width="15" />
    <text x="270" y="350" font-family="Playfair Display, serif" font-size="160" font-weight="bold" text-anchor="middle" fill="url(#gold-gradient)">V</text>
    <g fill="url(#gold-gradient)">
      <circle cx="270" cy="80" r="5" />
      <circle cx="450" cy="480" r="5" />
      <circle cx="90" cy="480" r="5" />
    </g>
    <g fill="url(#gold-gradient)">
      <!-- Decorative swirls -->
      <path d="M270,50 C310,60 320,90 290,110 C260,130 280,160 310,150" fill="none" stroke="url(#gold-gradient)" stroke-width="6" />
      <path d="M270,50 C230,60 220,90 250,110 C280,130 260,160 230,150" fill="none" stroke="url(#gold-gradient)" stroke-width="6" />
      <path d="M60,500 C40,450 80,430 110,470 C140,510 180,480 180,450" fill="none" stroke="url(#gold-gradient)" stroke-width="6" />
      <path d="M480,500 C500,450 460,430 430,470 C400,510 360,480 360,450" fill="none" stroke="url(#gold-gradient)" stroke-width="6" />
    </g>
  </g>
</svg>
`;
