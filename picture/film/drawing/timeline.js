/* The film's motif, last night's timeline (the picture plan's section 2): the night's hours on one rail, the price
 * data on the hour it arrived, the hour it was due two hours earlier, and the two hours between, measured below the
 * rail. It is the drawing the 25-minute film gives the same case (ddwg-film, lane 20261101-keep-concepts-faithful at
 * 938d6fe, picture/film.js, 06.2), redrawn by parts in the manner of the ETHOS film's mark, so that every part of the
 * film draws it alike: each part takes its own share in [0, 1], a stroke drawing on from its start and a mark fading
 * in, and its own opacity, and the whole figure is drawn at any centre and scale. Its marks scale with it; its names
 * keep the film's two text sizes and stand one gap from their marks at every scale, so the compact timeline of the
 * top band is the same figure with the same words. */

import { ctx } from "../canvas.js";
import {
  dot,
  drawnShare,
  flowAt,
  flowDot,
  labelSize,
  line,
  measure,
  ring,
  stroke,
} from "./strokes.js";
import { tableIcon } from "./symbols.js";
import { LEADING, NAME_GAP, nameText, wrapName } from "../naming/names.js";
import { LABEL, P } from "../palette.js";
import { clamp, ease, mix } from "../timing/easing.js";

/* The full form's measures, at scale 1. An hour is 180 px of rail, so about the frame's centre the rail runs from
 * x 420 to 1500, the due hour stands at 780 and the arrival at 1140. */
export const HOUR = 180;
/* The rail's first and last hour, counted from the due hour, and how late the data came: two hours. */
const HOURS = [-2, 4],
  LATE_BY = 2;
/* Half an hour tick, 14 px in all: under the 16 px from which repeated shapes each need a name of their own. */
const TICK = 7,
  RAIL = 3.5,
  /* The due hour's ring and the arrival's point: under 16 px too, and larger than the point that runs on (flow). */
  MARK = 7,
  CARD = [150, 110],
  STEM = 36,
  /* The card lands on its hour from this far above it. */
  LANDING = 14,
  /* The two hours stand this far below the rail, between end ticks of this half height: far enough that a name at
   * either end of the measure keeps at least half a line clear of the rail's ticks and of the measure's own name, 20
   * px at full scale. */
  SPAN = 44,
  SPAN_TICK = 10,
  SPAN_WIDTH = 3,
  /* A night's due tick, half its height, and its data's point: a point a few minutes late stands clear of the tick
   * rather than over a ring. */
  DUE_TICK = 9,
  NIGHT_POINT = 4.5;

/* Where the figure's parts stand for its anchor (x, y): the point of the rail midway between the due hour and two
 * hours after it, so the full form is centred on the two hours it is about, and x 960 centres its rail on the frame.
 * `at(h)` is the x of hour h counted from the due hour, and `above(h)` the box of a card standing over hour h, as the
 * price data stands over its arrival (a publication on the due hour takes the same place). Marks keep widths that stay
 * lit at small scales: a rail in the line colour reads as lit from 2.1 px. */
function geometry(x, y, scale, hours, lateBy) {
  const hour = HOUR * scale,
    at = (h) => x + (h - LATE_BY / 2) * hour,
    [cw, ch] = CARD.map((v) => v * scale),
    stem = STEM * scale,
    above = (h) => ({
      left: at(h) - cw / 2,
      top: y - stem - ch,
      right: at(h) + cw / 2,
      bottom: y - stem,
    }),
    span = y + Math.max(40, SPAN * scale);
  return {
    x,
    y,
    scale,
    hour,
    at,
    above,
    left: at(hours[0]),
    right: at(hours[1]),
    due: at(0),
    arrival: at(lateBy),
    tick: Math.max(4, TICK * scale),
    rail: Math.max(2.5, RAIL * scale),
    mark: Math.max(5.5, MARK * scale),
    card: above(lateBy),
    span: {
      y: span,
      tick: Math.max(6, SPAN_TICK * scale),
      width: Math.max(2.5, SPAN_WIDTH * scale),
      left: at(0),
      right: at(lateBy),
    },
  };
}

