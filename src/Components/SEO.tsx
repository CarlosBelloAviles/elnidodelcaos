import { useEffect } from "react";
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

  useEffect(() => {
    // Update the metadata already present in index.html instead of adding
    // a second copy through React Helmet.
    document.title = title;

    const setMeta = (
      selector: string,
      attribute: "name" | "property",
      key: string,
      content: string,
    ) => {
      const matches = Array.from(document.head.querySelectorAll<HTMLMetaElement>(selector));
      const meta = matches.shift() ?? document.createElement("meta");

      for (const duplicate of matches) duplicate.remove();

      meta.setAttribute(attribute, key);
      meta.setAttribute("content", content);

      if (!meta.isConnected) document.head.appendChild(meta);
    };

    const setLink = (rel: string, href?: string) => {
      const matches = Array.from(
        document.head.querySelectorAll<HTMLLinkElement>(`link[rel="${rel}"]`),
      );
      const link = matches.shift();

      for (const duplicate of matches) duplicate.remove();

      if (!href) {
        link?.remove();
        return;
      }

      const canonicalLink = link ?? document.createElement("link");
      canonicalLink.setAttribute("rel", rel);
      canonicalLink.setAttribute("href", href);

      if (!canonicalLink.isConnected) document.head.appendChild(canonicalLink);
    };

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", "index, follow");
    setMeta('meta[property="og:type"]', "property", "og:type", ogType);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:locale"]', "property", "og:locale", "es_CL");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    if (canonical) {
      setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    } else {
      document.head.querySelectorAll('meta[property="og:url"]').forEach((meta) => meta.remove());
    }

    if (image) {
      setMeta('meta[property="og:image"]', "property", "og:image", image);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }

    setLink("canonical", canonical);
  }, [title, description, canonical, image, ogType]);

  return (
    <Helmet>
      {/* JSON-LD remains managed by React Helmet. */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
