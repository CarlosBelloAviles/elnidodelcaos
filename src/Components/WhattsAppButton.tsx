import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  
  const message = encodeURIComponent(
    "Hola, me gustaría obtener información sobre sus servicios."
  );

  return (
    <a
      href= {`https://wa.me/${import.meta.env.VITE_WHATSSAP}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="
        fixed
        bottom-5
        right-5
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-[#25D366]
        text-white
        shadow-[0_8px_25px_rgba(0,0,0,0.5)]
        transition-all
        duration-300
        hover:scale-110
        hover:shadow-[0_0_25px_rgba(37,211,102,0.55)]
        md:bottom-6
        md:right-6
        md:h-16
        md:w-16
      "
    >
      <FaWhatsapp className="text-[30px] md:text-[36px]" />
    </a>
  );
};

export default WhatsAppButton;