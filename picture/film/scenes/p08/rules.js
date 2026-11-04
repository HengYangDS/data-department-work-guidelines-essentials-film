/* Part 08, stages C, D1, D2, E1 and E2. C: the way from a new practice to a department rule: any one of three reasons
 * opens it, and three conditions stand on it before the rule. D1: a rule and the four reasons to retire it; retired, it
 * lifts away. D2, the made-up case: the monitor on the schedule needs an owner and a later look at whether it caught
 * problems earlier. E1, the made-up case: the price data on its hour and its next user, with what that user needs. E2:
 * conveying a judgment: faithful first, then clear, then elegant. */

import { ctx } from "../../canvas.js";
import { link } from "../../drawing/links.js";
import { dot, line, ring, stroke } from "../../drawing/strokes.js";
import { documentIcon, person, seal } from "../../drawing/symbols.js";
import { lastNight, lastNightExtent } from "../../drawing/timeline.js";
import { recoverIcon } from "../../drawing/workspace.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, nameText } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { early, flowOf, glide, openMark } from "../p05/kit.js";

/* A rule: a page with its seal on the lower right. */
function rulePage(x, y, { alpha = 1, w = 90, h = 116, sealAt = 0.22 } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 2 });
  seal(x, y + h * sealAt, Math.min(18, w * 0.2), { alpha });
}

/* C: the way. The new practice at the left and the rule at the right stand on their words; three lanes leave the new
 * practice, any one of which gives the reason, one list named over each lane; they rejoin and the way passes three
 * conditions, small posts named under them, one list, before it reaches the rule. A point runs it once whole. */
const C = {
  y: 500,
  from: 470,
  join: 860,
  to: 1530,
  lanes: [400, 500, 600],
  posts: [980, 1170, 1360],
};
export function wayStage(s, t, c, g) {
  const start = g * early(t, c.first3, c.practice),
    // The rule is named in the same clause as the new practice, so the way's two ends stand from its first words.
    rule = g * early(t, c.first3, c.rule);
  ring(C.from, C.y, 16, { color: P.ink, alpha: start, width: 3 });
  dot(C.from, C.y, 6, { color: P.ink, alpha: start });
  nameText(L("新做法", "A new practice"), C.from - 16 - NAME_GAP, C.y, {
    align: "right",
    alpha: start,
  });
  rulePage(C.to, C.y, { alpha: rule });
  nameText(L("部门的规矩", "Department rule"), C.to, C.y + 58 + NAME_GAP, {
    valign: "top",
    alpha: rule,
  });
  // Three lanes, any one of which gives the reason.
  const reasons = c.reasons;
  C.lanes.forEach((ly, i) => {
    const a = g * ramp(t, reasons[i] - 0.15, 0.4);
    stroke(
      () => {
        ctx.moveTo(C.from + 18, C.y);
        ctx.quadraticCurveTo(C.from + 50, C.y, C.from + 50, mix(C.y, ly, 0.5));
        ctx.quadraticCurveTo(C.from + 50, ly, C.from + 70, ly);
        ctx.lineTo(C.join - 60, ly);
        ctx.lineTo(C.join - 60, ly);
        ctx.quadraticCurveTo(C.join - 20, ly, C.join - 20, mix(ly, C.y, 0.5));
        ctx.quadraticCurveTo(C.join - 20, C.y, C.join, C.y);
      },
      { color: P.line, alpha: a, width: 2.5 },
    );
  });
  L(
    ["观察到的问题", "实质风险", "适用的义务"],
    ["Observed problem", "Material risk", "Obligation"],
  ).forEach((v, i) =>
    nameText(v, (C.from + 70 + C.join - 60) / 2, C.lanes[i] - NAME_GAP + 6, {
      valign: "bottom",
      alpha: g * listIn(t, reasons, i),
      set: "reasons",
    }),
  );
  // The way on, through three conditions, to the rule.
  const conds = c.conditions,
    reach = conds.reduce(
      (v, at, i) => mix(v, i < 2 ? C.posts[i + 1] - 40 : C.to - 60, soon(t, at, 0.6)),
      C.join,
    );
  line(C.join, C.y, reach, C.y, {
    color: P.line,
    alpha: g * ramp(t, conds[0] - 0.15, 0.4),
    width: 2.5,
  });
  C.posts.forEach((x, i) => {
    const a = g * ramp(t, conds[i] - 0.15, 0.4);
    line(x, C.y - 22, x, C.y + 22, { color: P.authority, alpha: a, width: 4 });
  });
  L(["小范围试行", "有人负责", "利大于弊"], ["A small trial", "An owner", "Net benefit"]).forEach(
    (v, i) =>
      nameText(v, C.posts[i], C.y - 22 - NAME_GAP, {
        valign: "bottom",
        alpha: g * listIn(t, conds, i),
        set: "conditions",
      }),
  );
  if (t > conds[2] + 0.7) {
    const q = flowOf(t, 0.3);
    dot(mix(C.join, C.to - 60, q), C.y, 6 * Math.min(1, q * 8, (1 - q) * 8), {
      color: P.evidence,
      alpha: g,
    });
  }
}

