import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "service";
  structuredData?: Record<string, unknown>;
}

const SEO = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  structuredData,
}: SEOProps) => {
  const ogType = type === "service" ? "website" : type;

  return (
    <Helmet>
      {/* Idioma */}

      <html lang="es" />

      {/* SEO básico */}

      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index, follow"
      />

      {/* URL canónica */}

      {canonical && (
        <link
          rel="canonical"
          href={canonical}
        />
      )}

      {/* Open Graph */}

      <meta
        property="og:type"
        content={ogType}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      {canonical && (
        <meta
          property="og:url"
          content={canonical}
        />
      )}

      <meta
        property="og:locale"
        content="es_CL"
      />

      {image && (
        <meta
          property="og:image"
          content={image}
        />
      )}

      {/* Twitter / X */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      {image && (
        <meta
          name="twitter:image"
          content={image}
        />
      )}

      {/* JSON-LD */}

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;