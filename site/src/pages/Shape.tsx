import { written } from "../lib/tokens";

const RADII = [
  { token: "--radius-panel", use: "A panel: a card, a dialog, a sheet." },
  { token: "--radius-float", use: "What floats over a page (a menu, a popover, a tooltip) and a table's shell." },
  { token: "--radius-control", use: "A control: a button, a field, a choice. Aliased as --radius-button and --radius-field." },
  { token: "--radius-row", use: "A row or a tile inside any of those." },
  { token: "--radius-mark", use: "A mark." },
  { token: "--radius-round", use: "A pill and a face." },
];

const ELEVATION = [
  { token: "--edge", use: "A surface on the page: a card, a panel, an event. An edge and no shadow." },
  { token: "--edge-float", use: "The edge of what floats, inside both shadows." },
  { token: "--shadow-raise", use: "A small piece raised off what it sits on: a tooltip, an action bar, a knob." },
  { token: "--shadow-float", use: "Anything laid over the page: a menu, a popover, a dialog, a toast, a tray." },
];

const HEIGHTS = [
  { token: "--control-h", use: "A control's default height: a button, a field, a tab switcher." },
  { token: "--control-h-sm", use: "The dense height, the norm inside a working app." },
];

export function Shape() {
  return (
    <article className="site-article">
      <header className="site-head">
        <h1>Corners and elevation</h1>
        <p>
          One corner scale and one elevation scale, and nothing sets either of its own. <code>npm run check:design</code> reads every stylesheet and refuses a corner off the scale and a drop shadow that is not a token.
        </p>
      </header>
      <section className="site-example" aria-label="Corners">
        <h2>Corners</h2>
        <p className="site-note">Roundest for a panel, a step less for what floats, less again for a control, least for a row and a mark. A nested corner is a calc of a token, kept concentric.</p>
        <div className="site-shapes">
          {RADII.map(({ token, use }) => (
            <figure key={token} className="site-shape">
              <span className="site-shape-box" style={{ borderRadius: `var(${token})` }} />
              <figcaption>
                <code>{token}</code> <span className="site-quiet">{written(token).light}</span>
                <p>{use}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="site-example" aria-label="Elevation">
        <h2>Elevation</h2>
        <p className="site-note">A surface on the page has an edge and casts nothing. Only what floats casts a shadow, and only one of two.</p>
        <div className="site-shapes">
          {ELEVATION.map(({ token, use }) => (
            <figure key={token} className="site-shape">
              <span className="site-shape-box site-shape-lift" style={{ boxShadow: `var(${token})` }} />
              <figcaption>
                <code>{token}</code>
                <p>{use}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="site-example" aria-label="Heights">
        <h2>Control heights</h2>
        <div className="site-shapes">
          {HEIGHTS.map(({ token, use }) => (
            <figure key={token} className="site-shape">
              <span className="site-height" style={{ height: `var(${token})` }}>
                {written(token).light}
              </span>
              <figcaption>
                <code>{token}</code>
                <p>{use}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </article>
  );
}
