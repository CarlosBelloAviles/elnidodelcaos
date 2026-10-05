import { CircleChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type {  ServiceCardProps } from "../types";



const ServiceCard = ({ producto }: ServiceCardProps) => {
  return (
    <Link
  to={`/servicios/${producto.slug}`}
  className="
    flex
    w-full
    min-w-0
    flex-col
    overflow-hidden
    cursor-pointer
    rounded-[14px]
    border-[1.5px]
    border-[rgba(212,175,55,0.7)]
    bg-[#08000c]
    shadow-[0_0_10px_rgba(212,175,55,0.3)]
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:shadow-[0_0_20px_rgba(212,175,55,0.8)]
    sm:rounded-[16px]
    md:min-h-[260px]
    md:flex-row
    lg:min-h-[300px]
  "
>
  {/* IMAGEN */}
  <div
    className="
      h-[130px]
      w-full
      shrink-0
      sm:h-[160px]
      md:h-auto
      md:w-1/2
    "
  >
    <img
      src={producto.img_url}
      alt={producto.name}
      className="
        block
        h-full
        w-full
        object-cover
      "
    />
  </div>

  {/* CONTENIDO */}
  <div
    className="
      flex
      w-full
      min-w-0
      flex-1
      flex-col
      justify-center
      p-3
      sm:p-4
      md:w-1/2
      md:p-[15px]
    "
  >
    <h3
      className="
        mb-1
        text-[14px]
        leading-[1.25]
        text-white
        sm:mb-2
        sm:text-[15px]
        md:text-[18px]
      "
    >
      {producto.name}
    </h3>

    <p
      className="
        mb-3
        font-PoiretOne
        text-[14px]
        leading-[1.35]
        text-[rgb(245,222,158)]
        sm:mb-[10px]
        sm:text-[14px]
        sm:leading-[1.4]
        md:text-[16px]
      "
    >
      {producto.description}
    </p>

    <div className="mt-auto flex min-w-0 items-center justify-between gap-2">
      <p
        className="
          m-0
          min-w-0
          text-[13px]
          font-bold
          text-[#dbb241]
          sm:text-[13px]
          md:text-[16px]
        "
      >
        ${producto.price.toLocaleString("es-CL")}{" "}
        {producto.Currency}
      </p>

      <CircleChevronRight
        color="#d4af37"
        size={20}
        className="shrink-0 sm:h-[23px] sm:w-[23px] md:h-[30px] md:w-[30px]"
      />
    </div>
  </div>
</Link>
  );
};

export default ServiceCard;
