import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import supabase from "../../utils/supabase";

type LikeState = { like_count: number; liked: boolean };

function getVisitorId(): string {
  const key = "nido-blog-visitor-id";
  let visitorId = window.localStorage.getItem(key);
  if (!visitorId) {
    visitorId = window.crypto.randomUUID();
    window.localStorage.setItem(key, visitorId);
  }
  return visitorId;
}

export default function BlogArticleLikes({ postId }: { postId: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadLikeState() {
      try {
        const visitorId = getVisitorId();
        const { data, error: requestError } = await supabase.rpc(
          "get_or_toggle_blog_post_like",
          {
            p_post_id: postId,
            p_visitor_id: visitorId,
            p_toggle: false,
          },
        );
        if (requestError) throw requestError;
        if (!active) return;
        const state = (Array.isArray(data) ? data[0] : data) as LikeState | null;
        setCount(Number(state?.like_count ?? 0));
        setLiked(Boolean(state?.liked));
      } catch (requestError) {
        console.error("No se pudieron cargar los me gusta del artículo.", requestError);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadLikeState();
    return () => {
      active = false;
    };
  }, [postId]);

  async function toggleLike() {
    if (saving || loading || error) return;
    setSaving(true);
    setError(false);
    try {
      const visitorId = getVisitorId();
      const { data, error: requestError } = await supabase.rpc(
        "get_or_toggle_blog_post_like",
        { p_post_id: postId, p_visitor_id: visitorId, p_toggle: true },
      );
      if (requestError) throw requestError;
      const state = (Array.isArray(data) ? data[0] : data) as LikeState | null;
      if (!state) throw new Error("La base de datos no devolvió el estado del corazón.");
      setCount(Number(state.like_count ?? 0));
      setLiked(Boolean(state.liked));
    } catch (requestError) {
      console.error("No se pudo actualizar el me gusta del artículo.", requestError);
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      aria-label="Reacción al artículo"
      className="mx-auto mt-10 max-w-3xl rounded-xl border border-[rgba(212,175,55,0.25)] bg-[linear-gradient(135deg,rgba(55,25,70,0.38),rgba(16,11,23,0.88))] px-5 py-6 text-center sm:mt-12"
    >
      <p className="font-serif text-lg text-[#f4df9b]">¿Te ha gustado esta lectura?</p>
      <p className="mt-1 text-sm text-[#bdb2c9]">Deja tu corazón para recomendar este artículo.</p>
      <button
        type="button"
        onClick={toggleLike}
        disabled={loading || saving || error}
        aria-pressed={liked}
        aria-label={liked ? "Quitar me gusta" : "Me gusta este artículo"}
        className={`mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-wait disabled:opacity-60 ${
          liked
            ? "border-[#d4af37] bg-[rgba(212,175,55,0.12)] text-[#f4df9b]"
            : "border-[rgba(212,175,55,0.4)] text-[#d8d0df] hover:border-[#d4af37] hover:text-[#f4df9b]"
        }`}
      >
        <Heart
          aria-hidden="true"
          className={`h-5 w-5 transition-transform duration-200 ${liked ? "scale-110 fill-[#d4af37] text-[#d4af37]" : "text-[#d4af37]"}`}
        />
        {loading ? "Cargando…" : liked ? "Te gusta" : "Me gusta"}
        <span className="min-w-4 tabular-nums">{count.toLocaleString("es-CL")}</span>
      </button>
      {error && (
        <p role="status" className="mt-3 text-xs text-[#e6b5b5]">
          No se pudo guardar la reacción. Comprueba tu conexión e inténtalo más tarde.
        </p>
      )}
    </section>
  );
}