/* Each name's place by its side of its mark, as nameText anchors it: [x, y, align, valign]. Over the rail a name's
 * foot stands one gap above the hour ticks, so the rail's names (the night's at its left end, the due hour's and the
 * arrival's over their hours, the delay's over its lit hours) share one baseline. The card's name stands one gap above
 * the card, or beside it at its right, which keeps the compact form of the top band below the head band; it moves with
 * the card as the card lands. The two hours read as a measure: their name hangs one gap below their end ticks, and the
 * due hour and the arrival may be named at its two ends, on the measure's line, where the card leaves no room over
 * the arrival. The delay's name takes the measure's place from its first frame, whether or not the measure has begun
 * to draw on, so a name said just before its measure never steps down to it. */
const SIDES = { axis: "top", due: "top", arrival: "top", card: "top", late: "bottom" };
function anchor(g, slot, side, { lift = 0 } = {}) {
  const over = g.y - g.tick - NAME_GAP,
    card = { ...g.card, top: g.card.top - lift, bottom: g.card.bottom - lift },
    s = g.span,
    middle = (s.left + s.right) / 2;
  const places = {
    "axis:top": [g.left, over, "left", "bottom"],
    "axis:left": [g.left - g.rail / 2 - NAME_GAP, g.y, "right", "middle"],
    "due:top": [g.due, over, "center", "bottom"],
    "due:left": [s.left - s.width / 2 - NAME_GAP, s.y, "right", "middle"],
    "arrival:top": [g.arrival, over, "center", "bottom"],
    "arrival:right": [s.right + s.width / 2 + NAME_GAP, s.y, "left", "middle"],
    "card:top": [(card.left + card.right) / 2, card.top - NAME_GAP, "center", "bottom"],
    "card:right": [card.right + NAME_GAP, (card.top + card.bottom) / 2, "left", "middle"],
    "late:top": [middle, over, "center", "bottom"],
    "late:bottom": [middle, s.y + s.tick + NAME_GAP, "center", "top"],
  };
  const place = places[`${slot}:${side}`];
  if (!place) throw Error(`The timeline has no place for its ${slot} name at the ${side}`);
  return place;
}
/* The box a name takes at its place: its widest line across, its block of lines down. */
function nameBox(v, [x, y, align, valign], { size = LABEL, width = Infinity } = {}) {
  const lines = wrapName(v, width, size),
    w = Math.max(...lines.map((v) => measure(v, size))),
    h = labelSize(size) * (1 + LEADING * (lines.length - 1)),
    left = align === "left" ? x : align === "right" ? x - w : x - w / 2,
    top = valign === "top" ? y : valign === "bottom" ? y - h : y - h / 2;
  return { left, top, right: left + w, bottom: top + h };
}
/* A part is its share, or {upto, alpha, dash, draw}; `draw` ({t, at, least}) draws a stroke part (the axis, the late
 * measure, the lit hours) on from `at` over `upto` at the film's tip pace by its own length (drawnShare). A name is its
 * words, or {v, alpha, side} with nameText's own options (size, color, width, set). */
const partOf = (v) =>
  typeof v === "number"
    ? { upto: v, alpha: 1, dash: false }
    : { upto: 1, alpha: 1, dash: false, ...v };
const nameOf = (v) => (typeof v === "string" || Array.isArray(v) ? { v } : v);
const union = (boxes) =>
  boxes.length
    ? {
        left: Math.min(...boxes.map((b) => b.left)),
        top: Math.min(...boxes.map((b) => b.top)),
        right: Math.max(...boxes.map((b) => b.right)),
        bottom: Math.max(...boxes.map((b) => b.bottom)),
      }
    : { left: 0, top: 0, right: 0, bottom: 0 };

