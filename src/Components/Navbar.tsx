import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setMenuOpen(false);

    // Si estamos en otra página, volvemos al Home
    // y Home se encargará de llevarnos a la sección.
    if (location.pathname !== "/") {
      navigate("/", {
        state: {
          scrollTo: id,
        },
      });
      return;
    }

    // Estamos en Home: buscamos directamente la sección.
    const section = document.getElementById(id);

    if (!section) {
      console.log("No se encontró la sección:", id);
      return;
    }

    const nav = document.querySelector("nav");
    const navHeight = nav
      ? (nav as HTMLElement).getBoundingClientRect().height
      : 0;

    const sectionTop =
      section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionTop - navHeight,
      behavior: "smooth",
    });
  };

  // Cerrar el menú al hacer clic fuera del Navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const goHome = () => {
    setMenuOpen(false);

    // Si ya estamos en Home, simplemente subimos
    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // Si estamos en otra ruta, volvemos al Home
    navigate("/");
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 z-50 w-full bg-black px-4 py-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">

        {/* Nombre / Logo */}
        <button
          type="button"
          onClick={goHome}
          className="cursor-pointer text-lg text-[#d4af37] sm:text-xl"
        >
          Nido del Caos
        </button>

        {/* Botón menú móvil + tablet */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="flex cursor-pointer items-center justify-center p-2 text-[#d4af37] lg:hidden"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú escritorio */}
        <div className="hidden items-center gap-2.5 lg:flex">

          <button
            type="button"
            onClick={goHome}
            className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
          >
            Inicio
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("sobre-mi")}
            className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
          >
            El Nido
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("servicios")}
            className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
          >
            Servicios
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("testimonios")}
            className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
          >
            Testimonios
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("contacto")}
            className="cursor-pointer p-1.5 text-center text-lg text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
          >
            Contacto
          </button>

          {/* Redes sociales escritorio */}
          <div className="ml-3 flex items-center gap-4 border-l border-[rgba(212,175,55,0.25)] pl-4">

            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSSAP}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
              className="text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
            >
              <FaWhatsapp size={21} />
            </a>

            <a
              href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
            >
              <FaInstagram size={21} />
            </a>

          </div>
        </div>
      </div>

      {/* Menú móvil + tablet */}
      {menuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-t border-[rgba(212,175,55,0.25)] bg-black lg:hidden">
          <div className="flex flex-col px-4 py-3">

            <button
              type="button"
              onClick={goHome}
              className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("sobre-mi")}
              className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
            >
              El Nido
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("servicios")}
              className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
            >
              Servicios
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("testimonios")}
              className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
            >
              Testimonios
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("contacto")}
              className="cursor-pointer border-b border-[rgba(212,175,55,0.15)] px-4 py-3 text-center text-[16px] text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
            >
              Contacto
            </button>

            {/* Redes sociales móvil + tablet */}
            <div className="flex items-center justify-center gap-8 px-4 py-5">

              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSSAP}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
              >
                <FaWhatsapp size={25} />
              </a>

              <a
                href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[rgb(228,227,189)] transition-colors hover:text-[#d4af37]"
              >
                <FaInstagram size={25} />
              </a>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


