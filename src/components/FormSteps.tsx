import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";

/** Reached steps stay editable; upcoming steps describe themselves without skipping validation. */
export function FormSteps<T extends string>({ steps, current, reached, onChoose, disabled }: { steps: readonly { value: T; label: string; description?: string; marker?: string }[]; current: T; reached: ReadonlySet<T>; onChoose: (step: T) => void; disabled?: boolean }) {
  const at = steps.findIndex((one) => one.value === current);
  const reduce = useReducedMotion();
  // Motion's position-only layout animation preserves the circles while the active slot expands.
  // https://motion.dev/docs/react-layout-animations
  const travel = { duration: reduce ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] as const };
  return <nav aria-label="Form steps" className="ui-form-steps"><ol>
    {steps.map((one, index) => <motion.li layout={reduce ? false : "position"} transition={{ layout: travel }} key={one.value} data-current={current === one.value ? "" : undefined} data-complete={index < at ? "" : undefined} data-branch={one.marker?.includes(".") ? "" : undefined}>
      <Tooltip content={<><strong>{one.label}</strong>{one.description ? <span className="ui-form-step-description">{one.description}</span> : null}{!reached.has(one.value) ? <span className="ui-form-step-description">Complete the earlier steps first.</span> : null}</>}>
        <Button look="quiet" aria-current={current === one.value ? "step" : undefined} aria-label={`Step ${one.marker ?? index + 1}: ${one.label}${index < at ? ", completed" : ""}`} aria-disabled={disabled || !reached.has(one.value)} onClick={() => { if (!disabled && reached.has(one.value)) onChoose(one.value); }}>
          <span className="ui-form-step-mark" aria-hidden="true">{one.marker ?? index + 1}</span>
        </Button>
      </Tooltip>
      <AnimatePresence initial={false}>
        {current === one.value ? <motion.span key={one.value} className="ui-form-step-label" aria-hidden="true" initial={{ opacity: 0, x: reduce ? 0 : 8 }} animate={{ opacity: 1, x: 0, transition: { ...travel, delay: reduce ? 0 : 0.12 } }} exit={{ opacity: 0, x: reduce ? 0 : -6, transition: { duration: reduce ? 0 : 0.14 } }}><span>{one.label}</span></motion.span> : null}
      </AnimatePresence>
    </motion.li>)}
  </ol></nav>;
}
