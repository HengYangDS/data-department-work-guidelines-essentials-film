/* Symbols: people, Agents, documents, seals, locks and the other icons the scenes place. From ddwg-film v1.0.0 (c4e8aac), picture/film.js. */

import { ctx } from "../canvas.js";
import { box, dot, fill, line, measure, path, ring, stroke, text } from "./strokes.js";
import { LABEL, P, TYPE } from "../palette.js";
import { clamp, ease } from "../timing/easing.js";

/* A diamond's outline, filled as far as `solid` says: true or false, or a share by which its fill spreads out from its
 * centre inside the outline that stays, at the diamond's own ink, so a diamond that becomes solid never swaps one mark
 * for another in a frame, nor stands half-faded over what it replaces. */
export function diamond(
  x,
  y,
  r,
  { color = P.evidence, alpha = 1, solid = false, width = 2.5 } = {},
) {
  const build =
    (k = 1) =>
    () => {
      ctx.moveTo(x, y - r * k);
      ctx.lineTo(x + r * k, y);
      ctx.lineTo(x, y + r * k);
      ctx.lineTo(x - r * k, y);
      ctx.closePath();
    };
  const filled = solid === true ? 1 : solid === false ? 0 : clamp(solid);
  if (filled > 0) fill(build(filled), { color, alpha });
  if (solid !== true) stroke(build(), { color, alpha, width });
}
/* Icons: people decide, Agents act inside boundaries, documents carry claims. */
/* A work item moving through a process. */
export function token(x, y, { color = P.ink, alpha = 1, r = 14, hollow = false } = {}) {
  dot(x, y, r, { color, alpha, hollow, width: 3 });
  if (!hollow) ring(x, y, r + 7, { color, alpha: alpha * 0.45, width: 2 });
}
export function lock(x, y, { closed = 1, color = P.authority, alpha = 1, size = 1 } = {}) {
  const w = 34 * size,
    h = 26 * size,
    lift = (1 - ease(closed)) * 12 * size;
  box(x - w / 2, y - h / 2, w, h, {
    fill: P.row,
    stroke: color,
    alpha,
    radius: 5 * size,
    width: 2.5,
  });
  stroke(() => ctx.arc(x, y - h / 2 - lift, w * 0.32, Math.PI, 0), {
    color,
    alpha,
    width: 3 * size,
  });
  dot(x, y + 1, 3.5 * size, { color, alpha });
}
export function clock(x, y, r, { hand = 0, color = P.ink, alpha = 1 } = {}) {
  ring(x, y, r, { color, alpha, width: 2.5 });
  const a = -Math.PI / 2 + Math.PI * 2 * hand;
  line(x, y, x + r * 0.75 * Math.cos(a), y + r * 0.75 * Math.sin(a), { color, alpha, width: 3 });
  line(x, y, x, y - r * 0.5, { color, alpha: alpha * 0.6, width: 2 });
}

/* A seal stamps what a role may grant: a rim with an inner ring and a check inside. `stamp` is the opacity of the inner
 * ring and the check, so a seal's rim can stand before the seal is stamped. `hollow`, true or false or a share, is how
 * far the seal stays unstamped: its inner ring dashed and no check; as it falls to 0 the solid ring fades in over the
 * dashed one and the check draws on, so a seal is stamped in one continuous movement. The inner ring stands at 0.75 of
 * the stamp, which keeps it at 4.5:1 or more over the ground in the authority (5.6:1) and evidence (5.2:1) colours. */
export function seal(
  x,
  y,
  r,
  { color = P.authority, alpha = 1, hollow = false, stamp = alpha } = {},
) {
  const open = hollow === true ? 1 : hollow === false ? 0 : clamp(hollow);
  ring(x, y, r, { color, alpha, width: 3 });
  if (open > 0)
    ring(x, y, r * 0.74, { color, alpha: stamp * 0.75 * open, width: 1.5, dash: [5, 5] });
  if (open < 1) {
    ring(x, y, r * 0.74, { color, alpha: stamp * 0.75 * (1 - open), width: 1.5 });
    check(x, y + r * 0.05, r * 0.8, { color, alpha: stamp, upto: 1 - open });
  }
}
export function person(x, y, { color = P.ink, alpha = 1, size = 1, solid = true } = {}) {
  // `solid` may be a fraction: a seat becomes a person as its outlined head fills in.
  const r = 15 * size,
    fillQ = solid === true ? 1 : solid === false ? 0 : clamp(solid);
  if (fillQ < 1)
    dot(x, y - r * 1.15, r, { color, alpha: alpha * (1 - fillQ), hollow: true, width: 2.5 });
  if (fillQ > 0) dot(x, y - r * 1.15, r, { color, alpha: alpha * fillQ });
  stroke(() => ctx.arc(x, y + r * 1.9, r * 1.55, Math.PI * 1.08, Math.PI * 1.92), {
    color,
    alpha,
    width: 3 * size,
  });
}
export function agent(x, y, { alpha = 1, size = 1, color = P.evidence } = {}) {
  diamond(x, y, 22 * size, { color, alpha });
  dot(x, y, 4.5 * size, { color, alpha });
}
export function documentIcon(
  x,
  y,
  w,
  h,
  { alpha = 1, stroke: s = P.ink, rows = 4, fillColor = P.row, fold = true } = {},
) {
  if (alpha < 0.01) return;
  const c = Math.min(22, w * 0.2);
  fill(
    () => {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w - c, y);
      ctx.lineTo(x + w, y + c);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    },
    { color: fillColor, alpha },
  );
  stroke(
    () => {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w - c, y);
      ctx.lineTo(x + w, y + c);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    },
    { color: s, alpha, width: 2 },
  );
  if (fold)
    stroke(
      () => {
        ctx.moveTo(x + w - c, y);
        ctx.lineTo(x + w - c, y + c);
        ctx.lineTo(x + w, y + c);
      },
      { color: s, alpha, width: 1.5 },
    );
  for (let i = 0; i < rows; i++) {
    const ry = y + h * (0.3 + (i * 0.55) / Math.max(1, rows));
    line(x + w * 0.14, ry, x + w * (i % 2 ? 0.62 : 0.82), ry, {
      color: P.muted,
      alpha: alpha * 0.8,
      width: 2,
    });
  }
}
/* A table: the film's data as a card ruled into rows and columns, as the 25-minute film draws its price data (ddwg-film,
 * lane 20261101-keep-concepts-faithful at 938d6fe, picture/film.js, tableIcon). Its rules are drawn as two strokes, the
 * rows and the columns: the seat check reads each as content inside the card rather than as the card's edge, so a card
 * of frame size never stands as an empty frame, and the rules are not repeated members waiting for names of their own. */
