/* The title signature and the credits. The signature is what the cover, the opening and the credits paint: the DDWG
 * wordmark, a rule under it, the film's title in two lines (数据部门工作指南 over 精华版, or Data Department Work
 * Guidelines over The Essentials, the line break standing for the title's colon) and the author's name on the last
 * line's baseline. The wordmark, the rule and the title lines share one left edge, and the rule, the author's name and
 * the credits' note one right edge. Each edge is set on the ink of its text, as the text's own measure gives it in its
 * face and size, not on its pen position, so the edges hold in either edition's type size and at the cover's UHD scale
 * as at the frame's: the wordmark's pen stands 23 px left of its ink, where the released films set it by hand. */

import { ctx } from "../canvas.js";
import { font, line, text } from "../drawing/strokes.js";
import { P } from "../palette.js";
import { L, en, film } from "../timeline.js";
import { ramp } from "../timing/easing.js";

/* The signature's edges and its rule, as the released films draw them. */
const LEFT = 260,
  RIGHT = 1624,
  RULE = 652;
/* The wordmark's alphabetic baseline: where the released films' wordmark stands, its top 300 px down at the face's
 * 0.78 em ascent. */
const WORDMARK = { size: 300, baseline: 534, tracking: -4 };
/* Each edition's title lines: their size, the first line's alphabetic baseline (the released films centre their one
 * line on y 724) and the step to the next line, 1.5 lines. */
const TITLE = { zh: { size: 50, first: 743, step: 75 }, en: { size: 42, first: 736, step: 63 } };
const AUTHOR = "Yang HENG",
  AUTHOR_SIZE = 34,
  NOTE_SIZE = 24,
  /* The credits' note stands this far under the author's baseline. */
  NOTE_STEP = 54;

/* How far a text's ink begins and ends after its pen position, in its own face, size and tracking. */
function inkOf(v, size, bold = false, tracking = 0) {
  ctx.save();
  ctx.font = font(size, bold, v);
  ctx.letterSpacing = `${tracking}px`;
  ctx.textAlign = "left";
  const m = ctx.measureText(v);
  ctx.restore();
  return { left: -m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight };
}
/* A title text whose ink begins at x, or ends at x with `end`, on an alphabetic baseline at y. */
function titled(v, x, y, size, { end = false, bold = false, tracking = 0, ...o } = {}) {
  const ink = inkOf(v, size, bold, tracking);
  text(v, x - (end ? ink.right : ink.left), y, size, {
    ...o,
    bold,
    tracking,
    baseline: "alphabetic",
    role: "title",
  });
}

/* The signature at `alpha`, its author's name at `signed`. Returns the baseline of its last line. */
export function titleSignature(alpha, signed = alpha) {
  const lines = L(
      ["数据部门工作指南", "精华版"],
      ["Data Department Work Guidelines", "The Essentials"],
    ),
    { size, first, step } = en ? TITLE.en : TITLE.zh,
    last = first + step * (lines.length - 1);
  titled("DDWG", LEFT, WORDMARK.baseline, WORDMARK.size, {
    bold: true,
    tracking: WORDMARK.tracking,
    alpha,
  });
  // The rule's ends are square, so its ink ends on the edges, as the texts' ink does.
  line(LEFT, RULE, RIGHT, RULE, { color: P.line, width: 1, alpha, cap: "butt" });
  lines.forEach((v, i) => titled(v, LEFT, first + i * step, size, { alpha }));
  titled(AUTHOR, RIGHT, last, AUTHOR_SIZE, { end: true, alpha: signed });
  return last;
}
export function credits(t) {
  const start = film.duration - film.credits_duration;
  const last = titleSignature(ramp(t, start, 0.5), ramp(t, start + 0.2, 0.5));
  titled(L("旁白为合成语音", "Narration: synthetic voice"), RIGHT, last + NOTE_STEP, NOTE_SIZE, {
    end: true,
    color: P.muted,
    alpha: ramp(t, start + 0.1, 0.35),
  });
}
