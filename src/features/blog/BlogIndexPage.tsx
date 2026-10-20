import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../Components/SEO";
import {
  getBlogCategories,
  getFeaturedBlogPosts,
  getPublishedBlogPosts,
  type BlogCategory,
  type BlogPost,
} from "./blogService";

function excerpt(post: BlogPost) {
  const parts: string[] = [];
  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    const node = value as Record<string, unknown>;
    if (typeof node.text === "string") parts.push(node.text);
    if (Array.isArray(node.content)) node.content.forEach(visit);
  };
  visit(post.content);
  return parts.join(" ").slice(0, 190) || "Una lectura para comprender mejor la Magia del Caos y sus prácticas.";
}

function BlogIndexPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categorySlug, setCategorySlug] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    getBlogCategories()
      .then((rows) => {
        if (active) setCategories(rows);
      })
      .catch((error) => {
        console.error("No se pudieron cargar las categorías de El Grimorio.", error);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    Promise.all([getPublishedBlogPosts(page, 9, categorySlug || undefined), getFeaturedBlogPosts(categorySlug || undefined)])
      .then(([rows, featuredRows]) => {
        if (active) { setPosts(rows); setFeaturedPosts(featuredRows); }
      })
      .catch((error) => {
        console.error("No se pudieron cargar los artículos de El Grimorio.", error);
        if (active) {
          setPosts([]);
          setFeaturedPosts([]);
          setFailed(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, categorySlug, retryCount]);

  return (
    <>
      <SEO
        title="El Grimorio | El Nido del Caos"
        description="Explora artículos, conocimientos y orientación para comprender la Magia del Caos, sus prácticas y los servicios de El Nido del Caos."
        canonical="https://elnidodelcaos.cl/blog"
        image="https://elnidodelcaos.cl/seo_nido.png"
      />
      <section className="min-h-[65vh] bg-[radial-gradient(ellipse_at_50%_0%,rgba(92,43,116,0.18),transparent_45%),#08060d] px-5 pb-16 pt-24 text-[#e8e0ec] sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-[1200px]">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#d4af37] hover:text-[#f4df9b]">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <header className="mx-auto mb-9 mt-7 max-w-3xl text-center sm:mb-12">
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#b8944a] sm:w-16" />
              <BookOpen aria-hidden="true" className="h-5 w-5 text-[#d4af37]" />
              <span className="h-px w-10 bg-[#b8944a] sm:w-16" />
            </div>
            <h1 className="font-serif text-3xl tracking-[0.12em] text-[#f4df9b] sm:text-4xl lg:text-5xl">EL GRIMORIO</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#d8d0df] sm:text-base">
              Un espacio de conocimiento y guía para comprender la Magia del Caos, conocer sus prácticas y entender mejor los servicios de El Nido del Caos.
            </p>
          </header>

          {categories.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2" aria-label="Filtrar artículos por categoría">
              <button type="button" onClick={() => { setPage(0); setCategorySlug(""); }} className={`rounded-full border px-4 py-2 text-sm transition-colors ${categorySlug === "" ? "border-[#d4af37] bg-[#d4af37] text-[#08060d]" : "border-[rgba(212,175,55,0.3)] text-[#e8e0ec] hover:border-[#d4af37]"}`}>
                Todas las lecturas
              </button>
              {categories.map((category) => (
                <button key={category.id} type="button" onClick={() => { setPage(0); setCategorySlug(category.slug); }} className={`rounded-full border px-4 py-2 text-sm transition-colors ${categorySlug === category.slug ? "border-[#d4af37] bg-[#d4af37] text-[#08060d]" : "border-[rgba(212,175,55,0.3)] text-[#e8e0ec] hover:border-[#d4af37]"}`}>
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="py-12 text-center text-sm text-[#aaa2b3]">Consultando el grimorio…</p>
          ) : failed ? (
            <div className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-[#100b17]/80 px-5 py-10 text-center">
              <h2 className="font-serif text-xl text-[#f4df9b]">No pudimos cargar las lecturas</h2>
              <p className="mt-2 text-sm text-[#aaa2b3]">Inténtalo de nuevo dentro de un momento.</p>
              <button type="button" onClick={() => setRetryCount((current) => current + 1)} className="mt-5 rounded-lg border border-[#d4af37] px-5 py-2 text-sm text-[#f4df9b] hover:bg-[#d4af37] hover:text-[#08060d]">
                Reintentar
              </button>
            </div>
          ) : posts.length === 0 && featuredPosts.length === 0 ? (
            <div className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-[#100b17]/80 px-5 py-10 text-center">
              <h2 className="font-serif text-xl text-[#f4df9b]">Próximamente, nuevas lecturas</h2>
              <p className="mt-2 text-sm leading-6 text-[#aaa2b3]">Todavía no hay artículos publicados en esta selección.</p>
            </div>
          ) : (
            <>
              {featuredPosts.length > 0 && (
                <section className="mb-12" aria-labelledby="featured-blog-heading">
                  <div className="mb-5 flex items-center gap-3"><span className="h-px flex-1 bg-[rgba(212,175,55,0.35)]" /><h2 id="featured-blog-heading" className="font-serif text-xl tracking-wide text-[#f4df9b] sm:text-2xl">Lecturas destacadas</h2><span className="h-px flex-1 bg-[rgba(212,175,55,0.35)]" /></div>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {featuredPosts.map((post) => (
                      <article key={post.id} className="group flex h-full flex-col overflow-hidden rounded-xl border border-[rgba(212,175,55,0.5)] bg-[linear-gradient(145deg,rgba(48,27,61,0.95),rgba(12,9,17,0.98))]">
                        <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
                          {post.cover_image_url ? <img src={post.cover_image_url} alt={post.cover_image_alt || post.title} loading="lazy" className="h-52 w-full object-cover" /> : <div className="flex h-44 items-center justify-center bg-[radial-gradient(circle,rgba(168,117,201,0.24),transparent_65%),#100b17]"><BookOpen aria-hidden="true" className="h-10 w-10 text-[#b8944a]/70" /></div>}
                          <div className="flex flex-1 flex-col p-5">
                            <span className="w-fit rounded-full border border-[rgba(212,175,55,0.5)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#f4df9b]">{post.featured_order === 1 ? "Destacado principal" : "Lectura destacada"}</span>
                            <div className="mt-3 flex flex-wrap gap-1.5">{(post.categories?.length?post.categories:post.category?[post.category]:[]).map(category=><span key={category.id} className="rounded-full border border-[rgba(212,175,55,0.35)] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#b8944a]">{category.name}</span>)}{!(post.categories?.length||post.category)&&<span className="text-xs uppercase tracking-[0.16em] text-[#b8944a]">El Grimorio</span>}</div>
                            <h3 className="mt-2 font-serif text-xl leading-snug text-[#f4df9b] group-hover:text-[#fff0b8]">{post.title}</h3>
                            <p className="mt-3 flex-1 text-sm leading-6 text-[#d8d0df]">{excerpt(post)}</p>
                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37]">Leer artículo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              )}
              {posts.length > 0 && <section aria-labelledby="all-blog-heading">
                <div className="mb-5 flex items-center gap-3"><span className="h-px flex-1 bg-[rgba(212,175,55,0.2)]" /><h2 id="all-blog-heading" className="font-serif text-lg text-[#e8e0ec]">Todas las lecturas</h2><span className="h-px flex-1 bg-[rgba(212,175,55,0.2)]" /></div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group flex h-full flex-col overflow-hidden rounded-xl border border-[rgba(212,175,55,0.25)] bg-[linear-gradient(145deg,rgba(37,20,49,0.88),rgba(12,9,17,0.98))] transition-colors hover:border-[rgba(212,175,55,0.55)]">
                  <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
                    {post.cover_image_url ? (
                      <img src={post.cover_image_url} alt={post.cover_image_alt || post.title} loading="lazy" className="h-52 w-full object-cover" />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-[radial-gradient(circle,rgba(168,117,201,0.24),transparent_65%),#100b17]">
                        <BookOpen aria-hidden="true" className="h-10 w-10 text-[#b8944a]/70" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#b8944a]">{post.category?.name || "El Grimorio"}</p>
                      <h2 className="mt-3 font-serif text-xl leading-snug text-[#f4df9b] group-hover:text-[#fff0b8]">{post.title}</h2>
                      <p className="mt-3 flex-1 text-sm leading-6 text-[#d8d0df]">{excerpt(post)}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37]">Leer artículo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                </article>
              ))}
                </div>
              </section>}
            </>
          )}

          {!loading && !failed && posts.length > 0 && (
            <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Paginación de artículos">
              <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} className="inline-flex items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.35)] px-4 py-2 text-sm text-[#f4df9b] enabled:hover:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Anteriores
              </button>
              <span className="text-sm text-[#aaa2b3]">Página {page + 1}</span>
              <button type="button" disabled={posts.length < 9} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.35)] px-4 py-2 text-sm text-[#f4df9b] enabled:hover:border-[#d4af37] disabled:cursor-not-allowed disabled:opacity-40">
                Siguientes <ArrowRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

export default BlogIndexPage;
