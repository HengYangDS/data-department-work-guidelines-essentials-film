/* C2 (03.4, from 「要看原始记录」/ "primary records"): what can establish a fact, centred. The stage it cuts into has
 * named authority about facts and what it answers under its record (C1, kinds.js), so this one names them nowhere
 * else: a primary record and a repeatable observation arrive on their words at its top, and under them what each must
 * state builds part by part as one name. The leads build one row at the foot under their common way, at one pitch wide
 * enough for the widest neighbouring names, the middle lead on the frame's axis: the way stands whole in the line tone
 * from the stage's first frame, so the stage has its whole extent from its first words, and each lead joins it on its
 * words, with its own way down from it, in its edition's order, at its place in the whole row. On
 * 「都不是原始记录」/ "are not primary records" their way rises on that axis toward the records and stops at a bar under
 * them; on 「线索」/ "leads" a bracket centred on the axis and reaching past every name names the row. */

import { ctx } from "../../canvas.js";
import { flowDot, line, measure, stroke } from "../../drawing/strokes.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, growName, nameText } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { LEAD_ORDER, LEADS, bar, eye, leadMark, recordMark } from "./marks.js";

const ROW_Y = 395,
  RECORDS_X = [840, 1080],
  STATE_Y = 518,
  BAR_Y = 604,
  JOIN_Y = 640,
  LEADS_Y = 700,
  LEAD_HALF = 22,
  LEAD_GAP = 44;
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
  // A primary record and a repeatable observation, named under themselves on one baseline.
  const records = a * ramp(t, c.primary - 0.15, 0.4),
    observed = a * ramp(t, c.observe - 0.15, 0.4),
    names = ROW_Y + 52 + NAME_GAP;
  recordMark(RECORDS_X[0], ROW_Y, 84, 104, { alpha: records });
  nameText(L("原始记录", "Primary records"), RECORDS_X[0], names, {
    valign: "top",
    alpha: a * named(t, c.primary),
  });
  eye(RECORDS_X[1], ROW_Y, { alpha: observed, repeat: 1, r: 34 });
  nameText(L("能重复的观察", "Observations"), RECORDS_X[1], names, {
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
  // tone from the stage's first frame, so the row has its whole extent before its first member; each lead's own way
  // down from it to the lead fades in whole with the lead, on the lead's words. The way stands more than a column's
  // reach (90 px) under the state and over the leads' names, so no name reaches it before its leads join it.
  const { xs, widths } = leadPlaces();
  line(xs[0], JOIN_Y, xs.at(-1), JOIN_Y, { color: P.line, alpha: a, width: 2.5 });
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
  // A point rises from the leads toward the records in voice time and stops at the bar.
  if (meet >= 1) {
    const q = (voiceTime(t) * 0.35) % 1;
    flowDot(960, mix(JOIN_Y, BAR_Y + 8, q), 5, q, { color: P.line, alpha: a });
  }
  // 「线索」/ "leads": a bracket under the row's names, centred on the axis and reaching past every name, drawn on with
  // the name that hangs under its middle.
  const under = LEADS_Y + LEAD_HALF + 16 + 25 + 14,
    on = a * soon(t, c.onlyLeads - 0.1, 0.5);
  if (on > 0.01) {
    const half = Math.max(...xs.map((x, i) => Math.abs(x - 960) + widths[i] / 2));
    stroke(
      () => {
        ctx.moveTo(960 - half, under - 8);
        ctx.lineTo(960 - half, under);
        ctx.lineTo(960 + half, under);
        ctx.lineTo(960 + half, under - 8);
      },
      { color: P.line, alpha: on, width: 2 },
    );
  }
  nameText(L("线索", "Leads"), 960, under + NAME_GAP - 6, {
    valign: "top",
    alpha: a * named(t, c.onlyLeads),
  });
}
