import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const phonoWhatssap = import.meta.env.VITE_WHATSSAP;

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    // Si ya estamos en el Home
    if (location.pathname === "/") {
      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // Si estamos en otra página, vamos al Home
    // y enviamos la sección que queremos mostrar
    navigate("/", {
      state: {
        scrollTo: id,
      },
    });
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <footer className="mt-20 border-t border-[rgba(212,175,55,0.2)] bg-[#08060d] text-[#d8d0df]">
      <div className="mx-auto max-w-7xl px-6 py-14">

        {/* PARTE SUPERIOR */}
        <div className="grid gap-12 md:grid-cols-3">

          {/* MARCA */}
          <div>
            <h2 className="mb-4 text-2xl font-normal tracking-[2px] text-[#d4af37]">
              NIDO DEL CAOS
            </h2>

            <p className="max-w-xs text-[15px] leading-7 text-[#aaa2b3]">
              Tarot, limpieza, protección y rituales.
              Un espacio dedicado al trabajo espiritual,
              energético y simbólico.
            </p>
          </div>

          {/* NAVEGACIÓN */}
          <div>
            <h3 className="mb-5 text-[16px] uppercase tracking-[2px] text-[#d4af37]">
              Navegación
            </h3>

            <ul className="space-y-3 text-[15px]">

              {/* INICIO */}
              <li>
                <button
                  type="button"
                  onClick={goToHome}
                  className="transition-colors hover:text-[#d4af37]"
                >
                  Inicio
                </button>
              </li>

              {/* SERVICIOS */}
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("servicios")}
                  className="transition-colors hover:text-[#d4af37]"
                >
                  Servicios
                </button>
              </li>

              {/* TESTIMONIOS */}
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("testimonios")}
                  className="transition-colors hover:text-[#d4af37]"
                >
                  Testimonios
                </button>
              </li>

              {/* CONTACTO */}
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("contacto")}
                  className="transition-colors hover:text-[#d4af37]"
                >
                  Contacto
                </button>
              </li>

            </ul>
          </div>

          {/* CONTACTO */}
          <div>
            <h3 className="mb-5 text-[16px] uppercase tracking-[2px] text-[#d4af37]">
              Contacto
            </h3>

            <p className="mb-4 text-[15px] leading-6 text-[#aaa2b3]">
              ¿Tienes dudas o quieres realizar un trabajo?
            </p>

            <div className="flex flex-col gap-4">

              {/* WHATSAPP */}
              <a
                href={`https://wa.me/${phonoWhatssap}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[15px] transition-colors hover:text-[#d4af37]"
              >
                <FaWhatsapp size={19} />
                WhatsApp
              </a>

              {/* INSTAGRAM */}
              <a
                href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[15px] transition-colors hover:text-[#d4af37]"
              >
                <FaInstagram size={18} />
                Instagram
              </a>

            </div>
          </div>

        </div>

        {/* SEPARADOR */}
        <div className="my-10 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-[rgba(212,175,55,0.25)]" />
          <span className="text-[12px] text-[#d4af37]">✦</span>
          <span className="h-px w-16 bg-[rgba(212,175,55,0.25)]" />
        </div>

        {/* PARTE INFERIOR */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-[13px] text-[#77707f] md:flex-row md:text-left">

          <p>
            © {new Date().getFullYear()} Nido del Caos. Todos los derechos
            reservados.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;