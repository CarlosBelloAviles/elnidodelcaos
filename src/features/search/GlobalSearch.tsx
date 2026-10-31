import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { servicesData } from "../../services/services";
import {
  getBlogCategories,
  getFeaturedBlogPosts,
  getPublishedBlogPosts,
  type BlogCategory,
  type BlogPost,
} from "../blog/blogService";
import type { Category, Product } from "../../types";

type ResultGroup = "Servicios" | "Productos" | "Artículos" | "Categorías";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  group: ResultGroup;
}

interface SearchIndex {
  results: SearchResult[];
}

interface GlobalSearchProps {
  placement?: "mobile" | "desktop";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function buildIndex(
  categories: Category[],
  featuredPosts: BlogPost[],
  posts: BlogPost[],
  blogCategories: BlogCategory[],
): SearchIndex {
  const results: SearchResult[] = [];
  const seenPosts = new Set<string>();

  categories.forEach((category) => {
    results.push({
      id: `service-category-${category.id}`,
      title: category.name,
      description: "Categoría de servicios",
      href: `/#${category.slug}`,
      group: "Categorías",
    });

    (category.products ?? []).forEach((product: Product) => {
      results.push({
        id: `product-${product.id}`,
        title: product.name,
        description: product.description ?? category.name,
        href: `/servicios/${product.slug}`,
        group: "Servicios",
      });
    });
  });

  [...featuredPosts, ...posts].forEach((post) => {
    if (seenPosts.has(post.id)) return;
    seenPosts.add(post.id);
    results.push({
      id: `post-${post.id}`,
      title: post.title,
      description: post.meta_description?.trim() || post.category?.name || "Artículo de El Grimorio",
      href: `/grimorio/${post.slug}`,
      group: "Artículos",
    });
  });

  blogCategories.forEach((category) => {
    results.push({
      id: `blog-category-${category.id}`,
      title: category.name,
      description: "Categoría de El Grimorio",
      href: `/grimorio?categoria=${encodeURIComponent(category.slug)}`,
      group: "Categorías",
    });
  });

  return { results };
}

export default function GlobalSearch({ placement = "desktop" }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const isMobile = placement === "mobile";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    if (index || loading) return;

    let active = true;
    setLoading(true);
    setLoadError(false);

    Promise.allSettled([
      servicesData(),
      getFeaturedBlogPosts(),
      getPublishedBlogPosts(0, 100),
      getBlogCategories(),
    ]).then(([servicesResult, featuredResult, postsResult, categoriesResult]) => {
      if (!active) return;

      const services = servicesResult.status === "fulfilled" ? servicesResult.value : [];
      const featured = featuredResult.status === "fulfilled" ? featuredResult.value : [];
      const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
      const blogCategories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

      const hasData = services.length > 0 || featured.length > 0 || posts.length > 0 || blogCategories.length > 0;
      if (!hasData && [servicesResult, featuredResult, postsResult, categoriesResult].some((result) => result.status === "rejected")) {
        setLoadError(true);
      } else {
        setIndex(buildIndex(services, featured, posts, blogCategories));
      }
    }).catch((error) => {
      console.error("No se pudo preparar el buscador global.", error);
      if (active) setLoadError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [open, index, loading]);

  const filteredResults = useMemo(() => {
    const term = normalize(query.trim());
    if (!term || !index) return [];
    return index.results.filter((item) =>
      normalize(`${item.title} ${item.description}`).includes(term),
    );
  }, [index, query]);

  const groups: ResultGroup[] = ["Servicios", "Productos", "Artículos", "Categorías"];
  const hasQuery = query.trim().length > 0;

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const openResult = (href: string) => {
    close();
    navigate(href);
  };

  const retry = () => {
    setIndex(null);
    setLoadError(false);
    setLoading(false);
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Cerrar buscador" : "Buscar en El Nido del Caos"}
        aria-expanded={open}
        aria-controls={`global-search-panel-${placement}`}
        className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#e4e3bd] transition-colors hover:bg-[rgba(212,175,55,0.09)] hover:text-[#d4af37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d4af37]"
      >
        {open ? <X size={21} /> : <Search size={21} />}
      </button>

      {open && (
        <div
          id={`global-search-panel-${placement}`}
          className={`absolute right-0 top-full z-[80] mt-3 overflow-hidden rounded-xl border border-[rgba(212,175,55,0.38)] bg-[#0c0812] shadow-[0_16px_45px_rgba(0,0,0,0.55)] ${isMobile ? "w-[min( calc(100vw-2rem),28rem)]" : "w-[min( calc(100vw-2rem),30rem)]"}`}
        >
          <div className="border-b border-[rgba(212,175,55,0.2)] p-3">
            <label htmlFor={`global-search-input-${placement}`} className="sr-only">
              Buscar servicios, productos y artículos
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-[rgba(212,175,55,0.28)] bg-[#17101f] px-3">
              <Search size={18} className="shrink-0 text-[#b8944a]" aria-hidden="true" />
              <input
                ref={inputRef}
                id={`global-search-input-${placement}`}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="¿Qué estás buscando?"
                autoComplete="off"
                className="h-12 min-w-0 flex-1 bg-transparent text-sm text-[#f4df9b] outline-none placeholder:text-[#9d91a8]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Borrar búsqueda"
                  className="rounded p-1 text-[#aaa2b3] hover:text-[#f4df9b]"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[min(65vh,26rem)] overflow-y-auto p-2">
            {loading && (
              <div className="flex items-center justify-center gap-2 px-3 py-7 text-sm text-[#aaa2b3]">
                <LoaderCircle size={17} className="animate-spin text-[#d4af37]" />
                Preparando el buscador…
              </div>
            )}

            {!loading && loadError && (
              <div className="px-4 py-7 text-center">
                <p className="text-sm text-[#d8d0df]">No pudimos cargar el contenido para buscar.</p>
                <button type="button" onClick={retry} className="mt-3 text-sm font-semibold text-[#d4af37] hover:text-[#f4df9b]">
                  Intentar de nuevo
                </button>
              </div>
            )}

            {!loading && !loadError && !hasQuery && (
              <p className="px-3 py-5 text-center text-xs leading-5 text-[#aaa2b3]">
                Escribe para encontrar servicios, productos y lecturas de El Grimorio.
              </p>
            )}

            {!loading && !loadError && hasQuery && filteredResults.length === 0 && (
              <p className="px-3 py-7 text-center text-sm text-[#aaa2b3]">
                No encontramos resultados para “{query.trim()}”.
              </p>
            )}

            {!loading && !loadError && hasQuery && groups.map((group) => {
              const items = filteredResults.filter((item) => item.group === group).slice(0, 5);
              if (items.length === 0) return null;

              return (
                <section key={group} className="mb-2 last:mb-0">
                  <h3 className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b8944a]">
                    {group}
                  </h3>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => openResult(item.href)}
                          className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[rgba(212,175,55,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d4af37]"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-[#eee5d2] group-hover:text-[#f4df9b]">{item.title}</span>
                            <span className="mt-0.5 block truncate text-xs text-[#9d91a8]">{item.description}</span>
                          </span>
                          <ArrowUpRight size={15} className="shrink-0 text-[#9d7b39] transition-colors group-hover:text-[#d4af37]" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
