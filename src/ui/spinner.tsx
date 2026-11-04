import type { ComponentProps } from "react";
import { Spinner as VicSpinner } from "../components/Spinner";

export function Spinner(props: ComponentProps<typeof VicSpinner>) {
  return <VicSpinner data-slot="spinner" label="Loading" {...props} />;
}
