/* Part 08, stages A, A2 and B: making the next attempt better. A, the made-up case: last night's delay on one lane and
 * the schedule on another, sharing the agreed time; the delay can recur, so a check is left before calling it fixed,
 * a monitor on the schedule that warns the moment the agreed time passes without the data. A2: what learning aims at,
 * three gains, and a growing file count refused. B: the early signs night after night, their pattern and impact, and
 * a needed safeguard that must not wait for an incident. */

import { ctx } from "../../canvas.js";
import { dot, measure, ring, stroke } from "../../drawing/strokes.js";
import { diamond, documentIcon, seal } from "../../drawing/symbols.js";
import { lastNight, nights } from "../../drawing/timeline.js";
import { clearOfTitle } from "../../framing/chapters.js";
import { beats, listIn, named } from "../../naming/lists.js";
import { NAME_GAP, growName, nameText, rejectedName } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { centring, early, flowOf, glide, openMark } from "../p05/kit.js";

/* A: two lanes at 0.8 sharing the agreed time. The upper lane is last night, its two hours lit and named over them;
 * the lower lane is the next nights, where the same delay may recur, drawn dashed and named over it, and which is the
 * schedule. The agreed time is the scene's own line through both lanes' due hour; the monitor stands on it on the
 * schedule and flashes as a run passes the agreed time without the data. The stamp of "fixed" stands open at the right
 * until the check is left. Every mark waits for the rising chapter title to clear it. */
const A = { x: 940, up: 380, low: 600, scale: 0.8, stamp: 1470 };
export function lanesStage(s, t, c, g0) {
  const g = g0 * clearOfTitle(s, t, 248),
    upper = lastNight(A.x, A.up, A.scale, {
      alpha: g,
      due: 1,
      arrival: 1,
      lit: soon(t, c.first1 - 0.1, 0.8),
      names: {
        late: {
          v: L("这种延迟", "This kind of delay"),
          side: "top",
          alpha: early(t, c.first1, c.first1),
        },
      },
    });
  const recur = g * named(t, c.recur);
  lastNight(A.x, A.low, A.scale, {
    alpha: recur,
    due: 1,
    lit: { upto: soon(t, c.recur, 0.8), dash: true },
    flow: t > c.warns ? flowOf(t, 0.3) : null,
    names: {
      late: { v: L("还会出现", "Recurrence"), side: "top", alpha: 1 },
      axis: { v: L("调度", "The schedule"), side: "left", alpha: named(t, c.schedule) },
    },
  });
  // The agreed time: a line through both lanes' due hour, named at its top.
  const agreed = g * named(t, c.agreed),
    dx = upper.due;
  stroke(
    () => {
      ctx.moveTo(dx, A.up - 64);
      ctx.lineTo(dx, A.up - 18);
      ctx.moveTo(dx, A.up + 18);
      ctx.lineTo(dx, A.low - 22);
    },
    { color: P.authority, alpha: agreed, width: 2.5 },
  );
  nameText(L("约定时间", "The agreed time"), dx, A.up - 64 - NAME_GAP, {
    valign: "bottom",
    alpha: agreed,
  });
  // The monitor on the schedule at the agreed time, flashing as it warns.
  const monitor = g * named(t, c.monitor);
  ring(dx, A.low, 17, { color: P.evidence, alpha: monitor, width: 3 });
  beats(t, dx, A.low, 26, [c.warns, c.warns + 0.6], { color: P.unknown, alpha: g });
  nameText(L("监控", "A monitor"), dx, A.low + 17 + NAME_GAP, { valign: "top", alpha: monitor });
  nameText(L("告警", "Warning"), dx, A.low + 17 + NAME_GAP + 46, {
    valign: "top",
    alpha: g * named(t, c.warns),
  });
  // "Fixed": a stamp that stands open until the check is left, then is stamped.
  const fixed = g * named(t, c.fixed),
    stamped = soon(t, c.monitor + 0.2, 0.5),
    sy = (A.up + A.low) / 2;
  seal(A.stamp, sy, 40, {
    color: P.evidence,
    alpha: fixed,
    stamp: fixed * stamped,
    hollow: stamped < 0.5,
  });
  nameText(L("修好了", "Fixed"), A.stamp, sy + 40 + NAME_GAP, { valign: "top", alpha: fixed });
}

/* A2: the aim of learning, named over the lane of the next attempt, three strands drawn as one stroke from the first
 * words; each gain then acts on its strand, one list named under it: the next failure found earlier (its detection
 * moves back along the strand, its old place a muted trace), judged more easily (a decision's doubt clears), and less
 * manual rescue (a long band shrinks). A pile of files is refused under them. A point runs the first strand. */
