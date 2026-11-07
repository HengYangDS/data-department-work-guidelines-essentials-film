/* Part 06, stages C, E1, E2, F and G: evidence sets the limit of the claim. C: under the job's earlier start, the
 * chain of trust builds on one rail, a station to each clause, the station being said lit; lower risk slims its links,
 * but a way that skips one stops at a bar. E1: report the state, not the effort. E2: what verification, publication
 * and use each establish, and no more. F: a completion claim pinned to its subject and version, signed by its
 * verification, covering what it covers and narrowed to its evidence. G: two pairs, each reached state against the
 * state it does not make. */

import { ctx } from "../../canvas.js";
import { box, dot, flowAt, flowDot, line, measure, ring, stroke } from "../../drawing/strokes.js";
import { agent, check, documentIcon, person } from "../../drawing/symbols.js";
import { lastNight } from "../../drawing/timeline.js";
import { bubble, recoverIcon, tagIcon } from "../../drawing/workspace.js";
import { beats, listIn, named, speaking } from "../../naming/lists.js";
import { NAME_GAP, nameText, rejectedName } from "../../naming/names.js";
import { railNames } from "../../naming/placement.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { ease, mix, ramp, soon } from "../../timing/easing.js";
import { drawShare, travel, voiceTime } from "../../timing/pauses.js";
import { bar, centring, early, openMark } from "../p05/kit.js";
import { nightPlace, nightWay } from "./night.js";

/* C: the chain of trust. The job's earlier start stands on the compact timeline in the top band, the start the decision
 * owner approves; below it seven stations at one pitch on one rail, each a small mark over the rail and its name under
 * it, one list. The whole rail stands in the line tone from the first station, centred, so no station moves when the
 * next is said; the chain lights along it to each station on its words. The rail's own names stand beyond its end
 * stations' names. */