/* D1: a rule at the centre and the four reasons to retire it, open marks round it, one list; retired, the page lifts
 * and fades while its name and the reasons stay. */
const R = { x: 960, y: 500, dx: 330, dy: 110 };
export function retireStage(s, t, c, g) {
  const lift = soon(t, c.retired, 1.2),
    page = g * mix(1, 0.35, lift);
  rulePage(R.x, R.y - 40 * lift, { alpha: page, w: 120, h: 156, sealAt: -0.28 });
  nameText(L("规矩", "A rule"), R.x, R.y - 78 - NAME_GAP - 40 * lift, {
    valign: "bottom",
    alpha: g * early(t, c.first4, c.rule4),
  });
  const spots = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ],
    ats = c.retire;
  spots.forEach(([sx, sy], i) => {
    const x = R.x + sx * R.dx,
      y = R.y + sy * R.dy,
      a = g * ramp(t, ats[i] - 0.15, 0.4);
    openMark(x, y, 16, { alpha: a });
  });
  L(
    ["对象没了", "没人用", "与权威来源重复", "得不偿失"],
    ["No subject", "No user", "Duplicate", "Net cost"],
  ).forEach((v, i) => {
    const [sx, sy] = spots[i];
    nameText(v, R.x + sx * (R.dx + 16 + NAME_GAP), R.y + sy * R.dy, {
      align: sx < 0 ? "right" : "left",
      alpha: g * listIn(t, ats, i),
      set: "retire",
    });
  });
  nameText(L("撤掉", "Retired"), R.x, R.y + 78 + NAME_GAP, {
    valign: "top",
    alpha: g * named(t, c.retired),
  });
}

/* D2: the monitor on the schedule lane from 08.1, at the agreed time; its owner, a figure linked up to it; a later look,
 * a clock with its loop back; and what the look asks, an open mark beside the monitor, left unanswered. */
const M = { x: 1000, y: 540, scale: 0.8 };
export function monitorStage(s, t, c, g) {
  const m = lastNight(M.x, M.y, M.scale, { alpha: g, due: 1, flow: flowOf(t, 0.3) });
  ring(m.due, M.y, 17, { color: P.evidence, alpha: g, width: 3 });
  line(m.due, M.y - 17, m.due, M.y - 60, { color: P.line, alpha: g, width: 2.5 });
  stroke(() => ctx.roundRect(m.due - 60, M.y - 150, 120, 90, 10), {
    color: P.evidence,
    alpha: g,
    width: 3,
  });
  stroke(
    () => {
      ctx.moveTo(m.due - 44, M.y - 105);
      ctx.lineTo(m.due - 14, M.y - 105);
      ctx.lineTo(m.due - 4, M.y - 128);
      ctx.lineTo(m.due + 8, M.y - 84);
      ctx.lineTo(m.due + 18, M.y - 105);
      ctx.lineTo(m.due + 44, M.y - 105);
    },
    { color: P.evidence, alpha: g, width: 2.5 },
  );
  nameText(L("监控", "The monitor"), m.due, M.y - 150 - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first4b, c.monitor4),
  });
  const owner = g * named(t, c.owner);
  link(m.due, M.y + 26, m.due, M.y + 120, {
    alpha: owner,
    upto: soon(t, c.owner, 0.5),
    end: false,
  });
  person(m.due, M.y + 160, { alpha: owner, size: 1.1 });
  nameText(L("有人负责", "An owner"), m.due, M.y + 210 + NAME_GAP, { valign: "top", alpha: owner });
  const look = g * named(t, c.look4),
    lx = m.arrival + 120;
  recoverIcon(lx, M.y + 150, 26, { alpha: look, color: P.evidence, upto: soon(t, c.look4, 0.8) });
  line(lx, M.y + 150, lx, M.y + 134, { color: P.evidence, alpha: look, width: 3 });
  line(lx, M.y + 150, lx + 11, M.y + 156, { color: P.evidence, alpha: look, width: 3 });
  nameText(L("回头看看", "A later look"), lx, M.y + 176 + NAME_GAP, { valign: "top", alpha: look });
  const asks = g * named(t, c.earlier);
  openMark(m.arrival, M.y - 60, 18, { alpha: asks });
  nameText(L("更早发现问题", "Problems caught earlier"), m.arrival + 18 + NAME_GAP, M.y - 60, {
    align: "left",
    alpha: asks,
  });
}

