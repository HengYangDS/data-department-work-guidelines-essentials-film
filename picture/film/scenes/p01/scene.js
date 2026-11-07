/* 01 晚了两个小时 / Two hours late, chapter 01 一次延迟 / One delay. The opening quiet shows the title signature and hands
 * the picture to last night's timeline in one swap just before the first word (A, 01.1). On 01.2's first words the
 * timeline re-forms compact in the top band, its two hours leading down to a rail across the whole row, and the four
 * failures build that row below it, each hanging from the rail by its own link (B, 01.2-01.3); the timeline leaves,
 * the failures stand told and three open questions stand over them (C, 01.4); the guidelines' document takes the top
 * band and its links reach the four failures (D, 01.5). The whole part is the made-up case, so the Illustrative chip
 * stands from the swap. */

import { link } from "../../drawing/links.js";
import { line, path } from "../../drawing/strokes.js";
import { documentIcon } from "../../drawing/symbols.js";
import { lastNight, lastNightExtent } from "../../drawing/timeline.js";
import { illustrative } from "../../framing/chapters.js";
import { titleSignature } from "../../framing/titles.js";
import { listIn, listLevel, named } from "../../naming/lists.js";
import { NAME_GAP, growName, nameText, termRow } from "../../naming/names.js";
import { measure } from "../../drawing/strokes.js";
import { P } from "../../palette.js";
import { L, en } from "../../timeline.js";
import { cue } from "../../timing/cues.js";
import { clamp, ease, ramp, soon } from "../../timing/easing.js";
import { drawShare, travel, voiceTime } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { forkMark, meetingMark, openMark, pagesMark, patchMark } from "./failures.js";

/* The spoken cues, in the order they are said. */
function cuesOf(s) {
  return {
    night: cue(s, "昨晚", "Last night"),
    // 01.2's first words, on which the failures' stage cuts in, a thought boundary.
    says: cue(s, "有人马上说", "Someone says at once"),
    data: cue(s, "价格数据", "price data"),
    late: cue(s, "晚了两个小时", "two hours late"),
    vendor: cue(s, "换供应商", "change the vendor"),
    facts: cue(s, "事实还没查清", "before the facts"),
    patch: cue(s, "手工把数据补上", "patches the data"),
    again: cue(s, "下个月照样出错", "next month it fails again"),
    mechanism: cue(s, "机制", "the mechanism"),
    meeting: cue(s, "开了个会", "A meeting"),
    speaks: cue(s, "人人都发了言", "everyone speaks"),
    decide: cue(s, "决定", "decide"),
    act: cue(s, "动手", "or act"),
    agent: cue(s, "智能体", "an Agent"),
    more: cue(s, "材料多了", "more material"),
    judgment: cue(s, "判断和结果", "the judgment"),
    busy: cue(s, "大家都没闲着", "Everyone keeps busy"),
    who: cue(s, "谁可以决定", "who may decide"),
    which: cue(s, "哪些事实", "which facts"),
    boundary: cue(s, "哪条边界", "which boundary"),
    noOne: cue(s, "没人说得清", "no one can say"),
    guide: cue(s, "数据部门工作指南", "The Data Department Work Guidelines"),
    against: cue(s, "针对", "against"),
    four: cue(s, "四种失败", "four failures"),
  };
}

/* The row of failures: four places at a pitch of 340 px about the frame's centre, each figure centred on ROW_Y with
 * its name hanging from NAME_TOP; the links reach each figure at its own top. The row's lines span SPAN px each side
 * of the centre, clear of its outer names: the rail over it in B and the bracket under its names in C and D, at
 * BRACKET_Y; the rail of B and the links of D run across the frame at CROSS_Y. */
const XS = [450, 790, 1130, 1470],
  ROW_Y = 570,
  NAME_TOP = 675,
  SPAN = 680,
  CROSS_Y = 425,
  BRACKET_Y = NAME_TOP + 54,
  TOPS = [
    [0, -27],
    [0, -30],
    [0, -52],
    [-80, 10],
  ];
/* Each failure's name: its term on the words that bring it, and what went wrong set under it as its qualifier. */
const TERMS = () => [
  L("换供应商", "Changing the vendor"),
  L("手工补上的数据", "Data patched by hand"),
  L("一场会", "A meeting"),
  L("十页分析", "Ten pages of analysis"),
];
const QUALS = () => [
  [L("事实还没查清", "before the facts are in")],
  [L("机制一点没动", "the mechanism untouched")],
  [],
  // The fourth says what did not improve, in the voice's words, as its neighbours say what went wrong; the English, in
  // two phrases, breaks between them within the name's width, clear of the meeting beside it.
  L(["判断和结果没变得更可靠"], ["judgment and outcome ", "no more reliable"]),
];
/* The meeting's two empty seats are named apart, one on each side of the pair, each on its words. */
const SEATS = () => L(["决定", "动手"], ["Decision", "Action"]);

/* A: last night's timeline, centred with its three names: the night's hours from the first word, the price data on
 * the hour it arrived, the two hours late measured below the rail; then the night runs on. */
