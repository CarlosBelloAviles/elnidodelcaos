import { destacados } from "../services/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import useCarousel from "../Hooks/useCarousel";

const Destacados = () => {
  const {
    currentSlide,
    nextSlide,
    prevSlide,
    setCurrentSlide,
  } = useCarousel(destacados, 26000);

  const current = destacados[currentSlide];

  return (
    <section
      className="
        mx-auto box-border w-full max-w-[1400px]
        px-[15px] py-[45px]
        min-[601px]:px-[25px] min-[601px]:py-[55px]
        min-[901px]:px-10 min-[901px]:py-[70px]
      "
    >

      {/* HEADER */}
      <div
        className="
          mb-[10px]
          flex items-center justify-center
          gap-3
          min-[901px]:gap-[25px]
        "
      >
        <span
          className="
            h-px w-[35px]
            bg-gradient-to-r
            from-transparent via-[#b8944a] to-transparent
            min-[601px]:w-[60px]
            min-[901px]:w-[100px]
          "
        />

       <h2
          className="
            my-2 mb-[10px]
            font-serif
            text-[2rem]
            font-medium
            tracking-[4px]
            text-[#f4df9b]
            [text-shadow:0_0_10px_rgba(218,174,65,0.25),0_0_25px_rgba(218,174,65,0.12)]
            sm:text-[2.5rem]
            lg:text-[3.2rem]
          "
        >
          DESTACADOS
        </h2>

        <span
          className="
            h-px w-[35px]
            bg-gradient-to-r
            from-transparent via-[#b8944a] to-transparent
            min-[601px]:w-[60px]
            min-[901px]:w-[100px]
          "
        />
      </div>

      {/* SUBTÍTULO */}
      <p
        className="
          mb-[35px] mt-0
          text-center
          text-[13px]
          tracking-[1px]
          text-[#aaa2b3]
          min-[601px]:text-[15px]
        "
      >
        Descubre algunos de nuestros servicios y trabajos destacados
      </p>

      {/* CARRUSEL */}
      <div className="relative flex w-full items-center justify-center">

        {/* BOTÓN ANTERIOR */}
        <button
          type="button"
          aria-label="Anterior"
          onClick={prevSlide}
          className="
            absolute left-2 top-1/2 z-[5]
            flex h-9 w-9
            -translate-y-1/2
            items-center justify-center
            rounded-full
            border border-[rgba(212,175,55,0.7)]
            bg-[rgba(8,7,12,0.85)]
            p-0
            text-[#d4af37]
            transition-all duration-300
            hover:scale-[1.08]
            hover:border-[#d4af37]
            hover:bg-[rgba(212,175,55,0.15)]
            min-[601px]:left-3
            min-[601px]:h-[42px] min-[601px]:w-[42px]
            min-[901px]:left-5
            min-[901px]:h-12 min-[901px]:w-12
          "
        >
          <ChevronLeft size={24} />
        </button>

        {/* CONTENEDOR DEL BANNER */}
        <div
          className="
            w-full overflow-hidden
            rounded-[16px]
            border border-[#8f7136]
            bg-[#08070b]
            shadow-[0_0_0_1px_rgba(212,175,55,0.12),0_10px_40px_rgba(0,0,0,0.6)]
          "
        >

          {/* SLIDE */}
          <div className="w-full overflow-hidden bg-[#050505]">

            <picture>
              <source
                media="(max-width: 768px)"
                srcSet={current.imageMobile}
              />

              <img
                src={current.image}
                alt={current.alt}
                className="
                  block h-auto w-full
                "
              />
            </picture>

            {/* ZONA DE RESERVA */}
            <div
              className="
                flex items-center justify-center
                gap-3
                border-t border-[rgba(212,175,55,0.45)]
                bg-gradient-to-r
                from-[#09080d] via-[#12101a] to-[#09080d]
                px-3 py-2.5

                min-[601px]:gap-3
                min-[601px]:px-[15px] min-[601px]:py-[18px]

                min-[901px]:gap-[25px]
                min-[901px]:px-[25px]
              "
            >
              <p
                className="
                  m-0
                  font-serif
                  text-[14px]
                  tracking-[0.5px]
                  text-[#d8d2dc]
                  min-[901px]:text-[16px]
                "
              >
                ¿Te interesa este servicio?
              </p>

              <a
                href={`https://wa.me/56937838569?text=${encodeURIComponent(
                  `Hola, me interesa el servicio "${current.alt}". Me gustaría obtener más información.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  featured-whatsapp
                  inline-flex
                  w-auto
                  max-w-[260px]
                  box-border
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-[8px]
                  border border-[#d4af37]
                  bg-gradient-to-br
                  from-[#6d4aa8] to-[#432568]
                  px-3 py-1.5
                  text-[14px]
                  font-semibold
                  tracking-[0.5px]
                  text-white
                  no-underline
                  shadow-[0_0_15px_rgba(212,175,55,0.08)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:from-[#8059b8]
                  hover:to-[#543076]
                  hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]

                  min-[601px]:px-[22px]
                  min-[601px]:py-[11px]

                  min-[901px]:max-w-none
                "
              >
                <FaWhatsapp
                  size={23}
                  className="shrink-0 text-[#d4af37]"
                />

                <span>Consultar y reservar</span>
              </a>
            </div>

          </div>
        </div>

        {/* BOTÓN SIGUIENTE */}
        <button
          type="button"
          aria-label="Siguiente"
          onClick={nextSlide}
          className="
            absolute right-2 top-1/2 z-[5]
            flex h-9 w-9
            -translate-y-1/2
            items-center justify-center
            rounded-full
            border border-[rgba(212,175,55,0.7)]
            bg-[rgba(8,7,12,0.85)]
            p-0
            text-[#d4af37]
            transition-all duration-300
            hover:scale-[1.08]
            hover:border-[#d4af37]
            hover:bg-[rgba(212,175,55,0.15)]
            min-[601px]:right-3
            min-[601px]:h-[42px] min-[601px]:w-[42px]
            min-[901px]:right-5
            min-[901px]:h-12 min-[901px]:w-12
          "
        >
          <ChevronRight size={24} />
        </button>

      </div>

      {/* INDICADORES */}
      <div
        className="
          mt-[22px]
          flex items-center justify-center
          gap-2.5
        "
      >
        {destacados.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir al destacado ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
            className={`
              h-2
              rounded-full
              transition-all duration-300
              ${
                currentSlide === index
                  ? "w-6 bg-[#d4af37]"
                  : "w-2 bg-[#4c4652]"
              }
            `}
          />
        ))}
      </div>

    </section>
  );
};

export default Destacados;

