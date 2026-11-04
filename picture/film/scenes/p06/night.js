/* Part 06, stages A, B and D, the made-up case on its timeline. A: back to last night, the publication on the due hour
 * and the job log over the hour the job started, the publication on time and the job late. B: the timeline moves to
 * the top band and the fix's three layers stack below it, each acting on the timeline as it is said: the missing data
 * patched, the job's start moved before the due hour, and the lightest safeguard on the due hour; doing only the first
 * two is refused as a systemic fix. D: night after night, last night's late run keeps its record, and the later runs
 * that start on time do not erase it. */

import { ctx } from "../../canvas.js";
import { box, dot, line, stroke } from "../../drawing/strokes.js";
import { check, documentIcon } from "../../drawing/symbols.js";
import { lastNight, lastNightExtent, nights } from "../../drawing/timeline.js";
import { listIn, named, speaking } from "../../naming/lists.js";
import { NAME_GAP, nameText, rejectedName } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { bar, early, flowOf, missingPage, openMark, patchMark } from "../p05/kit.js";

/* A small shield, the lightest safeguard: a crest whose point faces down. */
export function shieldMark(x, y, s, { alpha = 1, color = P.evidence, width = 3 } = {}) {
  if (alpha < 0.01) return;
  stroke(
    () => {
      ctx.moveTo(x, y - s * 0.55);
      ctx.lineTo(x + s * 0.45, y - s * 0.38);
      ctx.lineTo(x + s * 0.42, y + s * 0.08);
      ctx.quadraticCurveTo(x + s * 0.32, y + s * 0.4, x, y + s * 0.58);
      ctx.quadraticCurveTo(x - s * 0.32, y + s * 0.4, x - s * 0.42, y + s * 0.08);
      ctx.lineTo(x - s * 0.45, y - s * 0.38);
      ctx.closePath();
    },
    { color, alpha, width },
  );
}

/* A: the full timeline. The publication, a page, stands over the due hour and the job log, a page, over the hour the
 * job started, their names on one baseline over them; the publication is stamped on time, and the job's late start is
 * measured below the rail. The figure stands centred with all its parts from the first word. */
function nightNames(t, c) {
  return {
    axis: { v: L("昨晚", "Last night"), alpha: early(t, c.first1, c.night) },
    late: { v: L("任务启动晚了", "Late start"), alpha: named(t, c.lateJob) },
  };
}
export function backStage(s, t, c, g) {
  const names = nightNames(t, c),
    e = lastNightExtent(1, { late: 1, names }),
    pageTop = 551 - 36 - 110 - NAME_GAP - 30,
    x = 960 - (e.left + e.right) / 2,
    y = 505 - (Math.min(e.top, pageTop - 551) + e.bottom) / 2;
  const m = lastNight(x, y, 1, {
    alpha: g,
    late: soon(t, c.lateJob + 0.05, 0.7),
    arrival: { upto: ramp(t, c.log + 0.35, 0.2), alpha: 1 },
    flow: flowOf(t, 0.25),
    names,
  });
  // The publication over the due hour and the job log over the hour the job started, each with its stem to the rail.
  const page = (h, shown, at, rows) => {
    const b = m.above(h),
      a = g * shown(t),
      reach = soon(t, at + 0.1, 0.5),
      cx = (b.left + b.right) / 2;
    documentIcon(b.left + 20, b.top, b.right - b.left - 40, b.bottom - b.top, { alpha: a, rows });
    line(cx, b.bottom, cx, mix(b.bottom, m.y, reach), { color: P.line, alpha: a, width: 2 });
    return b;
  };
  const pubIn = (v) => early(v, c.checked, c.publication),
    logIn = (v) => named(v, c.log),
    pub = page(0, pubIn, Math.max(c.checked - 0.2, c.publication - 1.35), 2),
    log = page(2, logIn, c.log, 2);
  nameText(L("发布时间", "Publication time"), m.due, pub.top - NAME_GAP, {
    valign: "bottom",
    alpha: g * pubIn(t),
  });
  nameText(L("任务日志", "Job log"), m.arrival, log.top - NAME_GAP, {
    valign: "bottom",
    alpha: g * logIn(t),
  });
  // On time: the publication's stamp at its lower right, named beside it.
  const on = g * named(t, c.onTime),
    sx = pub.right - 20,
    sy = pub.bottom - 18;
  dot(sx, sy, 17, { color: P.ground, alpha: on });
  dot(sx, sy, 17, { color: P.evidence, alpha: on, hollow: true, width: 2.5 });
  check(sx, sy + 1, 18, { alpha: on, upto: soon(t, c.onTime + 0.05, 0.4) });
  nameText(L("按时发布", "On time"), sx + 17 + NAME_GAP, sy, { align: "left", alpha: on });
}

