/* 03 两种依据 / Two kinds of authority, chapter 03 五个要点 / Five essentials. A (03.1-03.2): under the rising chapter
 * title, the two kinds stand apart, joined under their one name: authority to act, a seal, at the left, and authority
 * about facts, a record with its check, at the right; a divider rises between them; the left kind is named with what
 * it answers. B (03.3, from 「有先后」/ "an order of precedence", the words that announce it): authority to act's
 * order of sources (order.js). C (03.4): the two kinds again, the right one now named with what it answers; from
 * 「能重复的观察」/ "repeatable observations" what can establish a fact, the primary record and the repeatable
 * observation arriving together so the stage opens balanced, and the leads that cannot (facts.js). D (03.5-03.6): last
 * night's case (case.js). E-F (03.7-03.8): the meeting as it should have run, and the two kinds that never stand in for
 * each other (close.js). Each stage cuts in on the first words of a thought, except C's second, whose stage names
 * nothing the first named, and B, which cuts in on the words that announce the order: from 03.3's first words its head
 * stood alone 324 px off the centre, its ranks still to come at its right, for 1.6 s of the n5 English, past the 1.5 s
 * a build-up may. */

import { illustrative } from "../../framing/chapters.js";
import { cue, cueFrom } from "../../timing/cues.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { stageCase } from "./case.js";
import { stageApart, stageMeeting } from "./close.js";
import { stageFacts } from "./facts.js";
import { twoKinds } from "./kinds.js";
import { LEAD_ORDER, LEADS } from "./marks.js";
import { stageOrder } from "./order.js";

/* The parts of each rank said as a list, one beat each over its station, from the rank's own words: a part the
 * segment says earlier is taken there (制度 / "policies"). The second rank is one decision, said as one part. */
const PARTS = [
  [
    ["法律", "Law"],
    ["监管", "regulation"],
    ["安全要求", "security"],
    ["公司的强制性", "mandatory"],
  ],
  [],
  [
    ["契约", "contracts"],
    ["制度", "policies"],
    ["规范", "specifications"],
    ["决策记录", "decision records"],
  ],
  [
    ["工作计划", "Work plans"],
    ["临时约定", "provisional"],
    ["个人偏好", "personal"],
  ],
];
const partsOf = (s, ranks) =>
  PARTS.map((parts, k) => parts.map(([zh, en]) => cueFrom(s, zh, en, ranks[k])));
/* 「观察」/ "observation" is first said of the facts' observations; 03.5's is said after the publication time. */
const checked = (s) => cue(s, "查过发布时间", "checks the publication time");

/* The spoken cues, in the order they are said. A phrase said twice takes its later occurrence through the words that
 * follow it only there (两种依据，不能 / "Neither kind"). */
function cuesOf(s) {
  const c = {
    two: cue(s, "两种依据", "Two kinds of authority"),
    apart: cue(s, "分开看", "stay apart"),
    act: cue(s, "行动依据", "Authority to act"),
    who: cue(s, "谁可以决定", "who may decide"),
    // The order opens, and its span grows, on the words that announce it, 「有先后」/ "an order of precedence".
    order: cue(s, "有先后", "an order of precedence"),
    ranks: [
      cue(s, "最先是法律", "Law"),
      cue(s, "决策负责人作出", "what the decision owner"),
      cue(s, "有效的契约", "contracts"),
      cue(s, "工作计划", "Work plans"),
    ],
    another: cue(s, "另一种", "Authority about facts"),
    facts: cue(s, "事实依据", "Authority about facts"),
    what: cue(s, "靠什么认定", "what can establish"),
    primary: cue(s, "优先看原始记录", "primary records"),
    observe: cue(s, "能重复的观察", "repeatable observations"),
    state: [
      cue(s, "来源", "a source"),
      cue(s, "时间对象", "time"),
      cue(s, "对象和范围", "subject"),
      cue(s, "范围转述", "scope"),
    ],
    leads: LEAD_ORDER().map((k) => cue(s, ...LEADS[k])),
    unverified: cue(s, "都未经核实", "are unverified"),
    onlyLeads: cue(s, "线索", "leads"),
  };
  return { ...c, parts: partsOf(s, c.ranks), ...caseCues(s), ...closeCues(s) };
}
function caseCues(s) {
  const choice = cue(s, "要不要换供应商", "Whether to change vendors");
  return {
    night: cue(s, "拿昨晚的事来说", "Take last night"),
    lastNight: cue(s, "昨晚", "last night"),
    collection: cue(s, "采集", "The collection"),
    late: cue(s, "晚了两个小时", "two hours late"),
    log: cue(s, "日志", "the log"),
    fact: cue(s, "这是事实", "that is a fact"),
    vendorLate: cue(s, "供应商发布晚了", "The vendor's late publication"),
    hypothesis: cue(s, "假设", "a hypothesis"),
    checks: cue(s, "查过发布时间", "checks the publication time"),
    observation: cueFrom(s, "观察", "observation", checked(s)),
    refute: cue(s, "推翻", "refute"),
    choice,
    isChoice: cue(s, "选择", "a choice"),
    owner: cueFrom(s, "决策负责人", "decision owner", choice),
  };
}
function closeCues(s) {
  return {
    meeting: cue(s, "开头那场会", "The meeting at the start"),
    meetingName: cue(s, "那场会", "The meeting"),
    before: cue(s, "会前", "Before it"),
    items: [
      cue(s, "要决定什么", "what is to be decided"),
      cue(s, "谁必须参加", "who must attend"),
      cue(s, "需要哪些材料", "which inputs"),
    ],
    ends: cue(s, "散会时", "When it ends"),
    decision: cue(s, "有了决定", "reach a decision"),
    whoDoes: cue(s, "谁去做", "who does what"),
    byWhen: cue(s, "什么时候做完", "by when"),
    done: cue(s, "怎样算完成", "what counts as done"),
    missing: cue(s, "还缺什么", "still missing"),
    orSay: cue(s, "要么说清", "or say"),
    neither: cue(s, "两种依据不能", "Neither kind"),
    substitute: cue(s, "互相替代", "stands in for"),
    falseTrue: cue(s, "假的变成真的", "false fact"),
    permission: cue(s, "动手的权限", "permission to act"),
    request: cue(s, "经授权的要求", "an authorized request"),
    verified: cue(s, "核实过的事实", "verified facts"),
    conflict: cue(s, "冲突时", "conflicts"),
    report: cue(s, "讲出冲突和影响", "report the conflict"),
    alter: cue(s, "不改记录", "alter the record"),
    oneSide: cue(s, "其中一方", "one side"),
  };
}

scenes["03"] = function (s, t) {
  const c = cuesOf(s);
  const A = stageOut(t, c.order),
    B = stageIn(t, c.order) * stageOut(t, c.another),
    C1 = stageIn(t, c.another) * stageOut(t, c.primary),
    C2 = stageIn(t, c.primary) * stageOut(t, c.night),
    D = stageIn(t, c.night) * stageOut(t, c.meeting),
    E = stageIn(t, c.meeting) * stageOut(t, c.neither),
    F = stageIn(t, c.neither);
  if (A > 0) twoKinds(s, t, A, c);
  if (B > 0) stageOrder(t, B, c);
  if (C1 > 0) twoKinds(s, t, C1, c, { facts: true });
  if (C2 > 0) stageFacts(t, C2, c);
  if (D > 0) stageCase(t, D, c);
  if (E > 0) stageMeeting(t, E, c);
  if (F > 0) stageApart(t, F, c);
  illustrative(Math.max(D, E));
};
