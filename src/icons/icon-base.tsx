import type { SVGProps } from "react";

/**
 * An icon, drawn from a shape the generator copied out of an icon set (see
 * scripts/gen-icons.mjs), with the same props the application used before: a size, and
 * a weight, of which only "fill" changes anything, drawing the filled twin where there is
 * one. Coloured by the text around it.
 *
 * The shapes are fixed markup from installed packages, written into the source at build
 * time. Nothing anybody types reaches them, so setting them as inner markup puts no
 * words of anybody's into the page.
 */

export interface IconShape {
  body: string;
  width: number;
  height: number;
}

export interface IconShapes {
  line: IconShape;
  fill: IconShape | null;
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref" | "children" | "dangerouslySetInnerHTML"> {
  size?: number | string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

export type Icon = ((props: IconProps) => React.JSX.Element) & { displayName?: string };

export function makeIcon(name: string, shapes: IconShapes): Icon {
  function Glyph({ size = "1em", weight, ...rest }: IconProps) {
    const shape = weight === "fill" && shapes.fill ? shapes.fill : shapes.line;
    const labelled = rest["aria-label"] !== undefined || rest["aria-labelledby"] !== undefined;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={`0 0 ${shape.width} ${shape.height}`}
        fill="currentColor"
        focusable="false"
        aria-hidden={labelled ? undefined : true}
        {...rest}
        dangerouslySetInnerHTML={{ __html: shape.body }}
      />
    );
  }
  Glyph.displayName = name;
  return Glyph;
}
