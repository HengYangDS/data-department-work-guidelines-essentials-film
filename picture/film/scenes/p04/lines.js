/* B and C (04.2-04.4). B, from 04.2's first words 「第一」/ "First": the field of A widens and deepens round the list of
 * the four boundaries, keeping its top, so its name stands over it where A set it; its sides are in the line colour,
 * each lighting in the colour of authority as the ordinal that brings its boundary is said. Inside it the four
 * boundaries build one list, each a small field with its own side lit, its name, and what it rules out or covers set
 * under it in key words, each part on its own words. The field holds the whole list from the cut, so every state of
 * the list stands on the frame's axis and no row moves as wider rows arrive; the field closes as its fourth side
 * lights. C, from 「在这四条底线之内」/ "Inside them": the field large on the frame's axis, lit, named over itself at the
 * same place, and the two cases in a column under it, each with its point inside the field, the case being said at
 * full ink: a point moving freely inside, and a point halted short of a side, ringed, its way rising to the field's
 * top. */

import { line, measure, ring } from "../../drawing/strokes.js";
import { dot } from "../../drawing/strokes.js";
import { listIn, listLevel, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, nameText, termRow, termRowLayout } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
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
      ["说真话", ["不编造、", "隐瞒、", "挑着说，", "不把没把握说成有把握"]],
      ["守边界", ["对象和时间、", "能力和权限，", "数据、", "安全、", "合规和行动"]],
      ["责任落到人", ["重要的判断、", "决定、", "变更和验收"]],
      ["不虚报完成", ["做完、", "做对、", "能用、", "有人在用，", "要有当前的、", "对得上的证据"]],
    ],
    [
      [
        "Telling the truth",
        ["no fabrication, ", "hiding, ", "cherry-picking ", "or false certainty"],
      ],
      [
        "Staying in bounds",
        [
          "subject, time, ",
          "competence, permission, ",
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
export function stageLines(t, a, c) {
  const rows = ROWS(),
    widest = Math.max(...rows.flatMap(([v, q]) => [measure(v), measure(q.join(""), NOTE)])),
    // Each row is its term over its qualifier, as termRow sets a row whose qualifier stands under its term.
    rowHeight = Math.max(...rows.map(([v, q]) => termRowLayout([v], q, Infinity, false).height)),
    span = B.icon + B.toText + widest,
    height = 3 * B.pitch + rowHeight + 2 * B.margin,
    first = TOP + B.margin,
    iconX = 960 - span / 2 + B.icon / 2,
    textX = iconX + B.icon / 2 + B.toText;
  field(960, TOP + height / 2, span + 2 * B.margin, height, {
    alpha: a,
    lit: c.ordinals.map((at) => ramp(t, at - 0.15, 0.4)),
  });
  nameText(L("四条底线", "Four boundaries"), 960, TOP - NAME_GAP, {
    valign: "bottom",
    alpha: a,
  });
  rows.forEach(([term, qual], k) => {
    const top = first + k * B.pitch;
    fieldIcon(iconX, top + rowHeight / 2, B.icon, k, {
      alpha: a * ramp(t, c.rows[k] - 0.15, 0.4),
    });
    termRow(t, [term], [c.rows[k]], qual, c.quals[k], textX, top, {
      align: "left",
      inline: false,
      build: true,
      set: "boundaries",
      alpha: a * listLevel(t, [...c.rows, c.listEnd], k),
    });
  });
}

/* C: the field 400 across, lit, on the frame's axis, its top where A's and B's stood; the cases' names in a column
 * under it on the same axis, `pitch` apart. The column grows downward, so every state stays centred across the frame
 * and the field never moves: the field stands alone for nearly two seconds in Chinese, longer than a build-up may stand
 * off centre, so the cases cannot take a column beside it. */
const C = { y: TOP + 200, s: 400, pitch: 64 };
const CASES = () =>
  L(
    ["自主、探索和创造", "停下来，讲出来，往上报"],
    ["Autonomy, exploration, creative work", "Halt, disclosure, escalation"],
  );
export function stageCases(t, a, c) {
  const names = CASES(),
    x = 960,
    right = x + C.s / 2,
    top = C.y - C.s / 2,
    under = C.y + C.s / 2 + NAME_GAP,
    vt = voiceTime(t),
    ats = [c.free, c.halt],
    level = (i) => listLevel(t, ats, i);
  field(x, C.y, C.s, C.s, { alpha: a, lit: [1, 1, 1, 1] });
  nameText(L("四条底线", "Four boundaries"), x, top - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.inside),
  });
  // Inside them: a point moving freely about the field's upper left.
  const free = a * ramp(t, c.inside - 0.15, 0.4);
  dot(x - 70 + 60 * Math.sin(vt * 0.9), C.y - 60 + 45 * Math.sin(vt * 1.3), 8, {
    color: P.ink,
    alpha: free * level(0),
  });
  nameText(names[0], x, under, {
    valign: "top",
    alpha: a * listIn(t, ats, 0),
    set: "cases",
  });
  // Near a side: a point halts short of the right side, is ringed, and its way rises to the field's top.
  const near = a * ramp(t, c.near - 0.15, 0.4),
    halted = soon(t, c.near + 0.05, 0.7),
    hx = mix(x + 40, right - 34, halted),
    hy = C.y;
  dot(hx, hy, 8, { color: P.ink, alpha: near * level(1) });
  ring(hx, hy, 17, {
    color: P.authority,
    alpha: near * level(1) * ramp(t, c.halt - 0.1, 0.4),
    width: 3,
  });
  const rise = soon(t, c.halt + 0.4, 0.6);
  if (rise > 0)
    line(hx, hy - 17, hx, mix(hy - 17, top + 8, rise), { alpha: near * level(1), width: 2.5 });
  nameText(names[1], x, under + C.pitch, {
    valign: "top",
    alpha: a * listIn(t, ats, 1),
    set: "cases",
  });
}
