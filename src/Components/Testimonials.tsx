import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type TouchEvent as ReactTouchEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../utils/cloudinary";
import { auto as qualityAuto } from "@cloudinary/url-gen/qualifiers/quality";
import { getTestimonials } from "../services/services";
import useCarousel from "../Hooks/useCarousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => current === null ? null : (current + 1) % testimonials.length);
      }
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => current === null ? null : (current - 1 + testimonials.length) % testimonials.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, testimonials.length]);

  const {
    currentSlide,
    nextSlide,
    prevSlide,
    isPaused,
    togglePause,
  } = useCarousel(testimonials, 22000);

  if (isLoading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }

  const getVisibleTestimonials = () => {
    const total = testimonials.length;

    const prevIndex =
      currentSlide === 0 ? total - 1 : currentSlide - 1;

    const nextIndex =
      currentSlide === total - 1 ? 0 : currentSlide + 1;

    return [
      testimonials[prevIndex],
      testimonials[currentSlide],
      testimonials[nextIndex],
    ];
  };

  const visibleTestimonials = getVisibleTestimonials();
  const selectedImage = selectedIndex === null
    ? null
    : cld.image(testimonials[selectedIndex].imagen).format("webp").quality(qualityAuto()).toURL();

  const changeSelectedImage = (direction: -1 | 1) => {
    setSelectedIndex((current) => current === null
      ? null
      : (current + direction + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (Math.abs(distance) > 45) changeSelectedImage(distance < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section
      id="testimonios"
      className="
        relative w-full overflow-hidden
        px-[15px] py-[50px]
        sm:px-5 sm:py-[60px]
        lg:px-10 lg:py-[80px]
        pb-[60px]
        bg-[radial-gradient(circle_at_50%_45%,rgba(91,43,116,0.18),transparent_45%),radial-gradient(circle_at_10%_20%,rgba(115,54,150,0.12),transparent_30%),#08060d]
        text-white
      "
    >
      {/* TÍTULO */}

      <div
        className="
          mb-[30px]
          text-center
          lg:mb-[55px]
        "
      >
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
            TESTIMONIOS
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

        <p
          className="
            m-0
            font-serif
            text-base
            leading-[1.7]
            text-[#ddd6d0]
          "
        >
          Experiencias reales de personas que han transformado su vida con
          Nido del Caos.
        </p>
      </div>

      {/* CARRUSEL */}

      <div
        className="
          relative
          mx-auto
          flex
          max-w-[1400px]
          items-center
          justify-center
        "
      >
        {/* ANTERIOR */}

        <button
          type="button"
          className="
            absolute
            left-[-5px]
            z-10
            flex
            h-[42px]
            w-[42px]
            cursor-pointer
            items-center
            justify-center
            rounded-full
            border
            border-[#b8943f]
            bg-[radial-gradient(circle,rgba(38,27,14,0.95),rgba(8,6,13,0.95))]
            text-[1.2rem]
            text-[#e6c76a]
            transition-all
            duration-300
            hover:scale-110
            hover:shadow-[0_0_15px_rgba(216,184,90,0.5)]
            sm:left-0
            sm:h-[52px]
            sm:w-[52px]
            sm:text-[1.6rem]
          "
          onClick={prevSlide}
          aria-label="Testimonio anterior"
        >
          <ChevronLeft size={24} />
        </button>

        {/* TESTIMONIOS */}

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            gap-0
            [perspective:1200px]
            sm:gap-[10px]
            lg:gap-[25px]
          "
        >
          {visibleTestimonials.map((testimonio, index) => {
            const imagen = cld
              .image(testimonio.imagen)
              .format("webp")
              .quality(qualityAuto());

            const isActive = index === 1;

            return (
              <article
                className={`
                  relative
                  aspect-[3/4]
                  h-[calc(106.6667vw_+_28px)]
                  w-[80%]
                  overflow-hidden
                  rounded-[18px]
                  border
                  border-[rgba(190,147,54,0.45)]
                  bg-[#111]
                  shadow-[0_0_15px_rgba(0,0,0,0.7)]
                  transition-all
                  duration-500
                  ease-in-out

                  ${
                    isActive
                      ? `
                        z-[3]
                        block
                        scale-100
                        opacity-100
                        border-[#d8b85a]
                        shadow-[0_0_8px_rgba(216,184,90,0.7),0_0_25px_rgba(216,184,90,0.35),0_20px_50px_rgba(0,0,0,0.7)]
                      `
                      : `
                        hidden
                        scale-[0.88]
                        opacity-[0.58]
                      `
                  }

                  sm:block
                  sm:w-[34%]
                  sm:h-[420px]

                  lg:w-[31%]
                  lg:h-auto
                `}
                key={testimonio.id}
              >
                <div
                  className="
                    relative
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[radial-gradient(circle_at_50%_50%,rgba(216,184,90,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(120,70,180,0.2),transparent_40%),#0d0d0d]
                  "
                >
                  <AdvancedImage
                    cldImg={imagen}
                    alt="Testimonio de cliente"
                    draggable={false}
                    onClick={
                      isActive
                        ? () => {
                            togglePause();
                            setSelectedIndex(testimonials.findIndex((item) => item.id === testimonio.id));
                          }
                        : undefined
                    }
                    role={isActive ? "button" : undefined}
                    tabIndex={isActive ? 0 : undefined}
                    onKeyDown={
                      isActive
                        ? (event: ReactKeyboardEvent<HTMLImageElement>) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              togglePause();
                              setSelectedIndex(testimonials.findIndex((item) => item.id === testimonio.id));
                            }
                          }
                        : undefined
                    }
                    aria-label={isActive ? "Ampliar imagen del testimonio" : undefined}
                    className={`
                      block
                      h-full
                      w-full
                      select-none
                      object-contain
                      transition-all
                      duration-500
                      ${
                        isActive
                          ? "cursor-pointer brightness-100 saturate-100"
                          : "brightness-[0.55] saturate-[0.8]"
                      }
                    `}
                  />
                </div>

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[linear-gradient(180deg,transparent_70%,rgba(8,6,13,0.45))]
                    opacity-70
                  "
                />
              </article>
            );
          })}
        </div>

        {/* SIGUIENTE */}

        <button
          type="button"
          className="
            absolute
            right-[-5px]
            z-10
            flex
            h-[42px]
            w-[42px]
            cursor-pointer
            items-center
            justify-center
            rounded-full
            border
            border-[#b8943f]
            bg-[radial-gradient(circle,rgba(38,27,14,0.95),rgba(8,6,13,0.95))]
            text-[1.2rem]
            text-[#e6c76a]
            transition-all
            duration-300
            hover:scale-110
            hover:shadow-[0_0_15px_rgba(216,184,90,0.5)]
            sm:right-0
            sm:h-[52px]
            sm:w-[52px]
            sm:text-[1.6rem]
          "
          onClick={nextSlide}
          aria-label="Siguiente testimonio"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* VISOR AMPLIADO DE TESTIMONIOS */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada del testimonio"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="fixed right-4 top-4 z-[200] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-[#d8b85a] bg-[#d8b85a] text-4xl font-bold leading-none text-black shadow-[0_0_25px_rgba(216,184,90,0.8)] transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-6 sm:top-6"
            onClick={(event) => { event.stopPropagation(); setSelectedIndex(null); }}
            aria-label="Cerrar imagen ampliada"
          >
            <span aria-hidden="true">×</span>
          </button>

          {testimonials.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 z-[150] hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#d8b85a] bg-[#d8b85a] text-black shadow-[0_0_18px_rgba(216,184,90,0.55)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white sm:flex"
                onClick={(event) => { event.stopPropagation(); changeSelectedImage(-1); }}
                aria-label="Testimonio anterior"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 z-[150] hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#d8b85a] bg-[#d8b85a] text-black shadow-[0_0_18px_rgba(216,184,90,0.55)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white sm:flex"
                onClick={(event) => { event.stopPropagation(); changeSelectedImage(1); }}
                aria-label="Siguiente testimonio"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}

          <img
            src={selectedImage}
            alt="Testimonio de cliente ampliado"
            className="max-h-[calc(100dvh-100px)] max-w-full select-none object-contain sm:max-h-[calc(100dvh-48px)]"
            draggable={false}
            onClick={(event) => event.stopPropagation()}
            style={{ touchAction: "pan-y pinch-zoom" }}
          />
          {testimonials.length > 1 && (
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-[#d8b85a]/70 bg-black/80 px-4 py-1.5 text-sm tracking-wider text-[#f4df9b]">
              {selectedIndex! + 1} / {testimonials.length}
            </span>
          )}
        </div>
      )}

      {/* INDICADOR */}

      <div
        className="
          mt-[30px]
          flex
          items-center
          justify-center
          gap-3
        "
      >
        <span
          className="
            font-serif
            text-sm
            tracking-[2px]
            text-[#e2bd51]
          "
        >
          {currentSlide + 1} / {testimonials.length}
        </span>

        <span
          className="
            h-px
            w-[35px]
            bg-[#b8944a]
            opacity-40
          "
        />

        <span
          className="
            font-serif
            text-xs
            tracking-[1px]
            text-[#aaa2a0]
          "
        >
          {isPaused ? "PAUSADO" : "REPRODUCIENDO"}
        </span>
      </div>

      {/* CONTACTO */}

      <div
        id="contacto"
        className="
          relative
          mx-auto
          mt-[45px]
          max-w-[1350px]
          border
          border-[rgba(184,148,63,0.65)]
          bg-[linear-gradient(90deg,rgba(35,20,12,0.65),rgba(10,7,15,0.92),rgba(35,20,12,0.65))]
          px-5
          py-[30px]
          text-center
          shadow-[0_0_25px_rgba(0,0,0,0.5)]
          sm:px-[50px]
          sm:py-[35px]
        "
      >
        <h3
          className="
            m-0
            font-serif
            text-[1.4rem]
            font-medium
            tracking-[2px]
            text-[#e1bd61]
            sm:text-[1.7rem]
            lg:text-[2rem]
          "
        >
          ¿LISTO PARA TRANSFORMAR TU VIDA?
        </h3>

        <span
          className="
            mx-auto
            my-[14px]
            block
            h-px
            w-[180px]
            bg-[linear-gradient(90deg,transparent,#c5a44e,transparent)]
          "
        />

        <p
          className="
            m-0
            leading-[1.6]
            text-[#ded8d2]
          "
        >
          Tú puedes ser el próximo testimonio.
          <br />
          El primer paso es decidir cambiar.
        </p>

        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSSAP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-5
            inline-block
            cursor-pointer
            rounded-[7px]
            border
            border-[#c6a34d]
            bg-[rgba(20,14,8,0.9)]
            px-[30px]
            py-[13px]
            font-serif
            text-[0.9rem]
            tracking-[1px]
            text-[#e5c363]
            transition-all
            duration-300
            hover:bg-[rgba(102,72,25,0.4)]
            hover:shadow-[0_0_15px_rgba(216,184,90,0.35)]
          "
        >
          WhatsApp
        </a>
      </div>
    </section>
  );
};

export default Testimonials;
