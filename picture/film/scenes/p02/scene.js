/* 02 工作的价值 / What the work is worth, chapter 02 指南是什么 / What the guidelines are. A (02.1): under the rising
 * chapter title, the guidelines' page stands at the centre with its name; the seal of its contract stamps it; the
 * department's members and the Agents they delegate to arrive below it, each joined to it, and the delegation runs from
 * the members to the Agents. B (02.2): the way of the work's value across the frame, with what a piece of work merely
 * hands over refused below it, one thing on each one's words; on its words a signal from the world runs in at the
 * way's left. B2, from 「变成」/ "into judgments": the refused things leave whole and what the signal becomes hangs from
 * the way where they stood, judgments, data assets and actions, carried along the way to the others at its end, with
 * the qualities the others rely on under them. C, C2 and D (02.3-02.5) are drawn by tasks.js. */

import { link } from "../../drawing/links.js";
import { dot, flowDot, line, measure } from "../../drawing/strokes.js";
import { clearOfTitle } from "../../framing/chapters.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, nameText, rejectedName } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { cue } from "../../timing/cues.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { glide } from "../p01/failures.js";
import { agents, guidePage, handedMark, outputMark, people, toAndFro, wave } from "./marks.js";
import { stageForm, stageOutcomes, taskCues } from "./tasks.js";

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
      cue(s, "能用到哪里", "clear limits"),
    ],
    ...taskCues(s),
  };
}

/* A: the guidelines open as a booklet, wide enough with its two names that the opening's picture covers a tenth of
 * the frame by its second second. It stands centred under the rising title, at full ink as the voice begins, until the
 * members come, then glides up as one to leave the row of members and Agents room below it. The members stand left of
 * the centre and the Agents right of it, so the picture stays within 90 px of the centre while the members wait. */
const PAGE = { w: 400, h: 350 },
  PAGE_TOP = [300, 170],
  ROW = 700,
  MEMBERS = [620, 680, 740],
  AGENTS = [1180, 1240],
  ROW_NAMES = ROW + 22 + NAME_GAP;
function stageGuide(s, t, a, c) {
  // The booklet stands where it and its two names, one at each side, are centred on the frame.
  const x =
    960 -
    PAGE.w / 2 -
    (measure(L("契约", "Contract")) - measure(L("这份指南", "The guidelines"))) / 2;
  const top = glide(t, PAGE_TOP[0], [[c.members, PAGE_TOP[1]]]),
    g = a * clearOfTitle(s, t, top),
    bottom = top + PAGE.h,
    mid = PAGE_TOP[1] + PAGE.h + 76,
    agentsX = (AGENTS[0] + AGENTS[1]) / 2;
  const sealAt = guidePage(x, top, PAGE.w, PAGE.h, {
    alpha: g * ramp(t, s.voice_start - 0.4, 0.35),
    seal: ramp(t, c.seal - 0.15, 0.4),
    stamp: ramp(t, c.stamp - 0.1, 0.35),
  });
  nameText(L("这份指南", "The guidelines"), x - NAME_GAP, top + PAGE.h / 2, {
    align: "right",
    alpha: g * named(t, c.guide),
  });
  nameText(L("契约", "Contract"), x + PAGE.w + NAME_GAP, sealAt[1], {
    align: "left",
    alpha: g * named(t, c.seal),
  });
  // The members, joined to the page once it has glided up; the Agents, joined on their own words.
  const members = g * ramp(t, c.members - 0.15, 0.4),
    agentsOn = g * ramp(t, c.agents - 0.15, 0.4);
  people(MEMBERS, ROW, { alpha: members });
  link(x + PAGE.w * 0.25, bottom, MEMBERS[1], ROW - 36, {
    route: "vhv",
    mid,
    alpha: members,
    upto: soon(t, c.members + 0.6, 0.5),
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
    upto: soon(t, Math.max(c.agents, c.members + 0.6) + 0.05, 0.5),
  });
  nameText(L("智能体", "Agents"), agentsX, ROW_NAMES, {
    valign: "top",
    alpha: g * named(t, c.agents),
  });
  // The delegation runs from the members to the Agents, a point travelling along it once it has reached them.
  const reach = soon(t, c.delegate + 0.05, 0.8);
  link(MEMBERS[2] + 34, ROW, AGENTS[0] - 34, ROW, {
    alpha: g * ramp(t, c.delegate - 0.15, 0.4),
    upto: reach,
    width: 2.5,
    flow: reach > 0.99 ? (voiceTime(t) * 0.45) % 1 : null,
  });
  nameText(L("委托", "Delegation"), 960, ROW_NAMES, {
    valign: "top",
    alpha: g * named(t, c.delegate),
  });
}

