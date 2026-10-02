import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToServices = () => {
    if (location.pathname === "/") {
      const section = document.getElementById("servicios");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    navigate("/", {
      state: {
        scrollTo: "servicios",
      },
    });
  };

  return (
    <header
  
   className="
    header
    flex
    w-full
    items-center
  "
>
      <div
        className="
          w-full
          max-w-[58%]
          text-left
          pl-5
          sm:max-w-[55%]
          md:max-w-[50%]
          lg:max-w-[48%]
        "
      >
        <h1
          className="
            font-VollkornSC
            font-style-normal
            text-[1.8rem]
            font-semibold
           
            leading-[0.9]
            tracking-wide
            bg-linear-to-b
            from-[#f0d28a]
            via-[#c9a45c]
            to-[#8f682d]
            bg-clip-text
            text-transparent
            sm:text-[2.5rem]
            md:text-[4.5rem]
            md:leading-[0.82]
            lg:text-[6rem]
          "
        >
          EL NIDO
          <br />
          DEL CAOS
        </h1>

        <div
          className="
    mt-3
    w-full
    text-left
    font-cormorant
    text-[0.5rem]
    uppercase
    leading-tight
    tracking-[0.08em]
    text-[#c9a45c]
    sm:mt-5
    sm:text-xs
    sm:tracking-[0.2em]
    md:text-sm
    lg:text-base
    lg:tracking-[0.25em]
  "
        >
          <div className="w-fit">
            <span className="block text-left sm:inline">TAROT, LIMPIEZA, PROTECCIÓN</span>

            <span className="block w-full text-center sm:inline sm:w-auto">Y RITUALES</span>
          </div>
        </div>
        <div
          className="
            mt-4
            font-occult
            text-[#d4cec2]
            sm:mt-6
          "
        >
          <h2
            className="
            mb-3
            text-[0.75rem]
            leading-snug
            text-[#e0c58a]
            sm:text-lg
            md:text-2xl
  "
          >
            Magia del Caos para transformar
            <br />
            tu realidad.
          </h2>
        </div>

        <button
          type="button"
          onClick={scrollToServices}
          className="
            mt-4
            cursor-pointer
            border
            border-[#c9a45c]/75
            bg-[#120d18]/70
            px-4
            py-2
            font-occult
            text-[0.6rem]
            uppercase
            tracking-[0.08em]
            text-[#f0d28a]
            shadow-[0_0_14px_rgba(212,175,55,0.12)]
            backdrop-blur-[3px]
            transition-all
            duration-300
            hover:border-[#f0d28a]
            hover:bg-[#1a1220]/80
            hover:text-[#ffe7a3]
            hover:shadow-[0_0_18px_rgba(212,175,55,0.2)]
            sm:mt-7
            sm:px-6
            sm:py-3
            sm:text-xs
            sm:tracking-[0.12em]
            md:mt-8
            md:px-7
            md:py-4
            md:text-sm
            md:tracking-[0.2em]
          "
        >
          EXPLORAR SERVICIOS
        </button>
      </div>
    </header>
  );
};

export default Header;
