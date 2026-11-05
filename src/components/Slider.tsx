import { Slider as Primitive } from "@base-ui/react/slider";
import { DirectionProvider, useDirection } from "@base-ui/react/direction-provider";
import { forwardRef, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange" | "dir"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Page Up/Down and Shift+Arrow increment; defaults to ten steps. */
  largeStep?: number;
  disabled?: boolean;
  name?: string;
  form?: string;
  label?: ReactNode;
  hint?: ReactNode;
  valueText?: string | ((value: number) => string);
  /** Overrides the track's paint and hides the filled indicator. */
  trackStyle?: CSSProperties;
  /** A track press steps toward the pointer by default. Dragging always follows it. */
  trackPress?: "step" | "jump";
  /** Inherits the enclosing Base UI DirectionProvider when omitted. */
  dir?: "ltr" | "rtl";
}

// Keep decimal step grids free of floating-point dust, including exponent notation.
function precision(value: number) {
  const [fraction = "", exponent = "0"] = String(value).split("e");
  return Math.max(0, (fraction.split(".")[1]?.length ?? 0) - Number(exponent));
}

// Correct a one-ULP division error at a half-step before rounding to the grid.
function nearestStep(count: number) {
  return Math.round(count + Number.EPSILON * Math.max(1, Math.abs(count)));
}

/** One horizontal numeric value. The ref reaches Base UI's focusable range input. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider({
  value, defaultValue, onValueChange, onValueCommitted, min = 0, max = 100, step = 1,
  largeStep = step * 10, disabled = false, name, form, label, hint, valueText, trackStyle,
  trackPress = "step", dir, className, "aria-label": ariaLabel, "aria-labelledby": labelledBy,
  "aria-describedby": describedBy, onPointerDownCapture, ...rest
}, ref) {
  const inheritedDirection = useDirection();
  const direction = dir ?? inheritedDirection;
  const made = useId();
  const thumb = useRef<HTMLDivElement>(null);
  const [ownValue, setOwnValue] = useState(defaultValue ?? min);
  const current = Math.min(max, Math.max(min, value ?? ownValue));
  function change(next: number) {
    if (disabled || next === current) return;
    if (value === undefined) setOwnValue(next);
    onValueChange?.(next);
  }
  return (
    <DirectionProvider direction={direction}>
      <Primitive.Root<number>
        {...rest}
        dir={direction}
        className={["ui-slider", className].filter(Boolean).join(" ")}
        value={current}
        min={min} max={max} step={step} largeStep={largeStep}
        disabled={disabled} name={name} form={form}
        thumbAlignment="edge"
        onValueChange={change}
        onValueCommitted={(next) => onValueCommitted?.(next)}
        onPointerDownCapture={(event) => {
          onPointerDownCapture?.(event);
          if (event.defaultPrevented || disabled || trackPress === "jump" || event.button !== 0 || !event.isPrimary) return;
          const control = event.currentTarget.querySelector<HTMLElement>(".ui-slider-control");
          if (!control?.contains(event.target as Node) || thumb.current?.contains(event.target as Node)) return;
          event.preventDefault();
          event.stopPropagation();
          const box = control.getBoundingClientRect();
          const inset = (thumb.current?.getBoundingClientRect().width ?? 24) / 2;
          const width = box.width - inset * 2;
          if (width <= 0) return;
          let fraction = Math.min(1, Math.max(0, (event.clientX - box.left - inset) / width));
          if (direction === "rtl") fraction = 1 - fraction;
          const target = min + fraction * (max - min);
          const by = (max - min) / step <= 25 ? step : Math.max(step, nearestStep((max - min) / 20 / step) * step);
          const toward = Math.abs(target - current) <= by ? target : current + Math.sign(target - current) * by;
          const snapped = min + nearestStep((toward - min) / step) * step;
          const next = Math.min(max, Math.max(min, Number(snapped.toFixed(Math.min(100, Math.max(precision(min), precision(step)))))));
          change(next);
          if (next !== current) onValueCommitted?.(next);
          thumb.current?.querySelector("input")?.focus({ preventScroll: true });
        }}
      >
        {label != null && <span id={`${made}-label`} className="ui-field-label">{label}</span>}
        <Primitive.Control className="ui-slider-control">
          <Primitive.Track className="ui-slider-track" style={trackStyle}>
            {!trackStyle && <Primitive.Indicator className="ui-slider-fill" />}
          </Primitive.Track>
          <Primitive.Thumb
            ref={thumb} inputRef={ref} className="ui-slider-thumb"
            aria-label={ariaLabel}
            aria-labelledby={labelledBy ?? (label != null ? `${made}-label` : undefined)}
            aria-describedby={[describedBy, hint != null ? `${made}-hint` : undefined].filter(Boolean).join(" ") || undefined}
            aria-valuetext={typeof valueText === "string" ? valueText : undefined}
            getAriaValueText={typeof valueText === "function" ? (_formatted, next) => valueText(next) : undefined}
          >
            <span className="ui-slider-thumb-visual" aria-hidden="true" />
          </Primitive.Thumb>
        </Primitive.Control>
        {hint != null && <div id={`${made}-hint`} className="ui-slider-hint">{hint}</div>}
      </Primitive.Root>
    </DirectionProvider>
  );
});
