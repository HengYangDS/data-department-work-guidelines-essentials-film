/* 02.3-02.4. C (02.3), cut on 「一项任务」/ "a task": a task, and the three things it must achieve as three outcomes
 * branching from one spine, each on its words; then the reports it must not stop at, refused on its other side. C2
 * (02.4), the made-up case: the reports leave and the colleague who patched the data stands in their place, joined to
 * the task; only the way to the first outcome lights and only the first outcome takes its check. */

import { link } from "../../drawing/links.js";
import { labelSize, line, measure } from "../../drawing/strokes.js";
import { token } from "../../drawing/symbols.js";
import { illustrative } from "../../framing/chapters.js";
import { beats, listLevel, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, nameText, rejectedName, termRow } from "../../naming/names.js";
import { LABEL, P } from "../../palette.js";
import { L } from "../../timeline.js";
import { cue } from "../../timing/cues.js";
import { ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { glide } from "../p01/failures.js";
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

/* C: the outcomes' rows, the task on the middle one; the reports' column, the task, the spine and the outcomes' rings
 * stand at these offsets from the task, and the outcomes' names start one gap after their rings. The spine stands far
 * enough from the task, and its rows far enough apart, that the task with the spine of its three things covers a tenth
 * of the frame before the first outcome is said. */
const ROWS = [360, 540, 720],
  SPINE_TOP = 275,
  TO_REPORTS = -210,
  TO_SPINE = 320,
  TO_RINGS = 410,
  TO_NAMES = 410 + 19 + NAME_GAP,
  RING = 19;
const TASK = () => L("一项任务", "A task"),
  THREE = () => L("三件事", "Three things"),
  REPORTS = () => L("三份报告", "Three reports");
/* Each outcome's term and the qualifier set under it on one line, its parts said in turn. */
const OUTCOMES = () => [
  [[L("问题解决掉", "Problem resolved")], []],
  [[L("判断检验过", "Judgment tested")], [L("成立的条件", "its conditions stated")]],
  [
    [L("系统", "The system")],
    L(["更早认出来", "，或者处理得更好"], ["sooner recognition,", " better handling"]),
  ],
];
/* How far right of the task the outcomes reach once the first k stand. */
function outcomesRight(k) {
  return OUTCOMES()
    .slice(0, k)
    .reduce(
      (right, [term, qual]) =>
        Math.max(right, TO_NAMES + Math.max(measure(term.join("")), measure(qual.join(""), NOTE))),
      TO_SPINE + NAME_GAP + measure(THREE()),
    );
}
/* The task's place at t: the picture stands centred on what has arrived, gliding as one just after the words of each
 * part that widens it. */
function taskX(t, c) {
  const half = Math.max(21, measure(TASK()) / 2),
    reportsHalf = (measure(REPORTS()) + 16 + 26) / 2;
  const centre = (left, right) => 960 - (left + right) / 2;
  return glide(t, centre(-half, half), [
    [c.three, centre(-half, outcomesRight(0))],
    ...c.outcomes.map((at, k) => [at, centre(-half, outcomesRight(k + 1))]),
    [c.reports, centre(TO_REPORTS - reportsHalf, outcomesRight(3))],
  ]);
}

/* C and C2 share the task, its spine and the outcomes; C adds the reports, C2 the colleague and the first outcome
 * reached. */
export function stageOutcomes(t, c) {
  const C = stageIn(t, c.task) * stageOut(t, c.colleague),
    C2 = stageIn(t, c.colleague);
  const a = Math.max(C, C2);
  if (a <= 0) return;
  const x = taskX(t, c),
    vt = voiceTime(t),
    spine = x + TO_SPINE,
    rings = x + TO_RINGS,
    first = C2 * ramp(t, c.first - 0.15, 0.4);
  token(x, ROWS[1], { alpha: a * ramp(t, c.task - 0.15, 0.4) });
  nameText(TASK(), x, ROWS[1] + 21 + NAME_GAP, { valign: "top", alpha: a * named(t, c.task) });
  // The spine of the three things stands on their count, joined to the task; it grows from the task's row both ways.
  const grow = soon(t, c.three + 0.05, 0.6);
  line(x + 30, ROWS[1], spine, ROWS[1], { color: P.line, alpha: a * grow, width: 2.5 });
  line(spine, ROWS[1], spine, ROWS[1] - (ROWS[1] - SPINE_TOP) * grow, {
    color: P.line,
    alpha: a * grow,
    width: 2.5,
  });
  line(spine, ROWS[1], spine, ROWS[1] + (ROWS[2] - ROWS[1]) * grow, {
    color: P.line,
    alpha: a * grow,
    width: 2.5,
  });
  nameText(THREE(), spine + NAME_GAP, SPINE_TOP, { align: "left", alpha: a * named(t, c.three) });
  // Each outcome on its words: its branch from the spine, its ring and its name, one list.
  OUTCOMES().forEach(([term, qual], k) => {
    const at = c.outcomes[k],
      y = ROWS[k],
      on = a * ramp(t, at - 0.15, 0.4);
    link(spine, y, rings - RING - 7, y, { alpha: on, upto: soon(t, at + 0.05, 0.4), width: 2.5 });
    if (k < 2)
      outcome(rings, y, {
        alpha: on,
        bounds: k === 1 ? ramp(t, c.holds - 0.1, 0.4) : 0,
        done: k === 0 ? soon(t, c.first + 0.05, 0.5) * C2 : 0,
      });
    else
      mechanism(rings, y, {
        alpha: on,
        turn: vt * 0.5,
        watch: ramp(t, c.sooner - 0.1, 0.4),
      });
    beats(t, rings, y, RING + 12, [c.kinds], { alpha: C });
    termRow(
      t,
      term,
      [at],
      qual,
      k === 1 ? [c.holds] : [c.sooner, c.better],
      x + TO_NAMES,
      y - labelSize(LABEL) / 2,
      {
        align: "left",
        inline: false,
        build: true,
        set: "outcomes",
        alpha: a * listLevel(t, c.outcomes, k),
      },
    );
  });
  // C: the reports the task must not stop at, refused together on its other side, one on each outcome's row.
  const reportsOn = C * ramp(t, c.reports - 0.15, 0.4);
  reports(x + TO_REPORTS, ROWS, { alpha: reportsOn });
  rejectedName(REPORTS(), x + TO_REPORTS, ROWS[2] + 24 + NAME_GAP, {
    valign: "top",
    alpha: reportsOn,
    mark: ramp(t, c.reports + 0.05, 0.3),
  });
  if (C2 <= 0) return;
  // C2: the colleague stands where the reports stood, joined to the task; the way from the task to the first outcome
  // lights on 「只做到了第一件」/ "only the first", a point running it, and the first outcome takes its check.
  illustrative(C2);
  const cx = x + TO_REPORTS;
  people([cx], ROWS[1], { size: 1, alpha: C2 });
  link(cx + 30, ROWS[1], x - 30, ROWS[1], {
    alpha: C2,
    upto: soon(t, c.colleague + 0.05, 0.5),
    width: 2.5,
  });
  termRow(
    t,
    [L("那位同事", "The colleague")],
    [c.colleague],
    [L("只做到了第一件", "only the first")],
    [c.first],
    cx,
    ROWS[1] + 24 + NAME_GAP,
    { align: "center", inline: false, alpha: C2 },
  );
  const lit = { color: P.evidence, alpha: first, width: 3 };
  line(x + 30, ROWS[1], spine, ROWS[1], lit);
  line(spine, ROWS[1], spine, ROWS[0], lit);
  link(spine, ROWS[0], rings - RING - 7, ROWS[0], {
    ...lit,
    flow: t > c.first + 0.6 ? (vt * 0.5) % 1 : null,
  });
}
