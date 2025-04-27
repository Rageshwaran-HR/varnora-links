import { useEffect } from "react";

// Type definition for the global particlesJS
declare global {
  interface Window {
    particlesJS: any;
  }
}

export default function ParticleBackground() {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 1000
            }
          },
          color: {
            value: ["#D4AF37", "#F5E7A3", "#B8860B", "#FFD700", "#FFDF00"]
          },
          shape: {
            type: ["circle", "triangle", "polygon", "star"],
            stroke: {
              width: 0,
              color: "#000000"
            },
            polygon: {
              nb_sides: 6
            }
          },
          opacity: {
            value: 0.4,
            random: true,
            anim: {
              enable: true,
              speed: 0.6,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 4,
            random: true,
            anim: {
              enable: true,
              speed: 2.5,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#D4AF37",
            opacity: 0.2,
            width: 1.2
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: true,
              rotateX: 800,
              rotateY: 1400
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "bubble"
            },
            onclick: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 180,
              line_linked: {
                opacity: 0.8
              }
            },
            bubble: {
              distance: 250,
              size: 8,
              duration: 2,
              opacity: 0.9,
              speed: 3
            },
            repulse: {
              distance: 150,
              duration: 0.8
            },
            push: {
              particles_nb: 6
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        retina_detect: true
      });
    }
  }, []);

  return (
    <>
      <div
        id="particles-js"
        className="fixed inset-0 w-full h-full z-0"
      />
      <div className="fixed inset-0 bg-gradient-radial from-black via-black/80 to-transparent z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-0 pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />
    </>
  );
}
