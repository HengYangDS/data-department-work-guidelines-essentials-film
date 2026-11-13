/* Drawn relations: orthogonal links that end in a quiet point. From ddwg-film v1.0.0 (c4e8aac), picture/film.js. */

import { ctx } from "../canvas.js";
import {
  along,
  dot,
  drawnShare,
  flowAt,
  flowDot,
  landedShare,
  lengthOf,
  stroke,
} from "./strokes.js";
import { P } from "../palette.js";
import { clamp, ease } from "../timing/easing.js";

export { along };

/* A drawn relation follows the grid: a straight run when its ends share a row or a column, otherwise an orthogonal
 * route whose corners are quarter turns of radius `r` (never a diagonal). It draws on from its source along its length
 * and ends in a quiet point rather than an arrowhead, which grows by its size as the stroke lands on it. `flow`, the
 * time and flowAt's options ({t, from, until}), runs one dot along it at the film's even flow pace to show the way the
 * relation runs, so it rests in the quiet between thoughts. `draw` ({t, at, least}) draws it on from `at` over `upto`
 * of its length at the film's tip pace (drawnShare), so no tip races. Routes: "vhv"
 * leaves vertically, crosses at `mid` and arrives vertically; "hvh" the reverse; "vh" and "hv" turn once. */
export function rounded(corners, r) {
  const out = [corners[0]];
  for (let i = 1; i < corners.length - 1; i++) {
    const [ax, ay] = corners[i - 1],
      [bx, by] = corners[i],
      [cx2, cy2] = corners[i + 1];
    const d1 = Math.hypot(bx - ax, by - ay),
      d2 = Math.hypot(cx2 - bx, cy2 - by);
    if (d1 < 1e-6 || d2 < 1e-6) continue;
    const k = Math.min(r, d1 / 2, d2 / 2),
      p = [bx - ((bx - ax) / d1) * k, by - ((by - ay) / d1) * k],
      q = [bx + ((cx2 - bx) / d2) * k, by + ((cy2 - by) / d2) * k];
    for (let n = 0; n <= 6; n++) {
      const u = n / 6;
      out.push([
        (1 - u) ** 2 * p[0] + 2 * (1 - u) * u * bx + u * u * q[0],
        (1 - u) ** 2 * p[1] + 2 * (1 - u) * u * by + u * u * q[1],
      ]);
    }
  }
  out.push(corners.at(-1));
  return out;
}
export function link(
  x1,
  y1,
  x2,
  y2,
  {
    route = null,
    mid = null,
    r = 14,
    color = P.line,
    alpha = 1,
    upto = 1,
    draw = null,
    width = 2,
    dash = null,
    flow = null,
    end = true,
  } = {},
) {
  if (alpha < 0.01 || upto <= 0 || Math.hypot(x2 - x1, y2 - y1) < 1) return;
  const kind = route ?? (Math.abs(x1 - x2) < 0.5 || Math.abs(y1 - y2) < 0.5 ? "straight" : "vhv");
  const m = mid ?? (kind === "vhv" ? (y1 + y2) / 2 : (x1 + x2) / 2);
  const corners = {
    straight: [
      [x1, y1],
      [x2, y2],
    ],
    vhv: [
      [x1, y1],
      [x1, m],
      [x2, m],
      [x2, y2],
    ],
    hvh: [
      [x1, y1],
      [m, y1],
      [m, y2],
      [x2, y2],
    ],
    vh: [
      [x1, y1],
      [x1, y2],
      [x2, y2],
    ],
    hv: [
      [x1, y1],
      [x2, y1],
      [x2, y2],
    ],
  }[kind];
  const points = rounded(corners, r),
    extent = clamp(upto);
  if (draw) upto = drawnShare(draw, lengthOf(points), extent);
  if (upto <= 0) return;
  const drawn = along(points, upto).kept;
  if (drawn.length > 1)
    stroke(() => drawn.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))), {
      color,
      alpha,
      width,
      dash,
    });
  // The end point grows by its size as the stroke lands on it: over the last twentieth of its length, or, drawn at the
  // tip pace, over its last LANDING seconds (landedShare), so a short link's point does not appear whole in a frame.
  const grown =
    draw && extent >= 1 ? landedShare(draw, lengthOf(points)) : ease(clamp((upto - 0.95) / 0.05));
  if (end && grown > 0) dot(x2, y2, (width + 2.5) * grown, { color, alpha });
  const state = flow ? flowAt(flow.t, lengthOf(points), flow) : null;
  if (state && state.q < upto) {
    const [px, py] = along(points, state.q).point;
    flowDot(px, py, width + 2, state, { color, alpha });
  }
}
