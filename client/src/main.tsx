import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import * as React from "react";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { startLogin } from "./const";
import "./index.css";
import "./i18n";
import App from "./App";

// The Manus JSX transform emits React.createElement in this workspace.
// Install the namespace before the first render so production and dev use
// the same explicit bootstrap contract.
(globalThis as typeof globalThis & { React: typeof React }).React = React;

const root = document.getElementById("root");
const bootStage = (stage: string) => {
  root?.setAttribute("data-arki-boot-stage", stage);
};
const showBootError = (error: unknown, stage: string) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[ARKI_BOOT_ERROR]", { stage, error });
  if (root) {
    root.innerHTML = `<div style="min-height:100vh;background:#071a30;color:#edf4ff;display:grid;place-items:center;font-family:system-ui,sans-serif;padding:2rem"><div style="max-width:42rem;text-align:center"><strong style="display:block;font-size:1.25rem;letter-spacing:.12em">ARKI</strong><p style="margin-top:1rem">No se pudo montar la interfaz React.</p><p style="margin-top:.5rem;opacity:.7;font-size:.8rem">Etapa: ${stage}</p><pre style="margin-top:1rem;white-space:pre-wrap;text-align:left;color:#f6c995;font-size:.75rem">${message}</pre><button onclick="location.reload()" style="margin-top:1rem;padding:.65rem 1rem;border:0;border-radius:.5rem;background:#f0a35b;color:#071a30;font-weight:700">Recargar ARKI</button></div></div>`;
  }
};

bootStage("ENTRYPOINT_LOADED");

const queryClient = new QueryClient();
const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError) || typeof window === "undefined") return;
  if (error.message === UNAUTHED_ERR_MSG) startLogin();
};
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});
queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        try {
          const raw = sessionStorage.getItem("manus-cookie");
          if (raw) {
            const prefix = `${COOKIE_NAME}=`;
            const pair = raw.split(";").find((value) => value.trim().startsWith(prefix));
            const token = pair?.trim().slice(prefix.length);
            if (token) return { Authorization: `Bearer ${token}` };
          }
        } catch {
          // sessionStorage unavailable
        }
        return {};
      },
      fetch(input, init) {
        return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
      },
    }),
  ],
});

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      console.warn("[ARKI_PWA_REGISTRATION_FAILED]", error);
    });
  });
}

bootStage("REACT_MOUNTING");
try {
  if (!root) throw new Error("#root not found");
  createRoot(root).render(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>,
  );
  queueMicrotask(() => bootStage("REACT_MOUNTED"));
} catch (error) {
  showBootError(error, root?.getAttribute("data-arki-boot-stage") ?? "UNKNOWN");
}
