import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getProductBySlug } from "../services/services";

import DetailList from "../Components/DetailList";
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

  /*
   * --------------------------------
   * SCROLL AL INICIO
   * --------------------------------
   */

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

  /*
   * --------------------------------
   * LOADING
   * --------------------------------
   */

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#10091c,#1b0d2b,#0d0815)]">
        <span className="loader"></span>
      </div>
    );
  }

  /*
   * --------------------------------
   * ERROR
   * --------------------------------
   */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#10091c,#1b0d2b,#0d0815)] text-[#eee]">
        <p>Error al cargar el servicio.</p>
      </div>
    );
  }

  /*
   * --------------------------------
   * PRODUCTO NO ENCONTRADO
   * --------------------------------
   */

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#10091c,#1b0d2b,#0d0815)] text-[#eee]">
        <p>Servicio no encontrado.</p>
      </div>
    );
  }

  /*
   * --------------------------------
   * SEO
   * --------------------------------
   */

  const title = `${data.name} | Nido del Caos`;

  const description = `${data.name}: ${
    data.description?.trim() ||
    "Servicio disponible en Nido del Caos."
  }`;

  const canonicalUrl =
    `https://www.elnidodelcaos.cl/servicios/${data.slug}`;

  /*
   * --------------------------------
   * DATOS ESTRUCTURADOS
   * --------------------------------
   */

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

  /*
   * --------------------------------
   * PRECIO
   * --------------------------------
   *
   * Solo se agrega Offer cuando
   * el servicio no tiene variantes.
   */

  const variantes =
    data.product_details?.variantes;

  if (!variantes?.length && data.price != null) {
    structuredData.offers = {
      "@type": "Offer",

      price: data.price,

      priceCurrency:
        data.Currency || "CLP",

      availability:
        "https://schema.org/InStock",

      url: canonicalUrl,
    };
  }

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

          {/* Título */}

          <h1 className="mb-5 text-center text-[28px] font-AbrilFatface leading-tight text-[#d4af37] [text-shadow:0_0_15px_rgba(212,175,55,0.35)] sm:text-[34px] md:mb-[25px] md:text-[42px]">
            {data.name}
          </h1>

          {/* Imagen */}

          <img
            src={data.img_url}
            alt={`${data.name} - Nido del Caos`}
            className="mx-auto mb-5 block h-[220px] w-full max-w-[600px] rounded-[10px] border border-[rgba(212,175,55,0.5)] object-cover shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:h-[280px] sm:rounded-[14px] md:mb-[30px] md:h-[350px]"
          />

          {/* Descripción */}

          <p className="mb-5 text-center text-[18px] font-PoiretOne leading-[1.6] text-[#d4af37] [text-shadow:0_0_10px_rgba(212,175,55,0.2)] sm:text-[20px] md:text-[22px] md:leading-[1.7]">
            {data.description}
          </p>

          {/* Precio */}

          {!variantes?.length && (
            <p className="mb-8 text-center text-[23px] font-bold text-[#d4af37] sm:text-[25px] md:mb-10 md:text-[28px]">
              ${data.price.toLocaleString("es-CL")}{" "}
              {data.Currency}
            </p>
          )}

          {/* Variantes */}

          {variantes &&
            variantes.length > 0 && (
              <div className="mb-8 md:mb-10">
                <Variants
                  variantes={variantes}
                  currency={data.Currency}
                />
              </div>
            )}

          {/* Resumen y descripción */}

          <section className="border-t border-[rgba(212,175,55,0.25)] pt-6 md:pt-[30px]">

            {data.product_details?.resumen && (
              <p className="mb-5 text-[15px] leading-[1.7] text-[#d8d0df] sm:text-[16px] md:text-[17px] md:leading-[1.8]">
                {data.product_details.resumen}
              </p>
            )}

            {data.product_details?.descripcion && (
              <p className="text-[15px] leading-[1.7] text-[#d8d0df] sm:text-[16px] md:text-[17px] md:leading-[1.8]">
                {data.product_details.descripcion}
              </p>
            )}

          </section>

          {/* Cómo funciona */}

          {data.product_details?.como_funciona && (
            <section className="mt-7 md:mt-[35px]">

              <h2 className="mb-3 text-[22px] font-normal text-[#d4af37] sm:text-[24px] md:mb-[15px] md:text-[27px]">
                ¿Cómo funciona?
              </h2>

              <p className="text-[15px] leading-[1.7] text-[#d8d0df] sm:text-[16px] md:text-[17px] md:leading-[1.8]">
                {data.product_details.como_funciona}
              </p>

            </section>
          )}

          {/* Características */}

          <DetailList
            title="Características"
            items={
              data.product_details?.caracteristicas
            }
          />

          {/* Beneficios */}

          <DetailList
            title="Beneficios"
            items={
              data.product_details?.beneficios
            }
          />

          {/* Para qué sirve */}

          <DetailList
            title="¿Para qué sirve?"
            items={
              data.product_details?.para_que_sirve
            }
          />

          {/* Duración */}

          <DetailList
            title="Duración"
            items={
              data.product_details?.duracion
            }
          />

          {/* Incluye */}

          <DetailList
            title="Incluye"
            items={
              data.product_details?.incluye
            }
          />

          {/* Contacto */}

          <ServiceContact
            serviceName={data.name}
          />

        </div>
      </div>
    </>
  );
};

export default ProductDetail;