/* 01 晚了两个小时 / Two hours late, chapter 01 一次延迟 / One delay. The opening quiet shows the title signature and hands
 * the picture to last night's timeline in one swap just before the first word (A, 01.1). The timeline then re-forms
 * compact in the top band and the four failures build one row below it, each led away from the two hours by its own
 * link (B, 01.2-01.3); the timeline leaves, the failures keep busy and three open questions stand over them (C, 01.4);
 * the guidelines' document takes the top band and its links reach the four failures (D, 01.5). The whole part is the
 * made-up case, so the Illustrative chip stands from the swap. */

import { link } from "../../drawing/links.js";
import { line } from "../../drawing/strokes.js";
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
import { clamp, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { forkMark, glide, meetingMark, openMark, pagesMark, patchMark } from "./failures.js";

/* The spoken cues, in the order they are said. */
function cuesOf(s) {
  return {
    night: cue(s, "昨晚", "Last night"),
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
 * its name hanging from NAME_TOP; the links reach each figure at its own top. */
const XS = [450, 790, 1130, 1470],
  ROW_Y = 570,
  NAME_TOP = 675,
  TOPS = [
    [0, -27],
    [0, -30],
    [0, -52],
    [-80, 10],
  ];
/* Each failure's name: its term on the words that bring it, and what went wrong set under it as its qualifier. */
const TERMS = () => [
  L("换供应商", "A new vendor"),
  L("手工补上的数据", "Data patched by hand"),
  L("一场会", "A meeting"),
  L("十页分析", "Ten pages of analysis"),
];
const QUALS = () => [
  [L("事实还没查清", "before the facts are in")],
  [L("机制一点没动", "the mechanism untouched")],
  [],
  [L("判断和结果", "judgment and outcome")],
];
/* The meeting's two empty seats are named apart, one on each side of the pair, each on its words. */
const SEATS = () => L(["决定", "动手"], ["Decision", "Action"]);

/* A: last night's timeline, centred with its three names: the night's hours from the first word, the price data on
 * the hour it arrived, the two hours late measured below the rail; then the night runs on. */
function stageNight(t, a, c) {
  const names = {
    axis: { v: L("昨晚", "Last night"), alpha: named(t, c.night) },
    card: { v: L("价格数据", "Price data"), alpha: named(t, c.data) },
    late: { v: L("晚了两个小时", "Two hours late"), alpha: named(t, c.late) },
  };
  const e = lastNightExtent(1, { card: 1, late: 1, names });
  lastNight(960 - (e.left + e.right) / 2, 505 - (e.top + e.bottom) / 2, 1, {
    alpha: a,
    card: soon(t, c.data - 0.15, 0.8),
    late: soon(t, c.late + 0.05, 0.7),
    // The night runs on from the first word, so the opening holds its rail, its name and a moving point.
    flow: (voiceTime(t) * 0.25) % 1,
    names,
  });
}

/* The compact timeline of the top band, with the three names it kept. */
function compactNight(a, t) {
  return lastNight(960, 250, 0.75, {
    alpha: a,
    card: 1,
    late: 1,
    flow: (voiceTime(t) * 0.25) % 1,
    names: {
      axis: L("昨晚", "Last night"),
      card: { v: L("价格数据", "Price data"), side: "right" },
      late: L("晚了两个小时", "Two hours late"),
    },
  });
}

/* One failure's figure at (x, ROW_Y), its parts on their words; `busy` keeps it moving in voice time instead. */
function figure(k, x, t, a, c, busy = false) {
  const vt = voiceTime(t),
    on = a * ramp(t, [c.vendor, c.patch, c.meeting, c.agent][k] - 0.15, 0.4),
    part = (at) => ramp(t, at - 0.15, 0.4);
  if (k === 0)
    forkMark(x, ROW_Y, { alpha: on, facts: busy ? 0 : part(c.facts), run: busy ? (vt * 0.45) % 1 : null });
  if (k === 1)
    patchMark(x, ROW_Y, {
      alpha: on,
      drip: (vt * 0.7) % 1,
      again: busy ? 0 : part(c.again),
      light: busy ? 0 : part(c.mechanism),
    });
  if (k === 2) {
    // Everyone speaks: a beat at each seated head in turn, on the words, and in voice time while they keep busy.
    const flash = (i) => {
      const p = busy ? ((vt * 0.5 + i / 3) % 1) / 0.4 : (t - c.speaks - 0.05 - 0.35 * i) / 0.5;
      return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
    };
    meetingMark(x, ROW_Y, {
      alpha: on,
      seats: busy ? [0, 0] : [part(c.decide), part(c.act)],
      beat: [0, 1, 2].map(flash),
    });
  }
  if (k === 3)
    pagesMark(x, ROW_Y, {
      alpha: on,
      pages: busy ? 8.5 + 0.5 * Math.sin(vt * 2.4) : 3 + 6 * soon(t, c.more + 0.05, 1.6),
      bars: busy ? 0 : part(c.judgment),
    });
}

/* B: the compact timeline over the row of failures. The row builds left to right and stands centred on what has
 * arrived, gliding one place left as each next failure comes; each arrives with its name and its link from the two
 * hours, and what went wrong joins its name on its own words. */
function stageFailures(t, a, c) {
  compactNight(a, t);
  const ats = [c.vendor, c.patch, c.meeting, c.agent],
    shift = glide(
      t,
      510,
      ats.slice(1).map((at, i) => [at, 340 - 170 * i]),
    ),
    terms = TERMS(),
    quals = QUALS(),
    qualAts = [[c.facts], [c.mechanism], [], [c.judgment]],
    seats = [c.decide, c.act];
  ats.forEach((at, k) => {
    const x = XS[k] + shift,
      [dx, dy] = TOPS[k];
    link(960, 362, x + dx, ROW_Y + dy, {
      route: "vhv",
      mid: 425,
      alpha: a * ramp(t, at - 0.15, 0.3),
      upto: soon(t, at + 0.05, 0.6),
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

/* The row as it stands once told: each failure's figure keeps busy in voice time under its term, the name it was
 * given in the telling without what went wrong, so it reads as the same name. */
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
/* A name for the whole row: a bracket under its names, drawn on with the name that hangs under it. */
function rowName(v, t, at, a) {
  const y = NAME_TOP + 54,
    on = a * soon(t, at - 0.1, 0.5),
    reach = 640 * on;
  line(960 - reach, y, 960 + reach, y, { color: P.line, alpha: a * clamp(on * 3), width: 2 });
  if (on > 0.98)
    [-640, 640].forEach((dx) => line(960 + dx, y, 960 + dx, y - 10, { color: P.line, alpha: a, width: 2 }));
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
    names = L(["谁可以决定", "哪些事实", "哪条边界"], ["Who may decide", "Which facts", "Which boundary"]),
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
      mid: 425,
      alpha: a,
      upto: soon(t, c.against + 0.05 + 0.1 * k, 0.6),
    });
  });
  rowName(L("四种失败", "Four failures"), t, c.four, a);
}

scenes["01"] = function (s, t) {
  // The opening quiet: the title signature stands until one swap hands the picture to the timeline.
  if (t < s.words[0].start - 0.12) {
    titleSignature(1);
    return;
  }
  const c = cuesOf(s);
  const A = stageOut(t, c.vendor),
    B = stageIn(t, c.vendor) * stageOut(t, c.busy),
    C = stageIn(t, c.busy) * stageOut(t, c.guide),
    D = stageIn(t, c.guide);
  if (A > 0) stageNight(t, A, c);
  if (B > 0) stageFailures(t, B, c);
  if (C > 0) stageBusy(t, C, c);
  if (D > 0) stageGuide(t, D, c);
  illustrative(1);
};
