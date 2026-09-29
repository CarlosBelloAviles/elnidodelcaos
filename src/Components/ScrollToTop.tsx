import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_NEAR_BOTTOM_PX = 600;

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;

      setIsVisible(
        pageBottom - scrollPosition <= SHOW_NEAR_BOTTOM_PX &&
          window.scrollY > window.innerHeight,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      title="Volver arriba"
      className="fixed right-5 bottom-5 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#c9a227]/70 bg-[#100b18]/95 text-[#d4af37] shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-200 hover:border-[#d4af37] hover:bg-[#1a1024] hover:text-[#f0d77a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08060d] sm:right-7 sm:bottom-7"
    >
      <ArrowUp size={20} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}

export default ScrollToTop;
