/* C2 (03.4, from 「能重复的观察」/ "repeatable observations"): what can establish a fact, centred. The stage it cuts
 * into has named authority about facts and what it answers under its record (C1, kinds.js), and holds while the primary
 * records are said, so this one names them nowhere else: a primary record and a repeatable observation stand together
 * from the cut at its top, over the outer columns of the leads' row and at the size of C1's record, so the stage opens
 * balanced and the pair covers a tenth of the band on its own until the first lead comes; under them what each must
 * state builds part by part as one name. The leads build one row at the foot under their common way, at one pitch wide
 * enough for the widest neighbouring names, the middle lead on the frame's axis: the way stands whole with the first
 * lead, on its words, and each lead joins it on its words, with its own way down from it, in its edition's order, at
 * its place in the whole row. The stage stands where its first state, the pair named, and its last, the leads named,
 * stand equally far off the content centre, so nothing moves as it builds. On 「都不是原始记录」/ "are not primary
 * records" their way rises on that axis toward the records and stops at a bar under them; on 「线索」/ "leads" a bracket
 * that ends the same distance past each outer name's ink names the row. */

import { ctx } from "../../canvas.js";
import { flowAt, flowDot, line, measure, stroke } from "../../drawing/strokes.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, growName, nameText } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { LEAD_ORDER, LEADS, bar, eye, leadMark, recordMark } from "./marks.js";

/* The record is C1's (110 by 140) and the eye beside it in proportion. The names hang one gap under the record, the
 * state 49 px under the names' top, the bar 66 px and the leads' way 100 px under the state, and the leads 56 px under
 * the way, so the stage is short enough for its first and last states to stand within 80 px of the content centre. */
const ROW_Y = 410,
  RECORD = [110, 140],
  EYE_R = 46,
  NAMES_Y = ROW_Y + RECORD[1] / 2 + NAME_GAP,
  STATE_Y = NAMES_Y + 49,
  BAR_Y = STATE_Y + 66,
  JOIN_Y = STATE_Y + 100,
  LEADS_Y = JOIN_Y + 56,
  LEAD_HALF = 22,
  LEAD_GAP = 44,
  /* The bracket's ends reach this far past each outer name's advance, so they overshoot the row's two ends alike. */
  BRACKET_CLEAR = 32;
/* What each record or observation must state, its parts said in turn. */
const STATE = () =>
  L(["来源、", "时间、", "对象、", "范围"], ["Source, ", "time, ", "subject, ", "scope"]);
/* The leads' places in their row: one pitch, wide enough that each pair of neighbouring NOTE names keeps a gap apart,
 * with the middle lead on the frame's axis, where their way rises. Each lead stands at its place in the whole row from
 * its words, so no lead moves once shown. */
function leadPlaces() {
  const widths = LEAD_ORDER().map((k) => Math.max(2 * LEAD_HALF, measure(L(...LEADS[k]), NOTE))),
    pitch = Math.max(130, ...widths.slice(1).map((w, i) => (widths[i] + w) / 2 + LEAD_GAP)),
    middle = (widths.length - 1) / 2;
  return { xs: widths.map((_, i) => 960 + (i - middle) * pitch), widths };
}

export function stageFacts(t, a, c) {
  const { xs, widths } = leadPlaces();
  // A primary record and a repeatable observation over the row's outer columns, named under themselves on one
  // baseline.
  const records = a * ramp(t, c.primary - 0.15, 0.4),
    observed = a * ramp(t, c.observe - 0.15, 0.4);
  recordMark(xs[0], ROW_Y, ...RECORD, { alpha: records });
  nameText(L("原始记录", "Primary records"), xs[0], NAMES_Y, {
    valign: "top",
    alpha: a * named(t, c.primary),
  });
  eye(xs.at(-1), ROW_Y, { alpha: observed, repeat: 1, r: EYE_R });
  nameText(L("能重复的观察", "Repeatable observations"), xs.at(-1), NAMES_Y, {
    valign: "top",
    alpha: a * named(t, c.observe),
  });
  growName(t, STATE(), c.state, 960, STATE_Y, {
    size: NOTE,
    color: P.muted,
    align: "center",
    build: true,
    alpha: a,
  });
  // The leads, one row at the foot under their common way, each named under itself. The way stands whole in the line
  // tone with the first lead, on its words, and each lead's own way down from it to the lead fades in whole with the
  // lead, on the lead's words.
  line(xs[0], JOIN_Y, xs.at(-1), JOIN_Y, {
    color: P.line,
    alpha: a * ramp(t, c.leads[0] - 0.15, 0.4),
    width: 2.5,
  });
  LEAD_ORDER().forEach((k, i) => {
    const on = a * ramp(t, c.leads[i] - 0.15, 0.4);
    line(xs[i], JOIN_Y, xs[i], LEADS_Y - LEAD_HALF - 4, { color: P.line, alpha: on, width: 2.5 });
    leadMark(k, xs[i], LEADS_Y, { alpha: on });
    nameText(L(...LEADS[k]), xs[i], LEADS_Y + LEAD_HALF + 16, {
      valign: "top",
      size: NOTE,
      alpha: a * listIn(t, c.leads, i),
      set: "leads",
    });
  });
  // On 「都不是原始记录」/ "are not primary records" their way rises on the middle lead's axis toward the records and
  // stops at a bar under them.
  const meet = soon(t, c.notPrimary + 0.05, 0.7);
  if (meet > 0) {
    line(960, JOIN_Y, 960, JOIN_Y - (JOIN_Y - BAR_Y - 4) * meet, {
      color: P.line,
      alpha: a * Math.min(1, meet * 3),
      width: 2.5,
    });
    bar(960, BAR_Y, { alpha: a * ramp(t, c.notPrimary + 0.6, 0.3), length: 56 });
  }
  // A point rises from the leads toward the records in voice time and stops at the bar, once their way stands.
  const rises = flowAt(t, JOIN_Y - BAR_Y - 8, { from: c.notPrimary + 0.75 });
  flowDot(960, mix(JOIN_Y, BAR_Y + 8, rises?.q ?? 0), 5, rises, { color: P.line, alpha: a });
  // 「线索」/ "leads": a bracket 16 px under the row's names whose ends stand BRACKET_CLEAR past the outer names, drawn
  // on with the name that hangs under its middle.
  const under = LEADS_Y + LEAD_HALF + 16 + 25 + 16,
    on = a * soon(t, c.onlyLeads - 0.1, 0.5),
    ends = [xs[0] - widths[0] / 2 - BRACKET_CLEAR, xs.at(-1) + widths.at(-1) / 2 + BRACKET_CLEAR];
  if (on > 0.01)
    stroke(
      () => {
        ctx.moveTo(ends[0], under - 8);
        ctx.lineTo(ends[0], under);
        ctx.lineTo(ends[1], under);
        ctx.lineTo(ends[1], under - 8);
      },
      { color: P.line, alpha: on, width: 2 },
    );
  nameText(L("线索", "Leads"), (ends[0] + ends[1]) / 2, under + NAME_GAP - 6, {
    valign: "top",
    alpha: a * named(t, c.onlyLeads),
  });
}