const G = { x0: 700, x1: 1220, ys: [360, 480, 600] };
export function aimStage(s, t, c, g) {
  const ats = c.gains,
    [y0, y1, y2] = G.ys,
    mid = (G.x0 + G.x1) / 2;
  nameText(L("学习的目的", "The aim of learning"), mid, y0 - 34 - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first1b, c.aim),
  });
  stroke(
    () =>
      G.ys.forEach((y) => {
        ctx.moveTo(G.x0, y);
        ctx.lineTo(G.x1, y);
      }),
    { color: P.line, alpha: g, width: 3.5 },
  );
  const q = flowOf(t, 0.3);
  dot(mix(G.x0, G.x1, q), y0, 5 * Math.min(1, q * 8, (1 - q) * 8), { color: P.ink, alpha: g });
  // Found earlier: the failure stands; its detection moves earlier, leaving a muted trace where it was.
  const f = g * ramp(t, ats[0] - 0.15, 0.4),
    early0 = soon(t, ats[0] + 0.2, 0.9);
  dot(1020, y0, 8, { color: P.unknown, alpha: f });
  ring(1110, y0, 14, { color: P.muted, alpha: f * early0 * 0.6, width: 2 });
  ring(mix(1110, 800, early0), y0, 14, { color: P.evidence, alpha: f, width: 3 });
  // Judged more easily: an open decision whose doubt clears.
  const j = g * ramp(t, ats[1] - 0.15, 0.4),
    clear = soon(t, ats[1] + 0.2, 0.6);
  diamond(mid, y1, 20, { color: P.authority, alpha: j, solid: clear > 0.5 });
  openMark(mid, y1, 28, { alpha: j * (1 - clear) });
  // Less manual rescue: a long band that shrinks.
  const r = g * ramp(t, ats[2] - 0.15, 0.4),
    shrink = soon(t, ats[2] + 0.2, 1.2);
  stroke(
    () => {
      ctx.moveTo(G.x0 + 30, y2);
      ctx.lineTo(mix(G.x1 - 30, G.x0 + 140, shrink), y2);
    },
    { color: P.muted, alpha: r, width: 12, cap: "butt" },
  );
  L(
    ["更早被发现", "更容易判断", "更少靠人工抢救"],
    ["Earlier detection", "Easier judgment", "Less manual rescue"],
  ).forEach((v, i) =>
    nameText(v, mid, G.ys[i] + 30 + NAME_GAP, {
      valign: "top",
      alpha: g * listIn(t, ats, i),
      set: "gains",
    }),
  );
  // A growing file count, refused under the gains.
  const files = g * named(t, c.files),
    fy = y2 + 160,
    label = L("文件变多", "The file count"),
    fx = mid - (60 + NAME_GAP + measure(label) + 42) / 2;
  stroke(
    () => {
      for (let k = 0; k < 4; k++) {
        const x = fx + 30 + k * 9,
          y = fy - 26 - k * 9;
        ctx.moveTo(x, y + 52);
        ctx.lineTo(x, y);
        ctx.lineTo(x + 40, y);
      }
    },
    { color: P.muted, alpha: files, width: 2 },
  );
  documentIcon(fx, fy - 26, 44, 56, { alpha: files, rows: 2 });
  rejectedName(label, fx + 60 + NAME_GAP, fy, {
    align: "left",
    alpha: files,
    mark: ramp(t, c.notFiles + 0.05, 0.4),
  });
}

/* B: early signs. Four nights before last night in a row, named over it from the first words that speak of them; a few
 * of them a few minutes late, their delays lit as one stroke and named under them; a rescue mark over each late night,
 * one stroke, named; under the row two checks, the pattern and the impact, each named. Then a needed safeguard,
 * dashed, stands at the row's right, the stage gliding left to make room for it, and the incident it must not wait for
 * is refused under it. */
