import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Badge } from "vic-ui";
import { contrast, resolve } from "../lib/colour";
import { written } from "../lib/tokens";

type Modes = "light" | "dark";
const MODES: Modes[] = ["light", "dark"];
const MIN = 5.8;

interface Family {
  title: string;
  line: string;
  tokens: string[];
  words?: boolean;
  /** Tokens on their way out, and what to use instead. */
  deprecated?: Record<string, string>;
}

const NEUTRALS: Family[] = [
  { title: "Words", line: "The ink of words, strongest to quietest, and words on the contrast ground.", tokens: ["--fg-strong", "--fg", "--fg-subtle", "--fg-placeholder", "--fg-inactive", "--fg-inverse"], words: true },
  { title: "Grounds", line: "The canvas, the panel on it, and the fills of fields, tints and recesses.", tokens: ["--bg-frame", "--bg-canvas", "--bg-base", "--surface-lifted", "--bg-elevated", "--bg-tint", "--bg-recessed", "--bg-control", "--bg-contrast", "--field-fill", "--field-fill-hover"], deprecated: { "--bg-elevated": "Deprecated, removed in 0.4: use --surface-lifted or --bg-recessed." } },
  { title: "Fills", line: "What lies under a thing the pointer is on, has chosen or is pressing: faint, hover, chosen and press, the same grey in both modes.", tokens: ["--fill-faint", "--fill-hover", "--fill-chosen", "--fill-press"] },
  { title: "Lines and focus", line: "The line between things, quieter rules between rows, and the keyboard's focus ring.", tokens: ["--line", "--line-hairline", "--line-soft", "--focus"] },
  { title: "Placeholders and scrollbars", line: "A shade of the ground, the light that passes over it, and the scrollbar's thumb.", tokens: ["--bone", "--bone-glint", "--scroll-thumb", "--scroll-thumb-hover"] },
];

const TONES = [
  { tone: "danger", says: "Gone wrong or being destroyed", word: "Past due" },
  { tone: "caution", says: "Read before going on", word: "Terms changed" },
  { tone: "settled", says: "Done and fine", word: "Paid" },
  { tone: "moving", says: "Under way, waiting on somebody", word: "Open" },
] as const;

const HUE_LIST = ["sky", "sage", "butter", "lilac", "clay"] as const;

const ACCENT_PARTS = [
  ["fill", "--accent"],
  ["ink", "--accent-ink"],
  ["tint", "--accent-tint"],
  ["edge", "--accent-edge"],
] as const;

const ART: Family = {
  title: "Art",
  line: "Four hues and a grain for what is drawn rather than read, only inside thumbnails, banners and illustrations and never on a control. They carry no words, so they have no contrast floor. The grain is the alpha of a dot overlay, drawn here as that alpha of the strongest ink.",
  tokens: ["--art-1", "--art-2", "--art-3", "--art-4", "--art-grain"],
};

const BUTTON_TOKENS = [
  "--ink-rim-edge",
  "--ink-rim-top",
  "--ink-rim-bottom",
  "--ink-face-top",
  "--ink-face-bottom",
  "--ink-face-top-hover",
  "--ink-face-bottom-hover",
  "--ink-face-top-press",
  "--ink-face-bottom-press",
  "--ink-words",
  "--line-rim-edge",
  "--line-rim-top",
  "--line-rim-bottom",
  "--line-rim-top-hover",
  "--line-rim-bottom-hover",
  "--line-rim-press",
  "--line-face-top",
  "--line-face-bottom",
  "--line-face-top-hover",
  "--line-face-bottom-hover",
  "--line-face-top-press",
  "--line-face-bottom-press",
];

/** Measures each pair in both modes once the page is drawn, from hidden scopes set to each mode. */
function useMeasured(pairs: Array<[string, string, string]>): { scopes: ReactNode; ratio: (key: string, mode: Modes) => number | null } {
  const light = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);
  const [ratios, setRatios] = useState<Record<string, number | null>>({});
  useLayoutEffect(() => {
    const out: Record<string, number | null> = {};
    for (const mode of MODES) {
      const scope = (mode === "light" ? light : dark).current;
      if (!scope) continue;
      for (const [key, fore, back] of pairs) out[`${key}:${mode}`] = contrast(resolve(scope, fore), resolve(scope, back));
    }
    setRatios(out);
    // The pairs are fixed for the page.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    scopes: (
      <div aria-hidden="true" className="site-scopes">
        <div ref={light} data-mode="light" />
        <div ref={dark} data-mode="dark" />
      </div>
    ),
    ratio: (key, mode) => ratios[`${key}:${mode}`] ?? null,
  };
}

function Ratio(props: { value: number | null; min?: number }) {
  if (props.value === null) return <span className="site-quiet">Translucent</span>;
  const fails = props.min !== undefined && props.value < props.min;
  return <span className={fails ? "site-ratio site-ratio-low" : "site-ratio"}>{props.value.toFixed(2)}</span>;
}

