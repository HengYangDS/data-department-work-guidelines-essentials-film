/* D (03.5-03.6), the made-up case, one stage laid out once. From 「拿昨晚的事来说」/ "Take last night": last night's
 * timeline in the top band, at the size and place it keeps, its night, the collection on its hour and the two hours
 * late drawn on their words, and under it the rail over which the three kinds of statement will stand, whole in the
 * line tone from the stage's first frame, so the picture has its whole extent from its first words and no name moves
 * once shown. From 「日志」/ "the log" the kinds of statement build over the rail, one column each, named under it: the
 * log, a fact, with its check; the vendor's publication, dashed, a hypothesis, with its open question and, once someone
 * checks, the publication time on its clock; beside the hypothesis, the observation that would refute it, an eye named
 * over itself, which on 「推翻」/ "refute" is joined to the hypothesis: a condition, not a finding, so the hypothesis
 * keeps only its dashed outline, and the story refutes it in 06.1. From 「要不要换供应商」/ "Whether to change vendors"
 * the choice joins in the third column, failure 1's fork, with the decision owner who makes it under its name. Nothing
 * shown leaves before the stage does, and no new mark takes a place another has left. */

import { link } from "../../drawing/links.js";
import { line } from "../../drawing/strokes.js";
import { check, clock, person } from "../../drawing/symbols.js";
import { lastNight } from "../../drawing/timeline.js";
import { ledger } from "../../drawing/workspace.js";
import { named } from "../../naming/lists.js";
import { NAME_GAP, nameText, termRow, termRowLayout } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { forkMark, openMark } from "../p01/failures.js";
import { dashedPage, eye } from "./marks.js";

const NIGHT = () => L("昨晚", "Last night"),
  COLLECTION = () => L("采集", "Collection"),
  LATE = () => L("晚了两个小时", "Two hours late");

/* The compact timeline of the top band, its parts and names drawn on their words: the night's rail from the stage's
 * first frame, the card landing on its hour with its name beside it, at its right, which keeps the band clear of the
 * head band, legible a tenth of a second later, once the card has settled, so it never rides the landing; and the two
 * hours measured with their name. The measure starts with its name, so the name never stands first under the rail and
 * then steps down. */
function theNight(t, a, c) {
  lastNight(960, 250, 0.75, {
    alpha: a,
    card: soon(t, c.collection - 0.15, 0.8),
    late: { draw: { t, at: c.late - 0.15 } },
    flow: { t },
    names: {
      axis: { v: NIGHT(), alpha: named(t, c.lastNight) },
      card: { v: COLLECTION(), side: "right", alpha: named(t, c.collection + 0.1) },
      late: { v: LATE(), alpha: named(t, c.late) },
    },
  });
}

/* The kinds of statement stand in three columns over one rail under the timeline, each mark centred on its column, and
 * its name, a term and the kind set under it, hangs one gap under the rail. The rail reaches past the outer columns'
 * marks. */
const COLUMNS = [560, 960, 1360],
  ROW_Y = 590,
  MARK = [84, 104],
  RAIL = { y: ROW_Y + MARK[1] / 2 + 10, reach: 90 },
  NAMES_TOP = RAIL.y + NAME_GAP,
  /* The observation stands beside the hypothesis it would refute, between the second and third columns, and is named
   * over itself, so the third column stays free for the choice. */
  OBSERVATION = { x: COLUMNS[1] + 170, r: 34 },
  OWNER_Y = 800;
