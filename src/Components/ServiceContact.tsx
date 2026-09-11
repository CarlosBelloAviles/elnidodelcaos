import { FaWhatsapp } from "react-icons/fa";

interface ServiceContactProps {
  serviceName: string;
}

const ServiceContact = ({ serviceName }: ServiceContactProps) => {
  const phoneNumber = import.meta.env.VITE_WHATSSAP;

  const message = encodeURIComponent(
    `Hola, me interesa el servicio "${serviceName}". Me gustaría obtener más información.`
  );

  return (
    <section className="mt-[50px] border-t border-[rgba(212,175,55,0.3)] pt-[35px] text-center">
      <h2 className="mb-3 text-[28px] font-normal text-[#d4af37] [text-shadow:0_0_12px_rgba(212,175,55,0.25)]">
        ¿Te interesa este servicio?
      </h2>

      <p className="mb-[25px] text-[17px] leading-[1.6] text-[#d8d0df]">
        Si deseas realizar este trabajo o tienes alguna pregunta,
        puedes contactarme directamente por WhatsApp.
      </p>

      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-[#25D366] px-7 py-3.5 text-[17px] font-bold text-white no-underline shadow-[0_8px_20px_rgba(37,211,102,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(37,211,102,0.45)]"
      >
        <FaWhatsapp size={23} />
        Contactar por WhatsApp
      </a>
    </section>
  );
};

export default ServiceContact;