import { useRef, useState } from "react";
import { ProviderChoice, type ProviderKind } from "vic-ui";
import { Button } from "vic-ui";
export const title = "Host-owned provider choice";
export const note = "Selection calls the host. Confirmation content and any provider policy belong to that host.";
export default function ProvidersExample() {
  const [chosen, setChosen] = useState<ProviderKind | null>(null);
  const [show, setShow] = useState(false);
  const next = useRef<HTMLButtonElement>(null);
  return <ProviderChoice providers={["google", "apple", "microsoft"]} verb="Choose" onChoose={provider => { setChosen(provider); setShow(true); }}
    showNotice={show} noticeFocusRef={next} notice={<>
      <p>You selected {chosen ?? "a provider"}. This example makes no account request.</p>
      <Button ref={next} look="line" onClick={() => setShow(false)}>Back to choices</Button>
    </>} />;
}
