import { ButtonLink, Empty } from "vic-ui";

export function NotFound() {
  return (
    <Empty size="page" title="Nothing is here" line="The address names no page of the system. Start from the beginning, or search the contents." action={<ButtonLink href="#/start">Getting started</ButtonLink>} />
  );
}
