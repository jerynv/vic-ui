import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Agentation, type Annotation } from "agentation";
import { Button } from "vic-ui";

const storageKey = "vic-ui:review:v1";
type Entry = Annotation & { page: string; title: string; mode: string; surface: string; viewport: string };

function surfaceAt(annotation: Annotation) {
  try {
    const distance = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return annotation.boundingBox ? Math.abs(rect.x - annotation.boundingBox.x)
        + Math.abs(rect.y + (annotation.isFixed ? 0 : window.scrollY) - annotation.boundingBox.y) : 0;
    };
    const target = [...document.querySelectorAll(annotation.elementPath)].sort((a, b) => distance(a) - distance(b))[0];
    return target?.closest("[data-ui-surface]")?.getAttribute("data-ui-surface") ?? "default";
  } catch { return "default"; }
}

export default function LocalReview() {
  const location = useLocation();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) setEntries(saved.filter(entry => entry && typeof entry.id === "string" && typeof entry.comment === "string" && typeof entry.page === "string"));
    } catch { setError("Saved feedback could not be read. New notes can still be downloaded."); }
  }, []);
  function save(next: Entry[]) {
    setEntries(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setError("Browser storage is unavailable. Download your review before leaving."); }
  }
  function upsert(annotation: Annotation) {
    const previous = entries.find(entry => entry.id === annotation.id);
    const context = previous ?? {
      page: window.location.pathname + window.location.search + window.location.hash,
      title: document.title,
      mode: document.documentElement.classList.contains("dark") ? "dark" : "light",
      surface: surfaceAt(annotation),
      viewport: `${window.innerWidth} × ${window.innerHeight}`,
    };
    save([...entries.filter(entry => entry.id !== annotation.id), { ...context, ...annotation }]);
  }
  function download() {
    const markdown = "# vic/ui review\n\n" + entries.map((entry, index) => [
      `## ${index + 1}. ${entry.title}`, entry.page,
      `${entry.mode} · ${entry.surface} · ${entry.viewport}`,
      entry.comment, `Element: ${entry.element}`, `Selector: ${entry.elementPath}`,
      entry.cssClasses ? `Classes: ${entry.cssClasses}` : "",
    ].filter(Boolean).join("\n\n")).join("\n\n---\n\n");
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "vic-ui-review.md";
    link.setAttribute("data-feedback-toolbar", "");
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <>
    <Agentation key={location.pathname} appName="vic/ui" identifyingAttributes={["data-slot", "data-vic-example", "aria-label"]}
      onAnnotationAdd={upsert} onAnnotationUpdate={upsert}
      onAnnotationDelete={annotation => save(entries.filter(entry => entry.id !== annotation.id))}
      onAnnotationsClear={annotations => save(entries.filter(entry => !annotations.some(annotation => annotation.id === entry.id)))} />
    {(entries.length > 0 || error) && <div data-feedback-toolbar className="fixed bottom-4 left-4 z-50 grid max-w-64 gap-2 rounded-(--radius-control) bg-background p-2 shadow-(--shadow-float)">
      {entries.length > 0 && <Button look="line" onClick={download}>Download review ({entries.length})</Button>}
      {error && <p role="status" className="text-xs">{error}</p>}
    </div>}
  </>;
}
