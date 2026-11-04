/* The marks of part 04, each one connected mark about the point it is given, fading with `alpha`. The four boundaries'
 * field is four separate side strokes with open corners, never one closed outline: its unlit sides are one stroke in the
 * line colour and its lit sides one stroke in the colour of authority, so a field stays one mark however many of its
 * sides are lit. */

import { ctx } from "../../canvas.js";
import { box, dot, fill, line, ring, stroke } from "../../drawing/strokes.js";
import { documentIcon } from "../../drawing/symbols.js";
import { blend } from "../../drawing/colour.js";
import { P } from "../../palette.js";
import { clamp } from "../../timing/easing.js";

/* The four sides of a field w by h about (cx, cy), in reading order (top, right, bottom, left), each drawn from its
 * start corner to its end, a gap short of each corner. */
function sidesOf(cx, cy, w, h, gap) {
  const l = cx - w / 2,
    r = cx + w / 2,
    t = cy - h / 2,
    b = cy + h / 2;
  return [
    [
      [l + gap, t],
      [r - gap, t],
    ],
    [
      [r, t + gap],
      [r, b - gap],
    ],
    [
      [r - gap, b],
      [l + gap, b],
    ],
    [
      [l, b - gap],
      [l, t + gap],
    ],
  ];
}
/* A field: `drawn` gives each side's drawn share (a side counts in as it draws on), `lit` how far each side has turned
 * to the colour of authority. Sides at rest share one stroke per colour; a side turning is drawn on its own for the
 * moment it blends, so no side snaps from one colour to the other. */
export function field(
  cx,
  cy,
  w,
  h,
  { alpha = 1, drawn = [1, 1, 1, 1], lit = [0, 0, 0, 0], gap = 16, width = 4 } = {},
) {
  if (alpha < 0.01) return;
  const sides = sidesOf(cx, cy, w, h, gap),
    shown = sides.map((_, k) => k).filter((k) => drawn[k] > 0);
  const paint = (ks, color) => {
    if (!ks.length) return;
    stroke(
      () =>
        ks.forEach((k) => {
          const [[x0, y0], [x1, y1]] = sides[k],
            q = clamp(drawn[k]);
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q);
        }),
      { color, alpha, width },
    );
  };
  paint(
    shown.filter((k) => lit[k] <= 0.001),
    P.line,
  );
  paint(
    shown.filter((k) => lit[k] >= 0.999),
    P.authority,
  );
  shown
    .filter((k) => lit[k] > 0.001 && lit[k] < 0.999)
    .forEach((k) => paint([k], blend(P.line, P.authority, lit[k])));
}

/* Fields of one size in a row, one stroke, so the row is one mark that one name names; `lit` lights every side. */
export function fieldRow(xs, cy, s, { alpha = 1, lit = 0, gap = 12 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () =>
      xs.forEach((x) =>
        sidesOf(x, cy, s, s, gap).forEach(([[x0, y0], [x1, y1]]) => {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
        }),
      ),
    { color: blend(P.line, P.authority, lit), alpha, width: 4 },
  );
}

/* A small field, s across, with only side k lit: the boundary a row of the list names. */
export function fieldIcon(cx, cy, s, k, { alpha = 1 } = {}) {
  field(cx, cy, s, s, {
    alpha,
    lit: [0, 1, 2, 3].map((i) => (i === k ? 1 : 0)),
    gap: 5,
    width: 3.5,
  });
}

/* A document w by h about (cx, cy) whose ruled rows fill it, sized by the risk it records: its outline with its fold,
 * and its rows one stroke, so the rows read as the document's content rather than as members of a list. */
export function tierDoc(cx, cy, w, h, { alpha = 1, color = P.ink, rows = 3 } = {}) {
  if (alpha < 0.01) return;
  const x = cx - w / 2,
    y = cy - h / 2;
  documentIcon(x, y, w, h, { alpha, stroke: color, rows: 0 });
  stroke(
    () => {
      for (let i = 0; i < rows; i++) {
        const ry = y + h * (0.3 + (i * 0.55) / Math.max(1, rows));
        ctx.moveTo(x + w * 0.14, ry);
        ctx.lineTo(x + w * (i % 2 ? 0.62 : 0.82), ry);
      }
    },
    { color: P.muted, alpha: alpha * 0.8, width: 2 },
  );
}

/* A lens over the work: a ring with a handle, in the colour of evidence. */
export function lens(cx, cy, r, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  ring(cx, cy, r, { color: P.evidence, alpha, width: 4 });
  line(cx + r * 0.72, cy + r * 0.72, cx + r * 1.35, cy + r * 1.35, {
    color: P.evidence,
    alpha,
    width: 6,
  });
}

/* Someone giving their own account: a figure (or an Agent) with a speech bubble at its upper right. */
export function speaker(cx, cy, { alpha = 1, agent = false } = {}) {
  if (alpha < 0.01) return;
  if (agent) {
    stroke(
      () => {
        ctx.moveTo(cx, cy - 20);
        ctx.lineTo(cx + 20, cy);
        ctx.lineTo(cx, cy + 20);
        ctx.lineTo(cx - 20, cy);
        ctx.closePath();
      },
      { color: P.evidence, alpha, width: 2.5 },
    );
    dot(cx, cy, 4, { color: P.evidence, alpha });
  } else {
    dot(cx, cy - 14, 11, { color: P.ink, alpha });
    stroke(() => ctx.arc(cx, cy + 14, 17, Math.PI * 1.08, Math.PI * 1.92), {
      color: P.ink,
      alpha,
      width: 3,
    });
  }
  const bx = cx + 26,
    by = cy - 28;
  fill(() => ctx.roundRect(bx, by - 11, 30, 22, 7), { color: P.row, alpha });
  box(bx, by - 11, 30, 22, { stroke: P.muted, alpha, radius: 7, width: 2.5 });
}
