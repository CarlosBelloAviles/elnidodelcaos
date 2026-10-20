import { useQuery } from "@tanstack/react-query";
import CategorySection from "./CategorySection";
import { servicesData } from "../services/services";

const Services = () => {
  const { data } = useQuery({
    queryKey: ["services"],
    queryFn: servicesData,
  });

  

  return (
    <section id="servicios">
      {/* TÍTULO */}
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
          SERVICIOS
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

      <div className="mx-auto mb-8 max-w-3xl px-5 text-center">
        <p className="font-serif text-lg leading-relaxed text-[#f4df9b] sm:text-xl">
          Encuentra orientación para aquello que estás viviendo
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#d8d0df] sm:text-base">
          Conoce nuestros servicios de tarot, limpieza energética, protección y rituales.
          Explora cada alternativa, comprende en qué consiste y descubre cuál puede ajustarse mejor a tu situación.
        </p>
      </div>

      {/* CATEGORÍAS */}
      {data?.map((categoria) => (
        <CategorySection
          key={categoria.id}
          categoria={categoria}
        />
      ))}
    </section>
  );
};

export default Services;