/* Part 07, stages D and E: a delegation and who answers for it. D, the made-up case: last night's delegation fills
 * the boundary's places one by one, the purpose with failure 1's fork, the limits with a lock, the deliverable with
 * the compact timeline and its two open times, where each came from and what could not be verified; and the way to the
 * schedule stops at the boundary: stop and ask first. E: the person who calls an Agent owns its context, permissions,
 * verification and result, and submitting the work vouches for it. */

import { ctx } from "../../canvas.js";
import { box, dot, line, measure, path, stroke } from "../../drawing/strokes.js";
import { agent, check, clock, lock, person } from "../../drawing/symbols.js";
import { lastNight } from "../../drawing/timeline.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, nameText } from "../../naming/names.js";
import { railNames } from "../../naming/placement.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { bar, early, flowOf, glide, openMark } from "../p05/kit.js";

/* Failure 1's fork: a way that splits, its taken branch in the colour of authority. */
function fork(x, y, { alpha = 1 } = {}) {
  if (alpha < 0.01) return;
  path(
    [
      [x - 34, y],
      [x - 6, y],
      [x + 26, y - 18],
    ],
    { color: P.authority, alpha, width: 3 },
  );
  path(
    [
      [x - 6, y],
      [x + 26, y + 18],
    ],
    { color: P.muted, alpha, width: 3 },
  );
  dot(x - 34, y, 4.5, { color: P.ink, alpha });
}

/* D: the delegation. Its boundary stands whole from the first words, four sides in one stroke, the delegation's
 * scope named at its corner; each part takes its place inside on its words, centred on the boundary's axis: the
 * purpose with failure 1's fork, the limits with a lock, then the deliverable, the compact timeline with an open mark
 * on each time to find, a source under each and an open mark for what could not be verified. The schedule stands
 * outside at the right, and the way to it stops at a bar on the boundary's edge. The stage stands centred and glides
 * left as the schedule arrives. */
const D = {
  top: 280,
  bottom: 700,
  half: 380,
  rows: [340, 400],
  rail: 530,
  sources: 600,
  scale: 0.7,
  out: 140,
};
export function delegationStage(s, t, c, g) {
  const reach = D.half + D.out + 50,
    x = 960 + glide(t, 0, [[Math.min(c.schedule, c.stop), -(reach - D.half) / 2]]),
    x0 = x - D.half,
    x1 = x + D.half;
  stroke(
    () =>
      [
        [x0 + 16, D.top, x1 - 16, D.top],
        [x1, D.top + 16, x1, D.bottom - 16],
        [x0 + 16, D.bottom, x1 - 16, D.bottom],
        [x0, D.top + 16, x0, D.bottom - 16],
      ].forEach(([ax, ay, bx, by]) => {
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
      }),
    { color: P.line, alpha: g, width: 3.5 },
  );
  // The Agent the delegation is given to, inside its boundary at the top right.
  agent(x1 - 70, D.top + 56, { alpha: g, size: 1.2 });
  nameText(L("委托", "A delegation"), x0, D.top - NAME_GAP, {
    align: "left",
    valign: "bottom",
    alpha: g * early(t, c.first4, c.delegation),
  });
  // The purpose and the limits.
  const purpose = g * early(t, c.purposeClause, c.purpose),
    purposeName = L("要不要换供应商", "Whether to change vendors"),
    pw = measure(purposeName) + 70;
  fork(x - pw / 2 + 34, D.rows[0], { alpha: purpose });
  nameText(purposeName, x - pw / 2 + 70, D.rows[0], { align: "left", alpha: purpose });
  const ro = g * named(t, c.readOnly),
    rw = measure(L("只查不改", "Read-only")) + 60;
  lock(x - rw / 2 + 17, D.rows[1], { alpha: ro, size: 0.9 });
  nameText(L("只查不改", "Read-only"), x - rw / 2 + 60, D.rows[1], { align: "left", alpha: ro });
  // The deliverable: the compact timeline with the two times to find, each an open mark named over it.
  const tl = g * ramp(t, c.find - 0.15, 0.4),
    m = lastNight(x, D.rail, D.scale, {
      alpha: tl,
      hours: [-1, 3],
      flow: t > c.find + 0.6 ? flowOf(t, 0.25) : null,
    });
  const times = [m.due, m.arrival];
  times.forEach((tx, i) =>
    openMark(tx, D.rail, 11, { alpha: g * ramp(t, c.times[i] - 0.15, 0.4) }),
  );
  L(["发布时间", "任务启动时间"], ["Publication time", "Job start time"]).forEach((v, i) =>
    nameText(v, times[i], D.rail - 11 - NAME_GAP, {
      valign: "bottom",
      alpha: g * listIn(t, c.times, i),
      set: "times",
    }),
  );
  // Where each time came from: a small source page under each, linked up to it, the pages and links one mark.
  const src = g * named(t, c.source);
  stroke(
    () =>
      times.forEach((tx) => {
        ctx.moveTo(tx, D.rail + 14);
        ctx.lineTo(tx, D.sources - 20);
        ctx.moveTo(tx - 14, D.sources - 20);
        ctx.lineTo(tx + 14, D.sources - 20);
        ctx.lineTo(tx + 14, D.sources + 16);
        ctx.lineTo(tx - 14, D.sources + 16);
        ctx.closePath();
      }),
    { color: P.ink, alpha: src, width: 2.5 },
  );
  nameText(L("从哪里查到的", "Where each came from"), x, D.sources + 16 + NAME_GAP, {
    valign: "top",
    alpha: src,
  });
  const ux = x + D.half - 100,
    unv = g * named(t, c.unverified);
  openMark(ux, D.sources, 18, { alpha: unv });
  nameText(L("没法核实", "Unverified"), ux, D.sources + 16 + NAME_GAP, {
    valign: "top",
    alpha: unv,
  });
  // The schedule outside, the way to it stopped at a bar on the boundary's edge: stop and ask first.
  const sx = x1 + D.out,
    shown = g * soon(t, c.schedule - 0.15, 0.5);
  clock(sx, D.rail, 22, { alpha: shown, hand: 0.15 });
  nameText(L("调度", "Schedule"), sx, D.rail + 22 + NAME_GAP, { valign: "top", alpha: shown });
  line(m.arrival + 14, D.rail, x1 - 8, D.rail, {
    color: P.line,
    alpha: g * named(t, c.stopWay),
    width: 2.5,
  });
  line(x1 + 8, D.rail, sx - 30, D.rail, { color: P.line, alpha: shown, width: 2.5 });
  const stop = g * named(t, c.stop);
  bar(x1, D.rail, { alpha: stop, vertical: true, length: 48 });
  nameText(L("停下来问我", "Stop and ask"), x1 + NAME_GAP, D.rail - 48, {
    align: "left",
    valign: "bottom",
    alpha: stop,
  });
}

