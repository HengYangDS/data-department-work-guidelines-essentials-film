/* The marks of part 02, each one connected mark about the point it is given, fading with `alpha`: the guidelines' page
 * with the seal of its contract, the department's members and the Agents they delegate to (each group one stroke, as
 * one name names it), the things a piece of work hands over, the signal that runs in at the way's left, the outcomes a
 * task must reach and the reports it must not stop at. */

import { ctx } from "../../canvas.js";
import { box, dot, fill, line, ring, stroke } from "../../drawing/strokes.js";
import { check, documentIcon, seal, tableIcon, token } from "../../drawing/symbols.js";
import { kernelIcon } from "../../drawing/workspace.js";
import { P } from "../../palette.js";
import { clamp } from "../../timing/easing.js";

/* The guidelines as an open booklet of two pages, drawn as one mark: one outline with its spine, the two pages' title
 * rules one stroke and their lines of text one stroke, which fill it, so the booklet may be larger than a card. The last
 * lines of the right page stop short of its lower right, where the seal of the contract stamps (`seal` is the seal's
 * rim, `stamp` its inner ring and check). Returns the seal's centre. */
export function guidePage(x, y, w, h, { alpha = 1, seal: rim = 0, stamp = 0 } = {}) {
  const at = [x + w - 52, y + h - 58],
    half = w / 2,
    n = Math.floor((h - 90) / 30) + 1;
  if (alpha < 0.01) return at;
  box(x, y, w, h, { fill: P.row, stroke: P.ink, alpha, radius: 6, width: 2.5 });
  line(x + half, y, x + half, y + h, { color: P.ink, alpha, width: 2.5 });
  stroke(
    () =>
      [x, x + half].forEach((px) => {
        ctx.moveTo(px + 22, y + 38);
        ctx.lineTo(px + half * 0.62, y + 38);
      }),
    { color: P.ink, alpha, width: 4 },
  );
  stroke(
    () =>
      [x, x + half].forEach((px, side) => {
        for (let k = 0; k < n; k++) {
          const ry = y + 74 + k * 30,
            end = side && k >= n - 3 ? px + half - 102 : px + half - (k % 2 ? 44 : 22);
          ctx.moveTo(px + 22, ry);
          ctx.lineTo(end, ry);
        }
      }),
    { color: P.muted, alpha: alpha * 0.8, width: 2 },
  );
  if (rim > 0.01) seal(at[0], at[1], 30, { alpha: alpha * rim, stamp: alpha * stamp });
  return at;
}

/* A point that glides to and fro along a lane in voice time, easing at both ends, so it never jumps back. */
export const toAndFro = (vt, speed = 1.2) => 0.5 - 0.5 * Math.cos(vt * speed);

/* Figures drawn as one mark (heads one fill, shoulders one stroke), as symbols.js draws a person at `size`. */
export function people(xs, y, { size = 0.9, alpha = 1, color = P.ink } = {}) {
  if (alpha < 0.01) return;
  const r = 15 * size;
  fill(
    () =>
      xs.forEach((x) => {
        ctx.moveTo(x + r, y - r * 1.15);
        ctx.arc(x, y - r * 1.15, r, 0, Math.PI * 2);
      }),
    { color, alpha },
  );
  stroke(
    () =>
      xs.forEach((x) => {
        const a0 = Math.PI * 1.08;
        ctx.moveTo(x + r * 1.55 * Math.cos(a0), y + r * 1.9 + r * 1.55 * Math.sin(a0));
        ctx.arc(x, y + r * 1.9, r * 1.55, a0, Math.PI * 1.92);
      }),
    { color, alpha, width: 3 * size + 0.5 },
  );
}

/* Agents drawn as one mark: their diamonds one stroke and their cores one fill, as symbols.js draws an Agent. */
export function agents(xs, y, { r = 22, alpha = 1, color = P.evidence } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () =>
      xs.forEach((x) => {
        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y);
        ctx.lineTo(x, y + r);
        ctx.lineTo(x - r, y);
        ctx.closePath();
      }),
    { color, alpha, width: 2.5 },
  );
  fill(
    () =>
      xs.forEach((x) => {
        ctx.moveTo(x + r * 0.2, y);
        ctx.arc(x, y, r * 0.2, 0, Math.PI * 2);
      }),
    { color, alpha },
  );
}

/* What a piece of work hands over, each about 64 px about (x, y), drawn in the muted tone as the things refused:
 * 0 a file, 1 a table, 2 a report (a page with a small chart), 3 a process (three steps joined in a line). */
