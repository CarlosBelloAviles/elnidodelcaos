import { Eye, Triangle, Sparkles, Shield } from "lucide-react";

export default function Features() {
  const items = [
    {
      icon: Eye,
      title: "ENFOQUE PERSONALIZADO",
      desc: "Cada servicio se adapta a tu energía y necesidad.",
    },
    {
      icon: Triangle,
      title: "TRABAJO CONSCIENTE",
      desc: "Magia del Caos aplicada a tu transformación.",
    },
    {
      icon: Sparkles,
      title: "EXPERIENCIA Y CONFIANZA",
      desc: "Acompañamiento respetuoso y confidencial.",
    },
    {
      icon: Shield,
      title: "PROTECCIÓN ENERGÉTICA",
      desc: "Rituales y protección para tu camino.",
    },
  ];

  return (
    <section
      className="
        flex flex-col
        gap-5
        p-5
        rounded-b-2xl
        bg-[rgba(17,10,31,0.6)]
        backdrop-blur-[10px]
        border border-white/10
        shadow-[0_0_30px_rgba(138,43,226,0.2)]

        sm:grid
        sm:grid-cols-2
        sm:gap-x-5
        sm:gap-y-[30px]

        lg:flex
        lg:flex-row
        lg:justify-between
        lg:gap-5
      "
    >
      {items.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="
              flex
              flex-col
              items-center
              text-center
              text-[#ccc]
              flex-1

              sm:flex-none

              lg:flex-1
            "
          >
            <Icon
              className="
                w-9
                h-9
                mb-2.5
                text-[#d4af37]
                transition-all
                duration-300
                ease-in-out

                sm:w-[34px]
                sm:h-[34px]

                lg:w-10
                lg:h-10

                hover:text-white
                hover:scale-[1.15]
                hover:drop-shadow-[0_0_8px_#d4af37]
              "
            />

            <h4
              className="
                mb-1.5
                text-[12px]
                tracking-[0.8px]
                text-[#f3e0e0]

                lg:text-[14px]
                lg:tracking-[1px]
              "
            >
              {item.title}
            </h4>

            <p
              className="
                text-[12px]
                leading-[1.5]
                text-[#cfbfbf]

                lg:text-[14px]
              "
            >
              {item.desc}
            </p>
          </div>
        );
      })}
    </section>
  );
}