/* B and C (04.2-04.4). B, from 「说真话」/ "tell the truth": the field at the left, its sides in the line colour, each
 * lighting in the colour of authority as its boundary is said; at its right the four boundaries build one list, each a
 * small field with its own side lit, its name, and what it rules out or covers set under it in key words, whole from
 * its first words, so each row stands at its full width as the group centres on it. The group glides as one to stay centred as wider rows arrive; the field closes as its fourth side
 * lights. C, from 「在这四条底线之内」/ "Inside them": the field large at the left, lit, named over itself, and the three
 * cases in a column at its right, each with its point inside the field, the case being said at full ink: a point moving
 * freely inside; a point halted short of a side, ringed, its way rising to the field's top; a point that crossed a side
 * and stops outside, then returns inside as it is corrected, with the four steps built one by one. */

import { line, measure, ring } from "../../drawing/strokes.js";
import { dot } from "../../drawing/strokes.js";
import { listIn, listLevel, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, nameText, termRow } from "../../naming/names.js";
import { LABEL, P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { glide } from "../p01/failures.js";
import { field, fieldIcon } from "./marks.js";

/* The four boundaries, each its name and, in key words, what it rules out or covers, said in parts. */
const ROWS = () =>
  L(
    [
      ["说真话", ["不编造、", "隐瞒、", "挑着说，", "不把没把握说成有把握"]],
      ["守边界", ["对象和时间、", "能力和权限，", "数据、安全、合规和行动"]],
      ["责任落到人", ["重要的判断、", "决定、", "变更和验收"]],
      ["不虚报完成", ["做完、", "做对、", "能用、", "有人在用，", "要有当前的证据"]],
    ],
    [
      [
        "Telling the truth",
        ["no fabrication, ", "hiding, ", "cherry-picking ", "or false certainty"],
      ],
      [
        "Staying in bounds",
        ["subject, time, ", "competence, permission, ", "data, security, compliance, action"],
      ],
      ["Naming the owner", ["every important judgment, ", "decision, change ", "and acceptance"]],
      [
        "No false completion",
        ["without current evidence: ", "not complete, correct, usable, adopted"],
      ],
    ],
  );
const B = { y: 480, s: 360, rows: [300, 420, 540, 660], toRows: 90, icon: 34 };
/* The field's x at t: the field and what stands of the rows are centred together, gliding as one just after the words
 * of each term or qualifier that widens them. */
function lineX(t, c) {
  const textAt = B.s / 2 + B.toRows + B.icon / 2 + 26,
    parts = ROWS()
      .flatMap(([v, q], k) => [
        [c.rows[k], measure(v)],
        [c.quals[k][0], measure(q.join(""), NOTE)],
      ])
      .sort((p, q) => p[0] - q[0]);
  let widest = 0;
  const steps = parts.map(([at, w]) => {
    widest = Math.max(widest, w);
    return [at, 960 - (-B.s / 2 + textAt + widest) / 2];
  });
  return glide(t, steps[0][1], steps.slice(1));
}
export function stageLines(t, a, c) {
  const x = lineX(t, c),
    iconX = x + B.s / 2 + B.toRows,
    textX = iconX + B.icon / 2 + 26;
  field(x, B.y, B.s, B.s, { alpha: a, lit: c.rows.map((at) => ramp(t, at - 0.15, 0.4)) });
  nameText(L("四条底线", "Four boundaries"), x, B.y - B.s / 2 - NAME_GAP, {
    valign: "bottom",
    alpha: a,
  });
  // A point runs round the field's inside in voice time, keeping clear of its sides: the work held within them.
  const q = (voiceTime(t) * 0.12) % 1,
    inset = B.s / 2 - 34,
    path = [
      [x - inset, B.y - inset],
      [x + inset, B.y - inset],
      [x + inset, B.y + inset],
      [x - inset, B.y + inset],
      [x - inset, B.y - inset],
    ],
    leg = Math.min(3, Math.floor(q * 4)),
    f = q * 4 - leg;
  dot(mix(path[leg][0], path[leg + 1][0], f), mix(path[leg][1], path[leg + 1][1], f), 7, {
    color: P.ink,
    alpha: a,
  });
  ROWS().forEach(([term, qual], k) => {
    const y = B.rows[k];
    fieldIcon(iconX, y, B.icon, k, { alpha: a * ramp(t, c.rows[k] - 0.15, 0.4) });
    termRow(t, [term], [c.rows[k]], qual, c.quals[k], textX, y - 32, {
      align: "left",
      inline: false,
      set: "boundaries",
      alpha: a * listLevel(t, c.rows, k),
    });
  });
}

/* C: the field 400 across, lit; the cases' names in a column one gap and a little more past its right side. */
const C = { y: 500, s: 400, column: 80 },
  CASE_Y = [330, 450],
  STEPS_TOP = 552,
  STEP_PITCH = 38;
const CASES = () =>
  L(
    ["自主、探索和创造", "停下来，讲出来，往上报"],
    ["Autonomy, exploration, creative work", "Halt, disclosure, escalation"],
  );
const CROSSED = () => L("越了线", "Already crossed"),
  STEPS = () =>
    L(
      ["停下受影响的动作", "讲出来", "权限内纠正", "按风险上报"],
      [
        "Stopping the affected action",
        "Disclosure",
        "Correction within permission",
        "Escalation by risk",
      ],
    );
export function stageCases(t, a, c) {
  const names = [...CASES(), CROSSED(), ...STEPS()],
    widest = Math.max(...names.map((v, i) => measure(v, i > 2 ? NOTE : LABEL))),
    x = glide(t, 960, [[c.free, 960 - (C.column + widest) / 2]]),
    right = x + C.s / 2,
    top = C.y - C.s / 2,
    textX = right + C.column,
    vt = voiceTime(t),
    ats = [c.free, c.halt, c.crossed],
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
  nameText(CASES()[0], textX, CASE_Y[0], {
    align: "left",
    alpha: a * listIn(t, ats, 0),
    set: "cases",
  });
  // Near a side: a point halts short of the right side, is ringed, and its way rises to the field's top.
  const near = a * ramp(t, c.near - 0.15, 0.4),
    halted = soon(t, c.near + 0.05, 0.7),
    hx = mix(x + 40, right - 34, halted),
    hy = C.y - 10;
  dot(hx, hy, 8, { color: P.ink, alpha: near * level(1) });
  ring(hx, hy, 17, {
    color: P.authority,
    alpha: near * level(1) * ramp(t, c.halt - 0.1, 0.4),
    width: 3,
  });
  const rise = soon(t, c.halt + 0.4, 0.6);
  if (rise > 0)
    line(hx, hy - 17, hx, mix(hy - 17, top + 8, rise), { alpha: near * level(1), width: 2.5 });
  nameText(CASES()[1], textX, CASE_Y[1], {
    align: "left",
    alpha: a * listIn(t, ats, 1),
    set: "cases",
  });
  // Across a side: a point crosses the bottom side and stops outside; it returns inside as it is corrected.
  const crossed = a * ramp(t, c.crossed - 0.15, 0.4),
    out = soon(t, c.crossed + 0.05, 0.7),
    back = soon(t, c.steps[2] + 0.05, 0.7),
    cy = mix(mix(C.y + 120, C.y + C.s / 2 + 40, out), C.y + 120, back);
  dot(x - 90, cy, 8, { color: P.unknown, alpha: crossed * level(2) });
  nameText(CROSSED(), textX, STEPS_TOP - 12, {
    align: "left",
    valign: "bottom",
    alpha: a * listIn(t, ats, 2),
    set: "cases",
  });
  STEPS().forEach((v, i) =>
    nameText(v, textX, STEPS_TOP + 8 + i * STEP_PITCH, {
      align: "left",
      valign: "top",
      size: NOTE,
      color: P.muted,
      alpha: a * listIn(t, c.steps, i),
      set: "steps",
    }),
  );
}