export function tableIcon(x, y, w, h, { alpha = 1, stroke: s = P.ink, rows = 4, cols = 3 } = {}) {
  if (alpha < 0.01) return;
  box(x, y, w, h, { fill: P.row, stroke: s, alpha, radius: 8 });
  stroke(
    () => {
      for (let r = 1; r < rows; r++) {
        ctx.moveTo(x, y + (h * r) / rows);
        ctx.lineTo(x + w, y + (h * r) / rows);
      }
    },
    { color: P.line, alpha, width: 1.5 },
  );
  stroke(
    () => {
      for (let c = 1; c < cols; c++) {
        ctx.moveTo(x + (w * c) / cols, y);
        ctx.lineTo(x + (w * c) / cols, y + h);
      }
    },
    { color: P.line, alpha, width: 1.5 },
  );
}
export function check(x, y, s, { color = P.evidence, alpha = 1, upto = 1, width = 3.5 } = {}) {
  path(
    [
      [x - s * 0.5, y],
      [x - s * 0.12, y + s * 0.38],
      [x + s * 0.55, y - s * 0.42],
    ],
    { color, alpha, upto, width },
  );
}
export function cross(x, y, s, { color = P.unknown, alpha = 1, width = 3.5 } = {}) {
  line(x - s / 2, y - s / 2, x + s / 2, y + s / 2, { color, alpha, width });
  line(x + s / 2, y - s / 2, x - s / 2, y + s / 2, { color, alpha, width });
}
export function stopSign(x, y, r, { alpha = 1, color = P.unknown } = {}) {
  const build = () => {
    for (let i = 0; i < 8; i++) {
      const a = Math.PI / 8 + (i * Math.PI) / 4;
      const px = x + r * Math.cos(a),
        py = y + r * Math.sin(a);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
  };
  stroke(build, { color, alpha, width: 3 });
  line(x - r * 0.45, y, x + r * 0.45, y, { color, alpha, width: 4 });
}
/* A pill's word may follow the label tiers through `ink` while its frame keeps the place at `alpha`. */
export function pill(
  label,
  x,
  y,
  {
    alpha = 1,
    ink = null,
    color = P.ink,
    border = P.line,
    fillColor = P.row,
    size = LABEL,
    align = "center",
    padX = 18,
    h = null,
    bold = false,
    dash = null,
    dashed = null,
    group = null,
    role = "label",
  } = {},
) {
  if (alpha < 0.015) return null;
  const w = measure(label, size, bold, role) + padX * 2,
    height = h ?? size * TYPE + 22;
  const left = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  box(left, y - height / 2, w, height, { fill: fillColor, alpha, radius: height / 2 });
  // `dashed` turns a solid outline into a dashed one gradually, keeping one set of words.
  if (dashed === null)
    box(left, y - height / 2, w, height, { stroke: border, alpha, radius: height / 2, dash });
  else {
    box(left, y - height / 2, w, height, {
      stroke: border,
      alpha: alpha * (1 - clamp(dashed)),
      radius: height / 2,
    });
    box(left, y - height / 2, w, height, {
      stroke: border,
      alpha: alpha * clamp(dashed),
      radius: height / 2,
      dash: dash ?? [6, 6],
    });
  }
  text(label, left + w / 2, y + 1, size, {
    align: "center",
    color,
    alpha: ink ?? alpha,
    bold,
    group,
    role,
  });
  return { left, right: left + w, top: y - height / 2, bottom: y + height / 2, width: w };
}
