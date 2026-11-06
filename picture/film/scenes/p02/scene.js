/* 02 工作的价值 / What the work is worth, chapter 02 指南是什么 / What the guidelines are. A (02.1): under the rising
 * chapter title, the guidelines' page stands with its name, centred across the frame and high enough to leave room
 * below it; the seal of its contract stamps it; the department's members and the Agents they delegate to arrive below
 * it, each joined to it, and the delegation runs from the members to the Agents. B (02.2), one stage laid out once for
 * its one thought: the way of the work's value across the frame, with what a piece of work merely hands over refused
 * below it, one thing on each one's words; on its words a signal from the world runs in at the way's left. From
 * 「变成」/ "into judgments" the refused things stand on at the list's second level, their crosses at full ink, and what
 * the signal becomes hangs from the way under them, judgments, data assets and actions, carried along the way to the
 * others at its end, with the qualities the others rely on under them. C and C2 (02.3-02.4) are drawn by tasks.js. */

import { link } from "../../drawing/links.js";
import { dot, flowAt, flowDot, labelSize, line, measure } from "../../drawing/strokes.js";
import { cross } from "../../drawing/symbols.js";
import { clearOfTitle } from "../../framing/chapters.js";
import { SECOND, listIn, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, growName, nameText, rejectedName } from "../../naming/names.js";
import { LABEL, P } from "../../palette.js";
import { L } from "../../timeline.js";
import { cue } from "../../timing/cues.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { travel } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { agents, guidePage, handedMark, outputMark, people, wave } from "./marks.js";
import { stageOutcomes, taskCues } from "./tasks.js";

/* The spoken cues of 02.1 and 02.2. The seal's rim stands with its name on the words that begin to say what the
 * contract is about (工作质量 / "contract") and is stamped on the next (契约 / "quality"), so the page never stands
 * alone for two seconds in either edition. */
function cuesOf(s) {
  return {
    guide: cue(s, "这份指南", "The guidelines"),
    seal: cue(s, "工作质量", "contract"),
    stamp: cue(s, "契约", "quality"),
    members: cue(s, "部门成员", "members"),
    delegate: cue(s, "委托", "delegate"),
    agents: cue(s, "智能体", "Agents"),
    value: cue(s, "数据工作的价值", "The value of data work"),
    handed: [
      cue(s, "一个文件", "a file"),
      cue(s, "一张表", "a table"),
      cue(s, "一份报告", "a report"),
      cue(s, "一个流程", "a process"),
    ],
    signal: cue(s, "现实里的信号", "signals from the world"),
    becomes: cue(s, "变成", "into judgments"),
    others: cue(s, "别人", "others"),
    outputs: [
      cue(s, "判断", "judgments"),
      cue(s, "数据资产", "data assets"),
      cue(s, "行动", "actions"),
    ],
    qualities: [
      cue(s, "讲得清", "explained"),
      cue(s, "经得起查", "checked"),
      cue(s, "能用到哪里", "within clear limits"),
    ],
    ...taskCues(s),
  };
}

/* A: the guidelines open as a booklet, wide enough with its two names that the opening's picture covers a tenth of
 * the frame by its second second. It stands under the rising title, at full ink as the voice begins, at one height
 * from the first word until the stage leaves: as low as the row of members and Agents below it allows, whose links
 * cross CROSS px under the booklet and reach the members' heads (HEADS) as far again below, so the booklet alone
 * stands as near the content centre as it can and the picture with the row stands on it. The members stand left of
 * the centre and the Agents right of it, so the picture stays within 90 px of the centre while the members wait. */
const PAGE = { w: 400, h: 350 },
  ROW = 700,
  HEADS = ROW - 36,
  CROSS = 42,
  PAGE_TOP = HEADS - 2 * CROSS - PAGE.h,
  MEMBERS = [620, 680, 740],
  AGENTS = [1180, 1240],
  ROW_NAMES = ROW + 22 + NAME_GAP;