const C = { y: 690, pitch: 180, icon: 634 };
function stationMark(i, x, y, a) {
  if (i === 0) person(x, y + 12, { alpha: a, color: P.authority, size: 0.8 });
  else if (i === 1) {
    stroke(
      () => {
        ctx.moveTo(x - 24, y - 14);
        ctx.lineTo(x - 30, y - 14);
        ctx.lineTo(x - 30, y + 14);
        ctx.lineTo(x - 24, y + 14);
        ctx.moveTo(x + 24, y - 14);
        ctx.lineTo(x + 30, y - 14);
        ctx.lineTo(x + 30, y + 14);
        ctx.lineTo(x + 24, y + 14);
      },
      { color: P.authority, alpha: a, width: 3 },
    );
    dot(x, y, 6, { color: P.ink, alpha: a });
  } else if (i === 2) {
    ring(x, y, 15, { color: P.ink, alpha: a, width: 3 });
    dot(x, y, 6, { color: P.ink, alpha: a });
  } else if (i === 3) {
    [-18, 0, 18].forEach((dx) => dot(x + dx, y + 8, 5, { color: P.ink, alpha: a }));
    check(x, y - 12, 18, { alpha: a });
  } else if (i === 4) {
    box(x - 24, y - 17, 48, 34, { fill: P.row, stroke: P.ink, alpha: a, radius: 5, width: 2.5 });
    line(x - 14, y - 4, x + 14, y - 4, { color: P.muted, alpha: a, width: 2 });
    line(x - 14, y + 6, x + 6, y + 6, { color: P.muted, alpha: a, width: 2 });
  } else if (i === 5) {
    ring(x, y, 17, { color: P.evidence, alpha: a, width: 2.5 });
    check(x, y + 1, 18, { alpha: a });
  } else recoverIcon(x, y, 15, { alpha: a, color: P.evidence });
}
export function chainStage(s, t, c, g) {
  // The earlier start the decision owner approves, on the compact timeline, standing where B left it, so it does not
  // jump at the cut; its point runs the way once as the approved start is said.
  lastNight(nightPlace(), 250, 0.75, {
    alpha: g,
    lateBy: -0.6,
    arrival: 1,
    flow: { t, length: nightWay(c), from: c.approved, passes: 1 },
    names: {
      arrival: { v: L("任务提前启动", "An earlier start"), alpha: early(t, c.first3, c.approved) },
    },
  });
  const ats = c.stations,
    n = ats.length,
    x0 = 960 - ((n - 1) * C.pitch) / 2,
    xs = ats.map((_, i) => x0 + i * C.pitch),
    slim = soon(t, c.lighter + 0.05, 0.8);
  // The whole rail stands in the line tone from the first station; the chain lights along it to each station as it is
  // said, at the tip pace; lower risk slims it; a point runs along it once it is whole.
  const reach = ats.reduce(
    (v, at, i) => (i ? mix(v, xs[i], drawShare(t, at - 0.15, C.pitch)) : xs[0]),
    xs[0],
  );
  line(xs[0] - 30, C.y, xs[n - 1] + 30, C.y, {
    color: P.line,
    alpha: g * ramp(t, ats[0] - 0.15, 0.4),
    width: 2.5,
  });
  line(xs[0] - 30, C.y, reach + 30, C.y, {
    color: P.ink,
    alpha: g * 0.9,
    width: mix(5, 2.5, slim),
  });
  const runs = flowAt(t, xs[n - 1] - xs[0], { from: ats[n - 1] + 0.6 });
  flowDot(mix(xs[0], xs[n - 1], runs?.q ?? 0), C.y, 6, runs, { color: P.evidence, alpha: g });
  xs.forEach((x, i) => {
    const a = g * ramp(t, ats[i] - 0.15, 0.4),
      lit = speaking(t, ats, i);
    dot(x, C.y, 6, { color: P.ink, alpha: a });
    stationMark(i, x, C.icon, a);
    if (lit > 0) ring(x, C.icon, 32, { color: P.ink, alpha: g * lit * 0.4, width: 2 });
  });
  const stations = L(
    ["决策负责人", "范围", "改动", "当前的运行", "说法", "验收", "学习"],
    ["Decision owner", "Limits", "Change", "Current runs", "The claim", "Acceptance", "Learning"],
  );
  railNames(stations, xs, C.y, {
    gap: NAME_GAP,
    alpha: (i) => g * listIn(t, ats, i),
    set: "chain",
  });
  // The rail's own names stand at its ends, beyond the rail and the end stations' names alike.
  const reachOut = (v) => Math.max(30, measure(v) / 2);
  // Named on its own words, not from its clause: the far end's name follows within a breath, so the chain is never
  // weighted to one end for long.
  nameText(L("信任链", "Chain of trust"), xs[0] - reachOut(stations[0]) - NAME_GAP, C.y, {
    align: "right",
    alpha: g * named(t, c.chain),
  });
  nameText(L("手续变轻", "Less process"), xs[n - 1] + reachOut(stations[n - 1]) + NAME_GAP, C.y, {
    align: "left",
    alpha: g * named(t, c.lighter),
  });
  // A way that skips a link: from the third station over the fourth toward the fifth, stopped at a bar over the fourth.
  const skip = g * named(t, c.skip),
    wy = C.icon - 70,
    run = drawShare(t, c.skip - 0.1, xs[3] - 10 - xs[2] + C.icon - 24 - wy);
  stroke(
    () => {
      ctx.moveTo(xs[2], C.icon - 24);
      ctx.lineTo(xs[2], wy);
      ctx.lineTo(mix(xs[2], xs[3] - 10, run), wy);
    },
    { color: P.line, alpha: skip, width: 2.5 },
  );
  bar(xs[3], wy, { alpha: g * ramp(t, c.skip + 0.45, 0.3), vertical: true, length: 40 });
  rejectedName(L("少一环", "A skipped link"), xs[3], wy - 20 - NAME_GAP, {
    valign: "bottom",
    alpha: skip,
    mark: ramp(t, c.skip + 0.45, 0.3),
  });
}

/* E1: the state and the effort. The work's states on one rail, the report on a page over the station it has reached,
 * named over the page, and the state named under the rail; and under them the effort spent, a long bar, refused. */
