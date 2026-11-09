/* Part 08, stages C, D, E1 and E2. C, the made-up case: the monitor on the schedule needs an owner and a later look at
 * whether it caught problems earlier. D: a rule and the four reasons to retire it; retired, it fades where it stands.
 * E1, the made-up case: the price data on its hour and its next user, with what that user needs. E2: conveying a
 * judgment: faithful first, then clear, then elegant. */

import { ctx } from "../../canvas.js";
import { link } from "../../drawing/links.js";
import { dot, flowAt, flowDot, line, measure, ring, stroke } from "../../drawing/strokes.js";
import { documentIcon, person, seal } from "../../drawing/symbols.js";
import { HOUR, lastNight } from "../../drawing/timeline.js";
import { recoverIcon } from "../../drawing/workspace.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, nameText } from "../../naming/names.js";
import { railNames, rowNameTop } from "../../naming/placement.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { drawShare } from "../../timing/pauses.js";
import { early, openMark } from "../p05/kit.js";

/* A rule: a page with its seal on the lower right. `sealAlpha` lets the seal leave on its own: a key mark holds 4.5:1
 * only at full ink, so a retired rule's page may fade while its seal goes. */
function rulePage(x, y, { alpha = 1, w = 90, h = 116, sealAt = 0.22, sealAlpha = alpha } = {}) {
  if (alpha < 0.01) return;
  documentIcon(x - w / 2, y - h / 2, w, h, { alpha, rows: 2 });
  if (sealAlpha > 0.01) seal(x, y + h * sealAt, Math.min(18, w * 0.2), { alpha: sealAlpha });
}

/* C: the monitor on the schedule lane from 08.1, at the agreed time; its owner, a figure linked up to it; a later look,
 * a clock with its loop back; and what the look asks, an open mark beside the monitor, left unanswered. The English
 * names drop their articles, so the monitor and its owner repeat less than half the caption's words (EN9-n11). */
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
  nameText(L("监控", "Monitor"), m.due, M.y - 150 - NAME_GAP, {
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
  nameText(L("有人负责", "Owner"), m.due, M.y + 210 + NAME_GAP, { valign: "top", alpha: owner });
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

/* D: a rule over the four reasons to retire it. The page stands on the frame's axis, named over itself; the rail
 * under it, joined to it, stands whole with the first reason, on its words, and the reasons take the rail's stations
 * on their words, open marks named under them, one list. As the sentence closes the page fades where it stands while
 * its names and the reasons stay; its seal, the rule's authority, leaves as it fades, so no gold rests below 4.5:1. */
/* The English reasons are longer, so their stations stand wider apart on a longer rail. */
const R = { x: 960, y: 420, rail: 640, half: () => L(520, 670), pitch: () => L(300, 400) };
/* The reasons' names. "Duplicates a source of truth" fits one line, so no line ends on "a" and "source of truth"
 * stays whole; "Costs more than it returns" takes two lines of near equal width. */
const REASONS = () =>
  L(
    ["对象没了", "没人在用", "跟权威来源重复", "得不偿失"],
    [
      "Nothing left to govern",
      "No user",
      "Duplicates a source of truth",
      ["Costs more", "than it returns"],
    ],
  );
const widest = (v) => Math.max(...(Array.isArray(v) ? v : [v]).map((line) => measure(line)));
/* The English row of names centres on the frame's axis rather than its stations, and its rail reaches 20 px past the
 * outer names; the Chinese row already stands within its rail (EN9-n1). */
function retireRow() {
  const names = REASONS(),
    [first, last] = [widest(names[0]), widest(names[3])];
  return L(
    { x: R.x, half: R.half() },
    { x: R.x - (last - first) / 4, half: 1.5 * R.pitch() + (first + last) / 4 + 20 },
  );
}
export function retireStage(s, t, c, g) {
  const lifted = soon(t, c.lift, 0.7),
    page = g * mix(1, 0.45, lifted),
    row = retireRow(),
    xs = [-1.5, -0.5, 0.5, 1.5].map((k) => row.x + k * R.pitch()),
    ats = c.retire,
    carried = ramp(t, ats[0] - 0.15, 0.4);
  rulePage(R.x, R.y, { alpha: page, sealAlpha: g * (1 - lifted), w: 120, h: 156, sealAt: -0.34 });
  nameText(L("规矩", "A rule"), R.x, R.y - 78 - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first3b, c.rule3),
  });
  nameText(L("撤掉", "Retire"), R.x + 60 + NAME_GAP, R.y, {
    align: "left",
    alpha: g * named(t, c.retired),
  });
  line(R.x, R.y + 78, R.x, R.rail, { color: P.line, alpha: page * carried, width: 2 });
  line(row.x - row.half, R.rail, row.x + row.half, R.rail, {
    color: P.line,
    alpha: g * carried,
    width: 3.5,
  });
  [-1, 1].forEach((side) =>
    dot(row.x + side * row.half, R.rail, 6, { color: P.line, alpha: g * carried }),
  );
  xs.forEach((x, i) => openMark(x, R.rail, 16, { alpha: g * ramp(t, ats[i] - 0.15, 0.4) }));
  railNames(REASONS(), xs, R.rail, {
    gap: 16 + NAME_GAP,
    wrap: 400,
    alpha: (i) => g * listIn(t, ats, i),
    set: "retire",
  });
}

