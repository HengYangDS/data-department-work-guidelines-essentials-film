/* 02.3-02.4. C (02.3), cut on 「一项任务」/ "a task": a task on the frame's axis, named over itself, and under it, joined
 * to it, the rail of the three things it must achieve, whole from the task's first words and named on their count; the
 * reports it must not stop at, refused beside the task on their words, which come before the outcomes; then the three
 * outcomes hang from the rail in one row, each on its words, named under itself. C2 (02.4), the made-up case: the
 * reports leave and the colleague who patched the data stands in their place, joined to the task; only the way to the
 * first outcome lights and only the first outcome takes its check. C hands over to C2 without a cut: the reports fade
 * from 02.4's first words and the colleague comes on its own words once they have gone (ZH6-4). */

import { ctx } from "../../canvas.js";
import { link } from "../../drawing/links.js";
import { labelSize, measure, stroke } from "../../drawing/strokes.js";
import { token } from "../../drawing/symbols.js";
import { illustrative } from "../../framing/chapters.js";
import { listLevel, named } from "../../naming/lists.js";
import {
  LEADING,
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
import { stageIn } from "../../timing/stages.js";
import { mechanism, outcome, people, reports } from "./marks.js";

/* The spoken cues of 02.3-02.4. The third outcome takes the last occurrence of its term, as when 02.3 said 系统 after
 * 02.1's 人工智能系统 (ZH7-1); 工作体系 and "the system" are each said once, in 02.3. */
export function taskCues(s) {
  return {
    task: cue(s, "一项任务", "a task"),
    three: cue(s, "三件事", "three distinct outcomes"),
    outcomes: [
      cue(s, "解决问题", "resolve the problem"),
      cue(s, "检验判断", "test the judgment"),
      cue(s, "工作体系", "the system", { last: true }),
    ],
    holds: cue(s, "说清", "say when it holds"),
    // The English qualifier of the third outcome begins on its own first words, before "recognize".
    able: cue(s, "更好地发现", "better able"),
    sooner: cue(s, "更好地发现", "recognize"),
    better: cue(s, "应对", "handle"),
    reports: cue(s, "三份必须交的报告", "three required reports"),
    colleague: cue(s, "连夜", "The colleague"),
    mate: cue(s, "那位同事", "The colleague"),
    first: cue(s, "只做到了第一件", "only the first"),
  };
}

/* C: the task on its axis, its outer ring (r) RING_GAP above the stem that joins it to the rail; the outcomes hang from
 * the rail at one pitch about the axis, their names on one baseline one gap under their rings; the reports, and later
 * the colleague, stand on the task's row beside it, named at their outer side, more than a column's reach (90 px)
 * above the outcomes' branches, so their names name no branch. Every part is laid out about the task's axis, which
 * stands `stageShift` from the frame's, and every row stands `stageRise` above its place below, so each state the
 * stage holds stands near the centre, and the rail reaches as far past the outer outcomes as the wider of their names,
 * so the picture has its whole extent from the task's first words. */
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
  THREE = () => L("三件事", "Three distinct outcomes"),
  REPORTS = () => L("三份必须交的报告", "Three required reports"),
  COLLEAGUE = () => L("那位同事", "The colleague"),
  ONLY_FIRST = () => L("只做到了第一件", "only the first");
/* Each outcome's term and the qualifier set under it, its parts said in turn. An English qualifier wraps between its
 * parts at the width of the widest term, so each outcome's name keeps to its column; a Chinese one stands on one line,
 * since its parts are one clause, 更好地发现或应对, and the columns leave it room. */
const OUTCOMES = () => [
  [[L("解决问题", "Problem resolved")], []],
  [[L("检验判断", "Judgment tested")], [L("成立的条件", "when it holds")]],
  [
    [L("工作体系", "The system")],
    L(["更好地发现", "或应对"], ["better able", " to recognize", " or handle"]),
  ],
];
const noteWidth = () =>
  L(Infinity, Math.max(...OUTCOMES().map(([term]) => measure(term.join("")))));
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
/* The stage stands higher, by half the height its outcomes' qualifiers take beyond one line under their terms, so the
 * picture keeps its centre when an edition's qualifier wraps: the English third outcome's takes three lines, which
 * stood the n5 English pictures of 02.3-02.4 89 px under the content centre, past the gate's 78 px. */
function stageRise() {
  const lines = Math.max(
    ...OUTCOMES().map(([, qual]) => (qual.length ? growTexts(qual, noteWidth(), NOTE).length : 1)),
  );
  return ((lines - 1) * labelSize(NOTE) * LEADING) / 2;
}
/* The stage's shift right of the frame's axis: the midpoint of the shifts that centre its two lasting states, the
 * reports refused at the task's left (C) and the colleague in their place (C2), so neither stands far off (the idiom
 * of p05/data.js fitShift). The English reports' name is the wider, so its stage stands right of the axis. */
function stageShift() {
  const half = railHalf(),
    right = Math.max(TASK.x + half, TASK.x + NAME_GAP + measure(THREE())),
    reports = BESIDE.x - BESIDE.half - NAME_GAP - REFUSAL - measure(REPORTS()),
    colleague =
      BESIDE.x - 24 - NAME_GAP - Math.max(measure(COLLEAGUE()), measure(ONLY_FIRST(), NOTE)),
    shifts = [reports, colleague].map((left) => 960 - (Math.min(TASK.x - half, left) + right) / 2);
  return (Math.max(...shifts) + Math.min(...shifts)) / 2;
}

/* C and C2 share the task, its rail and the outcomes, which stand from the task's words to the scene's end, so the
 * frame never goes bare; C adds the reports, C2 the colleague and the first outcome reached. The reports leave over
 * LEAVE seconds from just after 02.4's first word, and the colleague enters where they stood on its own words,
 * 「那位同事」/ "The colleague", its fade beginning no sooner than the reports' last tenth of a second: the two never
 * stand together, so nothing ghosts, and no mark arrives at a cut. The leave lasts long enough that no frame takes
 * the pages' outline from firm (ink 60) to unseen (25) at once, whatever the frames' phase on the timeline: over
 * 0.3 s the n8 Chinese timeline sampled it at 61 and then 25 (a pop). */
const LEAVE = 0.45;
export function stageOutcomes(s, t, c) {
  const a = stageIn(t, c.task);
  if (a <= 0) return;
  const vt = voiceTime(t),
    shift = stageShift(),
    { r } = TASK,
    rise = stageRise(),
    y = TASK.y - rise,
    railY = RAIL_Y - rise,
    ringY = RING_Y - rise,
    x = TASK.x + shift,
    xs = XS.map((v) => v + shift),
    half = railHalf(),
    gone = c.colleague + 0.05 + LEAVE,
    mate = Math.max(c.mate, gone + 0.05),
    arrived = a * named(t, mate),
    first = a * ramp(t, c.first - 0.15, 0.4);
  token(x, y, { alpha: a * ramp(t, c.task - 0.15, 0.4) });
  nameText(TASK_NAME(), x, y - r - NAME_GAP, { valign: "bottom", alpha: a * named(t, c.task) });
  // The rail of the three things and the stem that joins it to the task, one stroke as wide as the way's, in the line
  // tone from the task's words; the three things are named beside the stem on their count.
  stroke(
    () => {
      ctx.moveTo(x, y + r + RING_GAP);
      ctx.lineTo(x, railY);
      ctx.moveTo(x - half, railY);
      ctx.lineTo(x + half, railY);
    },
    { color: P.line, alpha: a * ramp(t, c.task - 0.15, 0.4), width: 3.5 },
  );
  nameText(THREE(), x + NAME_GAP, (y + r + RING_GAP + railY) / 2, {
    align: "left",
    alpha: a * named(t, c.three),
  });
  // Each outcome on its words: its branch from the rail, its ring and its name, one list.
  const noteW = noteWidth();
  OUTCOMES().forEach(([term, qual], k) => {
    const at = c.outcomes[k],
      ox = xs[k],
      on = a * ramp(t, at - 0.15, 0.4);
    link(ox, railY, ox, ringY - RING - 7, {
      alpha: on,
      draw: { t, at: at + 0.05 },
      width: 2.5,
    });
    if (k < 2)
      outcome(ox, ringY, {
        alpha: on,
        bounds: k === 1 ? ramp(t, c.holds - 0.1, 0.4) : 0,
        done: k === 0 ? soon(t, c.first + 0.05, 0.5) : 0,
      });
    else
      mechanism(ox, ringY, {
        alpha: on,
        turn: vt * 0.5,
        watch: ramp(t, c.sooner - 0.1, 0.4),
      });
    termRow(
      t,
      term,
      [at],
      qual,
      k === 1 ? [c.holds] : L([c.sooner, c.better], [c.able, c.sooner, c.better]),
      ox,
      ringY + RING + NAME_GAP,
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
  const reportsOn = a * ramp(t, c.reports - 0.15, 0.4) * (1 - ramp(t, c.colleague + 0.05, LEAVE)),
    { pitch, half: pages } = BESIDE,
    bx = BESIDE.x + shift;
  reports([bx - pitch, bx, bx + pitch], y, { alpha: reportsOn });
  rejectedName(REPORTS(), bx - pages - NAME_GAP - REFUSAL, y, {
    align: "right",
    alpha: reportsOn,
    mark: ramp(t, c.reports + 0.05, 0.3),
  });
  if (t < c.colleague) return;
  // C2: the colleague stands where the reports stood, joined to the task and named at the outer side; the way from the
  // task to the first outcome lights on 「只做到了第一件」/ "only the first", a point running it, and the first outcome
  // takes its check. The chip of the made-up case fades in with its first words.
  illustrative(a * ramp(t, c.colleague + 0.05, 0.4));
  people([bx], y, { size: 1, alpha: arrived });
  link(bx + 30, y, x - r - RING_GAP, y, {
    alpha: arrived,
    draw: { t, at: mate + 0.05 },
    width: 2.5,
  });
  const { height } = termRowLayout([COLLEAGUE()], [ONLY_FIRST()], Infinity, false);
  termRow(t, [COLLEAGUE()], [mate], [ONLY_FIRST()], [c.first], bx - 24 - NAME_GAP, y - height / 2, {
    align: "right",
    inline: false,
    alpha: a,
  });
  const lit = { color: P.evidence, alpha: first, width: 3 };
  stroke(() => {
    ctx.moveTo(x, y + r + RING_GAP);
    ctx.lineTo(x, railY);
    ctx.lineTo(xs[0], railY);
  }, lit);
  link(xs[0], railY, xs[0], ringY - RING - 7, {
    ...lit,
    flow: { t, from: c.first + 0.6 },
  });
}