const E1 = { y: 505, x0: 540, x1: 1380, at: 3, page: [88, 110], effort: 116 };
export function stateStage(s, t, c, g) {
  const xs = [0, 1, 2, 3, 4].map((k) => mix(E1.x0, E1.x1, k / 4)),
    reached = xs[E1.at],
    [pw, ph] = E1.page,
    pageTop = E1.y - 18 - ph,
    state = g * early(t, c.stateClause, c.state);
  stroke(
    () => {
      ctx.moveTo(E1.x0, E1.y);
      ctx.lineTo(E1.x1, E1.y);
      xs.forEach((x) => {
        ctx.moveTo(x, E1.y - 7);
        ctx.lineTo(x, E1.y + 7);
      });
    },
    { color: P.line, alpha: g, width: 3 },
  );
  line(E1.x0, E1.y, reached, E1.y, { color: P.ink, alpha: g, width: 4 });
  documentIcon(reached - pw / 2, pageTop, pw, ph, { alpha: g, rows: 2 });
  line(reached, pageTop + ph, reached, E1.y - 6, { color: P.line, alpha: g, width: 2 });
  nameText(L("汇报", "Report"), reached, pageTop - NAME_GAP, {
    valign: "bottom",
    alpha: g * named(t, c.first5),
  });
  nameText(L("哪一步", "The state"), reached, E1.y + 7 + NAME_GAP, { valign: "top", alpha: state });
  // The effort: a long bar under the rail, nine tenths full, refused at its end.
  const effort = g * named(t, c.effort),
    ey = E1.y + E1.effort;
  box(E1.x0, ey - 14, E1.x1 - E1.x0, 28, { stroke: P.line, alpha: effort, radius: 6, width: 2 });
  // It fills at the tip pace by its own length.
  box(E1.x0 + 4, ey - 10, (E1.x1 - E1.x0 - 8) * 0.9 * drawShare(t, c.effort, (E1.x1 - E1.x0 - 8) * 0.9), 20, {
    fill: P.muted,
    alpha: effort * 0.55,
    radius: 4,
  });
  rejectedName(L("力气", "The effort"), (E1.x0 + E1.x1) / 2, ey + 14 + NAME_GAP, {
    valign: "top",
    alpha: effort,
    mark: ramp(t, c.effort + 0.4, 0.3),
  });
}

/* E2: what each step establishes. Verified holds only within its stated bounds: its check stands inside a field of
 * four sides, drawn as one stroke from the first word, and each side lights with its name as that bound is said, one
 * list. Under it, the work at its agreed destination and the work in use, two frames whose way stops at a bar, each
 * named under it, and beside the work in use an eye, what was actually observed, joined to it. The field stands above
 * the content centre by as much as the whole with the frames stands below it, so it never moves to make their room. */
const V = {
  w: 560,
  h: 280,
  y: 456,
  fy: 760,
  fw: 150,
  fh: 104,
  pubX: 680,
  useX: 1040,
  eyeX: 1250,
};
const BOUNDS = () =>
  L(["对象", "版本", "环境", "限度"], ["Subject", "Version", "Environment", "Limit"]);
