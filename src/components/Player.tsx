import type { Ref } from "react";

/**
 * A recording played in the browser's own player, its controls and all: a picture across the
 * width it is given, no taller than most of the window, on the tint behind it until it loads,
 * or sound alone (`audio`) as the bare control. `onTime` is told where it is, in milliseconds,
 * once it has played or been moved, and `onError` when the browser cannot play it, for the
 * caller to offer the download instead.
 */
export function Player(props: { src: string; audio?: boolean; onTime?: (ms: number) => void; onError?: () => void; "aria-label"?: string; ref?: Ref<HTMLVideoElement & HTMLAudioElement> }) {
  const follow = (media: HTMLMediaElement) => {
    if (media.currentTime > 0 || !media.paused) props.onTime?.(media.currentTime * 1000);
  };
  const common = {
    ref: props.ref,
    className: "ui-player",
    controls: true,
    preload: "metadata",
    src: props.src,
    "aria-label": props["aria-label"],
    onTimeUpdate: (event: { currentTarget: HTMLMediaElement }) => follow(event.currentTarget),
    onPlay: (event: { currentTarget: HTMLMediaElement }) => follow(event.currentTarget),
    onError: () => props.onError?.(),
  } as const;
  return props.audio ? <audio {...common} data-audio="" /> : <video {...common} playsInline />;
}
