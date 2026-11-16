/* Part 08, stages A, A2 and B: making the next attempt better. A, the made-up case: last night's delay on one lane and
 * the schedule on another, sharing the agreed time; the delay can recur, so a check is left before calling it fixed,
 * a monitor on the schedule that warns the moment the agreed time passes without the data. A2: what learning aims at,
 * three gains, and a growing file count refused. B: the early signs night after night, their pattern, impact and
 * direction, and a needed safeguard that must not wait for an incident. */

import { ctx } from "../../canvas.js";
import { dot, flowAt, flowDot, measure, ring, stroke } from "../../drawing/strokes.js";
import { diamond, documentIcon, seal } from "../../drawing/symbols.js";
import { HOUR, lastNight, nights } from "../../drawing/timeline.js";
import { beats, listIn, named } from "../../naming/lists.js";
import { NAME_GAP, growName, nameText, rejectedName } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { cue } from "../../timing/cues.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { drawShare, travel } from "../../timing/pauses.js";
import { centring, early, earliest, openMark } from "../p05/kit.js";

/* A: two lanes at 0.8 sharing the agreed time. The upper lane is last night, its two hours lit and named over them;
 * the lower lane is the next nights, where the same delay may recur, drawn dashed and named over it, and which is the
 * schedule. The agreed time is the scene's own line through both lanes' due hour; the monitor stands on it on the
 * schedule and flashes as a run passes the agreed time without the data. The stamp of "fixed" stands open at the right
 * until the check is left, near enough the lanes that the picture with it, before the schedule is named at the left,
 * stays within the reviewers' 50 px, and the schedule's name, its noun alone as 07.4 names it, keeps the picture with
 * both as near the centre (EN9-n12). */
