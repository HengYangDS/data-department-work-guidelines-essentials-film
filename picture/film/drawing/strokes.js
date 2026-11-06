/* Drawing primitives: text, strokes, fills and the basic shapes every mark is drawn from. From ddwg-film v1.0.0 (c4e8aac), picture/film.js. */

import { ctx, layout, resolution, sceneFade, wordFade } from "../canvas.js";
import { LABEL, P, TYPE } from "../palette.js";
import { clamp, ease } from "../timing/easing.js";
import { voiceTime } from "../timing/pauses.js";

/* Drawing primitives. Every painted text registers its box for the geometry check. */
export function font(size, bold, sample) {
  const latin = !/[\u4e00-\u9fff]/u.test(sample);
  return `${bold ? "700 " : ""}${size}px ${latin ? (bold ? "FilmLatinBold" : "FilmLatin") : bold ? "FilmBold" : "Film"}`;
}
export const labelSize = (size) => size * TYPE;
/* Display copy: an apostrophe is set as a typographic right single quote, as in the captions. */
const typeset = (v) => v.replaceAll("'", "\u2019");
export function measure(v, size = LABEL, bold = false, role = "label") {
  v = typeset(v);
  ctx.save();
  ctx.font = font(role === "label" ? labelSize(size) : size, bold, v);
  const w = ctx.measureText(v).width;
  ctx.restore();
  return w;
}
/* `group` names a structural set (the roles of a chain, the states of a rail): its labels stand together while the
 * structure stands, and they are read, and counted, as one object. */
export function text(
  v,
  x,
  y,
  size = LABEL,
  {
    color = P.ink,
    alpha = 1,
    align = "left",
    bold = false,
    baseline = "middle",
    role = "label",
    tracking = 0,
    group = null,
    whole = null,
    set = null,
  } = {},
) {
  if (alpha < 0.015 || !v) return null;
  v = typeset(v);
  whole = whole === null ? null : typeset(whole);
  ctx.save();
  ctx.globalAlpha = clamp(alpha) * wordFade;
  ctx.font = font(role === "label" ? labelSize(size) : size, bold, v);
  ctx.letterSpacing = `${tracking}px`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillStyle = color;
  ctx.fillText(v, x, y);
  const m = ctx.measureText(v),
    tr = ctx.getTransform();
  const box = [
    x - m.actualBoundingBoxLeft,
    y - m.actualBoundingBoxAscent,
    x + m.actualBoundingBoxRight,
    y + m.actualBoundingBoxDescent,
  ];
  const toScreen = (px, py) => [
    (tr.a * px + tr.c * py + tr.e) / resolution,
    (tr.b * px + tr.d * py + tr.f) / resolution,
  ];
  const [x0, y0] = toScreen(box[0], box[1]),
    [x1, y1] = toScreen(box[2], box[3]);
  ctx.restore();
  // A name placed by a layout primitive carries its whole text, so a wrapped or growing name is read as one; `set` names
  // the list it belongs to, which builds and leaves as a whole.
  const record = {
    text: v,
    bounds: [Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1)],
    alpha: clamp(alpha) * wordFade,
    role,
    scene: layout.scene,
    color,
    group,
    whole: whole ?? v,
    placed: whole !== null,
    size,
    set,
  };
  layout.texts.push(record);
  return record;
}
/* Structure strokes (the line and muted colours) are thin and often dashed, so at 1080p their antialiased pixels read
 * far fainter than their nominal ink. They are drawn at least 2 px wide, and their opacity is compensated on a concave
 * curve (1 - (1 - a)^2): a stroke at full ink is unchanged, a quiet placeholder at 0.45-0.8 stays at 0.7-0.96, at or
 * above 3:1 against the ground, and fades stay continuous. */
const STRUCTURE = new Set([P.line, P.muted]);
export function stroke(
  build,
  { color = P.line, width = 2, alpha = 1, dash = null, cap = "round" } = {},
) {
  if (alpha < 0.01) return;
  const structure = STRUCTURE.has(color),
    a = structure ? 1 - (1 - clamp(alpha)) ** 2 : clamp(alpha);
  ctx.save();
  ctx.globalAlpha = a * sceneFade;
  ctx.strokeStyle = color;
  ctx.lineWidth = structure ? Math.max(2, width) : width;
  ctx.lineCap = cap;
  ctx.lineJoin = "round";
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  build();
  ctx.stroke();
  ctx.restore();
}
export function fill(build, { color = P.row, alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  ctx.save();
  ctx.globalAlpha = clamp(alpha) * sceneFade;
  ctx.fillStyle = color;
  ctx.beginPath();
  build();
  ctx.fill();
  ctx.restore();
}
export const line = (x1, y1, x2, y2, o = {}) =>
  stroke(() => {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }, o);
export const dashed = (x1, y1, x2, y2, o = {}) => line(x1, y1, x2, y2, { dash: [8, 9], ...o });
export function box(
  x,
  y,
  w,
  h,
  { fill: f = null, stroke: s = null, width = 2, alpha = 1, radius = 8, dash = null } = {},
) {
  if (f) fill(() => ctx.roundRect(x, y, w, h, radius), { color: f, alpha });
  if (s) stroke(() => ctx.roundRect(x, y, w, h, radius), { color: s, width, alpha, dash });
}
export function dot(x, y, r, { color = P.evidence, alpha = 1, hollow = false, width = 2 } = {}) {
  if (hollow) stroke(() => ctx.arc(x, y, r, 0, Math.PI * 2), { color, alpha, width });
  else fill(() => ctx.arc(x, y, r, 0, Math.PI * 2), { color, alpha });
}
/* The length of a polyline. */
export const lengthOf = (points) =>
  points
    .slice(1)
    .reduce((v, pt, i) => v + Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1]), 0);
