import { useEffect, useId, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { IconButton } from "../IconButton";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "../../icons/icons";

export interface FilePreviewItem {
  id: string;
  label: string;
  content: ReactNode;
}

/** V-Client's native lightbox boundary, with host-owned content and explicit focus return. */
export function FilePreviewDialog({ items, activeId, onActiveIdChange, returnFocusRef, renderActions }: {
  items: readonly FilePreviewItem[];
  activeId: string | null;
  onActiveIdChange: (id: string | null) => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  renderActions?: (item: FilePreviewItem) => ReactNode;
}) {
  const box = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const latest = useRef({ onActiveIdChange, returnFocusRef });
  latest.current = { onActiveIdChange, returnFocusRef };
  const labelId = useId();
  const index = items.findIndex(item => item.id === activeId);
  const item = index < 0 ? undefined : items[index];
  const open = item !== undefined;

  useEffect(() => {
    if (activeId !== null && !open) latest.current.onActiveIdChange(null);
  }, [activeId, open]);

  useLayoutEffect(() => {
    const dialog = box.current;
    if (!open || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    body.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      if (document.body.style.overflow === "hidden") document.body.style.overflow = previousOverflow;
      const target = latest.current.returnFocusRef?.current ?? opener;
      if (target?.isConnected) target.focus({ preventScroll: true });
    };
  }, [open]);

  useLayoutEffect(() => {
    if (open && box.current && !box.current.contains(document.activeElement)) body.current?.focus({ preventScroll: true });
  }, [activeId, open]);

  const step = (by: number) => {
    if (items.length > 1) onActiveIdChange(items[(index + by + items.length) % items.length]!.id);
  };
  const keys = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (target.closest("dialog") !== box.current) return;
    // Native modality makes the background inert; wrap Tab as well so focus never
    // leaves the preview for browser chrome when its last action is reached.
    if (event.key === "Tab") {
      const nodes = [...event.currentTarget.querySelectorAll<HTMLElement>("button,a[href],input,select,textarea,[tabindex],[contenteditable]")]
        .filter(node => (node.tabIndex >= 0 || (node.isContentEditable && !node.hasAttribute("tabindex") && !node.parentElement?.isContentEditable))
          && !node.matches(":disabled") && !node.closest("[inert],[hidden],[aria-hidden='true']") && node.getClientRects().length > 0 && getComputedStyle(node).visibility !== "hidden");
      const first = nodes[0], last = nodes.at(-1);
      if (!first) { event.preventDefault(); body.current?.focus(); }
      else if (event.shiftKey && (target === first || !nodes.includes(target))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (target === last || !nodes.includes(target))) { event.preventDefault(); first.focus(); }
      return;
    }
    // Descendant renderers keep their arrows (for example, horizontal CSV scrolling).
    if (event.shiftKey || target !== body.current) return;
    if (event.key === "ArrowLeft") { step(-1); event.preventDefault(); }
    if (event.key === "ArrowRight") { step(1); event.preventDefault(); }
  };

  return <dialog ref={box} className="ui-preview-dialog" aria-labelledby={labelId} onKeyDown={keys}
    onCancel={event => {
      if (event.target !== event.currentTarget || event.defaultPrevented) return;
      event.preventDefault(); onActiveIdChange(null);
    }}>
    {item ? <div className="ui-preview-dialog-frame">
      <header className="ui-preview-header">
        <h2 id={labelId} className="ui-preview-name">{item.label}</h2>
        <div className="ui-preview-actions">
          {items.length > 1 ? <span className="ui-preview-count" aria-live="polite">{index + 1} of {items.length}</span> : null}
          {renderActions?.(item)}
          <IconButton label="Close preview" icon={<XIcon size={18} />} onClick={() => onActiveIdChange(null)} />
        </div>
      </header>
      <div ref={body} className="ui-preview-dialog-body" tabIndex={-1} aria-label="Preview content">
        <div key={item.id} className="ui-preview-dialog-content">{item.content}</div>
      </div>
      {items.length > 1 ? <nav className="ui-preview-navigation" aria-label="Files">
        <IconButton label="Previous file" icon={<ChevronLeftIcon size={18} />} onClick={() => step(-1)} />
        <IconButton label="Next file" icon={<ChevronRightIcon size={18} />} onClick={() => step(1)} />
      </nav> : null}
    </div> : null}
  </dialog>;
}