/* E1: the full timeline as in the opening, the price data on its hour, and its next user at the rail's right end, the
 * data's way running on to them; what the user needs builds in a column between the card and the user, one list. The
 * stage stands centred alone and glides left as the user arrives. */
export function nextUserStage(s, t, c, g) {
  const names = { card: { v: L("那份数据", "The price data"), alpha: early(t, c.first5, c.data) } },
    e = lastNightExtent(1, { card: 1, names }),
    x = 960 - (e.left + e.right) / 2 + glide(t, 0, [[c.user, -110]]),
    y = 551;
  const m = lastNight(x, y, 1, {
    alpha: g,
    card: 1,
    flow: t > c.user + 0.6 ? flowOf(t, 0.25) : null,
    names,
  });
  const user = g * named(t, c.user),
    ux = m.right + 90;
  link(m.right + 6, y, ux - 30, y, { alpha: user, upto: soon(t, c.user, 0.6) });
  person(ux, y + 4, { alpha: user, size: 1.2 });
  nameText(L("下一位", "Next user"), ux, y + 64 + NAME_GAP, { valign: "top", alpha: user });
  const needs = c.needs,
    cx = (m.card.right + ux) / 2 + 20;
  L(
    ["清楚的含义", "当时的事实", "对得上的证据", "获准、有边界的用途"],
    ["Clear meaning", "Facts available then", "Matching evidence", "A permitted, bounded use"],
  ).forEach((v, i) =>
    nameText(v, cx, 262 + i * 48, { alpha: g * listIn(t, needs, i), set: "needs" }),
  );
}

/* E2: conveying a judgment. The judgment, a page named as it is conveyed, stands at the left with its way running
 * toward someone else at the right; the three aims arrive on the way as nodes, each on its word, the way lighting
 * through them in order, and a point runs it. */
export function aimsStage(s, t, c, g) {
  const xs = [760, 960, 1160],
    y = 520,
    ats = c.aims,
    px = 520,
    ox = 1420,
    judged = g * early(t, c.first5b, c.first5b),
    other = g * named(t, c.other);
  documentIcon(px - 55, y - 70, 110, 140, { alpha: judged, rows: 3 });
  nameText(L("讲给别人的判断", "Conveying a judgment"), px, y - 70 - NAME_GAP, {
    valign: "bottom",
    alpha: judged,
  });
  line(px + 62, y, ox - 40, y, { color: P.line, alpha: judged, width: 3 });
  person(ox, y + 6, { alpha: other, size: 1.2 });
  nameText(L("别人", "Someone else"), ox, y + 62 + NAME_GAP, { valign: "top", alpha: other });
  const reach = ats.reduce((v, at, i) => mix(v, xs[i], soon(t, at - 0.1, 0.6)), px + 62);
  if (t > ats[0] - 0.1) line(px + 62, y, reach, y, { color: P.evidence, alpha: g, width: 3.5 });
  xs.forEach((x, i) => {
    const a = g * ramp(t, ats[i] - 0.15, 0.4);
    dot(x, y, 34, { color: P.ground, alpha: a });
    ring(x, y, 34, { color: P.evidence, alpha: a, width: 3.5 });
    dot(x, y, 9, { color: P.evidence, alpha: a });
  });
  L(["信", "达", "雅"], ["Faithful", "Clear", "Elegant"]).forEach((v, i) =>
    nameText(v, xs[i], y + 34 + NAME_GAP, {
      valign: "top",
      alpha: g * listIn(t, ats, i),
      set: "aims",
    }),
  );
  if (t > ats[2] + 0.5) {
    const q = flowOf(t, 0.35);
    dot(mix(px + 62, ox - 40, q), y, 6 * Math.min(1, q * 8, (1 - q) * 8), {
      color: P.ink,
      alpha: g,
    });
  }
}
