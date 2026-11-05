/* 02.3-02.4. C (02.3), cut on 「一项任务」/ "a task": a task on the frame's axis, named over itself, and under it, joined
 * to it, the rail of the three things it must achieve, whole from the task's first words and named on their count; the
 * three outcomes hang from the rail in one row, each on its words, named under itself; then the reports it must not
 * stop at, refused beside the task. C2 (02.4), the made-up case: the reports leave and the colleague who patched the
 * data stands in their place, joined to the task; only the way to the first outcome lights and only the first outcome
 * takes its check. */

import { ctx } from "../../canvas.js";
import { link } from "../../drawing/links.js";
import { labelSize, measure, stroke } from "../../drawing/strokes.js";
import { token } from "../../drawing/symbols.js";
import { illustrative } from "../../framing/chapters.js";
import { beats, listLevel, named } from "../../naming/lists.js";
import {
  NAME_GAP,
  NOTE,
  growTexts,
  nameText,
  rejectedName,
  termRow,
  termRowLayout,
} from "../../naming/names.js";
import { LABEL, P } from "../../palette.js";
import { L } from "../../timeline.js";
import { cue } from "../../timing/cues.js";
import { ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { mechanism, outcome, people, reports } from "./marks.js";

/* The spoken cues of 02.3-02.4. */
export function taskCues(s) {
  return {
    task: cue(s, "一项任务", "a task"),
    three: cue(s, "三件事", "three things"),
    outcomes: [
      cue(s, "问题解决掉", "resolve the problem"),
      cue(s, "判断检验过", "test the judgment"),
      cue(s, "系统", "the system"),
    ],
    holds: cue(s, "说清", "say when it holds"),
    sooner: cue(s, "更早认出来", "recognize"),
    better: cue(s, "处理得更好", "handle it better"),
    kinds: cue(s, "三种结果", "three outcomes"),
    reports: cue(s, "三份报告", "three reports"),
    colleague: cue(s, "连夜", "The colleague"),
    first: cue(s, "只做到了第一件", "only the first"),
  };
}

/* C: the task on the frame's axis, its outer ring (r) RING_GAP above the stem that joins it to the rail; the outcomes
 * hang from the rail at one pitch about the axis, their names on one baseline one gap under their rings; the reports,
 * and later the colleague, stand on the task's row beside it, named at their outer side, more than a column's reach
 * (90 px) above the outcomes' branches, so their names name no branch. Every part is laid out about the axis, so each
 * state the stage holds stands centred, and the rail reaches as far past the outer outcomes as the wider of their
 * names, so the picture has its whole extent from the task's first words. */
const TASK = { x: 960, y: 440, r: 21 },
  RING_GAP = 4,
  RAIL_Y = 570,
  RING_Y = 640,
  PITCH = 300,
  XS = [TASK.x - PITCH, TASK.x, TASK.x + PITCH],
  RING = 19,
  /* The reports' pages stand at this pitch about their place, which the colleague later takes; `half` is the row's
   * half width, its outer pages' edges. */
  BESIDE = { x: 840, pitch: 42, half: 61 },
  /* A refusal's cross and the gap before it (rejectedName), which a name set at the pages' outer side keeps clear. */
  REFUSAL = 16 + Math.min(26, labelSize(LABEL) * 0.9);
const TASK_NAME = () => L("一项任务", "A task"),
  THREE = () => L("三件事", "Three things"),
  REPORTS = () => L("三份报告", "Three reports"),
  COLLEAGUE = () => L("那位同事", "The colleague"),
  ONLY_FIRST = () => L("只做到了第一件", "only the first");
/* Each outcome's term and the qualifier set under it, its parts said in turn. A qualifier wraps between its parts at
 * the width of the widest term, so each outcome's name keeps to its column. */
const OUTCOMES = () => [
  [[L("问题解决掉", "Problem resolved")], []],
  [[L("判断检验过", "Judgment tested")], [L("成立的条件", "its conditions stated")]],
  [
    [L("系统", "The system")],
    L(["更早认出来", "，或者处理得更好"], ["sooner recognition,", " better handling"]),
  ],
];
const noteWidth = () => Math.max(...OUTCOMES().map(([term]) => measure(term.join(""))));
/* Half the width of an outcome's name: its term or its widest qualifier line. */
function nameHalf([term, qual]) {
  const lineWidth = (line) => measure(line.map(([, v]) => v).join(""), NOTE);
  return (
    Math.max(
      measure(term.join("")),
      ...(qual.length ? growTexts(qual, noteWidth(), NOTE).map(lineWidth) : []),
    ) / 2
  );
}
const railHalf = () => PITCH + Math.max(nameHalf(OUTCOMES()[0]), nameHalf(OUTCOMES()[2]));

/* C and C2 share the task, its rail and the outcomes; C adds the reports, C2 the colleague and the first outcome
 * reached. */
export function stageOutcomes(s, t, c) {
  const C = stageIn(t, c.task) * stageOut(t, c.colleague),
    C2 = stageIn(t, c.colleague);
  const a = Math.max(C, C2);
  if (a <= 0) return;
  const vt = voiceTime(t),
    { x, y, r } = TASK,
    half = railHalf(),
    first = C2 * ramp(t, c.first - 0.15, 0.4);
  token(x, y, { alpha: a * ramp(t, c.task - 0.15, 0.4) });
  nameText(TASK_NAME(), x, y - r - NAME_GAP, { valign: "bottom", alpha: a * named(t, c.task) });
  // The rail of the three things and the stem that joins it to the task, one stroke as wide as the way's, in the line
  // tone from the task's words; the three things are named beside the stem on their count.
  stroke(
    () => {
      ctx.moveTo(x, y + r + RING_GAP);
      ctx.lineTo(x, RAIL_Y);
      ctx.moveTo(x - half, RAIL_Y);
      ctx.lineTo(x + half, RAIL_Y);
    },
    { color: P.line, alpha: a * ramp(t, c.task - 0.15, 0.4), width: 3.5 },
  );
  nameText(THREE(), x + NAME_GAP, (y + r + RING_GAP + RAIL_Y) / 2, {
    align: "left",
    alpha: a * named(t, c.three),
  });
  // Each outcome on its words: its branch from the rail, its ring and its name, one list.
  const noteW = noteWidth();
  OUTCOMES().forEach(([term, qual], k) => {
    const at = c.outcomes[k],
      ox = XS[k],
      on = a * ramp(t, at - 0.15, 0.4);
    link(ox, RAIL_Y, ox, RING_Y - RING - 7, {
      alpha: on,
      upto: soon(t, at + 0.05, 0.4),
      width: 2.5,
    });
    if (k < 2)
      outcome(ox, RING_Y, {
        alpha: on,
        bounds: k === 1 ? ramp(t, c.holds - 0.1, 0.4) : 0,
        done: k === 0 ? soon(t, c.first + 0.05, 0.5) * C2 : 0,
      });
    else
      mechanism(ox, RING_Y, {
        alpha: on,
        turn: vt * 0.5,
        watch: ramp(t, c.sooner - 0.1, 0.4),
      });
    beats(t, ox, RING_Y, RING + 12, [c.kinds], { alpha: C });
    termRow(
      t,
      term,
      [at],
      qual,
      k === 1 ? [c.holds] : [c.sooner, c.better],
      ox,
      RING_Y + RING + NAME_GAP,
      {
        align: "center",
        inline: false,
        build: true,
        noteWidth: noteW,
        set: "outcomes",
        alpha: a * listLevel(t, c.outcomes, k),
      },
    );
  });
  // C: the reports the task must not stop at, refused together beside it on its row, their name at their outer side,
  // the refusal's cross between the name and the pages.
  const reportsOn = C * ramp(t, c.reports - 0.15, 0.4),
    { x: bx, pitch, half: pages } = BESIDE;
  reports([bx - pitch, bx, bx + pitch], y, { alpha: reportsOn });
  rejectedName(REPORTS(), bx - pages - NAME_GAP - REFUSAL, y, {
    align: "right",
    alpha: reportsOn,
    mark: ramp(t, c.reports + 0.05, 0.3),
  });
  if (C2 <= 0) return;
  // C2: the colleague stands where the reports stood, joined to the task and named at the outer side; the way from the
  // task to the first outcome lights on 「只做到了第一件」/ "only the first", a point running it, and the first outcome
  // takes its check.
  illustrative(C2);
  people([bx], y, { size: 1, alpha: C2 });
  link(bx + 30, y, x - r - RING_GAP, y, {
    alpha: C2,
    upto: soon(t, c.colleague + 0.05, 0.5),
    width: 2.5,
  });
  const { height } = termRowLayout([COLLEAGUE()], [ONLY_FIRST()], Infinity, false);
  termRow(
    t,
    [COLLEAGUE()],
    [c.colleague],
    [ONLY_FIRST()],
    [c.first],
    bx - 24 - NAME_GAP,
    y - height / 2,
    {
      align: "right",
      inline: false,
      alpha: C2,
    },
  );
  const lit = { color: P.evidence, alpha: first, width: 3 };
  stroke(() => {
    ctx.moveTo(x, y + r + RING_GAP);
    ctx.lineTo(x, RAIL_Y);
    ctx.lineTo(XS[0], RAIL_Y);
  }, lit);
  link(XS[0], RAIL_Y, XS[0], RING_Y - RING - 7, {
    ...lit,
    flow: t > c.first + 0.6 ? (vt * 0.5) % 1 : null,
  });
}