/* B: the compact timeline in the top band and the three layers below it. The layers hang from a spine named on their
 * count, each a slab named at its right on its words, one list; the slab being said lights. On the timeline, the
 * missing data's place (dashed, the missing thing the narration names) stands over the due hour and its patch fills
 * it; the job's start moves from its late hour to before the due hour and the late measure withdraws; the safeguard
 * stands on the due hour. Doing only the first two: they take their checks, the third its open mark, and a bracket
 * gathering the first two is refused as the systemic fix. */
const B = {
  scale: 0.75,
  x: 960,
  y: 250,
  spine: 642,
  slab: [680, 1060],
  ys: [458, 588, 718],
  h: 84,
};
export function layersStage(s, t, c, g) {
  const move = soon(t, c.earlier + 0.05, 0.9),
    names = {
      axis: { v: L("昨晚", "Last night"), side: "left", alpha: 1 },
      late: { v: L("任务启动晚了", "Late start"), alpha: 1 - ramp(t, c.earlier + 0.05, 0.4) },
    };
  const m = lastNight(B.x, B.y, B.scale, {
    alpha: g,
    late: { upto: 1, alpha: 1 - move },
    lateBy: mix(2, -0.6, move),
    arrival: 1,
    flow: flowOf(t, 0.25),
    names,
  });
  // The missing data's place over the due hour, named at its right, and the patch that fills it.
  const place = m.above(0),
    missing = g * named(t, Math.min(c.missing, c.fill)),
    patched = g * ramp(t, Math.max(c.missing, c.fill) + 0.2, 0.4);
  missingPage(place.left + 14, place.top, place.right - place.left - 28, place.bottom - place.top, {
    alpha: missing,
  });
  documentIcon(
    place.left + 14,
    place.top,
    place.right - place.left - 28,
    place.bottom - place.top,
    {
      alpha: patched,
      rows: 0,
    },
  );
  patchMark((place.left + place.right) / 2, place.bottom - 22, 22, { alpha: patched });
  line(m.due, place.bottom, m.due, m.y - m.tick, { color: P.line, alpha: missing, width: 2 });
  nameText(
    L("缺的数据", "The missing data"),
    place.right + NAME_GAP - 14,
    (place.top + place.bottom) / 2,
    {
      align: "left",
      alpha: missing,
    },
  );
  // Prevention before the job's start and detection after the due hour: two small open points on the rail, each on
  // its word, where the existing system could have stopped or caught the delay.
  [
    [-1.3, c.asks[1]],
    [0.6, c.asks[2]],
  ].forEach(([h, at]) => openMark(m.at(h), m.y, 7, { alpha: g * ramp(t, at - 0.15, 0.4) }));
  // The safeguard on the due hour, named under the rail once the late measure has gone.
  const guard = g * named(t, c.safeguard);
  dot(m.due, m.y, 15, { color: P.ground, alpha: guard });
  shieldMark(m.due, m.y, 26, { alpha: guard });
  nameText(L("刚好够用的防护", "The lightest safeguard"), m.due, m.y + 15 + NAME_GAP, {
    valign: "top",
    alpha: guard,
  });
  // The three layers.
  const [x0, x1] = B.slab,
    ats = c.layers,
    top = B.ys[0] - B.h / 2,
    bottom = B.ys[2] + B.h / 2,
    count = g * early(t, c.first2, c.three);
  line(B.spine, top, B.spine, mix(top, bottom, soon(t, c.three - 0.1, 0.8)), {
    color: P.ink,
    alpha: count,
    width: 3,
  });
  nameText(L("三层", "Three layers"), B.spine - NAME_GAP, (top + bottom) / 2, {
    align: "right",
    alpha: count,
  });
  const done = g * ramp(t, c.firstTwo - 0.1, 0.4);
  B.ys.forEach((y, i) => {
    const q = g * ramp(t, ats[i] - 0.15, 0.4),
      lit = g * speaking(t, ats, i);
    line(B.spine, y, x0, y, { color: P.line, alpha: q, width: 2 });
    box(x0, y - B.h / 2, x1 - x0, B.h, {
      fill: P.row,
      stroke: P.line,
      alpha: q,
      radius: 10,
      width: 2.5,
    });
    box(x0, y - B.h / 2, x1 - x0, B.h, { stroke: P.ink, alpha: q * lit, radius: 10, width: 3 });
    // The first two take their checks once they are said to be done; the third keeps the open question of why the
    // existing system neither prevented nor caught the delay, from the words that ask it.
    if (i < 2) check(x0 + 190, y, 30, { alpha: done, upto: soon(t, c.firstTwo + i * 0.2, 0.4) });
    else openMark(x0 + 190, y, 17, { alpha: g * ramp(t, c.asks[0] + 0.05, 0.4) });
    if (i === 0) patchMark(x0 + 60, y, 30, { alpha: q });
    if (i === 1) {
      dot(x0 + 60, y, 17, { color: P.ink, alpha: q, hollow: true, width: 2.5 });
      line(x0 + 60, y, x0 + 60, y - 10, { color: P.ink, alpha: q, width: 2.5 });
      line(x0 + 60, y, x0 + 52, y - 4, { color: P.ink, alpha: q, width: 2.5 });
    }
    if (i === 2) shieldMark(x0 + 60, y, 34, { alpha: q, color: P.ink });
    nameText(
      L(["控制影响", "修复", "防止再发生"], ["Containment", "Repair", "Prevention"])[i],
      x1 + NAME_GAP,
      y,
      {
        align: "left",
        alpha: g * listIn(t, ats, i),
        set: "layers",
      },
    );
  });
  // Only the first two: a bracket beyond the names gathers them, refused as the fix at the root.
  const refusedAt = Math.max(c.notFix - 0.2, c.systemic - 1.35),
    bx = x1 + NAME_GAP + L(170, 190),
    a = g * named(t, refusedAt - 0.4),
    ty = B.ys[0] - B.h / 2 + 6,
    by = B.ys[1] + B.h / 2 - 6;
  stroke(
    () => {
      ctx.moveTo(bx - 14, ty);
      ctx.lineTo(bx, ty);
      ctx.lineTo(bx, mix(ty, by, soon(t, refusedAt - 0.4, 0.6)));
      if (soon(t, refusedAt - 0.4, 0.6) > 0.98) ctx.lineTo(bx - 14, by);
    },
    { color: P.ink, alpha: a, width: 2.5 },
  );
  rejectedName(L("从根上修好", "A systemic fix"), bx + NAME_GAP, (ty + by) / 2, {
    align: "left",
    alpha: g * named(t, refusedAt),
    mark: ramp(t, c.notFix + 0.05, 0.4),
  });
}

