import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

// Recover once from stale or unavailable dynamically imported Vite chunks.
// The cooldown prevents an infinite reload loop if the underlying problem persists.
const PRELOAD_RELOAD_KEY = "nido-vite-preload-reload";
const PRELOAD_RELOAD_COOLDOWN_MS = 30_000;

window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();

  try {
    const lastReload = Number(
      window.sessionStorage.getItem(PRELOAD_RELOAD_KEY) ?? 0,
    );

    if (Date.now() - lastReload < PRELOAD_RELOAD_COOLDOWN_MS) {
      console.error(
        "No se repetirá la recarga automática para evitar un bucle.",
        event.payload,
      );
      return;
    }

    window.sessionStorage.setItem(
      PRELOAD_RELOAD_KEY,
      String(Date.now()),
    );
  } catch {
    // Without sessionStorage, do not reload automatically: a persistent
    // import failure could otherwise cause an endless reload loop.
    console.error(
      "No se pudo comprobar el límite de recargas automáticas.",
      event.payload,
    );
    return;
  }

  window.location.reload();
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