/* Last night's timeline anchored at (x, y), `scale` 1 for the full form and about 0.75 for the compact one. Its parts:
 * `axis`, the night's hours, a rail in the line colour with a tick each hour, drawn on from its first hour as one
 * stroke; `card`, the price data, a table card that lands over the hour it arrived, fading in as it settles, its stem
 * then reaching down to the rail; `arrival`, that hour, a firm point on the rail, which by default grows by its size as
 * the stem comes down and stands whole as it touches down; `late`, the two hours, measured below the rail in the colour
 * of the unknown from the due hour to the arrival, whose near end tick grows as the measure sets off and far end tick
 * as the measure reaches it; `due`, the hour the data was due, an open ring on the rail, drawn only where the narration
 * names that hour (elsewhere the due hour is the near end of the measure); and `lit`, the two hours lit on the rail
 * itself, as a lane or a night shows them. `dash` on `late` or `lit` draws a delay the narration only supposes, such as
 * one that can recur. `flow`, the time and flowAt's options ({t, from, until}, and `length`, the way's length when it
 * changes as the arrival moves), runs a small point on along the rail beyond the arrival at the film's even flow pace:
 * the night goes on. `hours` and `lateBy` move the rail's ends and the arrival, in hours from the due hour, while the
 * anchor stays where it is. `names` places the figure's names, each at its default side or the one it gives: `axis`
 * over the rail's left end (or "left", before it), `card` over the card (or "right", beside it), `due` and `arrival`
 * over their hours (or "left" and "right", at the two ends of the measure), and `late` under the measure (or "top",
 * over the lit hours). Returns where every part and name stands, whatever the figure's opacity, so a scene can join its
 * own marks to the figure. */
