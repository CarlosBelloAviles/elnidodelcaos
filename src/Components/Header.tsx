import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (id: string) => {
    if (location.pathname === "/") {
      const section = document.getElementById(id);
      if (!section) return;
      const nav = document.querySelector("nav");
      const navHeight = nav?.getBoundingClientRect().height ?? 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, sectionTop - navHeight), behavior: "smooth" });
      return;
    }
    navigate("/", { state: { scrollTo: id } });
  };

  return (
    <header className="header">
      <div className="header-circle-content">
        <p className="header-eyebrow">TAROT · LIMPIEZA · PROTECCIÓN · RITUALES</p>
        <h1 className="header-title">EL NIDO DEL CAOS</h1>
        <p className="header-description">
          Un espacio para explorar posibilidades, transformar tu realidad y encontrar tu propio camino.
        </p>
      </div>

      <div className="header-actions">
        <button type="button" onClick={() => goToSection("servicios")}>
          EXPLORAR SERVICIOS
        </button>
        <button type="button" onClick={() => goToSection("testimonios")}>
          VER RECOMENDACIONES
        </button>
        <button type="button" onClick={() => navigate("/grimorio")}>
          VER GRIMORIO
        </button>
      </div>
    </header>
  );
};

export default Header;