export function verifiedStage(s, t, c, g) {
  const cy = V.y,
    x0 = 960 - V.w / 2,
    x1 = 960 + V.w / 2,
    y0 = cy - V.h / 2,
    y1 = cy + V.h / 2,
    sides = [
      [x0 + 14, y0, x1 - 14, y0],
      [x1, y0 + 14, x1, y1 - 14],
      [x0 + 14, y1, x1 - 14, y1],
      [x0, y0 + 14, x0, y1 - 14],
    ];
  stroke(
    () =>
      sides.forEach(([ax, ay, bx, by]) => {
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
      }),
    { color: P.line, alpha: g, width: 3.5 },
  );
  ring(960, cy - 14, 30, { color: P.evidence, alpha: g, width: 3 });
  check(960, cy - 13, 32, { alpha: g, upto: soon(t, c.first5b, 0.4) });
  nameText(L("核验通过", "Verified"), 960, cy + 16 + NAME_GAP, { valign: "top", alpha: g });
  // Each bound lights its side and is named outside it, on its words.
  const at = c.bounds;
  sides.forEach(([ax, ay, bx, by], i) =>
    line(ax, ay, bx, by, { color: P.ink, alpha: g * ramp(t, at[i] - 0.15, 0.4), width: 4 }),
  );
  const place = [
    [960, y0 - NAME_GAP, "center", "bottom"],
    [x1 + NAME_GAP, cy, "left", "middle"],
    [960, y1 + NAME_GAP, "center", "top"],
    [x0 - NAME_GAP, cy, "right", "middle"],
  ];
  BOUNDS().forEach((v, i) =>
    nameText(v, place[i][0], place[i][1], {
      align: place[i][2],
      valign: place[i][3],
      alpha: g * listIn(t, at, i),
      set: "bounds",
    }),
  );
  // Publication at the agreed destination, and use: two frames whose way stops at a bar.
  const pub = g * named(t, c.published),
    inUse = g * named(t, c.inUse),
    { fy, fw, fh, pubX, useX, eyeX } = V,
    under = fy + fh / 2 + NAME_GAP;
  box(pubX - fw / 2, fy - fh / 2, fw, fh, { stroke: P.ink, alpha: pub, radius: 10, width: 2.5 });
  box(pubX - 22, fy - 17, 44, 34, {
    fill: P.row,
    stroke: P.ink,
    alpha: pub,
    radius: 5,
    width: 2.5,
  });
  nameText(L("约定的地方", "Agreed destination"), pubX, under, { valign: "top", alpha: pub });
  box(useX - fw / 2, fy - fh / 2, fw, fh, {
    stroke: P.line,
    alpha: inUse,
    radius: 10,
    width: 2.5,
    dash: [8, 8],
  });
  person(useX, fy + 8, { alpha: inUse, size: 0.85, color: P.muted });
  nameText(L("在用", "In use"), useX, under, { valign: "top", alpha: inUse });
  const way = drawShare(t, c.published + 0.3, useX - fw / 2 - 30 - (pubX + fw / 2 + 10));
  line(pubX + fw / 2 + 10, fy, mix(pubX + fw / 2 + 10, useX - fw / 2 - 30, way), fy, {
    color: P.line,
    alpha: pub,
    width: 2.5,
  });
  bar(useX - fw / 2 - 24, fy, {
    alpha: g * ramp(t, c.notMean + 0.05, 0.3),
    vertical: true,
    length: 44,
  });
  // Actually observed: an eye beside the work in use, joined to it, the way carrying what is seen.
  const seen = g * named(t, c.observed);
  line(useX + fw / 2 + 8, fy, eyeX - 40, fy, { color: P.line, alpha: seen, width: 2.5 });
  const carried = flowAt(t, eyeX - 40 - (useX + fw / 2 + 8), { from: c.observed + 0.4 });
  flowDot(mix(eyeX - 40, useX + fw / 2 + 8, carried?.q ?? 0), fy, 4.5, carried, {
    color: P.evidence,
    alpha: seen,
  });
  stroke(
    () => {
      ctx.moveTo(eyeX - 30, fy);
      ctx.quadraticCurveTo(eyeX, fy - 26, eyeX + 30, fy);
      ctx.quadraticCurveTo(eyeX, fy + 26, eyeX - 30, fy);
    },
    { color: P.evidence, alpha: seen, width: 3 },
  );
  dot(eyeX, fy, 7, { color: P.evidence, alpha: seen });
  nameText(L("实际看到的", "Actually observed"), eyeX, under, { valign: "top", alpha: seen });
}

/* F: the completion claim, a wide sheet of written lines on a rail, pinned at the rail's right to its subject and
 * version and signed at its left by its verification, each named under its mark; under the sheet, what it covers,
 * filled, and what is unproved, dashed. Narrowed to its evidence, the sheet draws in to what is covered and leaves its
 * larger extent as a dashed trace, which a bar closes: the narrower claim is named under what is covered and the
 * inflated wording, refused, under what is unproved. The rail stands whole from the first, so the claim stands at one
 * place, the midpoint of the centring shifts of its states: the rail alone, with the pin, and with both. */