const B = { y: 480, xs: [500, 760, 1020, 1280], late: [0, 0.4, 0, 0.35], guard: 1450, card: 64 };
/* The safeguard's name stands beside the last card, so English sets it on two lines to keep clear of the card. */
const SAFEGUARD = () => L(["该有的防护"], ["A needed", "safeguard"]);
export function signsStage(s, t, c, g) {
  const right = B.guard + Math.max(...SAFEGUARD().map((v) => measure(v))) / 2,
    left = B.xs[0] - 108 - NAME_GAP - measure(L("晚几分钟", "A few minutes late")),
    rowEnd = B.xs[3] + 108,
    shift = glide(t, centring(B.xs[0] - 108, rowEnd), [
      [c.minutes, centring(left, rowEnd)],
      [c.guard, centring(left, right)],
    ]),
    xs = B.xs.map((x) => x + shift),
    cardTop = B.y - 34 - B.card,
    lateIn = g * named(t, c.minutes);
  nights(xs, B.y, 0.3, { alpha: g, arrival: 1, lit: lateIn, lateBy: B.late });
  // Each night's run, a small card over its rail, the cards one stroke: the row is one mark under one name.
  stroke(
    () =>
      xs.forEach((x) => {
        ctx.moveTo(x - 30, B.y - 34);
        ctx.lineTo(x + 30, B.y - 34);
        ctx.lineTo(x + 30, cardTop);
        ctx.lineTo(x - 30, cardTop);
        ctx.closePath();
        ctx.moveTo(x, B.y - 34);
        ctx.lineTo(x, B.y - 10);
      }),
    { color: P.ink, alpha: g, width: 2.5 },
  );
  const signs = Math.max(c.signsClause - 0.2, c.signs - 1.35);
  growName(
    t,
    L(["出事之前", "的苗头"], ["Early signs"]),
    L([c.first2, signs], [signs]),
    (xs[0] + xs[3]) / 2,
    cardTop - NAME_GAP,
    { valign: "bottom", align: "center", build: true, alpha: g },
  );
  nameText(L("晚几分钟", "A few minutes late"), xs[0] - 108 - NAME_GAP, B.y, {
    align: "right",
    alpha: lateIn,
  });
  // A rescue mark under each late night, one stroke: a ring, someone stepping in.
  const rescue = g * named(t, c.rescue);
  stroke(
    () =>
      xs.forEach((x, i) => {
        if (!B.late[i]) return;
        ctx.moveTo(x + 14, B.y + 40);
        ctx.arc(x, B.y + 40, 14, 0, Math.PI * 2);
      }),
    { color: P.authority, alpha: rescue, width: 3 },
  );
  beats(t, xs[1], B.y + 40, 20, [c.changes], { color: P.authority, alpha: g });
  beats(t, xs[3], B.y + 40, 20, [c.changes], { color: P.authority, alpha: g });
  if (t > c.guard + 1) {
    const q = flowOf(t, 0.3);
    dot(mix(xs[0] - 108, xs[3] + 108, q), B.y, 4 * Math.min(1, q * 8, (1 - q) * 8), {
      color: P.ink,
      alpha: g,
    });
  }
  nameText(L("临时救场", "Stepping in again and again"), (xs[1] + xs[3]) / 2, B.y + 54 + NAME_GAP, {
    valign: "top",
    alpha: rescue,
  });
  // The pattern and the impact: two checks under the row.
  const checks = c.look;
  [0, 1].forEach((i) => {
    const x = mix(xs[0], xs[3], i ? 0.72 : 0.28),
      a = g * ramp(t, checks[i] - 0.15, 0.4);
    ring(x, B.y + 160, 18, { color: P.evidence, alpha: a, width: 2.5 });
    dot(x, B.y + 160, 5, { color: P.evidence, alpha: a });
  });
  L(["规律", "影响"], ["Pattern", "Impact"]).forEach((v, i) =>
    nameText(v, mix(xs[0], xs[3], i ? 0.72 : 0.28), B.y + 178 + NAME_GAP, {
      valign: "top",
      alpha: g * listIn(t, checks, i),
      set: "look",
    }),
  );
  // The needed safeguard, dashed, and the two waits refused under it.
  const guard = g * named(t, c.guard),
    gx = B.guard + shift;
  stroke(
    () => {
      ctx.moveTo(gx, B.y - 34);
      ctx.lineTo(gx + 27, B.y - 23);
      ctx.lineTo(gx + 25, B.y + 5);
      ctx.quadraticCurveTo(gx + 19, B.y + 24, gx, B.y + 35);
      ctx.quadraticCurveTo(gx - 19, B.y + 24, gx - 25, B.y + 5);
      ctx.lineTo(gx - 27, B.y - 23);
      ctx.closePath();
    },
    { color: P.evidence, alpha: guard, width: 3, dash: [7, 6] },
  );
  nameText(SAFEGUARD(), gx, B.y - 34 - NAME_GAP, {
    valign: "bottom",
    alpha: guard,
  });
  rejectedName(L("出了事", "An incident"), gx, B.y + 70, {
    alpha: g * named(t, c.wait),
    mark: ramp(t, c.wait + 0.3, 0.3),
  });
}