function stageGuide(s, t, a, c) {
  // The booklet stands where it and its two names, one at each side, are centred on the frame.
  const x =
    960 -
    PAGE.w / 2 -
    (measure(L("契约", "Contract")) - measure(L("这份指南", "The guidelines"))) / 2;
  const g = a * clearOfTitle(s, t, PAGE_TOP),
    bottom = PAGE_TOP + PAGE.h,
    mid = bottom + CROSS,
    agentsX = (AGENTS[0] + AGENTS[1]) / 2;
  const sealAt = guidePage(x, PAGE_TOP, PAGE.w, PAGE.h, {
    alpha: g * ramp(t, s.voice_start - 0.4, 0.35),
    seal: ramp(t, c.seal - 0.15, 0.4),
    stamp: ramp(t, c.stamp - 0.1, 0.35),
  });
  nameText(L("这份指南", "The guidelines"), x - NAME_GAP, PAGE_TOP + PAGE.h / 2, {
    align: "right",
    alpha: g * named(t, c.guide),
  });
  nameText(L("契约", "Contract"), x + PAGE.w + NAME_GAP, sealAt[1], {
    align: "left",
    alpha: g * named(t, c.seal),
  });
  // The members and the Agents, each joined to the page just after their own words.
  const members = g * ramp(t, c.members - 0.15, 0.4),
    agentsOn = g * ramp(t, c.agents - 0.15, 0.4);
  people(MEMBERS, ROW, { alpha: members });
  link(x + PAGE.w * 0.25, bottom, MEMBERS[1], HEADS, {
    route: "vhv",
    mid,
    alpha: members,
    upto: soon(t, c.members + 0.05, 0.5),
  });
  nameText(L("部门成员", "Members"), MEMBERS[1], ROW_NAMES, {
    valign: "top",
    alpha: g * named(t, c.members),
  });
  agents(AGENTS, ROW, { alpha: agentsOn });
  link(x + PAGE.w * 0.75, bottom, agentsX, ROW - 30, {
    route: "vhv",
    mid,
    alpha: agentsOn,
    upto: soon(t, c.agents + 0.05, 0.5),
  });
  nameText(L("智能体", "Agents"), agentsX, ROW_NAMES, {
    valign: "top",
    alpha: g * named(t, c.agents),
  });
  // The delegation runs from the members to the Agents, a point travelling along it once it has reached them.
  link(MEMBERS[2] + 34, ROW, AGENTS[0] - 34, ROW, {
    alpha: g * ramp(t, c.delegate - 0.15, 0.4),
    upto: soon(t, c.delegate + 0.05, 0.8),
    width: 2.5,
    flow: { t, from: c.delegate + 0.85 },
  });
  nameText(L("委托", "Delegation"), 960, ROW_NAMES, {
    valign: "top",
    alpha: g * named(t, c.delegate),
  });
}

/* B: the way across the frame, from a point at its start to a point at its end, its name over its middle. The marks
 * on the way (the signal at its left, the others beyond its end) are named over or under themselves; the things below
 * it stand in two rows, each named under itself on its row's one baseline: the refused things under the way, and what
 * the signal becomes under them, each hanging from the way by a stem that passes between the refused things. The
 * others stand beyond the way's end, named under themselves, with the qualities they rely on under their name. The
 * stage stands SHIFT px left of the frame's axis in Chinese, whose qualities take a line as wide as their first two
 * and whose signal's name is short, so the settled stage keeps within the reviewers' 50 px of the centre. */
const SHIFT = L(-20, 0),
  WAY_Y = 450,
  WAY = [360 + SHIFT, 1560 + SHIFT],
  WAVE_END = 470 + SHIFT,
  HANG_Y = 530,
  HANG_NAMES = HANG_Y + 32 + NAME_GAP,
  OUT_Y = 680,
  OUT_NAMES = OUT_Y + 32 + NAME_GAP,
  HANDED_X = [600, 840, 1080, 1320].map((x) => x + SHIFT),
  OUTPUT_X = [720, 960, 1200].map((x) => x + SHIFT),
  OTHERS = [1594 + SHIFT, 1640 + SHIFT],
  OTHERS_X = 1617 + SHIFT,
  OVER = WAY_Y - 7 - NAME_GAP;
/* The size of a refusal's cross (rejectedName). The refused things recede to the list's second level, SECOND
 * (naming/lists.js), from 「变成」/ "into judgments" on. */
const REFUSAL_CROSS = Math.min(26, labelSize(LABEL) * 0.9);
const HANDED = () =>
  L(["一个文件", "一张表", "一份报告", "一个流程"], ["A file", "A table", "A report", "A process"]);
const OUTPUTS = () => L(["判断", "数据资产", "行动"], ["Judgments", "Data assets", "Actions"]);
const QUALITIES = () =>
  L(["讲得清、", "经得起查", "能用到哪里"], ["Explained,", " checked,", " within clear limits"]);
/* The way, its name, and the signal at its left from the signal's words: the wave takes the way's first stretch, which
 * fades out with the way's starting point as the wave fades in, so the way never loses its start in a frame. The wave
 * moves on by one period as the signal is named, easing in and out over WAVE_SECONDS of voice time, and then rests, so
 * it does not keep pulling the eye back to a mark already named. */