/* The point at share q of a polyline's length, and the polyline up to it. */
export function along(points, q) {
  const lengths = points
      .slice(1)
      .map((pt, i) => Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1])),
    total = lengths.reduce((a, b) => a + b, 0);
  let left = clamp(q) * total;
  const kept = [points[0]];
  for (let i = 0; i < lengths.length; i++) {
    if (left >= lengths[i]) {
      kept.push(points[i + 1]);
      left -= lengths[i];
      continue;
    }
    const f = lengths[i] ? left / lengths[i] : 0,
      a = points[i],
      b = points[i + 1];
    kept.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    break;
  }
  return { point: kept.at(-1), kept };
}
/* A polyline drawn on from its start: `upto` is the share of its length drawn, so it grows continuously rather than a
 * segment at a time. */
export function path(points, { upto = 1, ...o } = {}) {
  if (points.length < 2 || upto <= 0) return;
  const drawn = upto >= 1 ? points : along(points, upto).kept;
  stroke(() => drawn.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))), {
    width: 2.5,
    color: P.ink,
    ...o,
  });
}
export function ring(
  x,
  y,
  r,
  { color = P.evidence, alpha = 1, width = 2, upto = 1, start = -Math.PI / 2, dash = null } = {},
) {
  if (upto <= 0) return;
  stroke(() => ctx.arc(x, y, r, start, start + Math.PI * 2 * clamp(upto)), {
    color,
    alpha,
    width,
    dash,
  });
}
/* A looping flow: a dot that runs a way to show the way a relation runs. It moves at one even pace, PACE px of the way
 * for each second of voice time, whatever the way's length, so every flow of the film runs alike, calm and easy to
 * follow, and it rests with the voice in the quiet between thoughts. The dot enters at the way's start and leaves at its
 * end by its size, over EDGE seconds of voice time each, so a pass never pops a dot in or out and a dot at rest in a
 * quiet near either end stays small; a pass lasts at least SPAN seconds, so on a way too short for that pace (under
 * PACE * SPAN px) the dot moves more slowly instead of blinking through. Passes follow one another with BLANK seconds
 * between them, so the dot that leaves the way's end is never seen beside the next one entering at its start. A flow
 * switched on at `from` (a time) begins its first pass there, at the way's start, rather than showing its dot part way
 * along; one switched off at `until` lets its dot shrink away as it runs on, and begins no further pass. `length` is
 * the way's length in px, or a function of voice time for a way that grows or shrinks: each pass then keeps the length
 * its way had when it began, so the dot's share of the way never jumps. `offset` (voice seconds) delays the passes, to
 * stagger two flows of one figure. Returns the dot's share of the way, `q`, and its size, `size`, or null while no dot
 * shows. */
export const PACE = 160,
  SPAN = 0.8,
  BLANK = 0.06,
  EDGE = 0.15;
export function flowAt(t, length, { from = null, until = null, pace = PACE, offset = 0 } = {}) {
  if (from !== null && t < from) return null;
  const v = voiceTime(t),
    origin = (from === null ? 0 : voiceTime(from)) + offset,
    spanOf = (l) => Math.max(l / pace, SPAN);
  if (v < origin) return null;
  let begin = origin,
    span;
  if (typeof length === "function") {
    span = spanOf(length(begin));
    while (begin + span + BLANK <= v) {
      begin += span + BLANK;
      span = spanOf(length(begin));
    }
  } else {
    span = spanOf(length);
    begin = origin + Math.floor((v - origin) / (span + BLANK)) * (span + BLANK);
  }
  const into = v - begin;
  if (!(length > 0 || typeof length === "function") || into > span) return null;
  const edge = Math.min(EDGE, span / 2);
  let size = ease(Math.min(1, into / edge, (span - into) / edge));
  if (until !== null && t >= until) {
    const stop = voiceTime(until);
    if (begin >= stop) return null;
    size *= 1 - ease((v - stop) / EDGE);
  }
  return size > 0 ? { q: into / span, size } : null;
}
/* A flow's dot of radius r at (x, y), at the size flowAt gives it; nothing while the flow shows no dot. */
export const flowDot = (x, y, r, flow, o) => {
  if (flow) dot(x, y, r * flow.size, o);
};