const A = { x: 940, up: 380, low: 600, scale: 0.8, stamp: 1460 };
export function lanesStage(s, t, c, g0) {
  const g = g0,
    upper = lastNight(A.x, A.up, A.scale, {
      alpha: g,
      due: 1,
      arrival: 1,
      lit: { draw: { t, at: c.first1 - 0.1 } },
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
    // The supposed delay's two dashed hours draw on as every stroke's tip does, at most 820 px/s.
    lit: { upto: drawShare(t, c.recur, 2 * HOUR * A.scale, 0.8), dash: true },
    flow: { t, from: c.warns },
    names: {
      late: { v: L("还会出现", "Recurrence"), side: "top", alpha: 1 },
      axis: { v: L("调度", "Schedule"), side: "left", alpha: named(t, c.schedule) },
    },
  });
  // The agreed time: a line through both lanes' due hour, named at its top, which stands high enough that its name
  // keeps a line and a half over the delay's name beside it (EN9-n2).
  const agreed = g * named(t, c.agreed),
    dx = upper.due;
  stroke(
    () => {
      ctx.moveTo(dx, A.up - 80);
      ctx.lineTo(dx, A.up - 18);
      ctx.moveTo(dx, A.up + 18);
      ctx.lineTo(dx, A.low - 22);
    },
    { color: P.authority, alpha: agreed, width: 2.5 },
  );
  nameText(L("约定时间", "The agreed time"), dx, A.up - 80 - NAME_GAP, {
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
  // "Fixed": a stamp that stands open until the check is left, then is stamped in one continuous movement.
  const fixed = g * named(t, c.fixed),
    stamped = soon(t, c.monitor + 0.2, 0.5),
    sy = (A.up + A.low) / 2;
  seal(A.stamp, sy, 40, {
    color: P.evidence,
    alpha: fixed,
    stamp: fixed * stamped,
    hollow: 1 - stamped,
  });
  nameText(L("修好了", "Fixed"), A.stamp, sy + 40 + NAME_GAP, { valign: "top", alpha: fixed });
}

/* A2: the aim of learning and the gains it aims at, which hang from one spine at their left: the spine and the three
 * strands it holds stand from the stage's cut as one stroke, its two ends quiet points, named over its top by the aim's
 * name set from its edge, so the stage opens at its full extent, centred, under the one name of the aims. Each gain
 * then acts on its strand on its own words, one list, each named just under its own strand, nearer it than the next:
 * the next failure found earlier (its detection moves back along the strand, its old place a muted trace), judged more
 * easily (a decision's doubt clears), and less manual rescue (a long band shrinks). A pile of files is refused under
 * them. A point runs the first strand once as its gain is said, and rests. The next failure on the first strand comes
 * where the first gain's words begin: on "find the next failure earlier", and on 「下一次失败」 in Chinese, which names the
 * failure before it is found earlier. */
const G = { x0: 700, x1: 1220, ys: [360, 480, 600], reach: 24, drop: 28 };
export function aimStage(s, t, c, g) {
  const ats = c.gains,
    starts = [cue(s, "下一次失败", "find the next failure earlier"), ats[1], ats[2]],
    [y0, y1, y2] = G.ys,
    mid = (G.x0 + G.x1) / 2,
    top = y0 - G.reach,
    bottom = y2 + G.reach;
  nameText(L("学习的目的", "The aim of learning"), G.x0, y0 - 34 - NAME_GAP, {
    align: "left",
    valign: "bottom",
    alpha: g * early(t, c.first1b, c.aim),
  });
  stroke(
    () => {
      ctx.moveTo(G.x0, top);
      ctx.lineTo(G.x0, bottom);
      G.ys.forEach((y) => {
        ctx.moveTo(G.x0, y);
        ctx.lineTo(G.x1, y);
      });
    },
    { color: P.line, alpha: g, width: 3.5 },
  );
  [top, bottom].forEach((y) => dot(G.x0, y, 4.5, { color: P.line, alpha: g }));
  // The point's one pass starts at the spine once the next failure stands on the first strand.
  const runs = flowAt(t, G.x1 - G.x0, { from: starts[0] + 0.65, passes: 1 });
  flowDot(mix(G.x0, G.x1, runs?.q ?? 0), y0, 5, runs, { color: P.ink, alpha: g });
  // Found earlier: the next failure stands on its words; on the gain's words its detection glides earlier over 1.1 s
  // of voice time (310 px, at most about 420 px/s), leaving a muted trace where it was.
  const f = g * ramp(t, starts[0] - 0.15, 0.4),
    d = g * ramp(t, ats[0] - 0.15, 0.4),
    early0 = travel(t, ats[0] + 0.2, 1.1);
  dot(1020, y0, 8, { color: P.unknown, alpha: f });
  ring(1110, y0, 14, { color: P.muted, alpha: d * early0 * 0.6, width: 2 });
  ring(mix(1110, 800, early0), y0, 14, { color: P.evidence, alpha: d, width: 3 });
  // Judged more easily: an open decision whose doubt clears; its open mark keeps inside the gap the gain's name leaves
  // under the strand.
  const j = g * ramp(t, ats[1] - 0.15, 0.4),
    clear = soon(t, ats[1] + 0.2, 0.6);
  diamond(mid, y1, 20, { color: P.authority, alpha: j, solid: clear });
  openMark(mid, y1, 24, { alpha: j * (1 - clear) });
  // Less manual rescue: a long band that shrinks, its end gliding back over 1.2 s of voice time (350 px, at most
  // about 440 px/s).
  const r = g * ramp(t, ats[2] - 0.15, 0.4),
    shrink = travel(t, ats[2] + 0.2, 1.2);
  stroke(
    () => {
      ctx.moveTo(G.x0 + 30, y2);
      ctx.lineTo(mix(G.x1 - 30, G.x0 + 140, shrink), y2);
    },
    { color: P.muted, alpha: r, width: 12, cap: "butt" },
  );
  // Each gain is named in the voice's words, so no name turns a verb of the narration into a noun of its own
  // (EN15-n11).
  L(
    ["更早被发现", "更容易判断", "少靠人救火"],
    ["Find it earlier", "Judge it more easily", "Less manual rescue"],
  ).forEach((v, i) =>
    nameText(v, mid, G.ys[i] + G.drop, {
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
 * one stroke, named under a bracket that joins the two; under the row three checks, the pattern, the impact and the
 * direction, each named, standing midway between neighbouring nights. Then a needed safeguard, dashed, stands at the
 * row's right, and the incident it must not wait for is refused under it. While the row builds, the stage stands where
 * the row alone stays within the reviewers' 90 px of the centre and the row with its delays named at its left, which
 * holds for seconds, within their 50 px for a settled picture; in Chinese, whose row alone holds 2.3 s before its
 * delays are named, it stands midway between the two, within 50 px of both; when the safeguard comes it glides once (a
 * structural glide, timing/pauses.js travel) to centre the whole, less `lean`, since the safeguard and its refusal
 * weigh the right: so the settled weight stands within 60 px of the centre while the settled box stays within 50 px
 * (the English row stood 156 px off while it built at a lean of 90 held from the cut). */
const B = {
  y: 480,
  xs: [500, 760, 1020, 1280],
  late: [0, 0.4, 0, 0.35],
  guard: 1470,
  card: 64,
  lean: () => L(30, 44),
};
/* The safeguard's name, one line over its mark, clear of the last card. */
const SAFEGUARD = () => L("该有的防护", "A needed safeguard");
export function signsStage(s, t, c, g) {
  const right = B.guard + measure(SAFEGUARD()) / 2,
    left = B.xs[0] - 108 - NAME_GAP - measure(L("晚几分钟", "A few minutes late")),
    rowStart = B.xs[0] - 108,
    rowEnd = B.xs[3] + 108,
    // The row alone may stand 90 px off where it holds under 1.5 s, as in English; the row named at its left stands
    // about 8 px left of its box's centre.
    building = (centring(left, rowEnd) + centring(rowStart, rowEnd)) / 2 + L(0, 24),
    shift = mix(building, centring(left, right) - B.lean(), travel(t, c.guard - 0.15, 0.9)),
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
  const signs = earliest(c.signsClause, c.signs);
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
  const runs = flowAt(t, xs[3] + 108 - (xs[0] - 108), { from: c.guard + 1 });
  flowDot(mix(xs[0] - 108, xs[3] + 108, runs?.q ?? 0), B.y, 4, runs, { color: P.ink, alpha: g });
  // The two rescues are named as one: a bracket under their rings, its ends turned up to them, the name under its
  // middle, so the name never reads as the night between them.
  const bracketY = B.y + 64;
  stroke(
    () => {
      ctx.moveTo(xs[1], bracketY - 8);
      ctx.lineTo(xs[1], bracketY);
      ctx.lineTo(xs[3], bracketY);
      ctx.lineTo(xs[3], bracketY - 8);
    },
    { color: P.line, alpha: rescue, width: 2 },
  );
  nameText(
    L("临时救场", "Stepping in again and again"),
    (xs[1] + xs[3]) / 2,
    bracketY + NAME_GAP - 6,
    {
      valign: "top",
      alpha: rescue,
    },
  );
  // The pattern, the impact and the direction: three checks under the row, midway between neighbouring nights.
  const checks = c.look,
    checkXs = [0, 1, 2].map((i) => (xs[i] + xs[i + 1]) / 2);
  [0, 1, 2].forEach((i) => {
    const x = checkXs[i],
      a = g * ramp(t, checks[i] - 0.15, 0.4);
    ring(x, B.y + 160, 18, { color: P.evidence, alpha: a, width: 2.5 });
    dot(x, B.y + 160, 5, { color: P.evidence, alpha: a });
  });
  L(["规律", "影响", "走向"], ["Pattern", "Impact", "Direction"]).forEach((v, i) =>
    nameText(v, checkXs[i], B.y + 178 + NAME_GAP, {
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
