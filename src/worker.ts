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
     * --------------------------------
     * ROBOTS.TXT
     * --------------------------------
     */

    if (url.pathname === "/robots.txt") {
      return withSecurityHeaders(
        new Response(
          `User-agent: *
Allow: /

Sitemap: https://elnidodelcaos.cl/sitemap.xml`,
          {
            headers: {
              "Content-Type":
                "text/plain; charset=UTF-8",

              "Cache-Control":
                "public, max-age=3600",
            },
          },
        ),
      );
    }

    /*
     * --------------------------------
     * SITEMAP.XML
     * --------------------------------
     */

    if (url.pathname === "/sitemap.xml") {
      try {
        const response = await fetch(
          `${env.SUPABASE_URL}/rest/v1/Products?select=slug`,
          {
            headers: {
              apikey: env.SUPABASE_KEY,
              Authorization:
                `Bearer ${env.SUPABASE_KEY}`,
            },
          },
        );

        if (!response.ok) {
          return withSecurityHeaders(
            new Response(
              "Error al generar sitemap.",
              {
                status: 500,
                headers: {
                  "Content-Type":
                    "text/plain; charset=UTF-8",
                },
              },
            ),
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
            .map(
              (product) => `
          <url>
            <loc>https://elnidodelcaos.cl/servicios/${escapeXml(
              product.slug,
            )}</loc>
          </url>
          `,
            ),
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
          new Response(
            "Error al generar sitemap.",
            {
              status: 500,
              headers: {
                "Content-Type":
                  "text/plain; charset=UTF-8",
              },
            },
          ),
        );
      }
    }

    /*
     * --------------------------------
     * SEO DINÁMICO DE PRODUCTOS
     * --------------------------------
     */

    if (
      url.pathname.startsWith("/servicios/")
    ) {
      const slug = decodeURIComponent(
        url.pathname.replace(
          "/servicios/",
          "",
        ),
      );

      if (slug) {
        try {
          const productResponse =
            await fetch(
              `${env.SUPABASE_URL}/rest/v1/Products?select=name,description,slug,img_url&slug=eq.${encodeURIComponent(slug)}&limit=1`,
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
              /*
               * Obtenemos el index.html
               * generado por Vite.
               */

              const assetResponse =
                await env.ASSETS.fetch(
                  new Request(
                    new URL(
                      "/",
                      request.url,
                    ),
                    request,
                  ),
                );

              const html =
                await assetResponse.text();

              /*
               * Datos SEO
               */

              const title =
                `${product.name} | Nido del Caos`;

              const description =
                product.description?.trim() ||
                "Servicio disponible en Nido del Caos.";

              const canonical =
                `https://elnidodelcaos.cl/servicios/${product.slug}`;

              const image =
                product.img_url ||
                "https://elnidodelcaos.cl/seo_nido.png";

              /*
               * Reemplazamos los datos
               * del <head>.
               */

              const modifiedHtml =
                html
                  .replace(
                    /<title>[\s\S]*?<\/title>/i,
                    `<title>${escapeHtml(title)}</title>`,
                  )

                  .replace(
                    /<meta\s+name=["']description["'][^>]*>/i,
                    `<meta name="description" content="${escapeHtml(description)}">`,
                  )

                  .replace(
                    /<link\s+rel=["']canonical["'][^>]*>/i,
                    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
                  )

                  .replace(
                    /<meta\s+property=["']og:type["'][^>]*>/i,
                    `<meta property="og:type" content="website">`,
                  )

                  .replace(
                    /<meta\s+property=["']og:title["'][^>]*>/i,
                    `<meta property="og:title" content="${escapeHtml(title)}">`,
                  )

                  .replace(
                    /<meta\s+property=["']og:description["'][^>]*>/i,
                    `<meta property="og:description" content="${escapeHtml(description)}">`,
                  )

                  .replace(
                    /<meta\s+property=["']og:url["'][^>]*>/i,
                    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
                  )

                  .replace(
                    /<meta\s+property=["']og:image["'][^>]*>/i,
                    `<meta property="og:image" content="${escapeHtml(image)}">`,
                  )

                  .replace(
                    /<meta\s+property=["']og:image:alt["'][^>]*>/i,
                    `<meta property="og:image:alt" content="${escapeHtml(product.name)}">`,
                  )

                  .replace(
                    /<meta\s+name=["']twitter:title["'][^>]*>/i,
                    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
                  )

                  .replace(
                    /<meta\s+name=["']twitter:description["'][^>]*>/i,
                    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
                  )

                  .replace(
                    /<meta\s+name=["']twitter:image["'][^>]*>/i,
                    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
                  );

              const headers =
                new Headers(
                  assetResponse.headers,
                );

              headers.set(
                "Content-Type",
                "text/html; charset=UTF-8",
              );

              return withSecurityHeaders(
                new Response(
                  modifiedHtml,
                  {
                    status: assetResponse.status,
                    headers,
                  },
                ),
              );
            }
          }
        } catch {
          /*
           * Si falla la consulta SEO,
           * dejamos que React funcione
           * normalmente.
           */
        }
      }
    }

    /*
     * --------------------------------
     * ARCHIVOS ESTÁTICOS / REACT
     * --------------------------------
     */

    return withSecurityHeaders(
      await env.ASSETS.fetch(request),
    );
  },
};

/*
 * --------------------------------
 * CABECERAS DE SEGURIDAD
 * --------------------------------
 */

function withSecurityHeaders(
  response: Response,
): Response {
  const headers = new Headers(
    response.headers,
  );

  headers.set(
    "X-Content-Type-Options",
    "nosniff",
  );

  headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  headers.set(
    "X-Frame-Options",
    "SAMEORIGIN",
  );

  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://qxidvvmpahtzcriyrdcc.supabase.co https://res.cloudinary.com",
      "connect-src 'self' https://qxidvvmpahtzcriyrdcc.supabase.co",
    ].join("; "),
  );

  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000",
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
 * --------------------------------
 * ESCAPE HTML
 * --------------------------------
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
 * --------------------------------
 * ESCAPE XML
 * --------------------------------
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