export function handedMark(k, x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const o = { color: P.muted, alpha, width: 2.5 };
  if (k === 0) documentIcon(x - 24, y - 30, 48, 60, { alpha, stroke: P.muted, rows: 3 });
  if (k === 1) tableIcon(x - 34, y - 24, 68, 48, { alpha, stroke: P.muted, rows: 3, cols: 3 });
  if (k === 2) {
    documentIcon(x - 24, y - 30, 48, 60, { alpha, stroke: P.muted, rows: 0 });
    stroke(
      () => {
        ctx.moveTo(x - 14, y + 18);
        ctx.lineTo(x - 4, y + 4);
        ctx.lineTo(x + 4, y + 10);
        ctx.lineTo(x + 14, y - 8);
      },
      { ...o, width: 2.5 },
    );
  }
  if (k === 3) {
    line(x - 30, y, x + 30, y, o);
    fill(
      () =>
        [-30, 0, 30].forEach((dx) => {
          ctx.moveTo(x + dx + 7, y);
          ctx.arc(x + dx, y, 7, 0, Math.PI * 2);
        }),
      { color: P.muted, alpha },
    );
  }
}

/* A signal from the world: a wave from x0 to x1 about the line y, moving on with `phase` (voice time). */
export function wave(x0, x1, y, phase, { alpha = 1, amp = 13 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => {
      for (let x = x0; x <= x1; x += 3) {
        const q = (x - x0) / (x1 - x0),
          v = y - amp * Math.sin(q * Math.PI * 4 - phase) * Math.sin(Math.PI * q);
        x === x0 ? ctx.moveTo(x, v) : ctx.lineTo(x, v);
      }
    },
    { color: P.evidence, alpha, width: 3 },
  );
}

/* What the signal becomes, each about 64 px about (x, y), hanging from the way: 0 judgments, a ring with its point; 1
 * data assets, a table; 2 actions, a work item carried along a short lane by `run`, a phase in [0, 1). */
export function outputMark(k, x, y, { alpha = 1, run = 0 } = {}) {
  if (alpha < 0.01) return;
  if (k === 0) {
    dot(x, y, 22, { color: P.ground, alpha });
    ring(x, y, 22, { color: P.ink, alpha, width: 3 });
    dot(x, y, 6, { color: P.ink, alpha });
  }
  if (k === 1) tableIcon(x - 34, y - 26, 68, 52, { alpha, rows: 3, cols: 3 });
  if (k === 2) {
    line(x - 34, y + 16, x + 34, y + 16, { color: P.line, alpha, width: 3 });
    token(x - 24 + 48 * run, y - 6, { alpha, r: 10 });
  }
}

/* An outcome a task must reach, a ring open on the ground: `bounds` draws the two small brackets that state where a
 * judgment holds, `done` the check of an outcome reached. The system's outcome is a mechanism instead, turning by
 * `turn`, whose watch point beats with `watch`. */
export function outcome(x, y, { alpha = 1, bounds = 0, done = 0 } = {}) {
  if (alpha < 0.01) return;
  dot(x, y, 19, { color: P.ground, alpha });
  ring(x, y, 19, { color: P.ink, alpha, width: 3 });
  if (bounds > 0.01)
    stroke(
      () =>
        [-1, 1].forEach((side) => {
          const bx = x + side * 31;
          ctx.moveTo(bx - side * 6, y - 22);
          ctx.lineTo(bx, y - 22);
          ctx.lineTo(bx, y + 22);
          ctx.lineTo(bx - side * 6, y + 22);
        }),
      { color: P.ink, alpha: alpha * bounds, width: 2.5 },
    );
  if (done > 0.01) check(x, y + 1, 22, { color: P.evidence, alpha, upto: clamp(done) });
}
export function mechanism(x, y, { alpha = 1, turn = 0, watch = 0 } = {}) {
  if (alpha < 0.01) return;
  kernelIcon(x, y, 22, { alpha, color: P.ink, turn, beat: watch });
  if (watch > 0.01) ring(x, y, 31, { color: P.evidence, alpha: alpha * watch, width: 2.5 });
}

/* Three reports in a row, one mark that one name names: their pages, each 38 by 48, one fill and one stroke, their
 * lines one stroke, about (xs, y). */
export function reports(xs, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  const w = 38,
    h = 48;
  const pages = () => xs.forEach((x) => ctx.roundRect(x - w / 2, y - h / 2, w, h, 4));
  fill(pages, { color: P.row, alpha });
  stroke(pages, { color: P.muted, alpha, width: 2 });
  stroke(
    () =>
      xs.forEach((x) =>
        [-10, 0, 10].forEach((dy, k) => {
          ctx.moveTo(x - 11, y + dy);
          ctx.lineTo(x + (k === 1 ? 4 : 11), y + dy);
        }),
      ),
    { color: P.muted, alpha: alpha * 0.8, width: 2 },
  );
}
