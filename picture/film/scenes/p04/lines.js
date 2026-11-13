/* B and C (04.2-04.4). B, from 04.2's first words 「第一」/ "First": the field of A glides wider and deeper round the list
 * of the four boundaries, keeping its top, so its name stands over it where A set it (scene.js); its sides are in the
 * line colour, each lighting in the colour of authority as the ordinal that brings its boundary is said. Inside it the
 * four boundaries build one list, each a small field with its own side lit, its name, and what it rules out or covers
 * set under it in key words, each part on its own words. The field holds the whole list from its first row, so every
 * state of the list stands on the frame's axis and no row moves as wider rows arrive; the field closes as its fourth
 * side lights. C, from 「在这四条底线之内」/ "Inside these boundaries": the field large on the frame's axis, lit, named over
 * itself at the same place, and the two cases inside it, each named under its point on their words: a point moving
 * freely, what is welcome under it, and a point halted short of a side, the three things done at that edge. */

import { line, measure, ring } from "../../drawing/strokes.js";
import { dot } from "../../drawing/strokes.js";
import { listIn, listLevel, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, nameText, termRow, termRowLayout } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp } from "../../timing/easing.js";
import { drawShare, thoughtEnd, travel, voiceTime } from "../../timing/pauses.js";
import { field, fieldIcon } from "./marks.js";

/* The centre line and height of A's field (scene.js). B's and C's fields keep its top, so the name over each stands
 * where A set it. */
export const FIELD = { y: 480, h: 440 };
const TOP = FIELD.y - FIELD.h / 2;

/* The four boundaries, each its name and, in key words, what it rules out or covers, said in parts: each item the
 * narration lists stands as a part of its own. */
const ROWS = () =>
  L(
    [
      ["说真话", ["不编造、", "隐瞒、", "挑着说，", "没把握的不说成有把握"]],
      ["守边界", ["对象和时间、", "专业能力和权限，", "数据、", "安全、", "合规和行动"]],
      ["责任落到人", ["重要的判断、", "决定、", "变更和验收"]],
      ["不虚报完成", ["做完、", "做对、", "能用、", "有人在用，", "要有当前的、", "对得上的证据"]],
    ],
    [
      [
        "Telling the truth",
        ["no fabrication, ", "hiding, ", "cherry-picking ", "or uncertainty dressed as certainty"],
      ],
      [
        "Staying in bounds",
        [
          "subject, time, ",
          "professional competence, permission, ",
          "data, ",
          "security, ",
          "compliance, ",
          "action",
        ],
      ],
      ["Naming the owner", ["every important judgment, ", "decision, change ", "and acceptance"]],
      [
        "No false completion",
        ["without current evidence: ", "not complete, correct, usable, adopted"],
      ],
    ],
  );
/* The list's rows stand `pitch` apart, each row's icon on its middle; the text begins `toText` after the icon. The list
 * keeps `margin` from all four sides, more than two label sizes, so no side stands just over or under a row as the
 * mark a centred block would hang from. B draws no moving point: the work inside the boundaries moves only in C, where
 * the narration names it. The list counts as said on the fourth boundary's last words (`listEnd`), so the earlier rows
 * stay at the second level while it is described and the whole list returns to full ink as its thought ends. */
const B = { pitch: 100, icon: 34, toText: 26, margin: 64 };
/* B's field and the list's places in it: the field holds the whole list from its first row, keeping A's top. */
export function listField() {
  const rows = ROWS(),
    widest = Math.max(...rows.flatMap(([v, q]) => [measure(v), measure(q.join(""), NOTE)])),
    // Each row is its term over its qualifier, as termRow sets a row whose qualifier stands under its term.
    rowHeight = Math.max(...rows.map(([v, q]) => termRowLayout([v], q, Infinity, false).height)),
    span = B.icon + B.toText + widest,
    iconX = 960 - span / 2 + B.icon / 2;
  return {
    w: span + 2 * B.margin,
    h: 3 * B.pitch + rowHeight + 2 * B.margin,
    first: TOP + B.margin,
    rowHeight,
    iconX,
    textX: iconX + B.icon / 2 + B.toText,
  };
}
/* A hands its field over to B on 04.2's first words, 「第一」/ "First", without a cut: the field glides from A's size to
 * B's over HANDOVER seconds of voice time, keeping its top (scene.js), and the list's first row enters once the field
 * has its size, since its icon stands beyond A's sides (ZH6-4). */
export const HANDOVER = 0.9;
export const handover = (t, c) => travel(t, c.ordinals[0] + 0.05, HANDOVER);
export function stageLines(t, a, c) {
  const { first, rowHeight, iconX, textX } = listField(),
    // The first row's words come within the hand-over; it enters as the field reaches its size.
    rowAts = c.rows.map((at, k) => (k ? at : Math.max(at, c.ordinals[0] + 0.05 + HANDOVER + 0.15)));
  ROWS().forEach(([term, qual], k) => {
    const top = first + k * B.pitch,
      at = rowAts[k],
      // A part said before its row enters joins it as it enters.
      parts = c.quals[k].map((v) => Math.max(v, at));
    fieldIcon(iconX, top + rowHeight / 2, B.icon, k, {
      alpha: a * ramp(t, at - 0.15, 0.4),
    });
    termRow(t, [term], [at], qual, parts, textX, top, {
      align: "left",
      inline: false,
      build: true,
      set: "boundaries",
      alpha: a * listLevel(t, [...rowAts, c.listEnd], k),
    });
  });
}

