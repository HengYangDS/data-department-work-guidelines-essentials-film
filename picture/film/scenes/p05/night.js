/* Part 05, stages C and D, the made-up case: what last night's delay means for the record. C: the full timeline, the
 * prices on their hour, the usual hour and the arrival at the two ends of the measured two hours; and a backtest of
 * those hours below it, which must count from the later time. D:
 * the rail runs on from last night to today: what could be known then at the left, what is seen in hindsight at the
 * right, and a correction drawn dashed, as the narration only supposes it, whose corrected series cannot be taken
 * back to show what was known then. */

import { lastNight, lastNightExtent, HOUR } from "../../drawing/timeline.js";
import { link } from "../../drawing/links.js";
import {
  dot,
  flowAt,
  flowDot,
  labelSize,
  lengthOf,
  line,
  measure,
  path,
} from "../../drawing/strokes.js";
import { tableIcon } from "../../drawing/symbols.js";
import { named } from "../../naming/lists.js";
import { NAME_GAP, nameText, rejectedName } from "../../naming/names.js";
import { LABEL, P } from "../../palette.js";
import { L } from "../../timeline.js";
import { clamp, ease, mix, ramp, soon } from "../../timing/easing.js";
import { bar } from "./kit.js";

/* The backtest's height and how far it stands below the measure's name, and the room its marker's name takes under it:
 * the stage's place counts them from its first word, so nothing moves when they arrive. */
const TEST = { gap: 30, h: 96 };
const TEST_ROOM = TEST.gap + TEST.h + NAME_GAP + labelSize(LABEL);
/* The curve's heights, one point per half hour from an hour before the due hour to an hour after the arrival. */
const CURVE = [0.25, 0.42, 0.34, 0.55, 0.47, 0.66, 0.58, 0.8, 0.72];

function nightNames(t, c) {
  return {
    card: { v: L("昨晚那份价格", "Last night's prices"), alpha: named(t, c.first3) },
    due: { v: L("平时", "Usual"), side: "left", alpha: named(t, c.usual) },
    arrival: { v: L("最早能拿到", "Arrival"), side: "right", alpha: named(t, c.arrival) },
    late: { v: L("晚了两个小时", "Two hours later"), alpha: named(t, c.measure) },
  };
}

/* The backtest over the same hours, under the measure: a curve whose points inside the two hours stand in the colour
 * of the unknown, not available then. The curve draws on over 1.6 s and each point fades in as the curve's tip passes
 * it, over two fifths of the curve, so the points arrive one after another rather than each in a frame. Its marker, on
 * the words that say so, stands on the arrival's hour: every decision in those hours counts from that later time. */
function backtest(t, c, g, m, top) {
  const x0 = m.at(-1),
    x1 = m.at(3),
    bottom = top + TEST.h,
    a = g * named(t, c.backtest),
    seen = ramp(t, c.backtest - 0.1, 1.6),
    points = CURVE.map((v, i) => [
      x0 + ((x1 - x0) * i) / (CURVE.length - 1),
      bottom - 8 - v * (TEST.h - 16),
    ]),
    total = lengthOf(points);
  line(x0, bottom, x1, bottom, { color: P.line, alpha: a, width: 2 });
  path(points, { color: P.ink, alpha: a, width: 3, upto: seen });
  points.forEach(([x, y], i) => {
    const within = x > m.due + 1 && x < m.arrival - 1,
      reached = lengthOf(points.slice(0, i + 1)) / total;
    dot(x, y, 6.5, {
      color: within ? P.unknown : P.evidence,
      alpha: a * ease(clamp((seen - reached + 0.15) / 0.4)),
    });
  });
  nameText(L("回测", "Backtest"), x0 - NAME_GAP, top + TEST.h / 2, { align: "right", alpha: a });
  const mark = g * named(t, c.later);
  line(m.arrival, top - 6, m.arrival, bottom, { color: P.authority, alpha: mark, width: 3 });
  nameText(L("晚到的时间", "That later time"), m.arrival, bottom + NAME_GAP, {
    valign: "top",
    alpha: mark,
  });
}

