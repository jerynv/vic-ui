import { isValidElement, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button as VicButton } from "../components/Button";

// The composable API uses vic's actual textured button, including its rim and face.
const buttonVariants = cva("ui-button group/button", {
  variants: {
    variant: { default: "ui-button-ink", outline: "ui-button-line", secondary: "ui-button-line", ghost: "ui-button-quiet", destructive: "ui-button-ink ui-button-danger", link: "ui-button-link" },
    size: { default: "", md: "", xs: "", sm: "", lg: "ui-button-lg", icon: "ui-button-square", "icon-xs": "ui-button-square", "icon-sm": "ui-button-square", "icon-lg": "ui-button-square ui-button-lg" },
  },
  defaultVariants: { variant: "default", size: "default" },
});

type ButtonProps = Omit<ComponentProps<typeof VicButton>, "size"> & VariantProps<typeof buttonVariants>;
function Button({ variant = "default", size = "default", look, className, ...props }: ButtonProps) {
  const appearance = look ?? (variant === "outline" || variant === "secondary" ? "line" : variant === "ghost" ? "quiet" : variant === "link" ? "link" : "ink");
  const link = isValidElement<{ href?: string; to?: unknown }>(props.render) && (props.render.props.href !== undefined || props.render.props.to !== undefined);
  return <VicButton data-slot="button" {...props} nativeButton={props.nativeButton ?? !link} role={props.role ?? (link ? "link" : undefined)} look={appearance} size={size === "lg" || size === "icon-lg" ? "lg" : "md"}
    square={props.square ?? size?.startsWith("icon") ?? false} className={["group/button", variant === "destructive" ? "ui-button-danger" : "", className].filter(Boolean).join(" ")} />;
}

export { Button, buttonVariants };
