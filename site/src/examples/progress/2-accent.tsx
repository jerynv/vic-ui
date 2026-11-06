import { Progress } from "vic-ui";

export const title = "In the accent";
export const note = "tone=\"accent\" draws the bar in the brand colour, for a quota or an onboarding run that says no state. A state that matters takes its tone instead.";

export default function Example() {
  return (
    <div className="demo-stack">
      <Progress label="Messages this month" value={64} valueText="64 of 100" tone="accent" />
      <Progress label="Setting up your workspace" value={3} max={5} valueText="Step 3 of 5" tone="accent" size="sm" />
    </div>
  );
}
