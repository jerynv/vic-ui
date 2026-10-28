const RULES: Array<{ title: string; body: string }> = [
  { title: "Least first", body: "Build the least thing that works, then stop. No container, card, panel, icon tile or numbered list unless the content has parts. Reuse a pattern before inventing a composition. Cutting is not a failure." },
  { title: "State never changes size", body: "Hover, press, focus, chosen, open and current never change a weight, a size or the letter spacing. Colour, fill, a ring or a shadow carries the change, so nothing in a row reflows." },
  { title: "Every piece answers", body: "Every interactive piece has an eased hover, a press and a focus ring." },
  { title: "Disabled says why", body: "A disabled control is dimmed to 0.55, still readable, with a not-allowed pointer. Where the page knows why, it passes disabledReason: the control stays focusable and hoverable and says the reason in a tooltip, on hover after a pause or on focus, never on load and never modal." },
  { title: "One ink button", body: "The filled, bevelled ink button is for a page's one committing action. Navigation, menus, filters and toggles are line, quiet or square icon buttons, or tabs." },
  { title: "Fields are filled", body: "A box to type into is a filled surface a step off the ground, with no border. It draws no focus ring: the caret says where focus is. Buttons, tabs, checks and switches keep a ring the keyboard alone shows." },
  { title: "Errors take the label's place", body: "A short error is drawn in the danger ink where the label was, stacked with it in one cell, and rings the box, so an error coming or going moves nothing. A refusal longer than that is a notice at the top of the form." },
  { title: "Dense by default", body: "Inside a working app the dense control height (--control-h-sm, 2rem) is the norm; the default (--control-h, 2.25rem) is for a way in and a page's header." },
  { title: "Sentence case", body: "Every label, eyebrow, caption, table head, placeholder and button is written and drawn in sentence case, never capitals. Hierarchy is weight and size, never text-transform." },
  { title: "Nothing under 11px", body: "Below 11px a word is a texture. The scale starts at --text-tag." },
  { title: "Colour from the palette", body: "Every colour comes from tokens.css and is written in oklch. A colour the palette lacks is added there, with a light and a dark value, before anything uses it. Nothing writes a colour inline." },
  { title: "Tones keep their meanings", body: "Danger for what has gone wrong or is being destroyed; caution for what must be read before going on; settled for what is done and fine; moving for what is under way and waiting on somebody else. State always carries a word, never only a colour." },
  { title: "Contrast is measured", body: "No tone ink falls below 5.8:1 on either canvas, the panel or its own tint, and the words on a solid tone likewise. The Colour page measures every pair live." },
  { title: "One corner scale", body: "Panel, float, control, row, mark and round. Nothing sets a corner of its own; a nested corner is a calc of a token. scripts/check-radius.mjs holds it." },
  { title: "Surfaces cast nothing", body: "A surface on the page has an edge (--edge) and no shadow. Only what floats casts one: --shadow-raise for a small raised piece, --shadow-float for anything over the page. scripts/check-shadows.mjs holds it." },
  { title: "Floating is in the top layer", body: "A list, a menu, a popover and a tooltip open in the top layer, positioned by Floating UI, so a dialog cannot clip them and a press inside one is not a press outside the dialog." },
  { title: "Nothing moves", body: "Loading, choosing and pressing never move what somebody is looking at. A placeholder is the page's own shape; a region whose words change reserves the longest; a floating surface keeps its size from opening; movement is fixed, never hidden behind a fade." },
  { title: "Words", body: "Declarative and plain. A refusal says what to do next, not what a validator wanted. No em or en dashes as punctuation anywhere: npm run check:dashes holds it." },
];

export function Rules() {
  return (
    <article className="site-article">
      <header className="site-head">
        <h1>Rules</h1>
        <p>What every piece already does, and what anything built with them is held to.</p>
      </header>
      <dl className="site-rules">
        {RULES.map((rule) => (
          <div key={rule.title}>
            <dt>{rule.title}</dt>
            <dd>{rule.body}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
