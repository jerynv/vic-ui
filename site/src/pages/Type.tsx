import { written } from "../lib/tokens";

const SCALE = [
  { token: "--text-tag", use: "A tag, a count, the smallest words drawn. Nothing is smaller than 11px." },
  { token: "--text-meta", use: "A hint under a field, a time, a line under a row." },
  { token: "--text-ui", use: "Labels, rows, buttons and table cells: the chrome's own words." },
  { token: "--text-read", use: "Words to read, and what is typed into a field." },
  { token: "--text-lead", use: "A value under its label, a dialog's title." },
];

const FACES = [
  { token: "--font-sans", use: "Everything: Cal Sans UI at the default GEOM." },
  { token: "--font-display", use: "Statements and dialog titles: the same face at GEOM 100." },
  { token: "--font-wordmark", use: "Space Mono Bold, for a wordmark and nothing else." },
  { token: "--font-code", use: "The device's own fixed width face, for code. No font is shipped for it." },
];

export function Type() {
  return (
    <article className="site-article">
      <header className="site-head">
        <h1>Type</h1>
        <p>
          One face reads the whole interface, set on one working scale. Hierarchy is weight (600 for a label, 400 for its value) and size, never capitals or letter spacing: every label, eyebrow, caption, table head, placeholder and button is in sentence case. No state changes a weight or a size.
        </p>
      </header>
      <section className="site-example" aria-label="The working scale">
        <h2>The working scale</h2>
        <div className="site-table-wrap">
          <table className="site-table">
            <thead>
              <tr>
                <th>Token</th>
                <th className="site-num">Size</th>
                <th className="site-num">Line</th>
                <th>Sample</th>
              </tr>
            </thead>
            <tbody>
              {SCALE.map(({ token, use }) => (
                <tr key={token}>
                  <td>
                    <code>{token}</code>
                  </td>
                  <td className="site-num">
                    <code>{written(token).light}</code>
                  </td>
                  <td className="site-num">
                    <code>{written(`${token}--line-height`).light}</code>
                  </td>
                  <td>
                    <span style={{ fontSize: `var(${token})`, lineHeight: `var(${token}--line-height)` }}>{use}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="site-example" aria-label="Faces">
        <h2>Faces</h2>
        <div className="site-faces">
          {FACES.map(({ token, use }) => (
            <div key={token} className="site-face">
              <span className="site-face-sample" style={{ fontFamily: `var(${token})`, fontVariationSettings: token === "--font-display" ? '"GEOM" 100' : undefined, fontWeight: token === "--font-wordmark" ? 700 : 500 }}>
                Who changed this, and when
              </span>
              <code>{token}</code>
              <p>{use}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="site-example" aria-label="Weights">
        <h2>Weights</h2>
        <div className="site-weights">
          {[300, 400, 500, 600, 700].map((weight) => (
            <span key={weight} style={{ fontWeight: weight }}>
              {weight} Requests waiting on you
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