/** A token drawn in one mode, whatever mode the page is in, with the value written for it. */
function Swatch(props: { token: string; mode: Modes; words?: boolean }) {
  const value = written(props.token)[props.mode];
  return (
    <div className="site-swatch" data-mode={props.mode}>
      {props.words ? (
        <span className="site-swatch-chip site-swatch-words" style={{ color: `var(${props.token})` }}>
          Aa
        </span>
      ) : (
        <span className="site-swatch-chip" style={{ background: props.token === "--art-grain" ? "color-mix(in oklab, var(--fg-strong) calc(var(--art-grain) * 100%), transparent)" : `var(${props.token})` }} />
      )}
      <code>{value}</code>
    </div>
  );
}

/** A family of tokens, each in both modes; words are measured on their ground. */
function FamilyTable(props: { family: Family; ratio: (key: string, mode: Modes) => number | null }) {
  const { family, ratio } = props;
  return (
    <section className="site-example" aria-label={family.title}>
      <h2>{family.title}</h2>
      <p className="site-note">{family.line}</p>
      <div className="site-table-wrap">
        <table className="site-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Light</th>
              <th>Dark</th>
              {family.words ? <th className="site-num">On its ground, light and dark</th> : null}
            </tr>
          </thead>
          <tbody>
            {family.tokens.map((token) => (
              <tr key={token}>
                <td>
                  <code>{token}</code>
                  {family.deprecated?.[token] ? (
                    <>
                      {" "}
                      <small className="site-quiet">{family.deprecated[token]}</small>
                    </>
                  ) : null}
                </td>
                {MODES.map((mode) => (
                  <td key={mode}>
                    <Swatch token={token} mode={mode} {...(family.words ? { words: true } : {})} />
                  </td>
                ))}
                {family.words ? (
                  <td className="site-num">
                    <Ratio value={ratio(token, "light")} /> <span className="site-quiet">and</span> <Ratio value={ratio(token, "dark")} />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Colour() {
  const pairs: Array<[string, string, string]> = [
    ...NEUTRALS[0]!.tokens.map((token): [string, string, string] => [token, token, token === "--fg-inverse" ? "--bg-contrast" : "--bg-canvas"]),
    ...TONES.flatMap(({ tone }): Array<[string, string, string]> => [
      [`${tone}:canvas`, `--tone-${tone}-ink`, "--bg-canvas"],
      [`${tone}:panel`, `--tone-${tone}-ink`, "--bg-base"],
      [`${tone}:tint`, `--tone-${tone}-ink`, `--tone-${tone}-tint`],
      [`${tone}:on`, "--tone-on", `--tone-${tone}-ink`],
    ]),
    ["accent:canvas", "--accent-ink", "--bg-canvas"],
    ["accent:panel", "--accent-ink", "--bg-base"],
    ["accent:tint", "--accent-ink", "--accent-tint"],
    ["accent:on", "--accent-on", "--accent"],
    ["accent:on-ink", "--accent-on", "--accent-ink"],
    ...HUE_LIST.flatMap((hue): Array<[string, string, string]> => [
      [`${hue}:block`, `--hue-${hue}-ink`, `--hue-${hue}`],
      [`${hue}:canvas`, `--hue-${hue}-ink`, "--bg-canvas"],
    ]),
  ];
  const { scopes, ratio } = useMeasured(pairs);

  return (
    <article className="site-article">
      {scopes}
      <header className="site-head">
        <h1>Colour</h1>
        <p>
          One palette, written in oklch, every token a light and a dark value through <code>light-dark()</code>. Nothing writes a colour of its own: a colour the palette lacks is added here, with both values, before anything uses it. Each row below shows both modes at once; the switch at the top changes the rest of the site. Contrast is measured by this page from what the browser resolves, WCAG 2.
        </p>
      </header>

      {NEUTRALS.map((family) => (
        <FamilyTable key={family.title} family={family} ratio={ratio} />
      ))}

      <section className="site-example" aria-label="Tones">
        <h2>Tones</h2>
        <p className="site-note">
          Four colours for meaning, each an ink, a tint and an edge, keeping their meaning wherever a state is shown. A hairline badge is a standing state; a solid one asks for a hand now. No ink falls below {MIN}:1 on the canvas, the panel or its own tint, and the words on a solid tone (<code>--tone-on</code>) likewise. A tint carries strong words only. State always carries a word, never only a colour.
        </p>
        <div className="site-table-wrap">
          <table className="site-table">
            <thead>
              <tr>
                <th>Tone</th>
                <th>Light: ink, tint, edge</th>
                <th>Dark: ink, tint, edge</th>
                <th className="site-num">Ink on canvas</th>
                <th className="site-num">On panel</th>
                <th className="site-num">On its tint</th>
                <th className="site-num">Words on ink</th>
              </tr>
            </thead>
            <tbody>
              {TONES.map(({ tone, says, word }) => (
                <tr key={tone}>
                  <td>
                    <div className="site-tone-name">
                      <Badge tone={tone}>{word}</Badge>
                      <span>
                        <code>{tone}</code>
                        <small>{says}</small>
                      </span>
                    </div>
                  </td>
                  {MODES.map((mode) => (
                    <td key={mode}>
                      <div className="site-tone-chips" data-mode={mode}>
                        {["ink", "tint", "edge"].map((part) => (
                          <span key={part} className="site-swatch-chip" style={{ background: `var(--tone-${tone}-${part})` }} title={`--tone-${tone}-${part}: ${written(`--tone-${tone}-${part}`)[mode]}`} />
                        ))}
                        <Badge tone={tone} solid>
                          {word}
                        </Badge>
                      </div>
                    </td>
                  ))}
                  {(["canvas", "panel", "tint", "on"] as const).map((against) => (
                    <td key={against} className="site-num">
                      <Ratio value={ratio(`${tone}:${against}`, "light")} min={MIN} /> <span className="site-quiet">and</span> <Ratio value={ratio(`${tone}:${against}`, "dark")} min={MIN} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="site-example" aria-label="Hues">
        <h2>Hues</h2>
        <p className="site-note">
          Five colours for look, each a block (pale on light, deep on dark) and an ink dark enough for words on its own block and on the page. <code>data-hue="sage"</code> on an element hands its children <code>--hue</code> and <code>--hue-ink</code>.
        </p>
        <div className="site-hues">
          {HUE_LIST.map((hue) => (
            <div key={hue} className="site-hue">
              {MODES.map((mode) => (
                <div key={mode} className="site-hue-block" data-mode={mode} data-hue={hue}>
                  <b>{hue}</b>
                  <small>{mode}</small>
                  <code>{written(`--hue-${hue}`)[mode]}</code>
                  <code>{written(`--hue-${hue}-ink`)[mode]}</code>
                </div>
              ))}
              <p className="site-hue-ratio">
                Ink on block <Ratio value={ratio(`${hue}:block`, "light")} /> <span className="site-quiet">and</span> <Ratio value={ratio(`${hue}:block`, "dark")} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-example" aria-label="Accent">
        <h2>Accent</h2>
        <p className="site-note">
          One brand colour for a look, never a meaning: a "New" pill, a chosen mode, a send button, a switch that is on. It is not a fifth tone and says no state. <code>--accent</code> is the fill and <code>--accent-on</code> the words on it; <code>--accent-ink</code> is words and lines on the page, <code>--accent-tint</code> a pale ground and <code>--accent-edge</code> an outline. <code>tone="accent"</code> draws a piece in it, and a filled button reads <code>--button-accent</code> and <code>--button-on-accent</code> first. The ink and the words hold {MIN}:1 as the tones do.
        </p>
        <div className="site-table-wrap">
          <table className="site-table">
            <thead>
              <tr>
                <th>Accent</th>
                <th>Light: fill, ink, tint, edge</th>
                <th>Dark: fill, ink, tint, edge</th>
                <th className="site-num">Ink on canvas</th>
                <th className="site-num">On panel</th>
                <th className="site-num">On its tint</th>
                <th className="site-num">Words on fill</th>
                <th className="site-num">Words on ink</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="site-tone-name">
                    <Badge tone="accent">New</Badge>
                    <span>
                      <code>accent</code>
                      <small>A look, never a state</small>
                    </span>
                  </div>
                </td>
                {MODES.map((mode) => (
                  <td key={mode}>
                    <div className="site-tone-chips" data-mode={mode}>
                      {ACCENT_PARTS.map(([part, token]) => (
                        <span key={part} className="site-swatch-chip" style={{ background: `var(${token})` }} title={`${token}: ${written(token)[mode]}`} />
                      ))}
                      <Badge tone="accent" solid>
                        New
                      </Badge>
                    </div>
                  </td>
                ))}
                {(["canvas", "panel", "tint", "on", "on-ink"] as const).map((against) => (
                  <td key={against} className="site-num">
                    <Ratio value={ratio(`accent:${against}`, "light")} min={MIN} /> <span className="site-quiet">and</span> <Ratio value={ratio(`accent:${against}`, "dark")} min={MIN} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <FamilyTable family={ART} ratio={ratio} />

      <section className="site-example" aria-label="Buttons">
        <h2>Button rims and faces</h2>
        <p className="site-note">
          A button is a rim, a hairline edge round a gradient one pixel deep, and a face inside it, each falling top to bottom; hovering and pressing move the face's two stops. After Cult UI's Texture Button (MIT).
        </p>
        <div className="site-table-wrap">
          <table className="site-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              {BUTTON_TOKENS.map((token) => (
                <tr key={token}>
                  <td>
                    <code>{token}</code>
                  </td>
                  {MODES.map((mode) => (
                    <td key={mode}>
                      <Swatch token={token} mode={mode} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
