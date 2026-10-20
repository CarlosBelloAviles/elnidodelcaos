import { useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getHomeBlogPosts, type BlogPost } from "./blogService";

function categoryLabels(post: BlogPost) {
  return post.categories?.length ? post.categories : post.category ? [post.category] : [];
}

function excerpt(post: BlogPost) {
  return post.meta_description?.trim() || "Una lectura para comprender mejor la Magia del Caos y sus prácticas.";
}

function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getHomeBlogPosts()
      .then((rows) => {
        if (active) setPosts(rows.slice(0, 4));
      })
      .catch((error) => console.error("No se pudieron cargar artículos de El Grimorio.", error))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const hero = posts[0];
  const others = posts.slice(1, 4);

  return (
    <section
      id="el-grimorio"
      className="relative overflow-hidden border-t border-[rgba(212,175,55,0.18)] bg-[radial-gradient(ellipse_at_50%_0%,rgba(92,43,116,0.18),transparent_55%),#08060d] px-5 py-14 text-white sm:px-8 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-9 text-center sm:mb-12">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#b8944a] sm:w-20" />
            <BookOpen aria-hidden="true" className="h-5 w-5 text-[#d4af37]" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#b8944a] sm:w-20" />
          </div>
          <h2 className="font-serif text-3xl tracking-[0.12em] text-[#f4df9b] [text-shadow:0_0_20px_rgba(212,175,55,0.16)] sm:text-4xl lg:text-5xl">
            EL GRIMORIO
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#d8d0df] sm:text-base">
            Un espacio de conocimiento y guía para comprender la Magia del Caos, conocer sus prácticas y entender mejor los servicios de El Nido del Caos.
          </p>
        </header>

        {loading ? (
          <p className="py-8 text-center text-sm text-[#aaa2b3]">Consultando el grimorio…</p>
        ) : posts.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-xl border border-[rgba(212,175,55,0.2)] bg-[#100b17]/70 px-5 py-8 text-center">
            <p className="font-serif text-lg text-[#f0d98a]">Próximamente, nuevas lecturas</p>
            <p className="mt-2 text-sm leading-6 text-[#aaa2b3]">
              Estamos preparando artículos para compartir conocimiento, orientación y explicaciones sobre la Magia del Caos y nuestros servicios.
            </p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {hero && (
              <article className="group overflow-hidden rounded-xl border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(145deg,rgba(37,20,49,0.92),rgba(12,9,17,0.98))]">
                <Link
                  to={`/grimorio/${hero.slug}`}
                  className="grid h-full sm:grid-cols-2"
                >
                  {hero.cover_image_url ? (
                    <img
                      src={hero.cover_image_url}
                      alt={hero.cover_image_alt || hero.title}
                      className="h-56 w-full object-cover sm:h-full sm:min-h-[340px] lg:min-h-[380px]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex min-h-48 items-center justify-center bg-[radial-gradient(circle,rgba(168,117,201,0.24),transparent_65%),#100b17] sm:min-h-[340px] lg:min-h-[380px]">
                      <BookOpen className="h-12 w-12 text-[#b8944a]/70" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col items-center justify-center p-5 text-center sm:p-7 lg:p-10">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b8944a] sm:text-xs">
                      Lectura destacada
                    </p>
                    <h3 className="max-w-2xl font-serif text-2xl leading-tight text-[#f4df9b] transition-colors group-hover:text-[#fff0b8] sm:text-3xl lg:text-4xl">
                      {hero.title}
                    </h3>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b8944a] sm:text-xs">
                      {categoryLabels(hero).map((category) => category.name).join(" · ") || "El Grimorio"}
                    </p>
                    <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-6 text-[#d8d0df] sm:text-base sm:leading-7">
                      {excerpt(hero)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37]">
                      Leer artículo
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </article>
            )}

            {others.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {others.map((post) => (
                  <article
                    key={post.id}
                    className="group flex h-full overflow-hidden rounded-xl border border-[rgba(212,175,55,0.2)] bg-[#100b17]/80 transition-colors hover:border-[rgba(212,175,55,0.5)]"
                  >
                    <Link to={`/grimorio/${post.slug}`} className="flex h-full w-full flex-col">
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt={post.cover_image_alt || post.title}
                          className="h-40 w-full object-cover sm:h-44"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center bg-[radial-gradient(circle,rgba(168,117,201,0.2),transparent_65%),#100b17] sm:h-36">
                          <BookOpen className="h-8 w-8 text-[#b8944a]/70" aria-hidden="true" />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h3 className="line-clamp-2 min-h-[3.25rem] font-serif text-lg leading-snug text-[#f0d98a] transition-colors group-hover:text-[#fff0b8]">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b8944a]">
                          {categoryLabels(post).map((category) => category.name).join(" · ") || "El Grimorio"}
                        </p>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#d8d0df]">
                          {excerpt(post)}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-[#d4af37]">
                          Leer artículo
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/grimorio"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d4af37] px-5 py-3 text-sm font-semibold text-[#f4df9b] transition-colors hover:bg-[#d4af37] hover:text-[#08060d]"
          >
            Ver todos los artículos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
