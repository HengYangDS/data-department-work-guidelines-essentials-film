/* D (03.5-03.6), the made-up case, one stage. From 「拿昨晚的事来说」/ "Take last night": last night's timeline full and
 * centred, the night, the collection on its hour and the two hours late, as in 01.1; from 「日志」/ "the log" it
 * re-forms compact in the top band and the three kinds of statement build under it, one column each: the log, a fact,
 * with its check; the vendor's publication, dashed, a hypothesis, with its open question and, once someone checks, the
 * publication time on its clock; beside the hypothesis, the observation that would refute it, an eye named over itself,
 * which on 「推翻」/ "refute" is joined to the hypothesis while a dashed cross stands on it: a condition, not a finding.
 * From 「要不要换供应商」/ "Whether to change vendors" the choice joins in the third column, failure 1's fork, with the
 * decision owner who makes it under it. Nothing shown leaves before the stage does, and no new mark takes a place
 * another has left. */

import { link } from "../../drawing/links.js";
import { line } from "../../drawing/strokes.js";
import { check, clock, person } from "../../drawing/symbols.js";
import { lastNight, lastNightExtent } from "../../drawing/timeline.js";
import { ledger } from "../../drawing/workspace.js";
import { named } from "../../naming/lists.js";
import { NAME_GAP, nameText, termRow, termRowLayout } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { forkMark, openMark } from "../p01/failures.js";
import { dashedPage, eye } from "./marks.js";

const flowOf = (t) => (voiceTime(t) * 0.25) % 1;
const NIGHT = () => L("昨晚", "Last night"),
  COLLECTION = () => L("采集", "Collection"),
  LATE = () => L("晚了两个小时", "Two hours late");

/* The full timeline, centred with its three names, as in 01.1. The measure starts with its name, so the name never
 * stands first under the rail and then steps down. */
function fullNight(t, a, c) {
  const names = {
    axis: { v: NIGHT(), alpha: named(t, c.lastNight) },
    card: { v: COLLECTION(), alpha: named(t, c.collection) },
    late: { v: LATE(), alpha: named(t, c.late) },
  };
  const e = lastNightExtent(1, { card: 1, late: 1, names });
  lastNight(960 - (e.left + e.right) / 2, 505 - (e.top + e.bottom) / 2, 1, {
    alpha: a,
    card: soon(t, c.collection - 0.15, 0.8),
    late: soon(t, c.late - 0.15, 0.7),
    flow: flowOf(t),
    names,
  });
}
/* The compact timeline of the top band, with its three names. */
function compactNight(t, a) {
  lastNight(960, 250, 0.75, {
    alpha: a,
    card: 1,
    late: 1,
    flow: flowOf(t),
    names: { axis: NIGHT(), card: { v: COLLECTION(), side: "right" }, late: LATE() },
  });
}

/* The kinds of statement stand in three columns under the compact timeline, each mark centred on its column with its
 * name, a term and the kind set under it, hanging one gap under the row's lowest mark. */
const COLUMNS = [560, 960, 1360],
  ROW_Y = 590,
  MARK = [84, 104],
  NAMES_TOP = ROW_Y + MARK[1] / 2 + NAME_GAP,
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
  const full = a * stageOut(t, c.log),
    compact = a * stageIn(t, c.log);
  if (full > 0) fullNight(t, full, c);
  if (compact <= 0) return;
  compactNight(t, compact);
  theFact(t, compact, c);
  theHypothesis(t, compact, c);
  // The observation that would refute it: an eye not yet opened beside the hypothesis, named over itself on its words;
  // on 「推翻」/ "refute" it is joined to the hypothesis and a dashed cross stands on the hypothesis.
  const { x, r } = OBSERVATION,
    seen = compact * ramp(t, c.observation - 0.15, 0.4);
  eye(x, ROW_Y, { alpha: seen, hollow: true, r });
  const term = [L("观察", "An observation")],
    qual = [L("能推翻它", "would refute it")],
    { height } = termRowLayout(term, qual, Infinity, false);
  termRow(t, term, [c.observation], qual, [c.refute], x, ROW_Y - r * 0.9 - NAME_GAP - height, {
    align: "center",
    inline: false,
    alpha: compact,
  });
  const refuted = compact * ramp(t, c.refute - 0.15, 0.4);
  link(x - r - 8, ROW_Y + 18, COLUMNS[1] + MARK[0] / 2 + 10, ROW_Y + 18, {
    alpha: refuted,
    upto: soon(t, c.refute + 0.05, 0.6),
    width: 2.5,
  });
  if (refuted > 0.01)
    [
      [-1, -1, 1, 1],
      [1, -1, -1, 1],
    ].forEach(([x0, y0, x1, y1]) =>
      line(COLUMNS[1] + 13 * x0, ROW_Y + 13 * y0, COLUMNS[1] + 13 * x1, ROW_Y + 13 * y1, {
        color: P.unknown,
        alpha: refuted,
        width: 3.5,
        dash: [5, 4],
      }),
    );
  // From 「要不要换供应商」/ "Whether to change vendors": the choice in the third column, failure 1's fork, and under it,
  // in its column, the decision owner who makes it.
  const cx = COLUMNS[2];
  forkMark(cx, ROW_Y - 20, {
    alpha: compact * ramp(t, c.choice - 0.15, 0.4),
    run: (voiceTime(t) * 0.45) % 1,
  });
  termRow(t, [L("换供应商", "A new vendor")], [c.choice], [L("选择", "a choice")], [c.isChoice], cx, NAMES_TOP, {
    align: "center",
    inline: false,
    alpha: compact,
  });
  person(cx, OWNER_Y + 4, {
    color: P.authority,
    alpha: compact * ramp(t, c.owner - 0.15, 0.4),
    size: 0.9,
  });
  nameText(L("决策负责人", "Decision owner"), cx, OWNER_Y + 36 + NAME_GAP, {
    valign: "top",
    alpha: compact * named(t, c.owner),
  });
}
