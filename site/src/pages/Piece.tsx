import { examplesOf } from "../examples";
import { Code } from "../parts/Code";
import type { Piece } from "../registry";

/** One piece: what it is, what it exports, and each of its states live with the code that draws it. */
export function PiecePage(props: { piece: Piece }) {
  const { piece } = props;
  const examples = examplesOf(piece.id);
  return (
    <article className="site-article">
      <header className="site-head">
        <h1>{piece.name}</h1>
        <p>{piece.summary}</p>
        <dl className="site-facts">
          <div>
            <dt>Exports</dt>
            <dd>
              {piece.exports.map((name) => (
                <code key={name}>{name}</code>
              ))}
            </dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>
              <code>src/components/{piece.file}</code>
            </dd>
          </div>
        </dl>
      </header>
      {examples.map(({ key, title, note, Demo, code }) => (
        <section key={key} className="site-example" aria-label={title}>
          <h2>{title}</h2>
          {note ? <p className="site-note">{note}</p> : null}
          <div className="site-demo">
            <Demo />
          </div>
          <Code code={code} label={`${title}, code`} />
        </section>
      ))}
    </article>
  );
}
