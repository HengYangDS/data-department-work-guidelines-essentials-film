/* The opening's four failures (the picture plan's section 3), drawn once here and returned to where the film answers
 * them: a fork taken ahead of the facts (换供应商 / a new vendor), a pipe whose break a hand-made patch catches (手工补上
 * 的数据 / data patched by hand), a meeting whose two seats stay empty (一场会 / a meeting), and an Agent beside a growing
 * stack of pages and two flat bars (十页分析 / ten pages of analysis). Each figure is one connected mark about its centre
 * (cx, cy), at most 260 px wide and 170 px tall, and fades with `alpha`; its later parts take their own shares, so a
 * part arrives on the words that name it. */

import { ctx } from "../../canvas.js";
import {
  along,
  box,
  dot,
  fill,
  flowAt,
  flowDot,
  lengthOf,
  line,
  ring,
  stroke,
  text,
} from "../../drawing/strokes.js";
import { P } from "../../palette.js";
import { mix } from "../../timing/easing.js";
import { travel } from "../../timing/pauses.js";

/* A picture built part by part stands centred on what is on screen: it stands at the shift `first` and glides as one
 * to each next shift, over 0.9 s of voice time from just after the word that brings the part that changes its extent
 * (the ETHOS film's idiom, ethos-film scenes/p03/kernel.js), a structural glide (timing/pauses.js, travel). Each step
 * is [that word's time, the shift]. */
export const glide = (t, first, steps) =>
  steps.reduce((x, [at, to]) => mix(x, to, travel(t, at + 0.05, 0.9)), first);

/* Figures drawn as one mark: heads one fill (or one dashed stroke when the people are absent) and shoulders one stroke,
 * as symbols.js draws a person at `size`. */
export function people(xs, y, { size = 0.6, alpha = 1, color = P.ink, absent = false } = {}) {
  if (alpha < 0.01 || !xs.length) return;
  const r = 15 * size,
    heads = () =>
      xs.forEach((x) => {
        ctx.moveTo(x + r, y - r * 1.15);
        ctx.arc(x, y - r * 1.15, r, 0, Math.PI * 2);
      });
  if (absent) stroke(heads, { color, alpha, width: 2.5, dash: [4, 4] });
  else fill(heads, { color, alpha });
  stroke(
    () =>
      xs.forEach((x) => {
        const a0 = Math.PI * 1.08;
        ctx.moveTo(x + r * 1.55 * Math.cos(a0), y + r * 1.9 + r * 1.55 * Math.sin(a0));
        ctx.arc(x, y + r * 1.9, r * 1.55, a0, Math.PI * 1.92);
      }),
    { color, alpha, width: 3 * size + 0.5, dash: absent ? [5, 4] : null },
  );
}

/* An open question: a dashed ring in the colour of the unknown with its question mark, turning by `turn`. */
export function openMark(x, y, r, { alpha = 1, turn = 0 } = {}) {
  if (alpha < 0.01) return;
  dot(x, y, r, { color: P.ground, alpha });
  ring(x, y, r, {
    color: P.unknown,
    alpha,
    width: 3,
    dash: [6, 5],
    start: -Math.PI / 2 + turn,
  });
  text("?", x, y + 1, r * 1.05, { role: "mark", align: "center", color: P.unknown, alpha });
}

/* Failure 1: the choice before the facts. A short line of time; at its left a fork whose taken branch (the authority
 * colour, a choice made) leaves the line, and further along the line, where the facts would be, an open question
 * (`facts`). `run`, the time and flowAt's options ({t, from}), runs a point along the taken branch as a flow, or is
 * null. */
export function forkMark(cx, cy, { alpha = 1, facts = 0, run = null } = {}) {
  if (alpha < 0.01) return;
  const y = cy + 28,
    fx = cx - 58,
    branch = forkBranch(fx, y);
  line(cx - 124, y, cx + 66, y, { color: P.line, alpha, width: 3 });
  stroke(() => branch.forEach(([x, py], i) => (i ? ctx.lineTo(x, py) : ctx.moveTo(x, py))), {
    color: P.authority,
    alpha,
    width: 3.5,
  });
  dot(...branch.at(-1), 6, { color: P.authority, alpha });
  dot(fx, y, 5, { color: P.ink, alpha });
  const runs = run && flowAt(run.t, lengthOf(branch), run);
  if (runs) flowDot(...along(branch, runs.q).point, 5, runs, { color: P.authority, alpha });
  openMark(cx + 88, y, 21, { alpha: alpha * facts });
}
/* The taken branch as points: level from the fork, a quarter turn up and a quarter turn level again, 48 px higher. */
function forkBranch(fx, y) {
  const quad = (a, c, b) =>
    Array.from({ length: 9 }, (_, i) => {
      const q = i / 8,
        u = 1 - q;
      return [u * u * a[0] + 2 * u * q * c[0] + q * q * b[0], u * u * a[1] + 2 * u * q * c[1] + q * q * b[1]];
    });
  return [
    [fx, y],
    ...quad([fx + 16, y], [fx + 40, y], [fx + 40, y - 24]),
    ...quad([fx + 40, y - 24], [fx + 40, y - 48], [fx + 64, y - 48]).slice(1),
    [fx + 98, y - 48],
  ];
}

