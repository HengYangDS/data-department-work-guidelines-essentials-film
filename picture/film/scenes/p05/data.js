/* Part 05, stages A, A2, B, B2 and E: data that means what it says. A: the data and the evidence its use takes; a file
 * that opens, a chart that looks good and a model signal build below, their way up stops at a bar, and what none of
 * them establishes stands between as open marks. A2: shown fit for a specific use, the data earns its seal. B: six
 * questions ring the data, each station filling as it is asked. B2: data that cannot answer them is explored inside
 * an authorized scope, and its way out to sharing, production and decisions stops at the scope's edge. E: the
 * views hang from the data, and none may climb back to become the source of truth. */

import { link } from "../../drawing/links.js";
import { dot, labelSize, line, measure, ring, stroke } from "../../drawing/strokes.js";
import { diamond, documentIcon, person, seal, tableIcon } from "../../drawing/symbols.js";
import { ctx } from "../../canvas.js";
import { listIn, named, speaking } from "../../naming/lists.js";
import { NAME_GAP, nameText } from "../../naming/names.js";
import { radialName, railNames } from "../../naming/placement.js";
import { LABEL, P } from "../../palette.js";
import { L } from "../../timeline.js";
import { clamp, ease, mix, ramp, soon } from "../../timing/easing.js";
import { thoughtEnd, voiceTime } from "../../timing/pauses.js";
import {
  bar,
  chartMark,
  early,
  fileMark,
  missingPage,
  openMark,
  runPoint,
  signalCurve,
  targetMark,
} from "./kit.js";

/* A: the data card and the dashed page of the evidence it takes stand as a pair under their names on one baseline,
 * at the middle of the stage; the three things that establish nothing build in a row at the foot, their ways rising,
 * joining and stopping at a bar under the pair; and what none of them establishes stands over the pair as a row of
 * open marks. The pair holds the stage's centre while the rows above and below it arrive, so each state stays near the
 * content centre. The card stands at its place from the stage's first frame with the dashed relation that reaches
 * from it to the page's place, so the picture spans the pair before the page is named at the relation's far end and
 * nothing moves when it is. */
const A = { top: 388, card: [300, 170], page: [120, 170], pageX: 620, cardX: 1210 },
  UNKNOWN_Y = 241,
  BAR_Y = 568,
  BUS_Y = 608,
  ROW_Y = 676,
  ROW_XS = [700, 960, 1220],
  // English names are longer, so the open marks stand at a wider pitch there.
  UNKNOWN_XS = () => L([630, 850, 1070, 1290], [600, 840, 1080, 1320]);
