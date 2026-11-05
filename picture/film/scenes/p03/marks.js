/* The marks of part 03, each one connected mark about the point it is given, fading with `alpha`: a record with its
 * check (a fact), a dashed page (what is only supposed or false), an observing eye, the five leads and a refusal's
 * bar. Marks keep the meaning colours of the film's palette: evidence for records and
 * checks, authority for the seal and the decision, unknown for refusals and open questions. */

import { ctx } from "../../canvas.js";
import { box, dot, fill, line, ring, stroke } from "../../drawing/strokes.js";
import { check, documentIcon } from "../../drawing/symbols.js";
import { bubble, layersIcon } from "../../drawing/workspace.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { clamp } from "../../timing/easing.js";

/* A record with its check: a page whose rows are its content, and a check in the colour of evidence at its foot. The
 * page is w by h about (x, y). */
export function recordMark(x, y, w, h, { alpha = 1, checked = 1 } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 3 });
  if (checked > 0.01)
    check(x + w * 0.12, y + h * 0.3, w * 0.34, { alpha: alpha * clamp(checked), width: 3.5 });
}

/* A page that is only supposed, or false: its outline and rows dashed, in the colour given. */
export function dashedPage(x, y, w, h, { alpha = 1, color = P.unknown } = {}) {
  if (alpha < 0.01) return;
  box(x - w / 2, y - h / 2, w, h, { stroke: color, alpha, radius: 6, width: 2.5, dash: [7, 6] });
  stroke(
    () =>
      [0.3, 0.5, 0.7].forEach((q, k) => {
        ctx.moveTo(x - w * 0.32, y - h / 2 + h * q);
        ctx.lineTo(x + w * (k === 1 ? 0.12 : 0.32), y - h / 2 + h * q);
      }),
    { color, alpha: alpha * 0.8, width: 2, dash: [6, 6] },
  );
}

/* An observing eye: an almond outline and its pupil; `hollow` leaves the pupil open, an observation not yet made.
 * `repeat` draws a small loop beside it, the observation that can be made again. */
export function eye(
  x,
  y,
  { alpha = 1, color = P.evidence, hollow = false, repeat = 0, r = 30 } = {},
) {
  if (alpha < 0.01) return;
  stroke(
    () => {
      ctx.moveTo(x - r, y);
      ctx.quadraticCurveTo(x, y - r * 0.9, x + r, y);
      ctx.quadraticCurveTo(x, y + r * 0.9, x - r, y);
      ctx.closePath();
    },
    { color, alpha, width: 3 },
  );
  dot(x, y, r * 0.3, { color, alpha, hollow, width: 2.5 });
  if (repeat > 0.01) {
    const cx = x + r + 16,
      cy = y - r * 0.55;
    ring(cx, cy, 11, {
      color,
      alpha: alpha * repeat,
      width: 2.5,
      upto: 0.78,
      start: -Math.PI * 0.2,
    });
    dot(cx + 11 * Math.cos(Math.PI * 1.36), cy + 11 * Math.sin(Math.PI * 1.36), 3.5, {
      color,
      alpha: alpha * repeat,
    });
  }
}

/* The five leads, each about 40 px about (x, y), in the muted tone: 0 a second-hand account (a speech bubble), 1 a
 * memory (a ring of dashes about a point), 2 a cache (stacked slabs), 3 a generated view (a window with a chart), 4 an
 * Agent's output (an Agent). */
export function leadMark(k, x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const o = { color: P.muted, alpha, width: 2.5 };
  if (k === 0) bubble(x, y, 15, { alpha });
  if (k === 1) {
    ring(x, y, 17, { ...o, dash: [5, 5] });
    dot(x, y, 4.5, { color: P.muted, alpha });
  }
  if (k === 2) layersIcon(x, y, 42, 36, { alpha, color: P.muted });
  if (k === 3) {
    box(x - 21, y - 17, 42, 34, { fill: P.row, stroke: P.muted, alpha, radius: 4, width: 2.5 });
    stroke(
      () => {
        ctx.moveTo(x - 13, y + 8);
        ctx.lineTo(x - 4, y - 2);
        ctx.lineTo(x + 3, y + 4);
        ctx.lineTo(x + 13, y - 8);
      },
      { ...o, width: 2 },
    );
  }
  if (k === 4) {
    stroke(() => {
      ctx.moveTo(x, y - 17);
      ctx.lineTo(x + 17, y);
      ctx.lineTo(x, y + 17);
      ctx.lineTo(x - 17, y);
      ctx.closePath();
    }, o);
    dot(x, y, 3.5, { color: P.muted, alpha });
  }
}

/* A refusal: a short bar across a way, in the colour of the unknown, centred on (x, y) across the axis given. */
export function bar(x, y, { alpha = 1, length = 44, vertical = false } = {}) {
  if (alpha < 0.01) return;
  const d = length / 2;
  if (vertical) line(x, y - d, x, y + d, { color: P.unknown, alpha, width: 5, cap: "butt" });
  else line(x - d, y, x + d, y, { color: P.unknown, alpha, width: 5, cap: "butt" });
}

/* A conflict: two short strokes meeting in a zigzag between two ways, in the colour of the unknown. */
export function conflictMark(x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => {
      ctx.moveTo(x - 22, y - 10);
      ctx.lineTo(x - 8, y + 10);
      ctx.lineTo(x + 8, y - 10);
      ctx.lineTo(x + 22, y + 10);
    },
    { color: P.unknown, alpha, width: 3.5 },
  );
}

/* A work item to be done: a token on a short lane. */
export function actionMark(x, y, { alpha = 1, color = P.ink } = {}) {
  if (alpha < 0.01) return;
  line(x - 28, y + 14, x + 28, y + 14, { color: P.line, alpha, width: 3 });
  dot(x, y, 10, { color, alpha });
  ring(x, y, 17, { color, alpha: alpha * 0.45, width: 2 });
}

/* A report: a page with a short chart, the conflict and its impact written up. */
export function reportMark(x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - 26, y - 32, 52, 64, { alpha, rows: 2 });
  fill(
    () => {
      ctx.roundRect(x - 14, y + 12, 7, 12, 1);
      ctx.roundRect(x - 3, y + 6, 7, 18, 1);
      ctx.roundRect(x + 8, y + 16, 7, 8, 1);
    },
    { color: P.ink, alpha },
  );
}

/* The five leads, each its words in both editions, and the order each edition says them in. */
export const LEADS = [
  ["转述", "Second-hand accounts"],
  ["记忆", "Memory"],
  ["缓存", "Caches"],
  ["派生视图", "Generated views"],
  ["智能体的输出", "Agent output"],
];
export const LEAD_ORDER = () => L([0, 1, 2, 3, 4], [0, 2, 3, 4, 1]);
