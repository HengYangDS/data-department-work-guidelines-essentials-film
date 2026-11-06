/* Part 08, stages C, D, E1 and E2. C, the made-up case: the monitor on the schedule needs an owner and a later look at
 * whether it caught problems earlier. D: a rule and the four reasons to retire it; retired, it fades where it stands.
 * E1, the made-up case: the price data on its hour and its next user, with what that user needs. E2: conveying a
 * judgment: faithful first, then clear, then elegant. */

import { ctx } from "../../canvas.js";
import { link } from "../../drawing/links.js";
import { dot, flowAt, flowDot, line, measure, ring, stroke } from "../../drawing/strokes.js";
import { documentIcon, person, seal } from "../../drawing/symbols.js";
import { lastNight, lastNightExtent } from "../../drawing/timeline.js";
import { recoverIcon } from "../../drawing/workspace.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, nameText } from "../../naming/names.js";
import { railNames } from "../../naming/placement.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { centring, early, openMark } from "../p05/kit.js";

/* A rule: a page with its seal on the lower right. */
function rulePage(x, y, { alpha = 1, w = 90, h = 116, sealAt = 0.22 } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 2 });
  seal(x, y + h * sealAt, Math.min(18, w * 0.2), { alpha });
}

/* C: the monitor on the schedule lane from 08.1, at the agreed time; its owner, a figure linked up to it; a later look,
 * a clock with its loop back; and what the look asks, an open mark beside the monitor, left unanswered. */
const M = { x: 960, y: 540, scale: 0.8 };
export function monitorStage(s, t, c, g) {
  const m = lastNight(M.x, M.y, M.scale, { alpha: g, due: 1, flow: { t } });
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
    alpha: g * early(t, c.first3, c.monitor3),
  });
  const owner = g * named(t, c.owner);
  link(m.due, M.y + 26, m.due, M.y + 120, {
    alpha: owner,
    upto: soon(t, c.owner, 0.5),
    end: false,
  });
  person(m.due, M.y + 160, { alpha: owner, size: 1.1 });
  nameText(L("有人负责", "An owner"), m.due, M.y + 210 + NAME_GAP, { valign: "top", alpha: owner });
  const look = g * named(t, c.look3),
    lx = m.arrival + 120;
  recoverIcon(lx, M.y + 150, 26, { alpha: look, color: P.evidence, upto: soon(t, c.look3, 0.8) });
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

/* D: a rule over the four reasons to retire it. The page stands on the frame's axis, named over itself and joined to a
 * rail under it, which stands whole from the first words, so the picture stays centred while the list builds; the
 * reasons take the rail's stations on their words, open marks named under them, one list. As the sentence closes the
 * page fades where it stands while its names and the reasons stay. */
const R = { x: 960, y: 420, rail: 640, half: 520, pitch: 300 };
export function retireStage(s, t, c, g) {
  const page = g * mix(1, 0.45, soon(t, c.lift, 0.7)),
    xs = [-1.5, -0.5, 0.5, 1.5].map((k) => R.x + k * R.pitch),
    ats = c.retire;
  rulePage(R.x, R.y, { alpha: page, w: 120, h: 156, sealAt: -0.34 });
  nameText(L("规矩", "A rule"), R.x, R.y - 78 - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first3b, c.rule3),
  });
  nameText(L("撤掉", "Retire"), R.x + 60 + NAME_GAP, R.y, {
    align: "left",
    alpha: g * named(t, c.retired),
  });
  line(R.x, R.y + 78, R.x, R.rail, { color: P.line, alpha: page, width: 2 });
  line(R.x - R.half, R.rail, R.x + R.half, R.rail, { color: P.line, alpha: g, width: 3.5 });
  [-1, 1].forEach((side) => dot(R.x + side * R.half, R.rail, 6, { color: P.line, alpha: g }));
  xs.forEach((x, i) => openMark(x, R.rail, 16, { alpha: g * ramp(t, ats[i] - 0.15, 0.4) }));
  railNames(
    L(
      ["对象没了", "没人用", "与权威来源重复", "得不偿失"],
      ["No subject", "No user", "Duplicate", "Net cost"],
    ),
    xs,
    R.rail,
    { gap: 16 + NAME_GAP, alpha: (i) => g * listIn(t, ats, i), set: "retire" },
  );
}

/* E1: the full timeline as in the opening, the price data on its hour, and its next user beyond the rail's right end,
 * the data's way running on to them; what the user needs builds in a column between the card and the user, one list.
 * The stage stands once at the midpoint of the places that centre it before and after the user arrives. */
export function nextUserStage(s, t, c, g) {
  const names = { card: { v: L("那份数据", "The price data"), alpha: early(t, c.first4, c.data) } },
    e = lastNightExtent(1, { card: 1, names }),
    userName = L("下一位", "Next user"),
    // The user stands 90 px beyond the rail's end, the name under the figure reaching furthest.
    reach = e.right + 90 + Math.max(28, measure(userName) / 2),
    x = (centring(e.left, e.right) + centring(e.left, reach)) / 2,
    y = 551;
  const m = lastNight(x, y, 1, {
    alpha: g,
    card: 1,
    flow: { t, from: c.user + 0.6 },
    names,
  });
  const user = g * named(t, c.user),
    ux = m.right + 90;
  link(m.right + 6, y, ux - 30, y, { alpha: user, upto: soon(t, c.user, 0.6) });
  person(ux, y + 4, { alpha: user, size: 1.2 });
  nameText(userName, ux, y + 64 + NAME_GAP, { valign: "top", alpha: user });
  const needs = c.needs,
    cx = (m.card.right + ux) / 2 + 20;
  L(
    ["清楚的含义", "当时能拿到的事实", "对得上的证据", "获准、有边界的用途"],
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
    judged = g * early(t, c.first4b, c.first4b),
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
  const runs = flowAt(t, ox - 40 - (px + 62), { from: ats[2] + 0.5 });
  flowDot(mix(px + 62, ox - 40, runs?.q ?? 0), y, 6, runs, { color: P.ink, alpha: g });
}
