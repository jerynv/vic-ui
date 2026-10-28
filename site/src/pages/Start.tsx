import { Notice } from "vic-ui";
import { Code } from "../parts/Code";
import { GROUPS, PIECES } from "../registry";

const INSTALL = `npm install github:jerynv/vic-ui`;

const USE = `import "vic-ui/styles.css";
import { Button, TextField } from "vic-ui";

export function Invite() {
  return (
    <form className="invite">
      <TextField label="Email" type="email" placeholder="Enter their email" />
      <Button type="submit">Send the invitation</Button>
    </form>
  );
}`;

const ROUTER = `import { Link } from "react-router";
import { LinkProvider } from "vic-ui";

// Every \`to\` link in the library (ButtonLink, Tabs, Breadcrumbs, Sidebar, Announcement)
// is drawn with the link you hand in. Without a provider it is a plain <a href>.
<LinkProvider component={Link}>
  <App />
</LinkProvider>`;

const MODE = `<!-- Light, dark, or the device's own. No attribute follows the device too. -->
<html data-mode="light">
<html data-mode="dark">
<html data-mode="system">

<!-- Any section can be set to the other mode on its own. -->
<section data-mode="dark">...</section>`;

const SCHEME = `/* If your build lowers light-dark() (Lightning CSS, a postcss preset, older browser
   targets), it turns each one into variables that only a color-scheme declaration sets.
   vic-ui declares it on :root and on every [data-mode]; keep that declaration if you
   restyle the root, or every colour resolves to nothing. */
:root { color-scheme: light; }
[data-mode="dark"] { color-scheme: dark; }`;

const PARTS = `import "vic-ui/styles.css";   // everything: fonts, tokens, base and every piece

// or the parts, in this order, leaving out what you supply yourself:
import "vic-ui/fonts.css";       // the two @font-face rules
import "vic-ui/tokens.css";      // the custom properties
import "vic-ui/components.css";  // the base layer and every piece`;

export function Start() {
  return (
    <article className="site-article">
      <header className="site-head">
        <h1>vic-ui</h1>
        <p>
          A quiet, dense React 19 component library. {PIECES.length} pieces in {GROUPS.length} groups, one oklch palette in light and dark, one corner scale, one elevation scale, and the rule that no state ever changes the size of anything. Every piece here is live, in every state it has, with the code that draws it.
        </p>
      </header>

      <section className="site-example" aria-label="Install">
        <h2>Install</h2>
        <p className="site-note">React 19 and React DOM are peers. Floating UI positions what floats and comes with it. Tailwind is not needed: the stylesheet is plain CSS.</p>
        <Code code={INSTALL} label="Install" />
      </section>

      <section className="site-example" aria-label="Use">
        <h2>Use</h2>
        <p className="site-note">Import the stylesheet once, then the pieces. Every class starts <code>ui-</code>; a piece takes <code>className</code> for placement only, never to restyle it. The pieces sit in CSS layers, so anything you write outside a layer outranks them.</p>
        <Code code={USE} label="Use" />
        <Code code={PARTS} label="The stylesheets" />
      </section>

      <section className="site-example" aria-label="Links">
        <h2>Links to your own pages</h2>
        <Code code={ROUTER} label="Links" />
      </section>

      <section className="site-example" aria-label="Appearance">
        <h2>Light and dark</h2>
        <p className="site-note">
          Every colour is a <code>light-dark()</code> pair, resolved by the <code>color-scheme</code> of the element it is drawn on. Set <code>data-mode</code> on the root, and on any section that should read as the other mode.
        </p>
        <Code code={MODE} label="Appearance" />
        <Notice tone="caution" title="Keep color-scheme declared">
          The tokens resolve only where a colour scheme is declared, once a build has compiled them.
        </Notice>
        <Code code={SCHEME} label="Colour scheme" />
      </section>

      <section className="site-example" aria-label="How a piece takes data">
        <h2>How a piece takes data</h2>
        <dl className="site-rules">
          <div>
            <dt>Controlled, one value</dt>
            <dd>
              A piece that holds a choice takes <code>value</code> and gives <code>onValueChange(value)</code>; one that is on or off takes <code>checked</code> and gives <code>onCheckedChange(checked)</code>. Native attributes pass through.
            </dd>
          </div>
          <div>
            <dt>Lists are items</dt>
            <dd>
              A record of value to words, pairs in order, or options (<code>value</code>, <code>label</code>, <code>text</code>, <code>hint</code>, <code>start</code>, <code>disabled</code>, <code>reason</code>, <code>group</code>). The same data feeds a select, a radio group, a combobox, a menu or tabs.
            </dd>
          </div>
          <div>
            <dt>Labelled the same way</dt>
            <dd>
              A field has <code>label</code> (or <code>aria-label</code>) and <code>hint</code>. A short <code>error</code> takes the label's place; <code>name</code> posts the value with its form.
            </dd>
          </div>
          <div>
            <dt>Sizes</dt>
            <dd>
              <code>size="sm"</code> is the dense height, the norm inside an app; the default is a step taller.
            </dd>
          </div>
          <div>
            <dt>Held for a reason</dt>
            <dd>
              <code>disabledReason</code> on a control, and <code>reason</code> on an option, keep it in reach and say why it cannot be used.
            </dd>
          </div>
        </dl>
      </section>

      <section className="site-example" aria-label="Licence">
        <h2>Licence</h2>
        <p className="site-note">
          MIT for the library. The icons are Tabler (MIT) and MingCute (Apache 2.0). The two faces, Cal Sans UI and Space Mono, ship under the SIL Open Font License 1.1, with their licences in the package. The base layer is Tailwind's preflight (MIT). See THIRD_PARTY_NOTICES.md.
        </p>
      </section>
    </article>
  );
}
