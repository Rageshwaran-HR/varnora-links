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
            value: 50,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#D4AF37", "#F5E7A3", "#B8860B"]
          },
          shape: {
            type: ["circle", "triangle", "polygon"],
            stroke: {
              width: 0,
              color: "#000000"
            },
            polygon: {
              nb_sides: 6
            }
          },
          opacity: {
            value: 0.3,
            random: true,
            anim: {
              enable: true,
              speed: 0.5,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 180,
            color: "#D4AF37",
            opacity: 0.15,
            width: 1
          },
          move: {
            enable: true,
            speed: 1.2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab"
            },
            onclick: {
              enable: true,
              mode: "push"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 0.6
              }
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            },
            push: {
              particles_nb: 4
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
      <div className="fixed inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-0 pointer-events-none" />
    </>
  );
}
