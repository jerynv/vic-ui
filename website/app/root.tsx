import { lazy, Suspense } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, Link, isRouteErrorResponse } from "react-router";
import { RootProvider } from "fumadocs-ui/provider/react-router";
import { Button, Toaster, TooltipProvider } from "vic-ui/ui";
import type { Route } from "./+types/root";
import SearchDialog from "./components/search";
import "./app.css";

const LocalReview = import.meta.env.DEV ? lazy(() => import("./components/local-review")) : null;

export function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning>
    <head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><Meta /><Links /></head>
    <body><RootProvider theme={{ storageKey: "vic-ui:mode" }} search={{ SearchDialog }}>
      <TooltipProvider>{children}<Toaster />{LocalReview && <Suspense fallback={null}><LocalReview /></Suspense>}</TooltipProvider>
    </RootProvider><ScrollRestoration /><Scripts /></body>
  </html>;
}

export default function App() { return <Outlet />; }

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-5 p-6">
    <h1 className="text-3xl font-semibold">{missing ? "Page not found" : "This page could not load"}</h1>
    <p className="text-muted-foreground">Explore the documentation to find a component or guide.</p>
    <Button render={<Link to="/docs" />}>Open documentation</Button>
  </main>;
}
