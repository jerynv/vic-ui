// Every corner is on the one scale in `src/styles/tokens.css`, or it says so.
//
// A corner is a token (`--radius-panel`, `-float`, `-control`, `-row`, `-mark`, `-round`, and
// the `-button` and `-field` aliases), a calc of one for a nested corner kept concentric, `0`,
// `inherit`, or `50%` for a true circle. This reads every stylesheet under `src` and `site/src`, and
// every Tailwind `rounded-*` class in a component, and lists each corner that is none of those.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SOURCES = [join(root, "src"), join(root, "site", "src")];
const SCALE = ["panel", "float", "control", "row", "mark", "round", "button", "field"];
const TOKEN = new RegExp(`^var\\(--radius-(?:${SCALE.join("|")})\\)$`);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path, out);
    } else out.push(path);
  }
  return out;
}

/** One corner's value: a token, a calc whose only variable is a token, or a fixed word. */
function cornerAllowed(part) {
  if (part === "0" || part === "inherit" || part === "50%") return true;
  if (TOKEN.test(part)) return true;
  if (part.startsWith("calc(")) {
    const vars = part.match(/var\([^)]*\)/g) ?? [];
    return vars.length > 0 && vars.every((v) => TOKEN.test(v)) && /^calc\([\s\d.+\-*/()a-z%]*\)$/.test(part.replace(/var\([^)]*\)/g, "0"));
  }
  return false;
}

/** A whole value, which may name up to four corners and an elliptical second half. */
function valueAllowed(value) {
  const parts = value.replace(/\s*\/\s*/g, " ").match(/calc\((?:[^()]|\([^()]*\))*\)|\S+/g) ?? [];
  return parts.length > 0 && parts.every(cornerAllowed);
}

const files = SOURCES.filter((dir) => existsSync(dir)).flatMap((dir) => walk(dir));
const found = [];

for (const file of files.filter((f) => f.endsWith(".css"))) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, at) => {
    const match = line.match(/^\s*(border(?:-[a-z]+)*-radius)\s*:\s*([^;]+);?/);
    if (match && !valueAllowed(match[2].trim().replace(/\s*!important$/, ""))) {
      found.push(`${relative(root, file)}:${at + 1}  ${match[1]}: ${match[2].trim()}`);
    }
  });
}

// Tailwind's own sizes (`rounded-lg`, `rounded-[0.625rem]`) are a corner of their own. The scale
// lives on `:root` rather than in `@theme`, so there is no `rounded-panel`; a component names the
// token, `rounded-(--radius-panel)`, and a bare `rounded-panel` (which draws nothing) is refused.
const UTILITY = new RegExp(`(?<![\\w-])rounded(?:-(?:t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee))?(?:-[^\\s"'\`}]+)?(?![\\w-])`, "g");
const UTILITY_OK = new RegExp(`^rounded(?:-(?:t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee))?-(?:none|inherit|\\[inherit\\]|\\[50%\\]|\\(--radius-(?:${SCALE.join("|")})\\)|\\[var\\(--radius-(?:${SCALE.join("|")})\\)\\]|\\[calc\\(var\\(--radius-(?:${SCALE.join("|")})\\)[\\d.+\\-*/_a-z%]*\\)\\])$`);
// A placeholder that stands in for the front page's own piece draws that piece's corner, and
// says so on one of the two lines above it.
const FRONT_PAGE = "The front page's own corner";

for (const file of files.filter((f) => f.endsWith(".tsx"))) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, at) => {
    if (lines.slice(Math.max(0, at - 2), at).some((above) => above.includes(FRONT_PAGE))) return;
    // Only what is inside a string or a template can be a class name.
    for (const literal of line.match(/"[^"]*"|`[^`]*`|'[^']*'/g) ?? []) {
      for (const util of literal.match(UTILITY) ?? []) {
        const bare = util.replace(/^.*:/, "");
        if (bare === "rounded" && !/className|class=|cn\(|"[^"]*\brounded\b[^"]*\b(?:flex|block|grid|p-|px-|bg-)/.test(line)) continue;
        if (!UTILITY_OK.test(bare)) found.push(`${relative(root, file)}:${at + 1}  ${bare}`);
      }
    }
  });
}

if (found.length) {
  console.error(`${found.length} corner${found.length === 1 ? " is" : "s are"} off the scale (src/styles/tokens.css):`);
  for (const line of found) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Every corner is on the scale.");
