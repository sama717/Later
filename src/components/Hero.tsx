import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import heroCards from "../assets/hero-cards.png";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const container = useRef(null);

  useGSAP(
    () => {
      // Entrance timeline stays the same across breakpoints
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });

      entrance
        .from(".hero-title", { y: 40, opacity: 0, duration: 0.8 })
        .from(".hero-subtitle-initial", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-chevron-wrapper", { opacity: 0, duration: 0.4 }, "-=0.2")
        .from(".hero-image-container", { y: 100, opacity: 0, duration: 0.8 }, "-=0.4");

      gsap.to(".hero-chevron-svg", {
        y: 12,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.5,
      });

      // matchMedia lets scroll behavior differ per breakpoint instead
      // of reusing one timeline tuned for desktop
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };

          const scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              // shorter pin distance on mobile — the section itself is
              // shorter now, so a long scrub feels disproportionate
              end: isMobile ? "+=300" : "+=800",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          scrollTl
            .to(".hero-title", {
              scale: isMobile ? 0.55 : 0.65,
              y: isMobile ? -55 : -120,
              transformOrigin: "center center",
              duration: 1,
            }, 0)
            .to(".hero-subtitle-wrapper", {
              y: isMobile ? -70 : -160,
              duration: 1,
            }, 0)
            .to(".hero-subtitle-initial", { opacity: 0, duration: 0.4 }, 0)
            .to(".hero-subtitle-scrolled", { opacity: 1, duration: 0.4 }, 0.2)
            .to(".hero-chevron-wrapper", { opacity: 0, scale: 0.8, duration: 0.3 }, 0)
            .to(".hero-image-container", {
              y: isMobile ? -100 : -280,
              duration: 1,
            }, 0);

          // cleanup runs automatically on context revert
          // (breakpoint change / unmount)
          return () => scrollTl.scrollTrigger?.kill();
        },
      );
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative flex flex-col items-center h-[65svh] sm:h-[80svh] md:h-[100svh] overflow-hidden bg-background text-foreground"
    >
      <h1 className="hero-title font-medium text-[3.25rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-[15rem] uppercase select-none tracking-tight mt-10 sm:mt-16 md:mt-20 leading-none">
        LATER
      </h1>

      <div className="hero-subtitle-wrapper relative mt-2 flex items-center justify-center w-full h-8 z-10 px-4">
        <p className="hero-subtitle-initial text-sm sm:text-lg md:text-xl text-muted-foreground dark:text-zinc-400 absolute whitespace-nowrap text-center">
          Discover games, save them for later
        </p>
        <p className="hero-subtitle-scrolled text-sm sm:text-lg md:text-xl text-muted-foreground dark:text-zinc-400 absolute opacity-0 whitespace-nowrap text-center">
          Keep a log of everything you play
        </p>
      </div>

      <div className="hero-chevron-wrapper mt-4 sm:mt-6 md:mt-8 z-10 text-muted-foreground dark:text-zinc-400">
        <ChevronDown className="hero-chevron-svg" size={28} strokeWidth={1.5} />
      </div>

      <div className="hero-image-container absolute top-[62%] sm:top-[70%] md:top-[75svh] w-full max-w-6xl px-4 z-20">
        <img
          src={heroCards}
          alt="Game showcase grid"
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>
    </section>
  );
}

export default Hero;