function stageNight(t, a, c) {
  // The night's name is the film's first word, so it stands whole from the opening cut with the rail and its point,
  // and the voice's first syllable never meets a frame of fewer than three firm marks.
  const names = {
    axis: { v: L("昨晚", "Last night"), alpha: 1 },
    card: { v: L("价格数据", "Price data"), alpha: named(t, c.data) },
    late: { v: L("晚了两个小时", "Two hours late"), alpha: named(t, c.late) },
  };
  const e = lastNightExtent(1, { card: 1, late: 1, names });
  lastNight(960 - (e.left + e.right) / 2, 505 - (e.top + e.bottom) / 2, 1, {
    alpha: a,
    card: soon(t, c.data - 0.15, 0.8),
    late: { draw: { t, at: c.late + 0.05 } },
    // The night runs on from the first word, so the opening holds its rail, its name and a moving point.
    flow: { t },
    names,
  });
}

/* The compact timeline of the top band, with the three names it kept. */
function compactNight(a, t) {
  return lastNight(960, 250, 0.75, {
    alpha: a,
    card: 1,
    late: 1,
    flow: { t },
    names: {
      axis: L("昨晚", "Last night"),
      card: { v: L("价格数据", "Price data"), side: "right" },
      late: L("晚了两个小时", "Two hours late"),
    },
  });
}

/* One failure's figure at (x, ROW_Y), its parts on their words; `busy` shows it as it stands once told: the fork's
 * taken way and the dripping pipe keep running as flows in voice time, while the meeting and the stack of pages, whose
 * marks count the speakers and the material, hold still. The stack climbs its six pages over 2.4 s of voice time, so
 * each page fades in as it settles rather than snapping in. */
function figure(k, x, t, a, c, busy = false) {
  const on = a * ramp(t, [c.vendor, c.patch, c.meeting, c.agent][k] - 0.15, 0.4),
    part = (at) => ramp(t, at - 0.15, 0.4);
  if (k === 0)
    forkMark(x, ROW_Y, {
      alpha: on,
      facts: busy ? 0 : part(c.facts),
      run: busy ? { t } : null,
    });
  if (k === 1)
    patchMark(x, ROW_Y, {
      alpha: on,
      drip: { t },
      again: busy ? 0 : part(c.again),
      light: busy ? 0 : part(c.mechanism),
    });
  if (k === 2) {
    // Everyone speaks: a beat at each seated head in turn, once, on the words.
    const flash = (i) => {
      const p = (t - c.speaks - 0.05 - 0.35 * i) / 0.5;
      return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
    };
    meetingMark(x, ROW_Y, {
      alpha: on,
      seats: busy ? [0, 0] : [part(c.decide), part(c.act)],
      beat: busy ? [0, 0, 0] : [0, 1, 2].map(flash),
    });
  }
  if (k === 3)
    pagesMark(x, ROW_Y, {
      alpha: on,
      pages: busy ? 9 : 3 + 6 * travel(t, c.more + 0.05, 2.4),
      bars: busy ? 0 : part(c.judgment),
    });
}

/* B, from 01.2's first words: the compact timeline over the row of failures. Its two hours lead down to a rail across
 * the row's whole width, whose two ends reach down to the line of the bracket that holds the row's names in C and D;
 * the rail stands with the first failure, on its words, so it never waits empty for its members, and from then on the
 * picture has its final extent, top to bottom, and stays balanced while the failures fill it. The row builds left to
 * right, each failure at its own place from its words and joined to the rail by its own link, and what went wrong joins
 * its name on its own words. */
function stageFailures(t, a, c) {
  compactNight(a, t);
  // The rail is a bracket over the row, the one that holds the row's names in C and D turned to face it.
  const rail = { color: P.line, alpha: a * ramp(t, c.vendor - 0.15, 0.4), width: 2.5 };
  line(960, 362, 960, CROSS_Y, rail);
  // Its ends and its span are one stroke, so the bracket is one mark, which the timeline's name over it names.
  path(
    [
      [960 - SPAN, BRACKET_Y],
      [960 - SPAN, CROSS_Y],
      [960 + SPAN, CROSS_Y],
      [960 + SPAN, BRACKET_Y],
    ],
    rail,
  );
  const ats = [c.vendor, c.patch, c.meeting, c.agent],
    terms = TERMS(),
    quals = QUALS(),
    qualAts = [[c.facts], [c.mechanism], [], [c.judgment, c.judgment]],
    seats = [c.decide, c.act];
  ats.forEach((at, k) => {
    const x = XS[k],
      [dx, dy] = TOPS[k];
    link(x + dx, CROSS_Y, x + dx, ROW_Y + dy, {
      alpha: a * ramp(t, at - 0.15, 0.3),
      draw: { t, at: at + 0.05 },
    });
    figure(k, x, t, a, c);
    termRow(t, [terms[k]], [at], quals[k], qualAts[k], x, NAME_TOP, {
      align: "center",
      inline: false,
      build: true,
      width: 300,
      set: "failures-told",
      alpha: a * listLevel(t, ats, k),
    });
    if (k === 2)
      SEATS().forEach((v, i) =>
        nameText(v, x + (i ? 71 : -71), ROW_Y + 51, {
          align: i ? "left" : "right",
          alpha: a * listIn(t, seats, i),
          set: "seats",
        }),
      );
  });
}