export function evidenceStage(s, t, c, g) {
  const [cw, ch] = A.card,
    cardX = A.cardX,
    page = g * named(t, c.evidence),
    mid = A.top + ch / 2;
  tableIcon(cardX - cw / 2, A.top, cw, ch, { alpha: g });
  missingPage(A.pageX - A.page[0] / 2, A.top, A.page[0], A.page[1], { alpha: page });
  // The evidence the data's use takes: a dashed relation from the page's place to the data, whole with the card and
  // wide enough to count in the picture's lit extent.
  link(A.pageX + A.page[0] / 2 + 12, mid, cardX - cw / 2 - 12, mid, {
    alpha: g,
    dash: [8, 8],
    width: 2.5,
  });
  nameText(L("数据", "Data"), cardX, A.top - NAME_GAP, {
    valign: "bottom",
    alpha: g * named(t, c.first1),
  });
  nameText(L("证据", "Evidence"), A.pageX, A.top - NAME_GAP, { valign: "bottom", alpha: page });
  // The three that establish nothing, one list, each on its words.
  const rowAt = c.nonProofs,
    seen = (i) => g * ramp(t, rowAt[i] - 0.15, 0.4);
  fileMark(ROW_XS[0], ROW_Y, { alpha: seen(0), h: 76 });
  chartMark(ROW_XS[1], ROW_Y, { alpha: seen(1) });
  signalCurve(ROW_XS[2], ROW_Y, { alpha: seen(2) });
  railNames(L(["文件", "图", "模型信号"], ["File", "Chart", "Model signal"]), ROW_XS, ROW_Y, {
    gap: 38 + NAME_GAP,
    alpha: (i) => g * listIn(t, rowAt, i),
    set: "non-proofs",
  });
  // None of them establishes: their ways rise from each, join, and stop at a bar under the open marks. The way that
  // joins them draws on from the outer two toward the middle one as they arrive, rather than standing at once.
  const rise = soon(t, c.refuse - 0.1, 0.5),
    join = ease(clamp((rise - 0.8) / 0.2)),
    up = soon(t, c.refuse + 0.25, 0.45),
    shut = g * ramp(t, c.refuse + 0.55, 0.3);
  stroke(
    () => {
      for (const x of ROW_XS) {
        ctx.moveTo(x, ROW_Y - 40);
        ctx.lineTo(x, mix(ROW_Y - 40, BUS_Y, rise));
      }
      if (join > 0)
        for (const x of [ROW_XS[0], ROW_XS[2]]) {
          ctx.moveTo(x, BUS_Y);
          ctx.lineTo(mix(x, ROW_XS[1], join), BUS_Y);
        }
    },
    { color: P.line, alpha: g * ramp(t, c.refuse - 0.15, 0.3), width: 2 },
  );
  if (up > 0)
    line(960, BUS_Y, 960, mix(BUS_Y, BAR_Y + 2, up), { color: P.line, alpha: g, width: 2 });
  bar(960, BAR_Y, { alpha: shut, length: 56 });
  // What none of them establishes: four open marks, one list, each on its words.
  const ats = c.unknowns;
  const uxs = UNKNOWN_XS();
  uxs.forEach((x, i) => openMark(x, UNKNOWN_Y, 15, { alpha: g * ramp(t, ats[i] - 0.15, 0.4) }));
  railNames(
    L(
      ["含义", "质量", "使用权限", "复现"],
      ["Meaning", "Quality", "Permission", "Reproducibility"],
    ),
    uxs,
    UNKNOWN_Y,
    { gap: 15 + NAME_GAP, alpha: (i) => g * listIn(t, ats, i), set: "unknowns" },
  );
}

/* A2: the data shown fit for a specific use. The data stands at the left and the use, a target, at the right, their
 * names on one baseline; the relation between them is named as the contract renders it, and the data's trust, a seal
 * on its corner, is stamped once the use is named at the relation's far end. */
/* The data and the relation that reaches from it to the use's place stand from the stage's first frame, so the
 * picture spans the stage before the relation and the use are named, and nothing moves when they are; once the
 * relation is said, a point runs along it toward the use. The places below are shifted as one by `fitShift`. */
const A2 = { y: 505, card: [220, 140], cardX: 640, useX: 1300, r: 56 };
const USE = () => L("具体用途", "A specific use");
/* The stage's two states are the data with its relation, and the whole once the use is named at the relation's end;
 * the stage stands at the midpoint of the shifts that centre each, so neither stands far off. */
function fitShift() {
  const left = A2.cardX - A2.card[0] / 2,
    reach = A2.useX - A2.r - 12,
    whole = A2.useX + Math.max(A2.r, measure(USE()) / 2);
  return 960 - (2 * left + reach + whole) / 4;
}
export function fitStage(s, t, c, g) {
  const [cw, ch] = A2.card,
    top = A2.y - ch / 2,
    use = g * named(t, c.use),
    shift = fitShift(),
    cardX = A2.cardX + shift,
    useX = A2.useX + shift;
  tableIcon(cardX - cw / 2, top, cw, ch, { alpha: g });
  nameText(L("数据", "Data"), cardX, top - NAME_GAP, { valign: "bottom", alpha: g });
  link(cardX + cw / 2 + 12, A2.y, useX - A2.r - 12, A2.y, {
    alpha: g,
    width: 3,
    flow: { t, from: c.fit },
  });
  nameText(L("证明适合", "Shown fit"), (cardX + cw / 2 + useX - A2.r) / 2, A2.y - NAME_GAP, {
    valign: "bottom",
    alpha: g * named(t, c.fit),
  });
  targetMark(useX, A2.y, A2.r, { alpha: use });
  nameText(USE(), useX, top - NAME_GAP, {
    valign: "bottom",
    alpha: use,
  });
  // The seal: its rim on the words of trust, its stamp once the data has been shown fit for the use, in one
  // continuous movement of 0.4 s that settles before the thought's quiet, however soon after the use the thought ends.
  const sx = cardX + cw / 2,
    sy = top + ch,
    rim = g * named(t, c.trust),
    stamped = ramp(
      t,
      Math.min(Math.max(c.trust, c.use + 0.4) + 0.05, thoughtEnd(c.use) - 0.45),
      0.4,
    );
  dot(sx, sy, 27, { color: P.ground, alpha: rim });
  seal(sx, sy, 26, { color: P.evidence, alpha: rim, stamp: g * stamped, hollow: 1 - stamped });
  nameText(L("可信", "Trust"), sx + 26 + NAME_GAP, sy, { align: "left", alpha: rim });
}

