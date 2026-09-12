import sobrenido from "../assets/Images/sobrenido.webp";

const About = () => {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#08060d] px-[5%] py-20 sm:px-[7%] sm:py-[110px]"
      id="sobre-mi"
    >
      {/* HUMO DE FONDO */}
      <div
        className="pointer-events-none absolute -inset-[30%] z-0 blur-[60px] animate-[smokeMove_18s_ease-in-out_infinite_alternate]"
        style={{
          background: `
            radial-gradient(
              ellipse 40% 70% at 0% 40%,
              rgba(125, 55, 170, 0.45),
              transparent 65%
            ),
            radial-gradient(
              ellipse 35% 50% at 100% 30%,
              rgba(150, 75, 190, 0.35),
              transparent 65%
            ),
            radial-gradient(
              ellipse 45% 30% at 30% 100%,
              rgba(90, 40, 130, 0.35),
              transparent 70%
            ),
            radial-gradient(
              ellipse 30% 40% at 90% 85%,
              rgba(212, 175, 55, 0.18),
              transparent 70%
            )
          `,
        }}
      />

      <div
        className="pointer-events-none absolute -inset-[25%] z-0 blur-[80px] animate-[smokeMove2_25s_ease-in-out_infinite_alternate]"
        style={{
          background: `
            radial-gradient(
              ellipse 25% 45% at 15% 75%,
              rgba(170, 90, 210, 0.25),
              transparent 70%
            ),
            radial-gradient(
              ellipse 30% 35% at 70% 15%,
              rgba(110, 50, 155, 0.22),
              transparent 70%
            ),
            radial-gradient(
              ellipse 20% 30% at 85% 60%,
              rgba(212, 175, 55, 0.14),
              transparent 70%
            )
          `,
        }}
      />

      {/* CONTENEDOR */}
      <div
        className="
          relative z-[1] mx-auto grid max-w-[1250px]
          grid-cols-1 items-center gap-[60px]
          min-[951px]:grid-cols-[1.1fr_0.9fr]
          min-[951px]:gap-[90px]
        "
      >
        {/* CONTENIDO */}
        <div className="text-white">
          <span className="mb-[18px] block text-[13px] font-semibold tracking-[4px] text-[#d4af37]">
            SOBRE EL NIDO DEL CAOS
          </span>

          <h2 className="mb-[30px] font-serif text-[38px] font-AbrilFatface leading-[1.08] text-white sm:text-[clamp(38px,4vw,56px)]">
            Magia, conocimiento
            <span className="mt-[5px] block text-[#a875c9]">
              y transformación
            </span>
          </h2>

          <p className="mb-[14px] max-w-full text-[15px] leading-[1.65] text-[#d8d5db] sm:mb-[18px] sm:max-w-[680px] sm:text-[17px] sm:leading-[1.85]">
            El Nido del Caos es un espacio dedicado a la práctica de la magia
            y la brujería, donde se ofrecen servicios y trabajos mágicos
            orientados a abordar distintas necesidades y aspectos de la vida de
            cada persona.
          </p>

          <p className="mb-[14px] max-w-full text-[15px] leading-[1.65] text-[#d8d5db] sm:mb-[18px] sm:max-w-[680px] sm:text-[17px] sm:leading-[1.85]">
            A través de rituales, trabajos mágicos, limpiezas energéticas,
            protección, volteos, aperturas de caminos, abundancia, amor y otras
            prácticas, se realizan trabajos orientados a necesidades concretas
            y situaciones particulares.
          </p>

          <p className="mb-[14px] max-w-full text-[15px] leading-[1.65] text-[#d8d5db] sm:mb-[18px] sm:max-w-[680px] sm:text-[17px] sm:leading-[1.85]">
            Cada trabajo parte de una comprensión individual de la situación.
            No existen fórmulas universales: la práctica se adapta al
            propósito, al contexto y a la intención de cada persona.
          </p>

          {/* SERVICIOS */}
          <div className="mt-[38px] grid grid-cols-1 gap-[22px] min-[651px]:grid-cols-2">
            <div
              className="
                group flex gap-[14px] rounded-[12px] border
                border-[rgba(212,175,55,0.16)]
                bg-[rgba(55,25,75,0.18)]
                p-[18px]
                transition-all duration-300 ease-in-out
                hover:-translate-y-[3px]
                hover:border-[rgba(212,175,55,0.45)]
                hover:bg-[rgba(70,32,92,0.25)]
              "
            >
              <span className="shrink-0 text-[18px] text-[#d4af37]">✦</span>

              <div>
                <h3 className="mb-[6px] font-serif text-[17px] font-medium text-[#e6d7b8]">
                  Trabajos mágicos
                </h3>

                <p className="m-0 text-[14px] leading-[1.6] text-[#c9c5d1]">
                  Rituales y trabajos orientados a objetivos específicos.
                </p>
              </div>
            </div>

            <div
              className="
                group flex gap-[14px] rounded-[12px] border
                border-[rgba(212,175,55,0.16)]
                bg-[rgba(55,25,75,0.18)]
                p-[18px]
                transition-all duration-300 ease-in-out
                hover:-translate-y-[3px]
                hover:border-[rgba(212,175,55,0.45)]
                hover:bg-[rgba(70,32,92,0.25)]
              "
            >
              <span className="shrink-0 text-[18px] text-[#d4af37]">✦</span>

              <div>
                <h3 className="mb-[6px] font-serif text-[17px] font-medium text-[#e6d7b8]">
                  Limpieza y protección
                </h3>

                <p className="m-0 text-[14px] leading-[1.6] text-[#c9c5d1]">
                  Trabajos destinados a limpiar, proteger y equilibrar.
                </p>
              </div>
            </div>

            <div
              className="
                group flex gap-[14px] rounded-[12px] border
                border-[rgba(212,175,55,0.16)]
                bg-[rgba(55,25,75,0.18)]
                p-[18px]
                transition-all duration-300 ease-in-out
                hover:-translate-y-[3px]
                hover:border-[rgba(212,175,55,0.45)]
                hover:bg-[rgba(70,32,92,0.25)]
              "
            >
              <span className="shrink-0 text-[18px] text-[#d4af37]">✦</span>

              <div>
                <h3 className="mb-[6px] font-serif text-[17px] font-medium text-[#e6d7b8]">
                  Lecturas y orientación
                </h3>

                <p className="m-0 text-[14px] leading-[1.6] text-[#c9c5d1]">
                  Herramientas de interpretación para comprender diferentes
                  situaciones y posibilidades.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="order-none flex justify-center min-[951px]:order-none">
          <div
            className="
              relative w-full max-w-[470px] rounded-[20px]
              border border-[rgba(212,175,55,0.75)]
              bg-[#100b17] p-2
              shadow-[0_0_12px_rgba(212,175,55,0.12),0_20px_55px_rgba(0,0,0,0.55)]
              before:pointer-events-none
              before:absolute before:-inset-[6px]
              before:rounded-[26px]
              before:border
              before:border-[rgba(168,117,201,0.22)]
              before:content-['']
            "
          >
            <img
              src={sobrenido}
              alt="El Nido del Caos"
              className="block h-[370px] w-full rounded-[14px] object-cover sm:h-[560px]"
            />

            {/* TEXTO SOBRE IMAGEN */}
            <div
              className="
                absolute bottom-[25px] left-[25px]
                flex flex-col gap-[5px]
                rounded-r-[8px]
                border-l-2 border-[#d4af37]
                bg-[rgba(8,6,13,0.78)]
                px-[18px] py-[14px]
                backdrop-blur-[6px]
              "
            >
              <span className="text-[13px] font-semibold tracking-[2px] text-[#d4af37]">
                EL NIDO DEL CAOS
              </span>

              <small className="text-[12px] text-[#c0b9c7]">
                Magia · Brujería · Rituales
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* ANIMACIONES */}
      <style>
        {`
          @keyframes smokeMove {
            0% {
              transform: translate(-5%, -2%) scale(1);
            }

            50% {
              transform: translate(3%, 4%) scale(1.08);
            }

            100% {
              transform: translate(-2%, 1%) scale(1.15);
            }
          }

          @keyframes smokeMove2 {
            0% {
              transform: translate(4%, 2%) scale(1);
            }

            50% {
              transform: translate(-3%, -4%) scale(1.1);
            }

            100% {
              transform: translate(2%, 3%) scale(1.15);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-\\[smokeMove_18s_ease-in-out_infinite_alternate\\],
            .animate-\\[smokeMove2_25s_ease-in-out_infinite_alternate\\] {
              animation: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default About;
