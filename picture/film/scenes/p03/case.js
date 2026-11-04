/* D1 and D2 (03.5-03.6), the made-up case. D1, from 「拿昨晚的事来说」/ "Take last night": last night's timeline full
 * and centred, the night, the collection on its hour and the two hours late, as in 01.1; from 「日志」/ "the log" it
 * re-forms compact in the top band and the two kinds of statement stand under it, one beside the other: the log, a
 * fact, with its check; the vendor's publication, dashed, a hypothesis, with its open question and, once someone checks,
 * the publication time on its clock; then the observation that would refute it, an eye, which on 「不成立」/ "fails"
 * is joined to the hypothesis, and a dashed cross stands beside the hypothesis: a condition, not a finding. D2, from
 * 「要不要换供应商」/ "Whether to change vendors": the observation leaves and the choice takes its place, failure 1's
 * fork, now after the fact and the hypothesis; under the three kinds, the decision owner who makes it, the trade-off it
 * states and the condition for revisiting it. */

import { link } from "../../drawing/links.js";
import { line } from "../../drawing/strokes.js";
import { check, clock, person } from "../../drawing/symbols.js";
import { lastNight, lastNightExtent } from "../../drawing/timeline.js";
import { ledger, recoverIcon } from "../../drawing/workspace.js";
import { named } from "../../naming/lists.js";
import { NAME_GAP, nameText, termRow } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { forkMark, openMark } from "../p01/failures.js";
import { balance, dashedPage, eye } from "./marks.js";

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
/* The compact timeline of the top band; D2 keeps only the name of its two hours. */
function compactNight(t, a, all = true) {
  lastNight(960, 250, 0.75, {
    alpha: a,
    card: 1,
    late: 1,
    flow: flowOf(t),
    names: {
      axis: all ? NIGHT() : null,
      card: all ? { v: COLLECTION(), side: "right" } : null,
      late: LATE(),
    },
  });
}

/* The kinds of statement stand in three columns under the compact timeline, each mark centred on its column with its
 * name, a term and the kind set under it, hanging one gap under the row's lowest mark. */
const COLUMNS = [560, 960, 1360],
  ROW_Y = 590,
  MARK = [84, 104],
  NAMES_TOP = ROW_Y + MARK[1] / 2 + NAME_GAP;
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
  // The observation that would refute it: an eye not yet opened, named on its words; on 「不成立」/ "fails" it is
  // joined to the hypothesis and a dashed cross stands beside the hypothesis.
  const x = COLUMNS[2],
    seen = compact * ramp(t, c.observation - 0.15, 0.4);
  eye(x, ROW_Y, { alpha: seen, hollow: true, r: 38 });
  termRow(
    t,
    [L("观察", "An observation")],
    [c.observation],
    [L("按时发布", "vendor on time")],
    [c.onTime],
    x,
    NAMES_TOP,
    { align: "center", inline: false, alpha: compact },
  );
  const fails = compact * ramp(t, c.fails - 0.15, 0.4);
  link(x - 46, ROW_Y + 18, COLUMNS[1] + MARK[0] / 2 + 10, ROW_Y + 18, {
    alpha: fails,
    upto: soon(t, c.fails + 0.05, 0.6),
    width: 2.5,
  });
  if (fails > 0.01)
    [
      [-1, -1, 1, 1],
      [1, -1, -1, 1],
    ].forEach(([x0, y0, x1, y1]) =>
      line(COLUMNS[1] + 13 * x0, ROW_Y + 13 * y0, COLUMNS[1] + 13 * x1, ROW_Y + 13 * y1, {
        color: P.unknown,
        alpha: fails,
        width: 3.5,
        dash: [5, 4],
      }),
    );
}

/* D2: the choice in the third column, and under the row the decision owner, the trade-off and the condition for
 * revisiting, each on its words, one row of marks named under themselves. */
const DETAILS_X = [760, 960, 1160],
  DETAILS_Y = 800;
export function stageChoice(t, a, c) {
  compactNight(t, a, false);
  theFact(t, a, c);
  theHypothesis(t, a, c, { checked: false });
  const x = COLUMNS[2],
    vt = voiceTime(t);
  forkMark(x, ROW_Y - 20, { alpha: a * ramp(t, c.choice - 0.15, 0.4), run: (vt * 0.45) % 1 });
  termRow(
    t,
    [L("换供应商", "A new vendor")],
    [c.choice],
    [L("选择", "a choice")],
    [c.isChoice],
    x,
    NAMES_TOP,
    {
      align: "center",
      inline: false,
      alpha: a,
    },
  );
  const owner = a * ramp(t, c.owner - 0.15, 0.4),
    weighed = a * ramp(t, c.tradeoff - 0.15, 0.4),
    back = a * ramp(t, c.revisit - 0.15, 0.4),
    names = DETAILS_Y + 36 + NAME_GAP;
  person(DETAILS_X[0], DETAILS_Y + 4, { color: P.authority, alpha: owner, size: 0.9 });
  nameText(L("决策负责人", "Decision owner"), DETAILS_X[0], names, {
    valign: "top",
    alpha: a * named(t, c.owner),
  });
  balance(DETAILS_X[1], DETAILS_Y, { alpha: weighed, tilt: 0.12 * Math.sin(vt * 1.4) });
  nameText(L("取舍", "Trade-off"), DETAILS_X[1], names, {
    valign: "top",
    alpha: a * named(t, c.tradeoff),
  });
  recoverIcon(DETAILS_X[2], DETAILS_Y, 22, { alpha: back, upto: soon(t, c.revisit + 0.05, 0.6) });
  nameText(L("回头再看", "Revisiting"), DETAILS_X[2], names, {
    valign: "top",
    alpha: a * named(t, c.revisit),
  });
}
