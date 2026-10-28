import { Badge, type Tone } from "vic-ui";

export const title = "Tones, hairline and solid";
export const note = "A hairline badge is a standing state; a solid one asks for a hand now. The word always says it, so colour never carries it alone.";

const TONES: Array<{ tone: Tone; words: string }> = [
  { tone: "neutral", words: "Owner" },
  { tone: "moving", words: "Open" },
  { tone: "settled", words: "Paid" },
  { tone: "caution", words: "Terms changed" },
  { tone: "danger", words: "Past due" },
];

export default function Example() {
  return (
    <div className="demo-wide">
      {[{}, { solid: true }, { dot: true }].map((how, at) => (
        <div key={at} className="demo-row">
          {TONES.map((each) => (
            <Badge key={each.tone} tone={each.tone} {...how}>
              {each.words}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  );
}
