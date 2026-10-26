import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    const section = document.getElementById(id);
    if (!section) {
      console.log("No se encontró la sección:", id);
      return;
    }
    const nav = document.querySelector("nav");
    const navHeight = nav ? (nav as HTMLElement).getBoundingClientRect().height : 0;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop - navHeight, behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, moreOpen]);

  const goHome = () => {
    setMenuOpen(false);
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/");
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 z-50 min-h-[60px] w-full bg-black px-4 sm:px-6">
      <div className="mx-auto flex min-h-[60px] max-w-[1200px] items-center justify-between">
        <button
          type="button"
          onClick={goHome}
          aria-label="Ir al inicio de El Nido del Caos"
          className="flex shrink-0 cursor-pointer flex-col items-center justify-center py-1 text-[#d4af37]"
        >
          <img
            src="https://res.cloudinary.com/pnvel4tk/image/upload/v1792984286/nido-brand/nido-logo-simbolo-caos.webp"
            alt=""
            aria-hidden="true"
            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
          />
          <span className="mt-0.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-[10px]">
            EL NIDO DEL CAOS
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="flex cursor-pointer items-center justify-center p-2 text-[#d4af37] lg:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="hidden items-center gap-2.5 lg:flex">
          <button type="button" onClick={goHome} className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">Inicio</button>
          <button type="button" onClick={() => scrollToSection("sobre-mi")} className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">El Nido</button>
          <button type="button" onClick={() => scrollToSection("servicios")} className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">Servicios</button>
          <button type="button" onClick={() => scrollToSection("el-grimorio")} className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">El Grimorio</button>

          <div className="relative">
            <button type="button" onClick={() => setMoreOpen((open) => !open)} aria-haspopup="true" aria-expanded={moreOpen} className="flex cursor-pointer items-center gap-1.5 p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">
              Ver más <ChevronDown size={16} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-[60] mt-2 min-w-48 overflow-hidden rounded-md border border-[rgba(212,175,55,0.3)] bg-black py-1 shadow-xl">
                <button type="button" onClick={() => { setMoreOpen(false); scrollToSection("como-funciona"); }} className="block w-full cursor-pointer px-4 py-3 text-left text-base text-[rgb(228,227,189)] transition-colors hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]">Cómo funciona</button>
                <button type="button" onClick={() => { setMoreOpen(false); scrollToSection("testimonios"); }} className="block w-full cursor-pointer px-4 py-3 text-left text-base text-[rgb(228,227,189)] transition-colors hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]">Testimonios</button>
                <button type="button" onClick={() => { setMoreOpen(false); scrollToSection("contacto"); }} className="block w-full cursor-pointer px-4 py-3 text-left text-base text-[rgb(228,227,189)] transition-colors hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]">Contacto</button>
              </div>
            )}
          </div>

          <div className="ml-3 flex items-center gap-4 border-l border-[rgba(212,175,55,0.25)] pl-4">
            <a href={`https://wa.me/${import.meta.env.VITE_WHATSSAP}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"><FaWhatsapp size={21} /></a>
            <a href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"><FaInstagram size={21} /></a>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-t border-[rgba(212,175,55,0.25)] bg-black lg:hidden">
          <div className="flex flex-col px-4 py-3">
            <button type="button" onClick={goHome} className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">Inicio</button>
            <button type="button" onClick={() => scrollToSection("sobre-mi")} className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">El Nido</button>
            <button type="button" onClick={() => scrollToSection("servicios")} className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">Servicios</button>
            <button type="button" onClick={() => scrollToSection("el-grimorio")} className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">El Grimorio</button>
            <button type="button" onClick={() => scrollToSection("como-funciona")} className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">Cómo funciona</button>
            <button type="button" onClick={() => scrollToSection("testimonios")} className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">Testimonios</button>
            <button type="button" onClick={() => scrollToSection("contacto")} className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]">Contacto</button>
            <div className="flex items-center justify-center gap-8 px-4 py-5">
              <a href={`https://wa.me/${import.meta.env.VITE_WHATSSAP}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"><FaWhatsapp size={25} /></a>
              <a href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"><FaInstagram size={25} /></a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
