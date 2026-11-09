/* Helpers shared by parts 05-08: when a name may first be read, how a stage built part by part stays centred, and the
 * small marks these parts draw beside the shared symbols (a file, a chart, a signal, a target, an open question, a
 * patch, a refusal's bar and a point that runs a way and stops). Each is drawn from the shared primitives, so it fades
 * with its stage and the checks attribute it to the scene that draws it. */

import { ctx } from "../../canvas.js";
import { box, dot, fill, line, path, ring, stroke } from "../../drawing/strokes.js";
import { documentIcon } from "../../drawing/symbols.js";
import { named } from "../../naming/lists.js";
import { P } from "../../palette.js";
import { clamp, ease, mix } from "../../timing/easing.js";
import { travel } from "../../timing/pauses.js";

/* A name may be read up to 0.3 s before the clause that says it and at most LEAD seconds ahead of its own words, so
 * every label stands within the half second of its words that the reviews measure (EN9-n6, ZH8-3). A stage's first
 * name, when its words come a little into the clause, stands as early as that allows: `clause` is the time of the
 * clause's first word and `at` of the name's own words, and `earliest` is the time the name arrives on, which a mark
 * drawn with it takes too. */
export const LEAD = 0.45;
export const earliest = (clause, at) => Math.max(clause - 0.2, at - LEAD);
export const early = (t, clause, at) => named(t, earliest(clause, at));

/* The shift that centres the extent from x0 to x1 on the frame. */
export const centring = (x0, x1) => 960 - (x0 + x1) / 2;
/* A picture built part by part stands centred on what is on screen: it stands at the shift `first` and glides as one
 * to each next shift, over 0.9 s of voice time from just after the word that brings the part that changes its extent,
 * a structural glide (timing/pauses.js, travel). Each step is [that word's time, the shift]. */
export const glide = (t, first, steps) =>
  steps.reduce((x, [at, to]) => mix(x, to, travel(t, at + 0.05, 0.9)), first);

/* A file: a page with its corner folded and three rules. */
export function fileMark(x, y, { alpha = 1, w = 64, h = 80 } = {}) {
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 3 });
}
/* A chart: a frame with a line that rises, the picture of a result that looks good. */
export function chartMark(x, y, { alpha = 1, w = 96, h = 72 } = {}) {
  if (alpha < 0.01) return;
  box(x - w / 2, y - h / 2, w, h, { fill: P.row, stroke: P.ink, alpha, radius: 6, width: 2 });
  path(
    [
      [x - w * 0.34, y + h * 0.26],
      [x - w * 0.1, y + h * 0.02],
      [x + w * 0.1, y + h * 0.12],
      [x + w * 0.34, y - h * 0.26],
    ],
    { color: P.ink, alpha, width: 3 },
  );
}
/* A model signal: a curve that climbs over a base line. */
export function signalCurve(x, y, { alpha = 1, w = 110, h = 64 } = {}) {
  if (alpha < 0.01) return;
  line(x - w / 2, y + h / 2, x + w / 2, y + h / 2, { color: P.line, alpha, width: 2 });
  path(
    Array.from({ length: 13 }, (_, k) => {
      const q = k / 12;
      return [x - w / 2 + q * w, y + h / 2 - 8 - (h - 14) * (q * q * 0.8 + 0.12 * Math.sin(q * 9))];
    }),
    { color: P.ink, alpha, width: 3 },
  );
}
/* A specific use: a target of two rings round a point. */
export function targetMark(x, y, r, { alpha = 1, color = P.ink } = {}) {
  if (alpha < 0.01) return;
  ring(x, y, r, { color, alpha, width: 3 });
  ring(x, y, r * 0.58, { color, alpha, width: 2.5 });
  dot(x, y, r * 0.18, { color, alpha });
}
/* An open question: a dashed ring in the colour of the unknown, the mark of something not yet shown. */
export function openMark(x, y, r = 15, { alpha = 1, turn = 0 } = {}) {
  if (alpha < 0.01) return;
  dot(x, y, r, { color: P.ground, alpha });
  ring(x, y, r, {
    color: P.unknown,
    alpha,
    width: 2.5,
    dash: [5, 5],
    start: -Math.PI / 2 + turn,
  });
}
/* A patch: a square of cloth stitched over a place, the data mended by hand. */
export function patchMark(x, y, s, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  box(x - s / 2, y - s / 2, s, s, { fill: P.row, stroke: P.ink, alpha, radius: 3, width: 2.5 });
  stroke(
    () => {
      ctx.moveTo(x - s * 0.28, y - s * 0.28);
      ctx.lineTo(x + s * 0.28, y + s * 0.28);
      ctx.moveTo(x + s * 0.28, y - s * 0.28);
      ctx.lineTo(x - s * 0.28, y + s * 0.28);
    },
    { color: P.muted, alpha, width: 2 },
  );
}
/* A refusal's bar across a way, in the colour of the unknown: `vertical` stands it across a horizontal way. */
export function bar(x, y, { alpha = 1, length = 52, vertical = false, width = 4 } = {}) {
  if (vertical) line(x, y - length / 2, x, y + length / 2, { color: P.unknown, alpha, width });
  else line(x - length / 2, y, x + length / 2, y, { color: P.unknown, alpha, width });
}
/* A point that runs along a polyline from its start and stops at its end: `q` in [0, 1] is how far it has run, which
 * the caller eases. It enters by its size over its first 16 px, so it never appears at full size at its start. */
export function runPoint(points, q, { alpha = 1, color = P.unknown, r = 6 } = {}) {
  if (alpha < 0.01 || q <= 0) return;
  const legs = points.slice(1).map(([x, y], k) => Math.hypot(x - points[k][0], y - points[k][1])),
    total = legs.reduce((a, b) => a + b, 0),
    size = ease(clamp((q * total) / 16));
  let left = clamp(q) * total,
    k = 0;
  while (k < legs.length - 1 && left > legs[k]) left -= legs[k++];
  const u = legs[k] ? clamp(left / legs[k]) : 0,
    [x0, y0] = points[k],
    [x1, y1] = points[k + 1];
  dot(mix(x0, x1, u), mix(y0, y1, u), r * size, { color, alpha });
}
/* A dashed page: a document that is missing, its outline dashed and its rows not yet written. */
export function missingPage(x, y, w, h, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const c = Math.min(22, w * 0.2);
  stroke(
    () => {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w - c, y);
      ctx.lineTo(x + w, y + c);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    },
    { color: P.muted, alpha, width: 2.5, dash: [7, 7] },
  );
}
/* A soft field behind a group: a tinted panel with no outline, the field of a valid scope or a held group. */
export function field(x, y, w, h, { alpha = 1, radius = 14 } = {}) {
  if (alpha < 0.01) return;
  fill(() => ctx.roundRect(x, y, w, h, radius), { color: P.row, alpha });
}