function theFact(t, a, c) {
  ledger(COLUMNS[0], ROW_Y, ...MARK, { alpha: a * ramp(t, c.log - 0.15, 0.4) });
  check(COLUMNS[0] + 30, ROW_Y + 30, 30, { alpha: a * ramp(t, c.fact - 0.1, 0.4), width: 4 });
  termRow(
    t,
    [L("日志", "The log")],
    [c.log],
    [L("事实", "a fact")],
    [c.fact],
    COLUMNS[0],
    NAMES_TOP,
    {
      align: "center",
      inline: false,
      alpha: a,
    },
  );
}
function theHypothesis(t, a, c, { checked = true } = {}) {
  const x = COLUMNS[1],
    vt = voiceTime(t);
  dashedPage(x, ROW_Y, ...MARK, { alpha: a * ramp(t, c.vendorLate - 0.15, 0.4) });
  openMark(x + MARK[0] / 2 + 6, ROW_Y - MARK[1] / 2 + 4, 20, {
    alpha: a * ramp(t, c.hypothesis - 0.15, 0.4),
    turn: vt * 0.6,
  });
  termRow(
    t,
    [L("供应商发布", "Vendor publication")],
    [c.vendorLate],
    [L("假设", "a hypothesis")],
    [c.hypothesis],
    x,
    NAMES_TOP,
    { align: "center", inline: false, alpha: a },
  );
  if (!checked) return;
  // Someone checks the publication time: a clock on the publication, named beside it.
  const on = a * ramp(t, c.checks - 0.15, 0.4);
  clock(x - MARK[0] / 2 - 4, ROW_Y - MARK[1] / 2 + 4, 17, { alpha: on, hand: 0.15 });
  nameText(
    L("发布时间", "Publication time"),
    x - MARK[0] / 2 - 4 - 17 - NAME_GAP,
    ROW_Y - MARK[1] / 2 + 4,
    {
      align: "right",
      alpha: a * named(t, c.checks),
    },
  );
}

export function stageCase(t, a, c) {
  theNight(t, a, c);
  // The statements' rail stands from the stage's first frame. The opening words build only the night in the top band;
  // with the rail held back to its first member, the log, three seconds later, the picture would stand a quarter of the
  // frame's height off the content centre at the thought's two-second instant, past the reviewed balance's 12 %. So
  // the rail is the stage's frame for what will stand on it, in the line tone, as in round 6.
  line(COLUMNS[0] - RAIL.reach, RAIL.y, COLUMNS[2] + RAIL.reach, RAIL.y, {
    color: P.line,
    alpha: a,
    width: 2.5,
  });
  theFact(t, a, c);
  theHypothesis(t, a, c);
  // The observation that would refute it: an eye not yet opened beside the hypothesis, named over itself on its words;
  // on 「推翻」/ "refute" it is joined to the hypothesis, which stays a hypothesis: nothing marks it refuted.
  const { x, r } = OBSERVATION,
    seen = a * ramp(t, c.observation - 0.15, 0.4);
  eye(x, ROW_Y, { alpha: seen, hollow: true, r });
  const term = [L("观察", "An observation")],
    qual = [L("能推翻它", "would refute it")],
    { height } = termRowLayout(term, qual, Infinity, false);
  termRow(t, term, [c.observation], qual, [c.refute], x, ROW_Y - r * 0.9 - NAME_GAP - height, {
    align: "center",
    inline: false,
    alpha: a,
  });
  const refuted = a * ramp(t, c.refute - 0.15, 0.4);
  link(x - r - 8, ROW_Y + 18, COLUMNS[1] + MARK[0] / 2 + 10, ROW_Y + 18, {
    alpha: refuted,
    // Drawn at the tip pace from just before its words, so it reaches the hypothesis before the thought's quiet.
    draw: { t, at: c.refute - 0.25 },
    width: 2.5,
  });
  // From 「要不要换供应商」/ "Whether to change vendors": the choice in the third column, failure 1's fork, and under it,
  // in its column, the decision owner who makes it.
  const cx = COLUMNS[2];
  forkMark(cx, ROW_Y - 20, {
    alpha: a * ramp(t, c.choice - 0.15, 0.4),
    run: { t },
  });
  termRow(
    t,
    [L("换供应商", "Changing vendors")],
    [c.choice],
    [L("选择", "a choice")],
    [c.isChoice],
    cx,
    NAMES_TOP,
    {
      align: "center",
      inline: false,
      alpha: a,
    },
  );
  person(cx, OWNER_Y + 4, {
    color: P.authority,
    alpha: a * ramp(t, c.owner - 0.15, 0.4),
    size: 0.9,
  });
  nameText(L("决策负责人", "Decision owner"), cx, OWNER_Y + 36 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.owner),
  });
}