/* E: the caller and the Agent on one line; what the caller owns builds as stations on the way between them, one list;
 * then the work submitted, a card under the caller, with the three things submitting it vouches for beside it, one
 * list. */
const E = { y: 410, caller: 540, agent: 1380, work: 660 };
export function callerStage(s, t, c, g) {
  person(E.caller, E.y + 14, { alpha: g, size: 1.7 });
  nameText(L("调用智能体的人", "The caller"), E.caller, E.y + 60 + NAME_GAP, {
    valign: "top",
    alpha: g,
  });
  agent(E.agent, E.y, { alpha: g, size: 2.4 });
  nameText(L("智能体", "Agent"), E.agent, E.y + 53 + NAME_GAP, {
    valign: "top",
    alpha: g * named(t, c.agent5),
  });
  // What the caller owns, on the way between them.
  const ownNames = L(
      ["信息", "权限", "核验", "结果"],
      ["Context", "Permissions", "Verification", "Result"],
    ),
    pitch = L(150, 196),
    xs = [-1.5, -0.5, 0.5, 1.5].map((k) => 960 + k * pitch),
    ats = c.owns;
  line(E.caller + 50, E.y, E.agent - 50, E.y, { color: P.line, alpha: g, width: 2.5 });
  xs.forEach((x, i) => {
    const a = g * ramp(t, ats[i] - 0.15, 0.4);
    dot(x, E.y, 10, { color: P.ground, alpha: a });
    dot(x, E.y, 10, { color: P.authority, alpha: a, hollow: true, width: 3 });
    dot(x, E.y, 4, { color: P.authority, alpha: a });
  });
  railNames(ownNames, xs, E.y, {
    gap: 10 + NAME_GAP,
    alpha: (i) => g * listIn(t, ats, i),
    set: "owns",
  });
  // Submitting: the work card leaves the caller, and three checks build beside it.
  const sub = g * named(t, c.submit),
    wx = mix(E.caller, E.work, soon(t, c.submit, 0.8)),
    wy = E.y + 200;
  box(wx - 40, wy - 30, 80, 60, { fill: P.row, stroke: P.ink, alpha: sub, radius: 6, width: 2.5 });
  line(wx - 24, wy - 8, wx + 24, wy - 8, { color: P.muted, alpha: sub, width: 2 });
  line(wx - 24, wy + 8, wx + 10, wy + 8, { color: P.muted, alpha: sub, width: 2 });
  nameText(L("提交", "Submitting"), E.work, wy + 30 + NAME_GAP, { valign: "top", alpha: sub });
  const vx = L([880, 1040, 1200], [840, 1040, 1240]),
    vats = c.vouch;
  vx.forEach((x, i) => check(x, wy, 30, { alpha: g * ramp(t, vats[i] - 0.15, 0.4) }));
  railNames(
    L(["看懂了", "检查过", "为后果负责"], ["Understood", "Checked", "Responsibility"]),
    vx,
    wy,
    {
      gap: 18 + NAME_GAP,
      alpha: (i) => g * listIn(t, vats, i),
      set: "vouch",
    },
  );
}
