import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Header = lazy(() => import("../Components/Header"));
const WhatsAppButton = lazy(() => import("../Components/WhattsAppButton"));
const About = lazy(() => import("../Components/About"));
const Features = lazy(() => import("../Components/Features"));
const Destacados = lazy(() => import("../Components/Destacados"));
const Services = lazy(() => import("../Components/Services"));
const Testimonials = lazy(() => import("../Components/Testimonials"));

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (!sectionId) return;

    const scrollToElement = () => {
      const section = document.getElementById(sectionId);

      if (!section) {
        console.debug("[Home] No se encontró:", sectionId);
        return false;
      }

      const nav = document.querySelector("nav");
      const navHeight = nav?.getBoundingClientRect().height ?? 0;

      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY;

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
          "/"
        );
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [location.state]);

  return (
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
);
};

export default Home;










/* import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import WhatsAppButton from "../Components/WhattsAppButton";
import About from "../Components/About";
import Features from "../Components/Features";
import Destacados from "../Components/Destacados";
import Services from "../Components/Services";
import Testimonials from "../Components/Testimonials";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (!sectionId) return;

    const scrollToElement = () => {
      const section = document.getElementById(sectionId);

      if (!section) {
        console.debug("[Home] No se encontró:", sectionId);
        return false;
      }

      const nav = document.querySelector("nav");
      const navHeight = nav?.getBoundingClientRect().height ?? 0;

      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: sectionTop - navHeight,
        behavior: "smooth",
      });

      return true;
    };

    // Esperamos a que Home esté montado completamente
    const timer = setTimeout(() => {
      if (scrollToElement()) {
        window.history.replaceState(
          {},
          document.title,
          "/"
        );
      }
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [location.state]);

  return (
    <>
      <Header />

      <About />
      <Features />
      <Destacados />
      <Services />
      <Testimonials />

      <WhatsAppButton />
    </>
  );
};

export default Home; */