/* The timeline stands at one place from its first word, its measure and the backtest arriving under it: the stage
 * grows downward from its card alone to the whole with the backtest, and stands at the midpoint of the anchors that
 * centre those two states on the content centre, so neither stands far off and nothing moves. */
export function nightStage(s, t, c, g) {
  const names = nightNames(t, c),
    first = lastNightExtent(1, { card: 1, names: { card: names.card } }),
    e = lastNightExtent(1, { card: 1, due: 1, late: 1, names }),
    x = 960 - (e.left + e.right) / 2,
    y = 505 - (first.top + first.bottom + e.top + e.bottom + TEST_ROOM) / 4;
  const m = lastNight(x, y, 1, {
    alpha: g,
    card: soon(t, c.first3 - 0.15, 0.8),
    due: soon(t, c.usual - 0.1, 0.4),
    late: soon(t, c.measure + 0.05, 0.7),
    flow: { t, from: c.later + 0.6 },
    names,
  });
  backtest(t, c, g, m, y + e.bottom + TEST.gap);
}

/* D: the rail runs on past last night to today, in the 0.6 form: last night's card at the left, today's corrected
 * series at the right, their names on one baseline. A correction drawn dashed over the stretch is what the narration
 * supposes. On the words that refuse it, a point runs back along the rail from today and stops at a bar just past last
 * night's hours. */
const D = { scale: 0.6, hours: [-2, 8], today: 8 };
export function hindsightStage(s, t, c, g) {
  const research = L("历史研究", "Historical research"),
    names = {
      axis: { v: research, alpha: named(t, c.first4) },
      card: { v: L("当时", "Known then"), alpha: named(t, c.then) },
    },
    later = L("事后", "Seen in hindsight"),
    series = L("修正后的数据", "Corrected series"),
    reach = Math.max(measure(later), measure(series)) / 2,
    e = lastNightExtent(D.scale, { card: 1, hours: D.hours, names }),
    x = 960 - (e.left + e.right + reach) / 2,
    y = 545;
  const m = lastNight(x, y, D.scale, {
    alpha: g,
    card: soon(t, c.then - 0.15, 0.8),
    hours: D.hours,
    flow: { t, until: c.cannot },
    names,
  });
  // The rail's two ends are quiet points, so the rail stands whole while its first name is said.
  dot(m.left, y, m.mark, { color: P.line, alpha: g });
  dot(m.right, y, m.mark, { color: P.line, alpha: g });
  const today = m.at(D.today),
    box = m.above(D.today),
    under = y + m.tick + NAME_GAP,
    midY = (m.card.top + m.card.bottom) / 2;
  // Today's end of the rail, on the words of hindsight.
  const seen = g * named(t, c.hindsight);
  dot(today, y, m.mark, { color: P.ink, alpha: seen });
  nameText(later, today, under, { valign: "top", alpha: seen });
  // The correction, only supposed: a dashed way over the stretch to where today's series stands.
  const fix = g * named(t, c.corrected);
  link(m.card.right + 10, midY, box.left - 10, midY, {
    alpha: fix,
    dash: [9, 9],
    upto: soon(t, c.corrected - 0.1, 0.9),
    color: P.muted,
  });
  nameText(L("修正", "Corrected"), (m.card.right + box.left) / 2, midY - NAME_GAP, {
    valign: "bottom",
    alpha: fix,
  });
  // Today's corrected series.
  const data = g * named(t, c.series);
  tableIcon(box.left, box.top, box.right - box.left, box.bottom - box.top, { alpha: data });
  nameText(series, today, box.top - NAME_GAP, { valign: "bottom", alpha: data });
  // Its way back stops at a bar past last night's hours.
  const barX = m.arrival + HOUR * D.scale * 0.8,
    no = g * named(t, c.cannot);
  bar(barX, y, { alpha: g * ramp(t, c.cannot + 0.35, 0.3), vertical: true, length: 44 });
  const back = flowAt(t, today - 12 - (barX + 10), { from: c.cannot });
  flowDot(mix(today - 12, barX + 10, back?.q ?? 0), y, 6, back, { color: P.unknown, alpha: g });
  rejectedName(L("证明不了", "Cannot show"), barX, under, {
    valign: "top",
    alpha: no,
    mark: ramp(t, c.cannot + 0.35, 0.3),
  });
}