const WAVE_SECONDS = 1.4;
function theWay(t, a, c, end) {
  const signal = ramp(t, c.signal - 0.15, 0.4);
  line(WAVE_END, WAY_Y, end, WAY_Y, { color: P.line, alpha: a, width: 3.5 });
  line(WAY[0], WAY_Y, WAVE_END, WAY_Y, { color: P.line, alpha: a * (1 - signal), width: 3.5 });
  dot(WAY[1], WAY_Y, 6, { color: P.line, alpha: a });
  dot(WAY[0], WAY_Y, 6, { color: P.line, alpha: a * (1 - signal) });
  wave(WAY[0], WAVE_END, WAY_Y, 2 * Math.PI * travel(t, c.signal - 0.15, WAVE_SECONDS), {
    alpha: a * signal,
  });
  nameText(L("工作的价值", "The value of data work"), (WAY[0] + WAY[1]) / 2, OVER, {
    valign: "bottom",
    alpha: a * named(t, c.value),
  });
  nameText(L("现实里的信号", "Signals from the world"), (WAY[0] + WAVE_END) / 2, OVER, {
    valign: "bottom",
    alpha: a * named(t, c.signal),
  });
}
function stageWay(t, a, c) {
  const end = WAY[1];
  theWay(t, a, c, end);
  // The refused things, each on its words, a cross beside each name. On 「变成」/ "into judgments" they recede to the
  // list's second level while their crosses keep full ink, and they stand so where they are until the stage leaves.
  const recede = ramp(t, c.becomes + 0.05, 0.4);
  HANDED().forEach((v, k) => {
    const seen = a * ramp(t, c.handed[k] - 0.15, 0.4),
      on = a * listIn(t, c.handed, k),
      level = on * mix(1, SECOND, recede),
      mark = ramp(t, c.handed[k] + 0.05, 0.3);
    handedMark(k, HANDED_X[k], HANG_Y, { alpha: level });
    const name = rejectedName(v, HANDED_X[k], HANG_NAMES, {
      valign: "top",
      alpha: Math.min(level, mix(1, 0.7, mark)),
      mark: 0,
      set: "handed",
    });
    cross(name.right - REFUSAL_CROSS / 2, (name.top + name.bottom) / 2, REFUSAL_CROSS, {
      alpha: mix(on, seen, recede) * mark,
      width: 3,
    });
  });
  // A point travels the way once, from the signal to the others, once they stand at its end; the work item of the
  // actions makes its one run along its lane on its words. Each then rests.
  const carried = flowAt(t, end - WAVE_END, { from: c.others, passes: 1 });
  flowDot(mix(WAVE_END, end, carried?.q ?? 0), WAY_Y, 6, carried, { color: P.evidence, alpha: a });
  const run = travel(t, c.outputs[2] + 0.1, 1.2);
  OUTPUTS().forEach((v, k) => {
    const on = a * ramp(t, c.outputs[k] - 0.15, 0.4);
    line(OUTPUT_X[k], WAY_Y + 2, OUTPUT_X[k], OUT_Y - 32, { color: P.line, alpha: on, width: 2 });
    outputMark(k, OUTPUT_X[k], OUT_Y, { alpha: on, run });
    nameText(v, OUTPUT_X[k], OUT_NAMES, {
      valign: "top",
      alpha: a * listIn(t, c.outputs, k),
      set: "outputs",
    });
  });
  const others = a * ramp(t, c.others - 0.15, 0.4);
  people(OTHERS, WAY_Y, { size: 0.8, alpha: others });
  const own = nameText(L("别人", "Others"), OTHERS_X, WAY_Y + 18 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.others),
  });
  // The qualities the others rely on, under their name: one name of parts, each joining it on its words, so the way's
  // twelve-name limit holds with the refused things standing. The first two share a line and the third takes the next,
  // so each line spans enough of the other's width to read as one block at rest.
  growName(t, QUALITIES(), c.qualities, OTHERS_X, own.bottom + 18, {
    width: measure(QUALITIES().slice(0, 2).join(""), NOTE),
    size: NOTE,
    color: P.muted,
    align: "center",
    build: true,
    alpha: a,
  });
}

scenes["02"] = function (s, t) {
  const c = cuesOf(s);
  const A = stageOut(t, c.value),
    B = stageIn(t, c.value) * stageOut(t, c.task);
  if (A > 0) stageGuide(s, t, A, c);
  if (B > 0) stageWay(t, B, c);
  stageOutcomes(s, t, c);
};
