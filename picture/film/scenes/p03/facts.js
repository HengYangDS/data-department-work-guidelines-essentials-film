/* C2 (03.4, from 「要看原始记录」/ "primary records"): what can establish a fact, centred. The head, a record with its
 * name and what it answers, stands at the top; under it a primary record and a repeatable observation arrive on their
 * words, and under them what each must state builds part by part as one name. The leads build one row at the foot,
 * centred on the frame, under their common way: the way stands whole from the first lead's words, and each lead joins
 * it on its words, in its edition's order, at its place in the whole row. On 「都不是原始记录」/ "are not primary
 * records" their way rises toward the records and stops at a bar under them; on 「线索」/ "leads" the row is named. */

import { ctx } from "../../canvas.js";
import { flowDot, line, measure, stroke } from "../../drawing/strokes.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, growName, nameText, termRow } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { LEAD_ORDER, LEADS, bar, eye, leadMark, recordMark } from "./marks.js";

const HEAD_Y = 285,
  HEAD_MARK = [62, 78],
  ROW_Y = 455,
  RECORDS_X = [760, 1160],
  STATE_Y = 578,
  BAR_Y = 644,
  JOIN_Y = 680,
  LEADS_Y = 730,
  LEAD_HALF = 22,
  LEAD_GAP = 44;
const HEAD = () => L("事实依据", "Authority about facts"),
  WHAT = () => L("靠什么认定一件事是真的", "what can establish truth");
/* What each record or observation must state, its parts said in turn. */
const STATE = () =>
  L(["来源、", "时间、", "对象、", "范围"], ["Source, ", "time, ", "subject, ", "scope"]);
/* The leads' places in their row, centred on the frame: neighbours keep their NOTE names a gap apart. Each lead stands
 * at its place in the whole row from its words, so no lead moves once shown. */
function leadPlaces() {
  const widths = LEAD_ORDER().map((k) => Math.max(2 * LEAD_HALF, measure(L(...LEADS[k]), NOTE))),
    steps = widths.slice(1).map((w, i) => Math.max(130, (widths[i] + w) / 2 + LEAD_GAP)),
    xs = steps.reduce((v, d) => [...v, v.at(-1) + d], [0]),
    mid = (xs[0] - widths[0] / 2 + xs.at(-1) + widths.at(-1) / 2) / 2;
  return { xs: xs.map((x) => x - mid + 960), widths };
}

export function stageFacts(t, a, c) {
  const width = HEAD_MARK[0] + NAME_GAP + Math.max(measure(HEAD()), measure(WHAT(), NOTE)),
    hx = 960 - width / 2 + HEAD_MARK[0] / 2;
  recordMark(hx, HEAD_Y, ...HEAD_MARK, { alpha: a });
  termRow(
    t,
    [HEAD()],
    [-Infinity],
    [WHAT()],
    [-Infinity],
    hx + HEAD_MARK[0] / 2 + NAME_GAP,
    HEAD_Y - 32,
    {
      align: "left",
      inline: false,
      alpha: a,
    },
  );
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
  // tone from the first lead's words, so the row has its whole extent from its first member, and each lead's own way
  // reaches down from it to the lead on the lead's words: one stroke.
  const { xs, widths } = leadPlaces(),
    reach = xs.map((_, i) => soon(t, c.leads[i] - 0.15, 0.4));
  stroke(
    () => {
      ctx.moveTo(xs[0], JOIN_Y);
      ctx.lineTo(xs.at(-1), JOIN_Y);
      xs.forEach((x, i) => {
        if (reach[i] <= 0) return;
        ctx.moveTo(x, JOIN_Y);
        ctx.lineTo(x, mix(JOIN_Y, LEADS_Y - LEAD_HALF - 4, reach[i]));
      });
    },
    { color: P.line, alpha: a * ramp(t, c.leads[0] - 0.15, 0.4), width: 2.5 },
  );
  LEAD_ORDER().forEach((k, i) => {
    leadMark(k, xs[i], LEADS_Y, { alpha: a * ramp(t, c.leads[i] - 0.15, 0.4) });
    nameText(L(...LEADS[k]), xs[i], LEADS_Y + LEAD_HALF + 16, {
      valign: "top",
      size: NOTE,
      alpha: a * listIn(t, c.leads, i),
      set: "leads",
    });
  });
  // On 「都不是原始记录」/ "are not primary records" their way rises toward the records and stops at a bar under them.
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
  // 「线索」/ "leads": a bracket under the row's names, drawn on with the name that hangs under its middle.
  const under = LEADS_Y + LEAD_HALF + 16 + 25 + 14,
    on = a * soon(t, c.onlyLeads - 0.1, 0.5);
  if (on > 0.01) {
    const left = xs[0] - widths[0] / 2,
      right = xs.at(-1) + widths.at(-1) / 2;
    stroke(
      () => {
        ctx.moveTo(left, under - 8);
        ctx.lineTo(left, under);
        ctx.lineTo(right, under);
        ctx.lineTo(right, under - 8);
      },
      { color: P.line, alpha: on, width: 2 },
    );
  }
  nameText(L("线索", "Leads"), 960, under + NAME_GAP - 6, {
    valign: "top",
    alpha: a * named(t, c.onlyLeads),
  });
}
