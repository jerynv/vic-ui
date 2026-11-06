// v-client 64d719de call sites, compiled by package.test.mjs against the packed declarations with
// exactOptionalPropertyTypes. Stubs stand in for what is the application's own, not the library's.
import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import {
  CheckMark, ChoiceCards, Combobox, FocusFrame, FocusLayout, ProviderButtons, ProviderChoice, RadioGroup,
  Textarea, TextField, reasonOf, unlessHeld, useBlocked, useFocusFrame,
  type FocusBack, type FocusFrameWords, type FocusStep, type Option,
} from "vic-ui";

type AuthProvider = "google" | "apple" | "microsoft";
declare const session: { providers: AuthProvider[]; stepUp: AuthProvider[] } | null;

// pages/NewCall.tsx:94, :97
export function Title(props: { form: { when: string; title: string; name: string; isNewGroup: boolean; setTitle: (v: string) => void; setName: (v: string) => void } }) {
  const { form } = props;
  if (form.when === "later") {
    return <TextField id="new-call-title" look="title" aria-label="Title" value={form.title} onFocus={(event) => event.currentTarget.select()} onChange={(event) => form.setTitle(event.target.value)} />;
  }
  return <TextField id="new-call-name" look="title" aria-label="Group name" placeholder="Name the group" value={form.name} onChange={(event) => form.setName(event.target.value)} />;
}

// components/RequestDetails.tsx:30
export function Details(props: { value: { title: string }; autoFocus: boolean; patch: (next: { title: string }) => void }) {
  return <TextField size="sm" look="title" label="Title" placeholder="e.g. Review the new website" autoFocus={props.autoFocus} required minLength={3} maxLength={200} value={props.value.title} onChange={(event) => props.patch({ title: event.target.value })} />;
}

