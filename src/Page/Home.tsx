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

    const timer = setTimeout(() => {
      if (scrollToElement()) {
        window.history.replaceState(
          {},
          document.title,
          "/",
        );
      }
    }, 150);

    return () => {
      clearTimeout(timer);
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

          <About />

          <Features />

          <Destacados />

          <Services />

          <Testimonials />

          <WhatsAppButton />
        </div>
      </Suspense>
    </>
  );
};

export default Home;