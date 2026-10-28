import { createContext, useContext, type AnchorHTMLAttributes, type ComponentType, type ReactNode, type Ref } from "react";

/**
 * What a piece draws for a link to a page of the consumer's own app (`to`): a plain `<a href>`
 * unless a router's link is handed in through `LinkProvider`. Links anywhere else (`href`) are
 * always a plain anchor.
 *
 *   import { Link as RouterLink } from "react-router";
 *   <LinkProvider component={RouterLink}>...</LinkProvider>
 */
export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: string; state?: unknown; ref?: Ref<HTMLAnchorElement> };

export type LinkComponent = ComponentType<LinkProps>;

function PlainLink({ to, state: _state, ...rest }: LinkProps) {
  return <a href={to} {...rest} />;
}

const LinkContext = createContext<LinkComponent>(PlainLink);

/** Hands every piece in it the link component to draw `to` links with. */
export function LinkProvider(props: { component: LinkComponent; children: ReactNode }) {
  return <LinkContext.Provider value={props.component}>{props.children}</LinkContext.Provider>;
}

/** The link the nearest `LinkProvider` supplies, or a plain anchor. */
export function Link(props: LinkProps) {
  const Component = useContext(LinkContext);
  return <Component {...props} />;
}