// pages/NewCall.tsx:183 (look="bare", several chosen)
export function Who(props: { items: Option[]; chosenItems: Option[]; values: string[]; typed: string; setTyped: (q: string) => void; setOpen: (o: boolean) => void; looking: boolean }) {
  const words = (key: string) => props.chosenItems.find((one) => one.value === key)?.text ?? "";
  return (
    <Combobox
      id="new-call-who"
      look="bare"
      aria-label="Who or where"
      items={props.items}
      chosenItems={props.chosenItems}
      values={props.values}
      onValuesChange={() => undefined}
      chip={(key) => {
        const one = props.chosenItems.find((item) => item.value === key);
        return (
          <>
            <span className="ui-start">{one?.start}</span>
            <span className="min-w-0 truncate">{words(key).replace(/^#/, "")}</span>
          </>
        );
      }}
      chipLabel={(key) => `Take ${words(key)} off`}
      query={props.typed}
      onQueryChange={props.setTyped}
      filter={false}
      onOpenChange={props.setOpen}
      steady
      placeholder={props.values.length > 0 ? "Add" : "A person, a group or a channel"}
      empty={props.looking ? "Looking" : "Nobody and nowhere here by that name."}
    />
  );
}

// components/Picker.tsx:80, :260, :336 (spread props, sizes "sm" | "xs", a lead)
interface RemoteSearch { onSearch: (term: string) => void; onOpen: (open: boolean) => void; more: string | null }
export function Picker<T>(props: {
  groups: { label: string; items: T[] }[]; value: T | null; onChange: (value: T | null) => void; keyOf: (item: T) => string; textOf: (item: T) => string;
  placeholder: string; label?: string; "aria-label"?: string; clarify?: string; empty: ReactNode; size?: "sm" | "xs" | "base"; disabled?: boolean; disabledReason?: string; className?: string; remote?: RemoteSearch; lead?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const as = (item: T): Option => ({ value: props.keyOf(item), label: props.textOf(item), text: props.textOf(item) });
  return (
    <>
      <Combobox
        items={props.groups.flatMap((g) => g.items.map(as))}
        chosenItems={props.value === null ? [] : [as(props.value)]}
        value={props.value === null ? null : props.keyOf(props.value)}
        onValueChange={() => undefined}
        query={term}
        onQueryChange={(next) => { setTerm(next); props.remote?.onSearch(next); }}
        filter={props.remote ? false : () => true}
        onOpenChange={(next) => { setOpen(next); props.remote?.onOpen(next); }}
        steady={Boolean(props.remote)}
        placeholder={open && props.clarify ? `${props.placeholder} ${props.clarify}` : props.placeholder}
        empty={props.empty}
        {...(props.remote?.more ? { footer: props.remote.more } : {})}
        {...(props.label ? { label: props.label } : {})}
        {...(props["aria-label"] ? { "aria-label": props["aria-label"] } : {})}
        {...(props.size === "sm" || props.size === "xs" ? { size: props.size } : {})}
        {...(props.disabled !== undefined ? { disabled: props.disabled } : {})}
        {...(props.disabledReason ? { disabledReason: props.disabledReason } : {})}
        {...(props.className ? { className: props.className } : {})}
      />
      <Combobox
        items={[]}
        value={null}
        filter={false}
        steady
        placeholder={props.placeholder}
        {...(props.lead ? { lead: props.lead } : {})}
        {...(props.size === "sm" || props.size === "xs" ? { size: props.size } : {})}
      />
      <Combobox
        items={[]}
        values={[]}
        onValuesChange={() => undefined}
        filter={false}
        steady
        placeholder={props.placeholder}
        {...(props.size === "sm" || props.size === "xs" ? { size: props.size } : {})}
      />
      {/* Forwarding an optional prop straight through, as a wrapper does. */}
      <Combobox items={[]} value={null} size={props.size === "base" ? undefined : props.size} lead={props.lead} disabledReason={props.disabledReason} disabled={props.disabled} label={props.label} aria-label={props["aria-label"]} className={props.className} placeholder={props.placeholder} />
    </>
  );
}

// components/RequestResponse.tsx:10
export function ResponseBuilder(props: { kind: string; onKind: (kind: string) => void; name: string }) {
  return <ChoiceCards size="sm" className="response-types" legend="What should they submit?" name={props.name} value={props.kind} onChange={props.onKind} items={[
    { value: "none", label: "No submission" },
    { value: "written", label: "Written answer" },
  ]} />;
}
export function Answer(props: { value: string; set: (v: string) => void; disabled: boolean }) {
  return <Textarea size="sm" count={false} grow maxRows={8} label="Answer" placeholder="Enter your answer" value={props.value} onValueChange={props.set} disabled={props.disabled} maxLength={2000} rows={2} />;
}
export function Urgency(props: { value: string; onValueChange: (v: string) => void }) {
  return <RadioGroup across legend="Urgency" value={props.value} onValueChange={props.onValueChange} items={(["low", "normal"] as const).map((value) => ({ value, label: value }))} />;
}

// pages/SignIn.tsx:39, admin/AdminApp.tsx:126, components/ProveHere.tsx:37
export function Providers() {
  return <ProviderChoice providers={session?.providers ?? []} action={(one) => `/auth/${one}/start`} verb="Continue with" />;
}
export function Ask(props: { providers: AuthProvider[]; providersBlocked: boolean }) {
  return <fieldset className="contents" disabled={props.providersBlocked} aria-label="Sign-in providers">
    <ProviderChoice key={props.providersBlocked ? "held" : "ready"} providers={props.providers} action={(one) => `/auth/${one}/start`} verb="Continue with" />
  </fieldset>;
}
export function ProviderProof(props: { next: string; onLeave?: () => void; size?: "sm" }) {
  const providers = session?.stepUp ?? [];
  return <ProviderButtons
    providers={providers}
    action={(one) => `/reverify/${one}/start?next=${encodeURIComponent(props.next)}`}
    verb="Confirm with"
    inline={props.size ? { size: props.size } : {}}
    {...(props.onLeave ? { onLeave: props.onLeave } : {})}
  />;
}

// components/CalendarRows.tsx:11 (useBlocked, reasonOf)
export const SideRow = forwardRef<HTMLButtonElement, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { icon: ReactNode; disabledReason?: string | undefined; children: ReactNode }>(function SideRow({ icon, disabled, disabledReason, children, ...rest }, ref) {
  const held = useBlocked(disabled, disabledReason, ref);
  return <><button type="button" {...rest} {...held.props} aria-describedby={[rest["aria-describedby"], reasonOf(held.props)["aria-describedby"]].filter(Boolean).join(" ") || undefined}>{icon}{children}</button>{held.node}</>;
});
export const pressed = unlessHeld<MouseEvent>(false, undefined, () => undefined);
export const mark = <CheckMark checked className="ui-date-none-mark" />;

// components/Bones.tsx:374 and pages/Demo.tsx:250
const DEMO_FIRST_STEPS: FocusStep[] = [{ words: "Pick a time", at: "now" }, { words: "Your details", at: "next" }];
export function DemoLoading(props: { children?: ReactNode }) {
  return <FocusFrame title="Book a demo" tab="Book a demo" steps={DEMO_FIRST_STEPS}>{props.children ?? null}</FocusFrame>;
}
export function DemoScreen(props: { title: string; steps: FocusStep[]; back?: FocusBack | undefined; head: ReactNode; children: ReactNode }) {
  const framed = useFocusFrame({ title: props.title, tab: props.title, steps: props.steps, back: props.back });
  if (framed) return <>{props.head}{props.children}</>;
  return <FocusLayout title={props.title} tab={props.title} steps={props.steps} {...(props.back ? { back: props.back } : {})}>{props.head}{props.children}</FocusLayout>;
}
export const words: FocusFrameWords = { title: "Book a demo" };