/* B: six questions ring the data. The ring is counted in on its words and named under the data; each question's
 * station fills on the ring as it is asked and is named outside it by what it asks about, one list; the station of
 * availability carries a clock, the time the example returns to. */
const B = { x: 960, y: 505, rx: 400, ry: 245, card: [200, 128] };
/* The ring is six arcs, one between each pair of stations, leaving each station's place open: it reads as one cycle of
 * questions and never as a closed frame waiting to be filled. The arcs are drawn as one stroke, on in turn. */
const GAP = 0.09;
function ringArcs(upto, alpha) {
  if (alpha < 0.01 || upto <= 0) return;
  stroke(
    () => {
      for (let k = 0; k < 6; k++) {
        const q = Math.min(1, Math.max(0, upto * 6 - k));
        if (q <= 0) break;
        const a0 = -Math.PI / 2 + (k * Math.PI) / 3 + GAP,
          a1 = a0 + (Math.PI / 3 - 2 * GAP) * q;
        for (let j = 0; j <= 16; j++) {
          const a = a0 + ((a1 - a0) * j) / 16,
            x = B.x + Math.cos(a) * B.rx,
            y = B.y + Math.sin(a) * B.ry;
          if (j) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
      }
    },
    { color: P.line, alpha, width: 3.5 },
  );
}
export function questionsStage(s, t, c, g) {
  const [cw, ch] = B.card,
    top = B.y - ch / 2;
  tableIcon(B.x - cw / 2, top, cw, ch, { alpha: g });
  nameText(L("数据", "Data"), B.x, top - NAME_GAP, { valign: "bottom", alpha: g });
  const six = g * early(t, c.sixClause, c.six);
  ringArcs(soon(t, c.sixClause - 0.2, 1.1), six);
  nameText(L("六个问题", "Six questions"), B.x, top + ch + NAME_GAP, { valign: "top", alpha: six });
  const names = L(
    ["来源", "最早拿到", "含义", "改动", "质量", "用途"],
    ["Origin", "Availability", "Meaning", "Changes", "Quality", "Use"],
  );
  c.asks.forEach((at, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 3,
      x = B.x + Math.cos(a) * B.rx,
      y = B.y + Math.sin(a) * B.ry,
      asked = g * ramp(t, at - 0.15, 0.4),
      lit = speaking(t, c.asks, i);
    dot(x, y, 13, { color: P.ground, alpha: asked });
    if (i === 1) {
      ring(x, y, 13, { color: P.evidence, alpha: asked, width: 2.5 });
      line(x, y, x, y - 8, { color: P.evidence, alpha: asked, width: 2.5 });
      line(x, y, x + 6, y + 3, { color: P.evidence, alpha: asked, width: 2.5 });
    } else dot(x, y, 12, { color: P.evidence, alpha: asked });
    if (lit > 0) ring(x, y, 22, { color: P.evidence, alpha: lit * 0.5 * g, width: 2 });
    // The ring returns to full ink as its last question is asked, so the six stand whole for more than a moment before
    // the stage leaves on the next clause.
    radialName(names[i], B.x, B.y, B.rx + 12, a, {
      ry: B.ry + 12,
      alpha: g * listIn(t, c.asks, i, Infinity, { whole: c.asks.at(-1) - 0.1 }),
      set: "questions",
    });
  });
}

/* B2: data that cannot answer the questions. It is explored inside its authorized scope, a frame sized to it in
 * which it moves; the work it stays out of stands in a row under the scope, each kind on its words; and the way out of
 * the scope toward that work stops at a bar on the scope's lower edge, which stays shut until the data is shown fit. */
/* The scope stands round the data from the cut on the frame's axis, a thin solid frame that holds the data and its
 * name, so it is never an empty frame; it is named on its words. The work arrives in a row under the scope, so the
 * stage grows downward on that axis and nothing moves: a row of work beside the scope would leave the scope alone off
 * centre for more than three seconds before the work is said. */
const S = { w: 500, h: 285, card: [320, 160], inset: 18 },
  /* The row of work stands `below` the scope's lower edge, `half` its height either side: each kind is its mark, its
   * name `toName` right of the mark's centre, the kinds `gap` apart and the row centred on the frame's axis. */
  WORK = { below: 80, half: 20, icon: 56, toName: 62, gap: 64 };
const USES = () => L(["共享", "投产", "决策"], ["Sharing", "Production", "Decisions"]);
/* The scope's top: the stage grows from the scope with its name over it to the whole with the row under it, and the
 * top stands at the midpoint of the tops that centre those two states, so neither stands far off. */
function scopeTop() {
  const head = labelSize(LABEL) + NAME_GAP,
    first = S.h - head,
    whole = S.h + WORK.below + WORK.half - head;
  return 505 - (first + whole) / 4;
}
/* The x of each kind's mark: the row measured and centred on the frame's axis. */
function workXs() {
  const widths = USES().map((v) => WORK.icon / 2 + WORK.toName + measure(v)),
    total = widths.reduce((a, b) => a + b, 0) + WORK.gap * (widths.length - 1);
  let x = 960 - total / 2;
  return widths.map((w) => {
    const at = x + WORK.icon / 2;
    x += w + WORK.gap;
    return at;
  });
}
export function scopeStage(s, t, c, g) {
  const left = 960 - S.w / 2,
    top = scopeTop(),
    bottom = top + S.h,
    roam = g * soon(t, c.explore - 0.15, 0.6),
    dx = 26 * Math.sin(Math.PI * 2 * 0.22 * voiceTime(t)) * roam,
    [cw, ch] = S.card,
    scope = g * early(t, c.scopeClause, c.scope);
  // The data at the scope's top, moving about as it is explored, and its name under it.
  tableIcon(960 + dx - cw / 2, top + S.inset, cw, ch, { alpha: g, stroke: P.muted });
  const under = top + S.inset + ch + NAME_GAP,
    data = nameText(L("说不清这些的数据", "Data that cannot answer"), 960, under, {
      valign: "top",
      color: P.ink,
      alpha: g * named(t, c.first2b),
    });
  // The scope, a thin solid frame round the data.
  stroke(() => ctx.roundRect(left, top, S.w, S.h, 12), { color: P.line, alpha: g, width: 2.5 });
  nameText(L("授权范围", "Authorized scope"), left, top - NAME_GAP, {
    align: "left",
    valign: "bottom",
    alpha: scope,
  });
  // The way out runs down from the data to the scope's lower edge and stops at a bar there.
  const out = g * ramp(t, c.staysOut - 0.15, 0.3);
  link(960, data.bottom + 10, 960, bottom - 4, {
    alpha: out,
    upto: soon(t, c.staysOut - 0.1, 0.6),
    end: false,
  });
  bar(960, bottom, { alpha: g * ramp(t, c.staysOut + 0.4, 0.3), length: 60 });
  nameText(L("证明适合", "Shown fit"), 960 + 30 + NAME_GAP, bottom + 10, {
    align: "left",
    valign: "top",
    alpha: g * named(t, c.fit2),
  });
  // The work it stays out of: shared use (two people), production (a running table) and decisions (a decision's
  // ring and point), one list.
  const uq = (i) => g * ramp(t, c.uses[i] - 0.15, 0.4),
    xs = workXs(),
    y = bottom + WORK.below;
  person(xs[0] - 12, y + 10, { alpha: uq(0), size: 0.62 });
  person(xs[0] + 14, y + 10, { alpha: uq(0), size: 0.62, color: P.muted });
  tableIcon(xs[1] - 28, y - 20, 56, 40, { alpha: uq(1), rows: 3, cols: 2 });
  ring(xs[2], y, 16, { color: P.authority, alpha: uq(2), width: 3 });
  dot(xs[2], y, 5, { color: P.authority, alpha: uq(2) });
  USES().forEach((v, i) =>
    nameText(v, xs[i] + WORK.toName, y, {
      align: "left",
      alpha: g * listIn(t, c.uses, i),
      set: "work",
    }),
  );
}

/* E: the views under the data. The data stands at the top; the views hang from it on one trunk and one crossing row,
 * each drop drawn on its word, one list. When none may quietly become the source of truth, a bar closes the trunk below
 * the data and a point runs up from the last view and stops at it, and the data takes its seal as the source of truth. */
const E = { card: [220, 130], top: 300, bus: 530, icon: 570, xs: [570, 830, 1090, 1350] };
function viewIcon(i, x, y, a) {
  if (i === 0) documentIcon(x - 34, y, 68, 88, { alpha: a, rows: 2 });
  else if (i === 1) {
    documentIcon(x - 34, y, 68, 88, { alpha: a, rows: 0 });
    stroke(
      () => {
        for (let k = 0; k < 4; k++) {
          ctx.moveTo(x - 20 + 4, y + 26 + k * 15);
          ctx.arc(x - 20, y + 26 + k * 15, 4, 0, Math.PI * 2);
          ctx.moveTo(x - 10, y + 26 + k * 15);
          ctx.lineTo(x + 20, y + 26 + k * 15);
        }
      },
      { color: P.muted, alpha: a, width: 2 },
    );
  } else if (i === 2) {
    stroke(
      () => {
        for (let k = 0; k < 3; k++) ctx.roundRect(x - 34, y + k * 30, 68, 24, 6);
      },
      { color: P.ink, alpha: a, width: 2.5 },
    );
  } else {
    documentIcon(x - 34, y + 12, 68, 76, { alpha: a, rows: 2 });
    diamond(x + 26, y + 10, 14, { color: P.evidence, alpha: a });
    dot(x + 26, y + 10, 3.5, { color: P.evidence, alpha: a });
  }
}
export function viewsStage(s, t, c, g) {
  const [cw, ch] = E.card,
    bottom = E.top + ch,
    barY = bottom + 26,
    views = c.views,
    xs = E.xs,
    reach = views.map((at) => soon(t, at - 0.15, 0.6)),
    shown = views.map((at) => g * ramp(t, at - 0.15, 0.4));
  tableIcon(960 - cw / 2, E.top, cw, ch, { alpha: g });
  nameText(L("数据", "Data"), 960, E.top - NAME_GAP, { valign: "bottom", alpha: g });
  // The trunk, the crossing row and the drops are one stroke, the one structure the views hang from. The trunk and
  // the whole row stand from the stage's first frame, as a rail does, so the picture spans the row from the first
  // view and no view moves; each view's drop reaches down to its icon as it is named.
  stroke(
    () => {
      ctx.moveTo(960, bottom + 8);
      ctx.lineTo(960, E.bus);
      ctx.moveTo(xs[0], E.bus);
      ctx.lineTo(xs.at(-1), E.bus);
      xs.forEach((x, i) => {
        const q = clamp((reach[i] - 0.5) * 2);
        if (q <= 0) return;
        ctx.moveTo(x, E.bus);
        ctx.lineTo(x, mix(E.bus, E.icon - 2, q));
      });
    },
    { color: P.line, alpha: g, width: 2 },
  );
  xs.forEach((x, i) => {
    if (shown[i] > 0) viewIcon(i, x, E.icon, shown[i]);
  });
  railNames(
    L(
      ["报告", "数据目录", "缓存", "智能体的摘要"],
      ["Report", "Catalog", "Cache", "Agent summary"],
    ),
    xs,
    E.icon + 88,
    { gap: NAME_GAP, alpha: (i) => g * listIn(t, views, i), set: "views" },
  );
  // None may climb back: a bar shuts the trunk, and a point runs up from the last view and stops below it. Its way is
  // about 480 px and the thought ends some 1.7 s after the words, so it eases in and out over 1.55 s from just before
  // them (at most about 470 px/s) and settles before the quiet.
  bar(960, barY, { alpha: g * ramp(t, c.become + 0.05, 0.3), length: 48 });
  runPoint(
    [
      [xs[3], E.icon - 10],
      [xs[3], E.bus],
      [960, E.bus],
      [960, barY + 10],
    ],
    ramp(t, c.become - 0.1, 1.55),
    { alpha: shown[3] },
  );
  // The source of truth: the data takes its seal on the words that name it.
  const truth = g * named(t, c.truth),
    sx = 960 + cw / 2 + 48,
    sy = E.top + ch / 2;
  seal(sx, sy, 26, { color: P.evidence, alpha: truth });
  nameText(L("权威来源", "Source of truth"), sx + 26 + NAME_GAP, sy, {
    align: "left",
    alpha: truth,
  });
}