/* E1: the full timeline as in the opening, six hours of the night from the hour the data was due, the price data on
 * the hour it arrived and its next user standing over a later hour, the night running on under them once from the
 * user's words; what the user needs builds under the rail between them, one list. The data and the user stand at equal
 * distances either side of the frame's axis, on which the rail and the needs centre, so the stage's ink centres on the
 * frame rather than at its right. */
const E1 = { y: 551, hours: [0, 6], user: 4, needs: 52, pitch: 48 };
export function nextUserStage(s, t, c, g) {
  const names = { card: { v: L("那份数据", "The price data"), alpha: early(t, c.first4, c.data) } },
    y = E1.y,
    // The motif's hour h stands at x + (h - 1) HOUR, so this anchor sets the data's hour, 2, and the user's either side
    // of the axis.
    x = 960 - ((2 + E1.user) / 2 - 1) * HOUR;
  const m = lastNight(x, y, 1, {
    alpha: g,
    card: 1,
    hours: E1.hours,
    flow: { t, from: c.user + 0.6, passes: 1 },
    names,
  });
  // The next user stands over a later hour, its shoulders clear of the rail's ticks, named over its head.
  const user = g * named(t, c.user),
    ux = m.at(E1.user),
    size = 1.2,
    head = 15 * size * 2.15;
  person(ux, y - 40, { alpha: user, size });
  nameText(L("下一位", "Next user"), ux, y - 40 - head - NAME_GAP, {
    valign: "bottom",
    alpha: user,
  });
  // The needs, in the voice's words, return to full ink on the last one's words, so the four stand whole before the
  // stage leaves.
  L(
    ["清楚的含义", "当时能拿到的事实", "对得上说法的证据", "获准的、有边界的用途"],
    ["Clear meaning", "Facts available then", "Matching evidence", "A permitted, bounded use"],
  ).forEach((v, i) =>
    nameText(v, 960, y + E1.needs + i * E1.pitch, {
      alpha: g * listIn(t, c.needs, i, Infinity, { whole: c.needs.at(-1) - 0.1 }),
      set: "needs",
    }),
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
  // Every name of the way hangs from one baseline, under its lowest mark: the person reaches 62 px below the line, the
  // aims' rings 34 px.
  const nameTop = rowNameTop([y + 34, y + 62]);
  person(ox, y + 6, { alpha: other, size: 1.2 });
  nameText(L("别人", "Someone else"), ox, nameTop, { valign: "top", alpha: other });
  // The rail reaches each station on its words at the tip pace, by the length of its own step.
  const reach = ats.reduce(
    (v, at, i) => mix(v, xs[i], drawShare(t, at - 0.2, xs[i] - (i ? xs[i - 1] : px + 62))),
    px + 62,
  );
  // The evidence line grows from the judgment as a tip, from the moment it has length, so no stub of it appears whole.
  if (reach > px + 62 + 0.5) line(px + 62, y, reach, y, { color: P.evidence, alpha: g, width: 3.5 });
  xs.forEach((x, i) => {
    const a = g * ramp(t, ats[i] - 0.15, 0.4);
    dot(x, y, 34, { color: P.ground, alpha: a });
    ring(x, y, 34, { color: P.evidence, alpha: a, width: 3.5 });
    dot(x, y, 9, { color: P.evidence, alpha: a });
  });
  // The three aims return to full ink on the last one's words, so the film's last diagram stands whole.
  L(["信", "达", "雅"], ["Faithful", "Clear", "Elegant"]).forEach((v, i) =>
    nameText(v, xs[i], nameTop, {
      valign: "top",
      alpha: g * listIn(t, ats, i, Infinity, { whole: ats.at(-1) - 0.1 }),
      set: "aims",
    }),
  );
  const runs = flowAt(t, ox - 40 - (px + 62), { from: ats[2] + 0.5 });
  flowDot(mix(px + 62, ox - 40, runs?.q ?? 0), y, 6, runs, { color: P.ink, alpha: g });
}