/* The row as it stands once told: each failure's figure under its term, the name it was given in the telling without
 * what went wrong, so it reads as the same name; the fork and the pipe keep busy in voice time. */
function busyRow(t, a, c) {
  const terms = TERMS(),
    quals = QUALS();
  XS.forEach((x, k) => {
    figure(k, x, t, a, c, true);
    growName(t, [terms[k]], [-Infinity], x, NAME_TOP, {
      align: "center",
      width: 300,
      set: "failures",
      alpha: a,
      whole: [terms[k], ...quals[k]].join(" "),
    });
  });
}
/* A name for the whole row: a bracket under its names, drawn on with the name that hangs under it; its end ticks grow
 * as the bracket reaches them. */
/* The row's bracket grows from the centre outwards as a stroke's tips draw (drawShare), each at most 820 px/s, so it
 * never stands at firm ink in the frame it appears; it sets off at `drawAt`, early enough to stand whole before the
 * thought's quiet, and its name comes on its words. */
function rowName(v, t, at, a, drawAt = at - 0.1) {
  const y = BRACKET_Y,
    on = a * drawShare(t, drawAt, SPAN, 0.5),
    reach = SPAN * on,
    tick = 10 * ease(clamp((on - 0.85) / 0.15));
  line(960 - reach, y, 960 + reach, y, { color: P.line, alpha: a * clamp(on * 3), width: 2 });
  if (tick > 0.5)
    [-SPAN, SPAN].forEach((dx) =>
      line(960 + dx, y, 960 + dx, y - tick, { color: P.line, alpha: a, width: 2 }),
    );
  nameText(v, 960, y + NAME_GAP, { valign: "top", alpha: a * named(t, at) });
}

/* C: everyone keeps busy, and three questions stand open over the row, built as one list on their words. */
const QX = [540, 960, 1380],
  QY = 232;
function stageBusy(t, a, c) {
  busyRow(t, a, c);
  rowName(L("大家", "Everyone"), t, c.busy, a);
  // The English says that no one can say before it asks; its first question stands on those words.
  const qs = [L(c.who, c.noOne), c.which, c.boundary],
    names = L(
      ["谁可以决定", "哪些事实", "哪条边界"],
      ["Who may decide", "Which facts", "Which boundary"],
    ),
    vt = voiceTime(t);
  qs.forEach((at, i) => {
    openMark(QX[i], QY, 24, { alpha: a * ramp(t, at - 0.15, 0.4), turn: vt * 0.5 + i });
    nameText(names[i], QX[i], QY + 24 + NAME_GAP, {
      valign: "top",
      alpha: a * listIn(t, qs, i),
      set: "questions",
    });
  });
}

/* D: the guidelines' document in the top band, named beside it; on its words its links reach down to the four
 * failures, and the row is named. */
function stageGuide(t, a, c) {
  busyRow(t, a, c);
  const name = L("数据部门工作指南", ["Data Department", "Work Guidelines"]),
    wide = en ? Math.max(...name.map((v) => measure(v))) : measure(name),
    W = 150,
    H = 186,
    TOP = 168,
    left = 960 - (W + NAME_GAP + wide) / 2;
  documentIcon(left, TOP, W, H, { alpha: a, rows: 5 });
  nameText(name, left + W + NAME_GAP, TOP + H / 2, { align: "left", alpha: a * named(t, c.guide) });
  XS.forEach((x, k) => {
    const [dx, dy] = TOPS[k];
    link(left + W / 2, TOP + H + 8, x + dx, ROW_Y + dy, {
      route: "vhv",
      mid: CROSS_Y,
      alpha: a,
      // Each link draws at the tip pace by its length (up to 785 px), so the four set off with the words before 针对 /
      // "against" and all have reached the failures by the time the voice names them.
      draw: { t, at: c.against - 1.2 + 0.1 * k },
    });
  });
  // The bracket spans the row as the links reach it, and stands whole before the thought's quiet (01.5 ends with
  // 四种失败 / "four failures", and the stage cuts in the quiet after it).
  rowName(L("四种失败", "Four failures"), t, c.four, a, c.against - 0.6);
}

scenes["01"] = function (s, t) {
  // The opening quiet: the title signature stands until one swap hands the picture to the timeline.
  if (t < s.words[0].start - 0.12) {
    titleSignature(1);
    return;
  }
  const c = cuesOf(s);
  const A = stageOut(t, c.says),
    B = stageIn(t, c.says) * stageOut(t, c.busy),
    C = stageIn(t, c.busy) * stageOut(t, c.guide),
    D = stageIn(t, c.guide);
  if (A > 0) stageNight(t, A, c);
  if (B > 0) stageFailures(t, B, c);
  if (C > 0) stageBusy(t, C, c);
  if (D > 0) stageGuide(t, D, c);
  illustrative(1);
};