export function lastNight(
  x,
  y,
  scale = 1,
  {
    axis = 1,
    card = 0,
    arrival = null,
    late = 0,
    due = 0,
    lit = 0,
    flow = null,
    alpha = 1,
    hours = HOURS,
    lateBy = LATE_BY,
    names = {},
  } = {},
) {
  const g = geometry(x, y, scale, hours, lateBy),
    placed = {};
  const [A, C, S, D, H] = [axis, card, late, due, lit].map(partOf);
  // A stroke part given `draw` takes its share from its own length, so no tip of the night races.
  [
    [A, g.right - g.left],
    [S, g.span.right - g.span.left],
    [H, g.arrival - g.due],
  ].forEach(([part, length]) => {
    if (part.draw) part.upto = drawnShare(part.draw, length, clamp(part.upto));
  });
  const // The card fades in over the first 0.4 of its share and settles onto its place over the first 0.6; its stem
    // reaches down to the rail over the last 0.6, and the arrival's point grows by its size over the stem's last 0.4
    // and stands whole as it touches down, unless given, so it enters as a point lands rather than popping in at ink.
    settle = ease(clamp(C.upto / 0.6)),
    lift = LANDING * scale * (1 - settle),
    reach = clamp((C.upto - 0.4) / 0.6),
    R = partOf(
      arrival ??
        (C.upto > 0 ? { upto: 1, alpha: C.alpha, size: ease(clamp((reach - 0.6) / 0.4)) } : 0),
    );
  // The night's hours, one stroke: the rail draws on from its first hour, and each hour's tick as the rail reaches it.
  if (A.upto > 0) {
    const end = mix(g.left, g.right, clamp(A.upto));
    stroke(
      () => {
        ctx.moveTo(g.left, y);
        ctx.lineTo(end, y);
        for (let h = Math.ceil(hours[0]); h <= hours[1] && g.at(h) <= end + 0.5; h++) {
          ctx.moveTo(g.at(h), y - g.tick);
          ctx.lineTo(g.at(h), y + g.tick);
        }
      },
      { color: P.line, alpha: alpha * A.alpha, width: g.rail },
    );
  }
  // The two hours lit on the rail, drawn on from the due hour.
  if (H.upto > 0)
    line(g.due, y, mix(g.due, g.arrival, clamp(H.upto)), y, {
      color: P.unknown,
      alpha: alpha * H.alpha,
      width: g.rail * 2,
      dash: H.dash ? [10, 9] : null,
    });
  // The two hours measured below the rail: the due hour's end tick grows as the measure sets off from it and the
  // arrival's grows out of the measure as the measure reaches it, the two ticks one stroke, so the measure is one mark
  // with one name and neither tick stands at once.
  if (S.upto > 0) {
    const { y: sy, tick, width, left, right } = g.span,
      o = { color: P.unknown, alpha: alpha * S.alpha, width },
      near = tick * ease(clamp(S.upto / 0.15)),
      grown = tick * clamp((S.upto - 0.85) / 0.15);
    stroke(() => {
      ctx.moveTo(left, sy - near);
      ctx.lineTo(left, sy + near);
      if (grown > 0.5) {
        ctx.moveTo(right, sy - grown);
        ctx.lineTo(right, sy + grown);
      }
    }, o);
    line(left, sy, mix(left, right, clamp(S.upto)), sy, { ...o, dash: S.dash ? [8, 8] : null });
  }
  // The price data lands over the hour it arrived, and its stem reaches down to the rail.
  if (C.upto > 0) {
    const a = alpha * C.alpha;
    tableIcon(
      g.card.left,
      g.card.top - lift,
      g.card.right - g.card.left,
      g.card.bottom - g.card.top,
      { alpha: a * clamp(C.upto / 0.4) },
    );
    if (reach > 0)
      line(g.arrival, g.card.bottom, g.arrival, mix(g.card.bottom, y, reach), {
        color: P.line,
        alpha: a,
        width: 2,
      });
  }
  // The due hour: an open ring whose ground hides the rail inside it, so the place reads as empty.
  if (D.upto > 0) {
    const a = alpha * D.alpha * clamp(D.upto);
    dot(g.due, y, g.mark, { color: P.ground, alpha: a });
    ring(g.due, y, g.mark, { color: P.ink, alpha: a, width: 2.5 });
  }
  if (R.upto > 0 && (R.size ?? 1) > 0)
    dot(g.arrival, y, g.mark * (R.size ?? 1), {
      color: P.ink,
      alpha: alpha * R.alpha * clamp(R.upto),
    });
  // The night goes on: a point, smaller than the arrival's so that it never reads as another hour marked, leaves the
  // arrival along the rail and shrinks away at its end, then starts again.
  const night =
    flow && A.upto >= 1 ? flowAt(flow.t, flow.length ?? g.right - g.arrival, flow) : null;
  flowDot(mix(g.arrival, g.right, night?.q ?? 0), y, Math.max(3, 4 * scale), night, {
    color: P.ink,
    alpha: alpha * A.alpha,
  });
  for (const slot of Object.keys(SIDES)) {
    const n = nameOf(names[slot]);
    if (!n?.v) continue;
    const { v, alpha: shown = 1, side = SIDES[slot], ...o } = n,
      place = anchor(g, slot, side, { lift });
    placed[slot] = nameBox(v, place, o);
    nameText(v, place[0], place[1], {
      ...o,
      align: place[2],
      valign: place[3],
      alpha: alpha * shown,
    });
  }
  return { ...g, names: placed };
}

/* The extent of last night's timeline with these parts and names, relative to its anchor, as {left, top, right,
 * bottom}: a part counts once its share is above zero, as drawn finished, and a name once it is given, whatever its
 * opacity, so a stage laid out from it keeps its place while the parts draw on and the names arrive. To centre a stage
 * on (960, cy), anchor the figure at x = 960 - (left + right) / 2 and y = cy - (top + bottom) / 2, passing the parts
 * and names that state of the stage shows. */