/* C: the field on the frame's axis, lit, 400 high, its top where A's and B's stood, named over itself at the same
 * place, and the two cases inside it, each a point with the list of what it does named under it on its words, rather
 * than in a clause the caption already says, so every name keeps to the field. A point moves freely about the field's
 * left, and what is welcome inside the boundaries, 自主、探索和创造 / "autonomy, exploration and creative work", hangs
 * under it as one list, each on its words (EN9-n10). A second point comes to a halt short of the right side, the edge
 * point, and the three things done there hang under it as one list, each on its own words, as its mark acts: it stops,
 * its ring lights as it is made visible, and its way rises to the field's top as it is escalated. The case being said
 * stands at full ink. Each list is centred under its point, and its widest line keeps the inset the film's frames keep
 * inside every side (`inset`, as the four boundaries' field keeps 60-64 px), so neither stands on or past the boundary
 * it names and the two stand as far in from their sides; the two lists share their first baseline, a gap under the
 * halted point's ring, and the free point roams just above its list. The field is as wide as both lists need with a
 * gap between their columns, and at least square, so in English the free list's widest line ends 32 px before the
 * edge list's widest begins (EN9-n3) and in Chinese the edge list stands centred under its ring (ZH8-2). */
const C = {
  y: TOP + 200,
  s: 400,
  pitch: 44,
  reach: [60, 45],
  approach: 0.55,
  inset: 62,
  between: 32,
  travel: 100,
  ring: 17,
};
const FREE = () => L(["自主", "探索", "创造"], ["Autonomy", "Exploration", "Creative work"]);
/* The English names begin alike in case, as the names of one list do, and keep the voice's key words, as the caption
 * says the whole phrase (EN15-n6). */
const EDGE = () => L(["停下来", "讲出来", "上报"], ["Stop", "Make visible", "Escalate"]);
const widest = (names) => Math.max(...names.map((v) => measure(v)));
/* The field's width and the x of each list's centre, the free list's and the edge list's. */
function caseColumns() {
  const free = widest(FREE()),
    edge = widest(EDGE()),
    w = Math.max(C.s, 2 * C.inset + free + C.between + edge);
  return { w, free: 960 - w / 2 + C.inset + free / 2, edge: 960 + w / 2 - C.inset - edge / 2 };
}
export function stageCases(t, a, c) {
  const x = 960,
    { w, free: xf, edge: xe } = caseColumns(),
    top = C.y - C.s / 2,
    vt = voiceTime(t),
    edge = c.edge,
    frees = [c.free, c.explore, c.create],
    // The second point sets off toward the side as the edge case is said, but no sooner than `C.approach` s before
    // the stop is named under it, so it never stands waiting for its name.
    approach = Math.max(c.near, edge[0] - C.approach),
    cases = [c.free, approach],
    level = (i) => listLevel(t, cases, i);
  field(x, C.y, w, C.s, { alpha: a, lit: [1, 1, 1, 1] });
  nameText(L("四条底线", "Four boundaries"), x, top - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.inside),
  });
  // Inside these boundaries: a point moving freely about its list's column, and under it what is welcome, one list on
  // the edge list's baselines. The roam is timed back from the voice time at which the cases' thought ends, so the
  // point comes to rest with the voice on its list's axis, level with the halted point, and stands there until the
  // cut, as the halted point stands over its own list (EN12-n2).
  const row = C.y + C.ring + NAME_GAP,
    free = a * ramp(t, c.inside - 0.15, 0.4),
    ry = row - NAME_GAP - 8 - C.reach[1],
    rest = voiceTime(thoughtEnd(c.free)),
    roam = Math.min(vt, rest) - rest,
    phase = Math.asin((C.y - ry) / C.reach[1]);
  dot(xf + C.reach[0] * Math.sin(roam * 0.9), ry + C.reach[1] * Math.sin(roam * 1.3 + phase), 8, {
    color: P.ink,
    alpha: free * level(0),
  });
  FREE().forEach((v, i) =>
    nameText(v, xf, row + i * C.pitch, {
      valign: "top",
      alpha: a * level(0) * listIn(t, frees, i),
      set: "free",
    }),
  );
  // Near a side: a point comes to a halt over its list, short of the right side; it is ringed as it is made visible,
  // and its way rises to the field's top as it is escalated.
  const near = a * ramp(t, approach - 0.15, 0.4),
    halted = travel(t, approach + 0.05, 0.9),
    hx = mix(xe - C.travel, xe, halted),
    hy = C.y;
  dot(hx, hy, 8, { color: P.ink, alpha: near * level(1) });
  ring(hx, hy, C.ring, {
    color: P.authority,
    alpha: near * level(1) * ramp(t, edge[1] - 0.1, 0.4),
    width: 3,
  });
  // The way rises at the tip pace while 「上报」/ "escalate" is said, the thought's last words, so it stands whole before
  // the quiet.
  const rise = drawShare(t, edge[2] - 0.2, hy - 25 - top);
  if (rise > 0)
    line(hx, hy - C.ring, hx, mix(hy - C.ring, top + 8, rise), {
      alpha: near * level(1),
      width: 2.5,
    });
  EDGE().forEach((v, i) =>
    nameText(v, xe, row + i * C.pitch, {
      valign: "top",
      alpha: a * level(1) * listIn(t, edge, i),
      set: "edge",
    }),
  );
}
