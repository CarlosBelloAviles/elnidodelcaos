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

    if (url.pathname === "/robots.txt") {
      return withSecurityHeaders(
        new Response(
          `User-agent: *
Allow: /
Sitemap: https://elnidodelcaos.cl/sitemap.xml
`,
          {
            headers: {
              "Content-Type": "text/plain; charset=UTF-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        ),
      );
    }

    if (url.pathname === "/sitemap.xml") {
      try {
        const supabase = getSupabaseConfig(env);

        const response = await fetch(
          `${supabase.url}/rest/v1/Products?select=slug&slug=not.is.null`,
          {
            headers: supabase.headers,
          },
        );

        if (!response.ok) {
          const errorBody = await response.text();

          console.error("Sitemap: Supabase request failed.", {
            status: response.status,
            statusText: response.statusText,
            body: errorBody.slice(0, 1000),
          });

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

        const serviceSlugs = [
          ...new Set(
            products
              .map((product) => product.slug?.trim())
              .filter(
                (slug): slug is string =>
                  Boolean(slug),
              ),
          ),
        ];

        const urls = [
          `
        <url>
          <loc>https://elnidodelcaos.cl/</loc>
        </url>
      `,

          ...serviceSlugs.map((slug) => {
            const encodedSlug =
              encodeURIComponent(slug);

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
      } catch (error) {
        console.error("Sitemap: unexpected error.", error);

        return withSecurityHeaders(
          new Response("Error al generar sitemap.", {
            status: 500,
            headers: {
              "Content-Type": "text/plain; charset=UTF-8",
            },
          }),
        );
      }
    }

    if (url.pathname.startsWith("/servicios/")) {
      const slug = decodeURIComponent(
        url.pathname.slice("/servicios/".length),
      );

      if (slug) {
        try {
          const supabase = getSupabaseConfig(env);

          const productResponse = await fetch(
            `${supabase.url}/rest/v1/Products?select=name,description,slug,img_url&slug=eq.${encodeURIComponent(
              slug,
            )}&limit=1`,
            {
              headers: supabase.headers,
            },
          );

          if (!productResponse.ok) {
            const errorBody = await productResponse.text();

            console.error("Service SEO: Supabase request failed.", {
              status: productResponse.status,
              statusText: productResponse.statusText,
              slug,
              body: errorBody.slice(0, 1000),
            });
          } else {
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

              const isTarotPredictivo =
                product.slug === "tarot-predictivo";

              const image = isTarotPredictivo
                ? "https://res.cloudinary.com/pnvel4tk/image/upload/v1790910844/nido/og/tarot-predictivo-og.webp"
                : product.img_url
                  ? new URL(
                      product.img_url,
                      url.origin,
                    ).toString()
                  : "https://elnidodelcaos.cl/seo_nido.png";

              const imageType = isTarotPredictivo
                ? "image/webp"
                : "image/webp";

              const imageWidth = isTarotPredictivo
                ? "1200"
                : undefined;

              const imageHeight = isTarotPredictivo
                ? "630"
                : undefined;

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
                  /<meta\s+name=["']robots["'][^>]*>/i,
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

              const imageDimensions = imageWidth && imageHeight
                ? `
<meta
  property="og:image:width"
  content="${imageWidth}"
>

<meta
  property="og:image:height"
  content="${imageHeight}"
>
`
                : "";

              const seoTags = `
<title>${escapeHtml(title)}</title>

<meta
  name="description"
  content="${escapeHtml(description)}"
>

<meta
  name="robots"
  content="index, follow"
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
  property="og:image:type"
  content="${imageType}"
>
${imageDimensions}
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

              headers.set(
                "Cache-Control",
                "public, max-age=300, must-revalidate",
              );

              return withSecurityHeaders(
                new Response(modifiedHtml, {
                  status: assetResponse.status,
                  headers,
                }),
              );
            }
          }
        } catch (error) {
          console.error("Service SEO: unexpected error.", {
            slug,
            error,
          });
        }
      }
    }

    const assetResponse =
      await env.ASSETS.fetch(request);

    return withSecurityHeaders(assetResponse);
  },
};

function getSupabaseConfig(env: Env): {
  url: string;
  headers: HeadersInit;
} {
  const url = env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = env.SUPABASE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL y SUPABASE_KEY deben estar configuradas en el Worker.",
    );
  }

  return {
    url,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  };
}

function withSecurityHeaders(
  response: Response,
): Response {
  const headers = new Headers(
    response.headers,
  );

  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

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

  headers.set(
    "X-Content-Type-Options",
    "nosniff",
  );

  headers.set(
    "X-Frame-Options",
    "DENY",
  );

  headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

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