/* B and B2: the way across the frame, from a point at its start to a point at its end, its name over its middle. The
 * marks on the way (the signal at its left, the others beyond its end) are named over or under themselves; the things
 * hanging below it are named under themselves on one baseline, the refused things in B and what the signal becomes in
 * B2, in the same places. The others stand beyond the way's end, so the way keeps its extent through both stages. */
const WAY_Y = 450,
  WAY = [360, 1560],
  WAVE_END = 470,
  HANG_Y = 530,
  HANG_NAMES = HANG_Y + 32 + NAME_GAP,
  HANDED_X = [600, 840, 1080, 1320],
  OUTPUT_X = [720, 960, 1200],
  OTHERS = [1594, 1640],
  OTHERS_X = 1617,
  OVER = WAY_Y - 7 - NAME_GAP;
const HANDED = () =>
  L(["一个文件", "一张表", "一份报告", "一个流程"], ["A file", "A table", "A report", "A process"]);
const OUTPUTS = () => L(["判断", "数据资产", "行动"], ["Judgments", "Data assets", "Actions"]);
const QUALITIES = () =>
  L(["讲得清", "经得起查", "能用到哪里"], ["Explained", "Checked", "Clear limits"]);
/* The way, its name, and the signal at its left from the signal's words: the wave takes the way's first stretch. */
function theWay(t, a, c, end) {
  const signal = ramp(t, c.signal - 0.15, 0.4),
    start = t >= c.signal - 0.15 ? WAVE_END : WAY[0];
  line(start, WAY_Y, end, WAY_Y, { color: P.line, alpha: a, width: 3.5 });
  dot(WAY[1], WAY_Y, 6, { color: P.line, alpha: a });
  if (t < c.signal - 0.15) dot(WAY[0], WAY_Y, 6, { color: P.line, alpha: a });
  wave(WAY[0], WAVE_END, WAY_Y, voiceTime(t) * 5, { alpha: a * signal });
  nameText(L("工作的价值", "The value of data work"), 960, OVER, {
    valign: "bottom",
    alpha: a * named(t, c.value),
  });
  nameText(L("现实里的信号", "Signals from the world"), (WAY[0] + WAVE_END) / 2, OVER, {
    valign: "bottom",
    alpha: a * named(t, c.signal),
  });
}
function stageHanded(t, a, c) {
  theWay(t, a, c, WAY[1]);
  HANDED().forEach((v, k) => {
    const on = a * listIn(t, c.handed, k);
    handedMark(k, HANDED_X[k], HANG_Y, { alpha: on });
    rejectedName(v, HANDED_X[k], HANG_NAMES, {
      valign: "top",
      alpha: on,
      mark: ramp(t, c.handed[k] + 0.05, 0.3),
      set: "handed",
    });
  });
}
function stageOutputs(t, a, c) {
  const vt = voiceTime(t),
    end = WAY[1];
  theWay(t, a, c, end);
  // Points travel the way from the signal to the others once they stand at its end.
  const q = (vt * 0.3) % 1;
  if (t > c.others) flowDot(mix(WAVE_END, end, q), WAY_Y, 6, q, { color: P.evidence, alpha: a });
  OUTPUTS().forEach((v, k) => {
    const on = a * ramp(t, c.outputs[k] - 0.15, 0.4);
    line(OUTPUT_X[k], WAY_Y + 2, OUTPUT_X[k], HANG_Y - 32, { color: P.line, alpha: on, width: 2 });
    outputMark(k, OUTPUT_X[k], HANG_Y, { alpha: on, run: toAndFro(vt) });
    nameText(v, OUTPUT_X[k], HANG_NAMES, {
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
  QUALITIES().forEach((v, k) =>
    nameText(v, OTHERS_X, own.bottom + 18 + k * 40, {
      valign: "top",
      size: NOTE,
      color: P.muted,
      alpha: a * listIn(t, c.qualities, k),
      set: "qualities",
    }),
  );
}

scenes["02"] = function (s, t) {
  const c = cuesOf(s);
  const A = stageOut(t, c.value),
    B = stageIn(t, c.value) * stageOut(t, c.becomes),
    B2 = stageIn(t, c.becomes) * stageOut(t, c.task);
  if (A > 0) stageGuide(s, t, A, c);
  if (B > 0) stageHanded(t, B, c);
  if (B2 > 0) stageOutputs(t, B2, c);
  stageOutcomes(t, c);
  stageForm(t, c);
};
