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
                  sm:h-[450px]

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
                    onClick={isActive ? togglePause : undefined}
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

        <button
          className="
            mt-5
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
        </button>
      </div>
    </section>
  );
};

export default Testimonials;