const F = { y: 450, w: 600, h: 200, narrow: 380 },
  /* The sheet draws in over this many seconds of voice time: 220 px at most about 330 px/s. */
  NARROWING = 1.0;
const SUBJECT = () => L("哪个对象、哪个版本", "Subject and version"),
  SIGNED = () => L("谁、什么时候、什么方法", "When, by whom, how");
export function claimStage(s, t, c, g) {
  // The pin's tag and the signature stand far enough out that their names, centred under them, keep a name's gap from
  // the sheet and its dashed trace; the rail runs between them, from the signature's ring to the tag's point.
  const tagX = F.w / 2 + NAME_GAP + Math.max(35, measure(SUBJECT()) / 2),
    signX = F.w / 2 + NAME_GAP + Math.max(18, measure(SIGNED()) / 2),
    right = tagX + Math.max(35, measure(SUBJECT()) / 2),
    left = -signX - Math.max(18, measure(SIGNED()) / 2),
    shifts = [
      [18 - signX, tagX - 35],
      [18 - signX, right],
      [left, right],
    ].map(([l, r]) => centring(960 + l, 960 + r)),
    x = 960 + (Math.max(...shifts) + Math.min(...shifts)) / 2,
    narrowed = travel(t, c.narrow + 0.05, NARROWING),
    w = mix(F.w, F.narrow, narrowed),
    cl = x - F.w / 2,
    top = F.y - F.h / 2,
    under = F.y + 34 + NAME_GAP;
  // The rail, under the sheet, which covers its middle.
  line(x - signX + 18, F.y, x + tagX - 35, F.y, { color: P.line, alpha: g, width: 2 });
  if (narrowed > 0)
    box(cl, top, F.w, F.h, {
      stroke: P.line,
      alpha: g * narrowed,
      radius: 10,
      width: 2,
      dash: [8, 8],
    });
  box(cl, top, w, F.h, { fill: P.row, stroke: P.ink, alpha: g, radius: 10, width: 2.5 });
  // The claim's written lines; the first, what is claimed, brightens as it is asked, and the sheet beats as the
  // questions are announced.
  const asked = ramp(t, c.what - 0.15, 0.4);
  stroke(
    () =>
      [0, 1, 2, 3].forEach((k) => {
        ctx.moveTo(cl + 36, top + 44 + k * 38);
        ctx.lineTo(cl + w - 40 - (k % 2) * 60, top + 44 + k * 38);
      }),
    { color: P.muted, alpha: g * 0.8, width: 2.5 },
  );
  line(cl + 36, top + 44, cl + w - 40, top + 44, { color: P.ink, alpha: g * asked, width: 4 });
  beats(t, cl + w / 2, F.y, 60, [c.answers], { alpha: g });
  nameText(L("说完成", "Completion claim"), cl + F.w / 2, top - NAME_GAP, {
    valign: "bottom",
    alpha: g * early(t, c.first6, c.claim),
  });
  // Pinned at the rail's right to its subject and version; a point runs along the pin, from the sheet's edge, whose
  // way lengthens as the sheet draws in: each pass keeps the length its way had when it began.
  const pin = g * named(t, c.subject),
    tx = x + tagX,
    narrows = voiceTime(c.narrow + 0.05),
    pinned = flowAt(
      t,
      (v) => tx - 35 - (cl + mix(F.w, F.narrow, ease((v - narrows) / NARROWING)) + 4),
      {
        from: c.subject + 0.5,
      },
    );
  flowDot(mix(cl + w + 4, tx - 35, pinned?.q ?? 0), F.y, 4, pinned, { color: P.ink, alpha: pin });
  tagIcon(tx - 35, F.y, 70, 34, { alpha: pin, color: P.ink });
  nameText(SUBJECT(), tx, under, { valign: "top", alpha: pin });
  // Signed at the rail's left by its verification.
  const sign = g * named(t, c.signed),
    sx = x - signX;
  ring(sx, F.y, 18, { color: P.evidence, alpha: sign, width: 2.5 });
  check(sx, F.y + 1, 18, { alpha: sign });
  nameText(SIGNED(), sx, under, { valign: "top", alpha: sign });
  // What it covers, filled on the subject, and what is unproved, dashed; under them the narrower claim and the
  // inflated wording, each in its column.
  const cy = top + F.h + 40,
    split = cl + F.narrow,
    covered = g * named(t, c.covering),
    unproved = g * named(t, c.unproved),
    one = (cl + split) / 2,
    two = (split + cl + F.w) / 2,
    row1 = cy + 12 + NAME_GAP,
    row2 = row1 + 29 + 16;
  box(cl, cy - 12, split - cl, 24, { fill: P.evidence, alpha: covered * 0.85, radius: 4 });
  box(split + 6, cy - 12, cl + F.w - split - 6, 24, {
    stroke: P.unknown,
    alpha: unproved,
    radius: 4,
    width: 2.5,
    dash: [6, 6],
  });
  nameText(L("覆盖了什么", "Covering what"), one, row1, { valign: "top", alpha: covered });
  nameText(L("没证明", "Unproved"), two, row1, { valign: "top", alpha: unproved });
  nameText(L("收窄说法", "A narrower claim"), one, row2, {
    valign: "top",
    alpha: g * named(t, c.narrow),
  });
  const shut = g * named(t, c.inflate);
  bar(split + 3, F.y, { alpha: shut, vertical: true, length: F.h - 40 });
  rejectedName(L("把话说大", "Inflated wording"), two, row2, {
    valign: "top",
    alpha: shut,
    mark: ramp(t, c.inflate + 0.3, 0.3),
  });
}

