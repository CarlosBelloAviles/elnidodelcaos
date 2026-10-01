/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: Fetcher;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

interface ProductSEO {
  name: string;
  description: string | null;
  slug: string;
  img_url: string | null;
}

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    const url = new URL(request.url);

    // Fuerza todo el tráfico HTTP a HTTPS antes de procesar cualquier ruta.
    if (url.protocol === "http:") {
      url.protocol = "https:";

      return new Response(null, {
        status: 301,
        headers: {
          Location: url.toString(),
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }

    /*
     * ---------------------------------------------------------
     * ROBOTS.TXT
     * ---------------------------------------------------------
     */

    if (url.pathname === "/robots.txt") {
      return withSecurityHeaders(
        new Response(
          `User-agent: *
Allow: /
Sitemap: https://elnidodelcaos.cl/sitemap.xml`,
          {
            headers: {
              "Content-Type": "text/plain; charset=UTF-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
      );
    }

    /*
     * ---------------------------------------------------------
     * SITEMAP.XML
     * ---------------------------------------------------------
     */

    if (url.pathname === "/sitemap.xml") {
      try {
        const response = await fetch(
          `${env.SUPABASE_URL}/rest/v1/Products?select=slug`,
          {
            headers: {
              apikey: env.SUPABASE_KEY,
              Authorization: `Bearer ${env.SUPABASE_KEY}`,
            },
          },
        );

        if (!response.ok) {
          return withSecurityHeaders(
            new Response("Error al generar sitemap.", {
              status: 500,
              headers: {
                "Content-Type": "text/plain; charset=UTF-8",
              },
            }),
          );
        }

        const products =
          (await response.json()) as {
            slug: string | null;
          }[];

        const urls = [
          `
        <url>
          <loc>https://elnidodelcaos.cl/</loc>
        </url>
      `,

          ...products
            .filter(
              (
                product,
              ): product is { slug: string } =>
                Boolean(product.slug),
            )
            .map((product) => {
              const encodedSlug =
                encodeURIComponent(product.slug);

              return `
        <url>
          <loc>https://elnidodelcaos.cl/servicios/${escapeXml(
            encodedSlug,
          )}</loc>
        </url>
      `;
            }),
        ];

        const sitemap =
          `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

        return withSecurityHeaders(
          new Response(sitemap, {
            headers: {
              "Content-Type":
                "application/xml; charset=UTF-8",
              "Cache-Control":
                "public, max-age=3600",
            },
          }),
        );
      } catch {
        return withSecurityHeaders(
          new Response("Error al generar sitemap.", {
            status: 500,
            headers: {
              "Content-Type":
                "text/plain; charset=UTF-8",
            },
          }),
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * SEO DINÁMICO PARA /servicios/:slug
     * ---------------------------------------------------------
     */

    if (url.pathname.startsWith("/servicios/")) {
      const slug = decodeURIComponent(
        url.pathname.slice("/servicios/".length),
      );

      if (slug) {
        try {
          const productResponse = await fetch(
            `${env.SUPABASE_URL}/rest/v1/Products?select=name,description,slug,img_url&slug=eq.${encodeURIComponent(
              slug,
            )}&limit=1`,
            {
              headers: {
                apikey: env.SUPABASE_KEY,
                Authorization:
                  `Bearer ${env.SUPABASE_KEY}`,
              },
            },
          );

          if (productResponse.ok) {
            const products =
              (await productResponse.json()) as ProductSEO[];

            const product = products[0];

            if (product) {
              const assetResponse =
                await env.ASSETS.fetch(
                  new Request(
                    new URL("/", request.url),
                    request,
                  ),
                );

              const html =
                await assetResponse.text();

              const title =
                `${product.name} | Nido del Caos`;

              const description =
                product.description?.trim() ||
                "Servicio disponible en Nido del Caos.";

              const canonical =
                `https://elnidodelcaos.cl/servicios/${encodeURIComponent(
                  product.slug,
                )}`;

              // Mantiene URLs absolutas (por ejemplo Cloudinary)
              // y convierte rutas relativas en URLs completas.
              const image = product.img_url
                ? new URL(
                    product.img_url,
                    url.origin,
                  ).toString()
                : "https://elnidodelcaos.cl/seo_nido.png";

              /*
               * Eliminamos las etiquetas SEO que pueda haber
               * generado React para evitar duplicados.
               */

              const cleanedHtml = html
                .replace(
                  /<title>[\s\S]*?<\/title>/i,
                  "",
                )
                .replace(
                  /<meta\s+name=["']description["'][^>]*>/i,
                  "",
                )
                .replace(
                  /<link\s+rel=["']canonical["'][^>]*>/i,
                  "",
                )
                .replace(
                  /<meta\s+property=["']og:[^"']+["'][^>]*>/gi,
                  "",
                )
                .replace(
                  /<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi,
                  "",
                );

              /*
               * Open Graph + Twitter Card.
               * La imagen viene del servicio concreto en Supabase.
               */

              const seoTags = `
<title>${escapeHtml(title)}</title>

<meta
  name="description"
  content="${escapeHtml(description)}"
>

<link
  rel="canonical"
  href="${escapeHtml(canonical)}"
>

<meta
  property="og:type"
  content="website"
>

<meta
  property="og:title"
  content="${escapeHtml(title)}"
>

<meta
  property="og:description"
  content="${escapeHtml(description)}"
>

<meta
  property="og:url"
  content="${escapeHtml(canonical)}"
>

<meta
  property="og:image"
  content="${escapeHtml(image)}"
>

<meta
  property="og:image:alt"
  content="${escapeHtml(product.name)}"
>

<meta
  property="og:site_name"
  content="Nido del Caos"
>

<meta
  property="og:locale"
  content="es_CL"
>

<meta
  name="twitter:card"
  content="summary_large_image"
>

<meta
  name="twitter:title"
  content="${escapeHtml(title)}"
>

<meta
  name="twitter:description"
  content="${escapeHtml(description)}"
>

<meta
  name="twitter:image"
  content="${escapeHtml(image)}"
>
`;

              /*
               * Insertamos los metadatos antes de </head>.
               */

              const modifiedHtml =
                cleanedHtml.replace(
                  /<\/head>/i,
                  `${seoTags}\n</head>`,
                );

              const headers =
                new Headers(assetResponse.headers);

              headers.set(
                "Content-Type",
                "text/html; charset=UTF-8",
              );

              return withSecurityHeaders(
                new Response(modifiedHtml, {
                  status: assetResponse.status,
                  headers,
                }),
              );
            }
          }
        } catch {
          // Si falla el SEO dinámico,
          // React continúa funcionando normalmente.
        }
      }
    }

    /*
     * ---------------------------------------------------------
     * ASSETS / REACT
     * ---------------------------------------------------------
     */

    const assetResponse =
      await env.ASSETS.fetch(request);

    return withSecurityHeaders(assetResponse);
  },
};

/*
 * ---------------------------------------------------------
 * SECURITY HEADERS
 * ---------------------------------------------------------
 */

function withSecurityHeaders(
  response: Response,
): Response {
  const headers = new Headers(
    response.headers,
  );

  /*
   * HTTPS obligatorio durante 1 año.
   */

  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  /*
   * Content Security Policy
   */

  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "connect-src 'self' https://*.supabase.co",
      "img-src 'self' data: blob: https://*.supabase.co https://res.cloudinary.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  );

  /*
   * Evita MIME sniffing.
   */

  headers.set(
    "X-Content-Type-Options",
    "nosniff",
  );

  /*
   * Evita que el sitio pueda cargarse dentro
   * de un iframe.
   */

  headers.set(
    "X-Frame-Options",
    "DENY",
  );

  /*
   * Controla qué información de origen se
   * envía al navegar hacia otros sitios.
   */

  headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  /*
   * Desactiva APIs del navegador que el sitio
   * no necesita.
   */

  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return new Response(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers,
    },
  );
}

/*
 * ---------------------------------------------------------
 * HTML ESCAPING
 * ---------------------------------------------------------
 */

function escapeHtml(
  value: string,
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/*
 * ---------------------------------------------------------
 * XML ESCAPING
 * ---------------------------------------------------------
 */

function escapeXml(
  value: string,
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
