import { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";

const join = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(" ");
type DivProps = HTMLAttributes<HTMLDivElement>;
type HeadingProps = Omit<DivProps, "title"> & {
  title: ReactNode;
  titleId?: string | undefined;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: 2 | 3 | 4 | undefined;
};
export type SettingsSectionProps = HeadingProps;
export type SettingsGroupProps = HeadingProps & { surface?: "flat" | "bordered" };

function Heading({ title, titleId, description, actions, headingLevel = 2 }: Pick<HeadingProps, "title" | "titleId" | "description" | "actions" | "headingLevel">) {
  const Tag = headingLevel === 4 ? "h4" : headingLevel === 3 ? "h3" : "h2";
  return <div className="ui-settings-heading">
    <div className="ui-settings-heading-words">
      <Tag id={titleId} className="ui-settings-title">{title}</Tag>
      {description != null && <div className="ui-settings-description">{description}</div>}
    </div>
    {actions != null && <div className="ui-settings-actions">{actions}</div>}
  </div>;
}

/** A titled section; headings provide structure without adding a landmark per group. */
export const SettingsSection = forwardRef<HTMLDivElement, SettingsSectionProps>(function SettingsSection({ title, titleId, description, actions, headingLevel, className, children, ...rest }, ref) {
  return <div {...rest} ref={ref} className={join("ui-settings-section", className)}>
    <Heading {...{ title, titleId, description, actions, headingLevel }} />
    {children}
  </div>;
});

/** Related rows with an optional border, without introducing a card or a shadow. */
export const SettingsGroup = forwardRef<HTMLDivElement, SettingsGroupProps>(function SettingsGroup({ title, titleId, description, actions, headingLevel = 3, surface = "bordered", className, children, ...rest }, ref) {
  return <div {...rest} ref={ref} className={join("ui-settings-group", className)} data-surface={surface}>
    <Heading {...{ title, titleId, description, actions, headingLevel }} />
    <div className="ui-settings-group-body">{children}</div>
  </div>;
});

export interface SettingsRowProps extends DivProps {
  label: ReactNode;
  labelId?: string;
  htmlFor?: string;
  description?: ReactNode;
  descriptionId?: string;
  stacked?: boolean;
  align?: "center" | "start";
}

/** Label and control wrap according to their available container width. */
export const SettingsRow = forwardRef<HTMLDivElement, SettingsRowProps>(function SettingsRow({ label, labelId, htmlFor, description, descriptionId, stacked, align = "center", className, children, ...rest }, ref) {
  const made = useId();
  return <div {...rest} ref={ref} className={join("ui-settings-row", className)} data-stacked={stacked || undefined} data-align={align}>
    <div className="ui-settings-row-words">
      {htmlFor ? <label id={labelId ?? `${made}-label`} htmlFor={htmlFor} className="ui-settings-label">{label}</label> : <span id={labelId ?? `${made}-label`} className="ui-settings-label">{label}</span>}
      {description != null && <div id={descriptionId} className="ui-settings-description">{description}</div>}
    </div>
    <div className="ui-settings-row-control">{children}</div>
  </div>;
});

export interface SettingsLayoutProps extends DivProps {
  navigation?: ReactNode;
  navigationLabel?: string;
  actions?: ReactNode;
}

/** Host-owned navigation, detail children and trailing actions. No routing or selection state. */
export const SettingsLayout = forwardRef<HTMLDivElement, SettingsLayoutProps>(function SettingsLayout({ navigation, navigationLabel = "Settings", actions, className, children, ...rest }, ref) {
  return <div {...rest} ref={ref} className={join("ui-settings-layout", className)}>
    <div className="ui-settings-layout-grid" data-navigation={navigation != null || undefined}>
      {navigation != null && <nav className="ui-settings-navigation" aria-label={navigationLabel}>{navigation}</nav>}
      <div className="ui-settings-detail">
        {children}
        {actions != null && <div className="ui-settings-actions ui-settings-layout-actions">{actions}</div>}
      </div>
    </div>
  </div>;
});