/* G: two pairs in rows, the reached state at the left and the state it does not make, hollow and dashed, at the
 * right, each named under its mark, the way between stopped at a tall bar: a test sheet with its check against
 * acceptance, and an Agent reporting completion against completion. The pairs stand wide on the frame's axis, so the
 * first fills its share of the frame before the second arrives. */
export function pairsStage(s, t, c, g) {
  const rows = [
    {
      y: 370,
      at: c.test,
      to: c.acceptance,
      from: L("测试通过", "A passing test"),
      not: L("已经验收", "Acceptance"),
    },
    {
      y: 640,
      at: c.agentSays,
      to: c.complete,
      from: L("智能体说完成了", "An Agent reporting completion"),
      not: L("完成了", "Complete"),
    },
  ];
  const r = 56,
    reachLeft = Math.max(50, ...rows.map((row) => measure(row.from) / 2)),
    reachRight = Math.max(r, ...rows.map((row) => measure(row.not) / 2)),
    lx = 600 + centring(600 - reachLeft, 1320 + reachRight),
    rx = lx + 720;
  rows.forEach((row, i) => {
    const a = g * (i ? named(t, row.at) : early(t, c.first7, row.at)),
      b = g * named(t, row.to),
      wayAt = i ? row.at : c.first7;
    if (i === 0) {
      documentIcon(lx - 50, row.y - 66, 100, 132, { alpha: a, rows: 3 });
      dot(lx + 40, row.y + 46, 24, { color: P.ground, alpha: a });
      ring(lx + 40, row.y + 46, 24, { color: P.evidence, alpha: a, width: 3 });
      check(lx + 40, row.y + 47, 26, { alpha: a });
    } else {
      agent(lx, row.y, { alpha: a, size: 2 });
      bubble(lx + 74, row.y - 52, 20, { alpha: a, color: P.ink });
    }
    line(lx + 80, row.y, mix(lx + 80, rx - r - 34, drawShare(t, wayAt + 0.2, rx - r - 114 - lx)), row.y, {
      color: P.line,
      alpha: a,
      width: 3,
    });
    bar(rx - r - 26, row.y, { alpha: b, vertical: true, length: 100 });
    openMark(rx, row.y, r, { alpha: b });
    nameText(row.from, lx, row.y + 70 + NAME_GAP, { valign: "top", alpha: a });
    nameText(row.not, rx, row.y + 70 + NAME_GAP, { valign: "top", alpha: b });
  });
}
