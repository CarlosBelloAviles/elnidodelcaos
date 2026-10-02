import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";

import SEO from "../Components/SEO";

const Header = lazy(() => import("../Components/Header"));

const WhatsAppButton = lazy(
  () => import("../Components/WhattsAppButton"),
);

const About = lazy(
  () => import("../Components/About"),
);

const Features = lazy(
  () => import("../Components/Features"),
);

const Destacados = lazy(
  () => import("../Components/Destacados"),
);

const Services = lazy(
  () => import("../Components/Services"),
);

const HowItWorks = lazy(
  () => import("../Components/HowItWorks"),
);

const Testimonials = lazy(
  () => import("../Components/Testimonials"),
);

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (!sectionId) return;

    const scrollToElement = () => {
      const section = document.getElementById(sectionId);

      if (!section) {
        console.debug(
          "[Home] No se encontró:",
          sectionId,
        );

        return false;
      }

      const nav = document.querySelector("nav");

      const navHeight =
        nav?.getBoundingClientRect().height ?? 0;

      const sectionTop =
        section.getBoundingClientRect().top +
        window.scrollY;

      window.scrollTo({
        top: sectionTop - navHeight,
        behavior: "smooth",
      });

      return true;
    };

    const clearScrollState = () => {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname,
      );
    };

    let attempts = 0;

    const timer = window.setInterval(() => {
      attempts += 1;

      if (scrollToElement() || attempts >= 50) {
        window.clearInterval(timer);
        clearScrollState();
      }
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, [location.state]);

  return (
    <>
      <SEO
  title="Nido del Caos | Tarot, Brujería, Limpiezas y Rituales"
  description="Nido del Caos es un espacio dedicado al tarot, la brujería, las limpiezas energéticas, la protección y los rituales. Descubre servicios personalizados de orientación, interpretación, trabajo energético y prácticas esotéricas diseñadas para acompañarte en diferentes procesos y necesidades."
  canonical="https://elnidodelcaos.cl/"
  image="https://elnidodelcaos.cl/seo_nido.png"
/>

      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[rgb(31,31,39)]">
            <div className="loader"></div>
          </div>
        }
      >
        <div className="pt-[60px]">
          <Header />

          {/* TRANSICIÓN ATMOSFÉRICA */}
          <div
            aria-hidden="true"
            className="
              relative -mt-px h-[58px] w-full overflow-hidden
              bg-[#08060d]
            "
          >
            <div
              className="
                absolute -top-[35px] left-1/2 h-[110px] w-[85%]
                -translate-x-1/2 rounded-full
                bg-[radial-gradient(ellipse_at_center,rgba(125,55,170,0.22),rgba(90,40,130,0.10)_38%,transparent_72%)]
                blur-[22px]
              "
            />

            <div
              className="
                absolute -top-[15px] left-1/2 h-[65px] w-[55%]
                -translate-x-1/2 rounded-full
                bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_68%)]
                blur-[18px]
              "
            />

            <div
              className="
                absolute left-[8%] right-[8%] top-1/2 h-px
                -translate-y-1/2
                bg-[linear-gradient(to_right,transparent,rgba(212,175,55,0.16),rgba(168,117,201,0.24),transparent)]
                sm:left-[12%] sm:right-[12%]
              "
            />

            <div
              className="
                absolute left-1/2 top-1/2 z-[1]
                h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2
                rounded-full border border-[rgba(212,175,55,0.55)]
                bg-[#0d0912]
                shadow-[0_0_16px_rgba(168,117,201,0.16),0_0_10px_rgba(212,175,55,0.1)]
                after:absolute after:-inset-[6px]
                after:rounded-full
                after:border after:border-[rgba(212,175,55,0.28)]
                after:content-['']
                before:absolute before:-inset-[9px]
                before:rounded-full
                before:border-[3px]
                before:border-[rgba(212,175,55,0.38)]
                before:[mask-image:repeating-conic-gradient(from_0deg,black_0deg_10deg,transparent_10deg_20deg)]
                before:[-webkit-mask-image:repeating-conic-gradient(from_0deg,black_0deg_10deg,transparent_10deg_20deg)]
                before:content-['']
              "
            />

            <div
              className="
                absolute inset-x-0 bottom-0 h-[28px]
                bg-[linear-gradient(to_bottom,transparent,#08060d)]
              "
            />
          </div>

          <About />

          <Features />

          <Destacados />

          <Services />

          <HowItWorks />

          <Testimonials />

          <WhatsAppButton />
        </div>
      </Suspense>
    </>
  );
};

export default Home;