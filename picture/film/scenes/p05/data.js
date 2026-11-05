/* Part 05, stages A, A2, B, B2 and E: data that means what it says. A: the data and the evidence its use takes; a file
 * that opens, a chart that looks good and a model signal build below, their way up stops at a bar, and what none of
 * them establishes stands between as open marks. A2: shown fit for a specific use, the data earns its seal. B: six
 * questions ring the data, each station filling as it is asked. B2: data that cannot answer them is explored inside
 * its authorized scope, and its way out to shared, production and decision work stops at the scope's edge. E: the
 * views hang from the data, and none may climb back to become the source of truth. */

import { link } from "../../drawing/links.js";
import { dot, line, measure, ring, stroke } from "../../drawing/strokes.js";
import { diamond, documentIcon, person, seal, tableIcon } from "../../drawing/symbols.js";
import { ctx } from "../../canvas.js";
import { building, listIn, named, speaking } from "../../naming/lists.js";
import { NAME_GAP, nameText } from "../../naming/names.js";
import { radialName, railNames } from "../../naming/placement.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { clamp, mix, ramp, soon } from "../../timing/easing.js";
import {
  bar,
  centring,
  chartMark,
  early,
  fileMark,
  flowOf,
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
 * content centre. The card stands alone on the frame's axis until the page arrives, then glides right as the page
 * takes its place at its left. */
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
    cardX = mix(960, A.cardX, soon(t, c.evidence - 0.15, 0.6)),
    page = g * named(t, c.evidence),
    mid = A.top + ch / 2;
  tableIcon(cardX - cw / 2, A.top, cw, ch, { alpha: g });
  missingPage(A.pageX - A.page[0] / 2, A.top, A.page[0], A.page[1], { alpha: page });
  // The evidence the data's use takes: a dashed relation from the missing page to the data.
  link(A.pageX + A.page[0] / 2 + 12, mid, cardX - cw / 2 - 12, mid, {
    alpha: page,
    dash: [8, 8],
    upto: soon(t, c.evidence + 0.1, 0.6),
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
  // None of them establishes: their ways rise from each, join, and stop at a bar under the open marks.
  const rise = soon(t, c.refuse - 0.1, 0.5),
    up = soon(t, c.refuse + 0.25, 0.45),
    shut = g * ramp(t, c.refuse + 0.55, 0.3);
  stroke(
    () => {
      for (const x of ROW_XS) {
        ctx.moveTo(x, ROW_Y - 40);
        ctx.lineTo(x, mix(ROW_Y - 40, BUS_Y, rise));
      }
      if (rise > 0.98) {
        ctx.moveTo(ROW_XS[0], BUS_Y);
        ctx.lineTo(ROW_XS[2], BUS_Y);
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
 * on its corner, is stamped once the relation has reached the use. */
/* The data stands nearer the axis with its seal until the relation is said, then glides left to make room for it. */
const A2 = { y: 505, card: [220, 140], cardX: 640, aloneX: 880, useX: 1300, r: 56 };
export function fitStage(s, t, c, g) {
  const [cw, ch] = A2.card,
    top = A2.y - ch / 2,
    use = g * named(t, c.use),
    reach = soon(t, c.fit - 0.1, 0.8),
    cardX = mix(A2.aloneX, A2.cardX, soon(t, c.fit - 0.15, 0.7));
  tableIcon(cardX - cw / 2, top, cw, ch, { alpha: g });
  nameText(L("数据", "Data"), cardX, top - NAME_GAP, { valign: "bottom", alpha: g });
  link(cardX + cw / 2 + 12, A2.y, A2.useX - A2.r - 12, A2.y, {
    alpha: g * ramp(t, c.fit - 0.15, 0.3),
    upto: reach,
    width: 3,
    flow: reach >= 1 ? flowOf(t, 0.4) : null,
  });
  nameText(L("证明适合", "Shown fit"), (cardX + cw / 2 + A2.useX - A2.r) / 2, A2.y - NAME_GAP, {
    valign: "bottom",
    alpha: g * named(t, c.fit),
  });
  targetMark(A2.useX, A2.y, A2.r, { alpha: use });
  nameText(L("具体用途", "A specific use"), A2.useX, top - NAME_GAP, {
    valign: "bottom",
    alpha: use,
  });
  // The seal: its rim on the words of trust, its stamp once the data has been shown fit for the use.
  const sx = cardX + cw / 2,
    sy = top + ch,
    rim = g * named(t, c.trust),
    stamp = g * soon(t, Math.max(c.trust, c.use + 0.4) + 0.05, 0.5);
  dot(sx, sy, 27, { color: P.ground, alpha: rim });
  seal(sx, sy, 26, { color: P.evidence, alpha: rim, stamp, hollow: stamp < 0.5 });
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
    ["来源", "可用时间", "含义", "改动", "质量", "用途"],
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
    radialName(names[i], B.x, B.y, B.rx + 12, a, {
      ry: B.ry + 12,
      alpha: g * listIn(t, c.asks, i),
      set: "questions",
    });
  });
}

/* B2: data that cannot answer the questions. It is explored inside its authorized scope, a frame sized to it in
 * which it moves; the work it stays out of stands at the right, each kind on its words; and the way out of the scope
 * toward that work stops at a bar on the scope's edge, which stays shut until the data is shown fit. */
/* The scope stands round the data from the cut, a thin solid frame that holds the data and its name, so it is never an
 * empty frame; it is named on its words. It stands centred alone and glides left as the work the data stays out of
 * arrives at its right, the two together centred by the width of the work's names. */
const S = { top: 388, w: 500, h: 250, card: [280, 150], alone: 710, beside: 470 },
  WORK = { toIcon: 700, toNames: 762, ys: [433, 513, 593] };
const USES = () => L(["共享", "投产", "决策"], ["Shared", "Production", "Decision work"]);
export function scopeStage(s, t, c, g) {
  const widest = Math.max(...USES().map((v) => measure(v))),
    beside = S.beside + centring(S.beside, S.beside + WORK.toNames + NAME_GAP + widest),
    left = mix(S.alone, beside, soon(t, c.uses[0] - 0.15, 0.7)),
    cy = S.top + 100,
    roam = g * soon(t, c.explore - 0.15, 0.6),
    dx = 26 * Math.sin(Math.PI * 2 * flowOf(t, 0.22)) * roam,
    cx = left + S.w / 2 + dx,
    [cw, ch] = S.card,
    scope = g * early(t, c.scopeClause, c.scope);
  tableIcon(cx - cw / 2, cy - ch / 2, cw, ch, { alpha: g, stroke: P.muted });
  nameText(
    L("说不清这些的数据", "Data that cannot answer"),
    left + S.w / 2,
    cy + ch / 2 + NAME_GAP,
    {
      valign: "top",
      color: P.ink,
      alpha: g * named(t, c.first2b),
    },
  );
  // The scope, a thin solid frame round the data.
  stroke(() => ctx.roundRect(left, S.top, S.w, S.h, 12), { color: P.line, alpha: g, width: 2.5 });
  nameText(L("授权范围", "Authorized scope"), left, S.top - NAME_GAP, {
    align: "left",
    valign: "bottom",
    alpha: scope,
  });
  // The way out runs from the data to the scope's edge and stops at a bar there.
  const out = g * ramp(t, c.staysOut - 0.15, 0.3),
    edge = left + S.w;
  link(cx + cw / 2 + 10, cy, edge - 4, cy, {
    alpha: out,
    upto: soon(t, c.staysOut - 0.1, 0.6),
    end: false,
  });
  bar(edge, cy, { alpha: g * ramp(t, c.staysOut + 0.4, 0.3), vertical: true, length: 60 });
  nameText(L("证明适合", "Shown fit"), edge + NAME_GAP + 8, cy + 30 + NAME_GAP, {
    align: "left",
    valign: "top",
    alpha: g * named(t, c.fit2),
  });
  // The work it stays out of: shared use (two people), production (a running table) and decisions (a decision's
  // ring and point), one list.
  const uq = (i) => g * ramp(t, c.uses[i] - 0.15, 0.4),
    wx = beside + WORK.toIcon,
    [y0, y1, y2] = WORK.ys;
  person(wx - 12, y0 + 10, { alpha: uq(0), size: 0.62 });
  person(wx + 14, y0 + 10, { alpha: uq(0), size: 0.62, color: P.muted });
  tableIcon(wx - 28, y1 - 20, 56, 40, { alpha: uq(1), rows: 3, cols: 2 });
  ring(wx, y2, 16, { color: P.authority, alpha: uq(2), width: 3 });
  dot(wx, y2, 5, { color: P.authority, alpha: uq(2) });
  USES().forEach((v, i) =>
    nameText(v, beside + WORK.toNames, WORK.ys[i], {
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
    // The row builds centred on the trunk: it stands half a pitch right for each view still to come.
    shift = building(t, views, (E.xs[1] - E.xs[0]) / 2),
    xs = E.xs.map((x) => x + shift),
    reach = views.map((at) => soon(t, at - 0.15, 0.6)),
    shown = views.map((at) => g * ramp(t, at - 0.15, 0.4));
  tableIcon(960 - cw / 2, E.top, cw, ch, { alpha: g });
  nameText(L("数据", "Data"), 960, E.top - NAME_GAP, { valign: "bottom", alpha: g });
  // The trunk, the crossing row and the drops are one stroke, the one structure the views hang from: the row grows
  // out to each view as it is named and its drop reaches down to the view's icon.
  const left = Math.min(960, ...xs.map((x, i) => mix(960, x, reach[i]))),
    right = Math.max(960, ...xs.map((x, i) => mix(960, x, reach[i])));
  stroke(
    () => {
      ctx.moveTo(960, bottom + 8);
      ctx.lineTo(960, E.bus);
      ctx.moveTo(left, E.bus);
      ctx.lineTo(right, E.bus);
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
  // None may climb back: a bar shuts the trunk, and a point runs up from the last view and stops below it.
  bar(960, barY, { alpha: g * ramp(t, c.become + 0.05, 0.3), length: 48 });
  runPoint(
    [
      [xs[3], E.icon - 10],
      [xs[3], E.bus],
      [960, E.bus],
      [960, barY + 10],
    ],
    soon(t, c.become + 0.05, 1.4),
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
