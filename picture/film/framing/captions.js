/* The single-line captions. From ddwg-film v1.0.0 (c4e8aac), picture/film.js. */

import { text } from "../drawing/strokes.js";
import { P } from "../palette.js";
import { film } from "../timeline.js";
import { ramp } from "../timing/easing.js";

/* Cues closer than this are lines of one speech: the earlier holds through the gap and the next replaces it in place,
 * so the caption band does not blink to ground between them. A cue fades only beside a longer quiet. */
const CAPTION_JOIN = 0.3;
/* A Chinese line that ends on a full-width mark is centred on its ink, not on its advance: the mark's empty half hangs
 * outside the centring width, the engine's own convention (half the mark, 0.25 em at 26 px). A line that opens on a
 * full-width mark hangs it on the left in the same way. English lines do not hang. */
const HANGING =
  /[\u4e00-\u9fff].*[\u3001\uff0c\u3002\uff1b\uff1a\uff01\uff1f\uff09\u300d\u300f\u201d\u300b\u3011]$/u;
const OPENING = /^[\uff08\u300c\u300e\u201c\u300a\u3010].*[\u4e00-\u9fff]/u;
const HUNG_SHIFT = 6.5;
export function caption(t) {
  const caps = film.captions;
  const joined = (a, b) => a && b && b.start - a.end <= CAPTION_JOIN;
  let i = caps.findIndex((v) => v.start <= t && t < v.end);
  if (i < 0)
    i = caps.findIndex((v, k) => v.end <= t && t < caps[k + 1]?.start && joined(v, caps[k + 1]));
  if (i < 0) return;
  const c = caps[i];
  const a =
    (joined(caps[i - 1], c) ? 1 : ramp(t, c.start - 0.04, 0.12)) *
    (joined(c, caps[i + 1]) ? 1 : 1 - ramp(t, c.end - 0.1, 0.1));
  const line = (c.display_text ?? c.text).trim();
  const x = 960 + (HANGING.test(line) ? HUNG_SHIFT : 0) - (OPENING.test(line) ? HUNG_SHIFT : 0);
  text(line, x, 970, 26, {
    align: "center",
    color: P.ink,
    alpha: 0.94 * Math.max(a, 0.001),
    role: "caption",
  });
}
