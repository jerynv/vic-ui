/**
 * The identity providers' own marks, in their own colours.
 *
 * Not in `icons.tsx`, which is generated from MingCute and Huge Icons by
 * `scripts/gen-icons.mjs` and says at the top not to edit it. These are not icons from
 * a set: they are other people's trademarks, drawn from each provider's published path
 * data, and a regeneration of that file must not silently redraw them.
 *
 * These are the one exception to rule 18's "no colour", and it is a deliberate one.
 * Google's and Microsoft's brand guidance requires their multicoloured marks on a
 * sign-in button, and a recoloured Google G is a misuse of the mark rather than a
 * style choice. The exception is theirs and stops at them: nothing else in the
 * application carries a hue.
 *
 * Apple is the exception to the exception. Apple's mark has no colours to be drawn in,
 * and its guidance asks for black, white or outlined, never recoloured. So it stays
 * `currentColor`, which resolves to the ink of the button it sits in: black on paper,
 * white in the dark. That is Apple's normal treatment, not a departure from it.
 *
 * See THIRD_PARTY_NOTICES.md.
 */

export interface BrandMarkProps {
  size?: number;
  className?: string;
}

/** Google's four-colour "G", from Google's own path data. */
export function GoogleMark(props: BrandMarkProps) {
  const size = props.size ?? 16;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={props.className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/**
 * The Apple mark, in the ink of whatever it sits in.
 *
 * `currentColor` on purpose. Apple ships one mark and asks for it in black or white
 * depending on the background, which is exactly what inheriting the button's colour
 * gives: near-black on the light theme, near-white on the dark one.
 */
export function AppleMark(props: BrandMarkProps) {
  const size = props.size ?? 16;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={props.className}>
      <path
        fill="currentColor"
        d="M17.05 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.9-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.4-.02 2.28-1.27 3.13-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13ZM14.48 5.13c.71-.87 1.19-2.07 1.06-3.27-1.02.04-2.26.68-3 1.54-.66.77-1.24 2-1.08 3.17 1.14.09 2.3-.58 3.02-1.44Z"
      />
    </svg>
  );
}

/** Microsoft's four squares, in Microsoft's four colours. */
export function MicrosoftMark(props: BrandMarkProps) {
  const size = props.size ?? 16;
  return (
    <svg width={size} height={size} viewBox="0 0 23 23" aria-hidden="true" focusable="false" className={props.className}>
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

export const BRAND_MARKS = {
  google: { label: "Google", Mark: GoogleMark },
  apple: { label: "Apple", Mark: AppleMark },
  microsoft: { label: "Microsoft", Mark: MicrosoftMark },
} as const;