export function lastNightExtent(
  scale = 1,
  {
    axis = 1,
    card = 0,
    arrival = null,
    late = 0,
    due = 0,
    lit = 0,
    hours = HOURS,
    lateBy = LATE_BY,
    names = {},
  } = {},
) {
  const g = geometry(0, 0, scale, hours, lateBy),
    on = (v) => partOf(v).upto > 0,
    disc = (x, r) => ({ left: x - r, top: -r, right: x + r, bottom: r }),
    boxes = [];
  if (on(axis))
    boxes.push({
      left: g.left - g.rail / 2,
      top: -g.tick - g.rail / 2,
      right: g.right + g.rail / 2,
      bottom: g.tick + g.rail / 2,
    });
  if (on(lit))
    boxes.push({ left: g.due - g.rail, top: -g.rail, right: g.arrival + g.rail, bottom: g.rail });
  if (on(due)) boxes.push(disc(g.due, g.mark + 1.25));
  if (on(arrival ?? card)) boxes.push(disc(g.arrival, g.mark));
  if (on(card)) boxes.push({ ...g.card });
  if (on(late)) {
    const { y, tick, width, left, right } = g.span;
    boxes.push({
      left: left - width / 2,
      top: y - tick - width / 2,
      right: right + width / 2,
      bottom: y + tick + width / 2,
    });
  }
  for (const slot of Object.keys(SIDES)) {
    const n = nameOf(names[slot]);
    if (!n?.v) continue;
    const { v, side = SIDES[slot], ...o } = n;
    boxes.push(nameBox(v, anchor(g, slot, side), o));
  }
  return union(boxes);
}

/* A row of nights (06.4, 08.2): each night a short rail of the same hours with its due tick, every rail and tick in
 * one stroke, so the row is one mark that one name names. A night's data stands on its rail as a point on the hour it
 * arrived, on the due tick when it came on time, and a night whose data came late has that delay lit on its rail, every
 * delay of the row in one stroke. `xs` are the nights' anchors, as the motif's: the hour after the due hour, the middle
 * of each rail at the default hours. `lateBy` gives each night's arrival in hours after its due hour: 0 on time, a
 * fraction for a few minutes late (0.3 or more, so the lit delay shows beside the point), 2 for last night, null for a
 * night drawn without its data. Returns each night's geometry, as lastNight does. */
export function nights(
  xs,
  y,
  scale = 0.3,
  { axis = 1, arrival = 0, lit = 0, alpha = 1, hours = [-1, 3], lateBy = [] } = {},
) {
  const late = (i) => lateBy[i] ?? 0,
    gs = xs.map((x, i) => geometry(x, y, scale, hours, late(i)));
  const [A, R, H] = [axis, arrival, lit].map(partOf);
  if (alpha < 0.01 || !gs.length) return gs;
  if (A.upto > 0)
    stroke(
      () =>
        gs.forEach((g) => {
          const end = mix(g.left, g.right, clamp(A.upto));
          ctx.moveTo(g.left, y);
          ctx.lineTo(end, y);
          if (g.due <= end + 0.5) {
            ctx.moveTo(g.due, y - DUE_TICK);
            ctx.lineTo(g.due, y + DUE_TICK);
          }
        }),
      { color: P.line, alpha: alpha * A.alpha, width: gs[0].rail },
    );
  const delayed = gs.filter((_, i) => late(i) > 0);
  if (H.upto > 0 && delayed.length)
    stroke(
      () =>
        delayed.forEach((g) => {
          ctx.moveTo(g.due, y);
          ctx.lineTo(mix(g.due, g.arrival, clamp(H.upto)), y);
        }),
      {
        color: P.unknown,
        alpha: alpha * H.alpha,
        width: gs[0].rail * 2,
        dash: H.dash ? [10, 9] : null,
      },
    );
  if (R.upto > 0)
    gs.forEach((g, i) => {
      if (lateBy[i] !== null)
        dot(g.arrival, y, NIGHT_POINT, { color: P.ink, alpha: alpha * R.alpha * clamp(R.upto) });
    });
  return gs;
}
