import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getProductBySlug } from "../services/services";

import ServiceContact from "../Components/ServiceContact";
import Variants from "../Components/Variants";
import SEO from "../Components/SEO";

const ProductDetail = () => {
  const { slug } = useParams();

  const {
    data,
    isPending,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      // noop
    }
  }, [slug]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#10091c,#1b0d2b,#0d0815)]">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#10091c,#1b0d2b,#0d0815)] text-[#eee]">
        <p>Error al cargar el servicio.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#10091c,#1b0d2b,#0d0815)] text-[#eee]">
        <p>Servicio no encontrado.</p>
      </div>
    );
  }

  const title = `${data.name} | Nido del Caos`;

  const description = `${data.name}: ${
    data.description?.trim() ||
    "Servicio disponible en Nido del Caos."
  }`;

  const canonicalUrl =
    `https://www.elnidodelcaos.cl/servicios/${data.slug}`;

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    description,
    url: canonicalUrl,
    provider: {
      "@type": "Organization",
      name: "Nido del Caos",
      url: "https://www.elnidodelcaos.cl/",
    },
  };

  if (data.img_url) {
    structuredData.image = data.img_url;
  }

  const variantes = data.ProductDetails?.variantes;

  
if (!variantes?.length && data.price != null) {
    structuredData.offers = {
      "@type": "Offer",
      price: data.price,
      priceCurrency: data.Currency || "CLP",
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
    };
  }

  const renderContenido = (contenido: string) => {
    const lineas = contenido.split("\n");

    return lineas.map((linea, index) => {
      const texto = linea.trim();

      if (!texto) {
        return (
          <div
            key={index}
            className="h-3"
          />
        );
      }

      if (texto.startsWith("## ")) {
        const titulo = texto.replace(/^##\s+/, "");

        return (
          <h2
            key={index}
            className="mb-4 mt-8 text-[24px] font-AbrilFatface text-[#d4af37] [text-shadow:0_0_10px_rgba(212,175,55,0.25)] sm:text-[27px] md:text-[30px]"
          >
            {titulo}
          </h2>
        );
      }

      if (texto.startsWith("•")) {
        return (
          <p
            key={index}
            className="mb-2 pl-4 text-[15px] leading-[1.7] text-[#d8d0df] sm:text-[16px] md:text-[17px]"
          >
            {texto}
          </p>
        );
      }

      return (
        <p
          key={index}
          className="mb-4 text-[15px] leading-[1.7] text-[#d8d0df] sm:text-[16px] md:text-[17px] md:leading-[1.8]"
        >
          {texto}
        </p>
      );
    });
  };

  return (
    <>
      <SEO
        title={title}
        description={description}
        canonical={canonicalUrl}
        image={
          data.img_url ||
          "https://www.elnidodelcaos.cl/seo_nido.png"
        }
        type="service"
        structuredData={structuredData}
      />

      <div className="flex flex-1 flex-col bg-[linear-gradient(135deg,#10091c,#1b0d2b,#0d0815)] px-3 pb-8 pt-[90px] font-sans text-[#eee] sm:px-5 sm:pb-10 sm:pt-[88px] md:pb-[60px] md:pt-[100px]">

        <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col rounded-[14px] border border-[rgba(212,175,55,0.45)] bg-[rgba(30,15,45,0.9)] p-4 shadow-[0_0_35px_rgba(120,60,180,0.25)] sm:rounded-[18px] sm:p-6 md:p-10">

          <h1 className="mb-5 text-center text-[28px] font-AbrilFatface leading-tight text-[#d4af37] [text-shadow:0_0_15px_rgba(212,175,55,0.35)] sm:text-[34px] md:mb-[25px] md:text-[42px]">
            {data.name}
          </h1>

          <img
            src={data.img_url}
            alt={`${data.name} - Nido del Caos`}
            className="mx-auto mb-5 block h-[220px] w-full max-w-[600px] rounded-[10px] border border-[rgba(212,175,55,0.5)] object-cover shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:h-[280px] sm:rounded-[14px] md:mb-[30px] md:h-[350px]"
          />

          <p className="mb-5 text-center text-[18px] font-PoiretOne leading-[1.6] text-[#d4af37] [text-shadow:0_0_10px_rgba(212,175,55,0.2)] sm:text-[20px] md:text-[22px] md:leading-[1.7]">
            {data.description}
          </p>

          {!variantes?.length && (
            <p className="mb-8 text-center text-[23px] font-bold text-[#d4af37] sm:text-[25px] md:mb-10 md:text-[28px]">
              ${data.price.toLocaleString("es-CL")}{" "}
              {data.Currency}
            </p>
          )}

          {variantes && variantes.length > 0 && (
            <div className="mb-8 md:mb-10">
              <Variants
                variantes={variantes}
                currency={data.Currency}
              />
            </div>
          )}

          

           {data.ProductDetails?.contenido && (
            <section className="border-t border-[rgba(212,175,55,0.25)] pt-6 md:pt-[30px]">
              {renderContenido(data.ProductDetails.contenido)}
            </section>
          )} 

          <ServiceContact
            serviceName={data.name}
          />

        </div>
      </div>
    </>
  );
};

export default ProductDetail;