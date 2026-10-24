import { useState } from "react";
import { BellRing, CheckCircle2, ShieldCheck } from "lucide-react";
import supabase from "../../utils/supabase";

type NoticeState = "idle" | "working" | "success" | "error";
function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const padded = (value + "=".repeat((4 - (value.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
export default function BlogPushSignup() {
  const [state, setState] = useState<NoticeState>("idle");
  const [message, setMessage] = useState("");
  async function subscribe() {
    setState("working"); setMessage("");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("Este navegador no admite notificaciones push. Prueba con Chrome o Edge actualizado.");
      if (!window.isSecureContext) throw new Error("Las notificaciones requieren HTTPS.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("No se concedió permiso para las notificaciones.");
      const { data: keyData, error: keyError } = await supabase.functions.invoke("blog-push", { body: { action: "public-key" } });
      if (keyError) throw keyError;
      if (!keyData?.publicKey) throw new Error("Las notificaciones aún no están configuradas en el servidor.");
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlToBytes(keyData.publicKey) });
      const { error: saveError } = await supabase.functions.invoke("blog-push", { body: { action: "subscribe", subscription: subscription.toJSON() } });
      if (saveError) throw saveError;
      setState("success"); setMessage("Listo. Te avisaremos cuando publiquemos nuevas lecturas.");
    } catch (error) {
      setState("error"); setMessage(error instanceof Error ? error.message : "No se pudo activar la suscripción. Inténtalo nuevamente.");
    }
  }
  return <section aria-labelledby="blog-notifications-title" className="mx-auto mb-9 max-w-3xl rounded-xl border border-[rgba(212,175,55,0.42)] bg-[linear-gradient(125deg,rgba(43,24,55,0.92),rgba(12,9,17,0.96))] px-5 py-5 sm:mb-11 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-6"><div className="flex items-start gap-3"><span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.45)] bg-[#d4af37]/10 text-[#f4df9b]">{state === "success" ? <CheckCircle2 aria-hidden="true" className="h-5 w-5" /> : <BellRing aria-hidden="true" className="h-5 w-5" />}</span><div><h2 id="blog-notifications-title" className="font-serif text-lg text-[#f4df9b]">Nuevas lecturas del Grimorio</h2><p className="mt-1 text-sm leading-6 text-[#d8d0df]">Recibe una notificación en tu dispositivo cuando publiquemos un nuevo artículo. Sin correos ni mensajes publicitarios.</p><p className="mt-2 flex items-center gap-1.5 text-xs text-[#aaa2b3]"><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Tú decides si activarlas desde tu navegador.</p>{message && <p role="status" aria-live="polite" className={`mt-3 text-sm ${state === "error" ? "text-rose-300" : "text-[#f4df9b]"}`}>{message}</p>}</div></div><button type="button" onClick={() => void subscribe()} disabled={state === "working" || state === "success"} className="mt-4 inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[#d4af37] px-4 py-2.5 text-sm font-semibold text-[#f4df9b] transition-colors hover:bg-[#d4af37] hover:text-[#08060d] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 sm:w-auto"><BellRing aria-hidden="true" className="h-4 w-4" />{state === "working" ? "Activando…" : state === "success" ? "Notificaciones activadas" : "Activar notificaciones"}</button></section>;
}