/* Failure 2: the symptom patched, the mechanism untouched. A pipe broken at its middle drips; a patch under the break
 * catches the drip (`drip`, the time and flowAt's options ({t}), a flow down from the break, or null); `again` sends a
 * second drip past the patch, falling while the first does, a little after it, the failure of the next month; `light`
 * rings the break, the mechanism left as it was. */
export function patchMark(cx, cy, { alpha = 1, drip = null, again = 0, light = 0 } = {}) {
  if (alpha < 0.01) return;
  const py = cy - 18;
  stroke(
    () => {
      ctx.moveTo(cx - 124, py);
      ctx.lineTo(cx - 15, py);
      ctx.moveTo(cx + 15, py + 7);
      ctx.lineTo(cx + 124, py + 7);
    },
    { color: P.ink, alpha, width: 7, cap: "butt" },
  );
  box(cx - 44, cy + 34, 88, 18, { fill: P.row, stroke: P.ink, alpha, radius: 6, width: 2.5 });
  // The patch rests on two short legs from the pipe, so the figure is one mark.
  stroke(
    () => {
      ctx.moveTo(cx - 36, py + 4);
      ctx.lineTo(cx - 36, cy + 34);
      ctx.moveTo(cx + 36, py + 11);
      ctx.lineTo(cx + 36, cy + 34);
    },
    { color: P.line, alpha, width: 2 },
  );
  const falls = drip && flowAt(drip.t, cy + 30 - (py + 10), drip);
  if (falls) flowDot(cx, mix(py + 10, cy + 30, falls.q), 5, falls, { color: P.ink, alpha });
  const passes = again > 0.01 && drip && flowAt(drip.t, 56, { ...drip, offset: 0.4 });
  if (passes)
    flowDot(cx + 58, mix(cy + 20, cy + 76, passes.q), 5, passes, {
      color: P.ink,
      alpha: alpha * again,
    });
  if (light > 0.01) ring(cx, py + 3, 27, { color: P.unknown, alpha: alpha * light, width: 3 });
}

/* Failure 3: a meeting at which no one can decide or act. A table with its people seated along its far side (one
 * mark), and on the near side two seats that stay empty, each drawn on its own words (`seats`, two shares). `beat`
 * flashes a speaker's ring at each seated head in turn: three opacities. */
export function meetingMark(cx, cy, { alpha = 1, seats = [0, 0], beat = [0, 0, 0] } = {}) {
  if (alpha < 0.01) return;
  const top = cy - 10,
    xs = [cx - 54, cx, cx + 54],
    seated = top - 14;
  people(xs, seated, { alpha });
  box(cx - 86, top, 172, 34, { fill: P.row, stroke: P.ink, alpha, radius: 8, width: 2.5 });
  xs.forEach((x, i) => {
    if (beat[i] > 0.01)
      ring(x, seated - 10, 17, { color: P.ink, alpha: alpha * beat[i] * 0.6, width: 2.5 });
  });
  [cx - 40, cx + 40].forEach((x, i) =>
    people([x], top + 34 + 37, { alpha: alpha * seats[i], color: P.unknown, absent: true }),
  );
}

/* Failure 4: more material, no more reliable judgment. An Agent beside the stack of pages it writes, the stack
 * touching it (`pages` slabs, which may be fractional as the stack climbs), on one ground line with two short bars
 * (`bars`) that stay level however tall the stack grows. */
export function pagesMark(cx, cy, { alpha = 1, pages = 3, bars = 0 } = {}) {
  if (alpha < 0.01) return;
  const ground = cy + 64,
    whole = Math.floor(pages),
    part = pages - whole;
  line(cx - 108, ground, cx + 112, ground, { color: P.line, alpha, width: 2.5 });
  const agentX = cx - 80;
  stroke(
    () => {
      ctx.moveTo(agentX, ground - 46);
      ctx.lineTo(agentX + 23, ground - 23);
      ctx.lineTo(agentX, ground);
      ctx.lineTo(agentX - 23, ground - 23);
      ctx.closePath();
    },
    { color: P.evidence, alpha, width: 2.5 },
  );
  dot(agentX, ground - 23, 4.5, { color: P.evidence, alpha });
  const slab = (k) => ground - 4 - (k + 1) * 12;
  const slabs = (from, to) => () => {
    for (let k = from; k < to; k++) ctx.roundRect(cx - 48, slab(k), 62, 8, 2);
  };
  fill(slabs(0, whole), { color: P.row, alpha });
  stroke(slabs(0, whole), { color: P.ink, alpha, width: 2 });
  if (part > 0.01) {
    const lift = (1 - part) * 10;
    stroke(
      () => ctx.roundRect(cx - 48, slab(whole) - lift, 62, 8, 2),
      { color: P.ink, alpha: alpha * part, width: 2 },
    );
  }
  if (bars > 0.01) {
    const shape = () => {
      ctx.roundRect(cx + 44, ground - 26, 22, 26, 3);
      ctx.roundRect(cx + 78, ground - 26, 22, 26, 3);
    };
    fill(shape, { color: P.row, alpha: alpha * bars });
    stroke(shape, { color: P.ink, alpha: alpha * bars, width: 2.5 });
  }
}