/* D: night after night. Four nights in a row: last night at the left with its two hours lit and its record kept over
 * it, then the later nights, which start on time with their checks. Their way back over last night's record stops at
 * a bar: they do not erase it. */
const D = { xs: [570, 830, 1090, 1350], y: 560 };
export function recordStage(s, t, c, g) {
  const later = g * named(t, c.laterRuns);
  nights(D.xs, D.y, 0.3, { alpha: g, arrival: 1, lit: 1, lateBy: [2, 0, 0, 0] });
  const last = D.xs[0],
    page = { w: 92, h: 116 },
    top = D.y - 40 - page.h;
  documentIcon(last - page.w / 2, top, page.w, page.h, { alpha: g, rows: 2 });
  line(last, top + page.h, last, D.y, { color: P.line, alpha: g, width: 2 });
  nameText(L("延迟的那次记录", "Last night's late run"), last, top - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first4, c.record),
  });
  // The later nights' checks, one stroke, and their name over the middle of them.
  stroke(
    () =>
      D.xs.slice(1).forEach((x) => {
        ctx.moveTo(x - 64, D.y - 34);
        ctx.lineTo(x - 54, D.y - 25);
        ctx.lineTo(x - 38, D.y - 44);
      }),
    { color: P.evidence, alpha: later, width: 3.5 },
  );
  nameText(L("后面几次", "Later runs"), (D.xs[1] + D.xs[3]) / 2, D.y - 60 - NAME_GAP, {
    valign: "bottom",
    alpha: later,
  });
  // Their way back to last night's record stops at a bar before it.
  const erase = g * named(t, c.erase),
    wy = D.y + 70,
    reach = soon(t, c.erase - 0.1, 0.8);
  stroke(
    () => {
      ctx.moveTo(D.xs[2], D.y + 22);
      ctx.lineTo(D.xs[2], wy);
      ctx.lineTo(mix(D.xs[2], last + 90, reach), wy);
    },
    { color: P.line, alpha: erase, width: 2.5 },
  );
  bar(last + 80, wy, { alpha: g * ramp(t, c.erase + 0.5, 0.3), vertical: true, length: 40 });
  rejectedName(L("抹掉", "Erasure"), (last + 80 + D.xs[2]) / 2, wy + 24 + NAME_GAP, {
    valign: "top",
    alpha: erase,
    mark: ramp(t, c.erase + 0.5, 0.3),
  });
}
