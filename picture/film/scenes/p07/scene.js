/* 07 Human-AI collaboration. People and Agents in one relationship: the Agent extends people's capacity to investigate,
 * reason and act inside a delegated boundary, never their authorization or commitments, and direction, authorization,
 * decisions and the responsibility for consequences stay with people (07.1); the ten pages and the decision that should
 * have come first (07.2); a clear boundary and the five things a delegation states (07.3); last night's delegation
 * (07.4); and who answers for an Agent's work (07.5). Each thought's stage cuts in on its first words. The Illustrative
 * chip stands while the made-up case shows (07.2, 07.4). */

import { illustrative } from "../../framing/chapters.js";
import { cue, cueFrom, cues } from "../../timing/cues.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { callerStage, delegationStage } from "./delegation.js";
import { boundaryStage, collaborationStage, pagesStage } from "./people.js";

/* The spoken cues, in the order they are said; words the part says more than once are cued from their thought. */
function cuesOf(s) {
  const c = {
    first1: cue(s, "在人与人工智能的协作里", "In human–AI collaboration"),
    collab: cue(s, "人与人工智能的协作", "human–AI collaboration"),
    people: cue(s, "人", "people"),
    agent: cue(s, "智能体", "Agents"),
    boundary: cue(s, "委托的范围", "a delegated boundary"),
    extend: cue(s, "调查、推理和动手", "investigate"),
    refusals: cues(s, [
      ["组织的授权", "organizational authorization"],
      ["承诺", "commitments"],
    ]),
    first2: cue(s, "开头那十页分析", "Before the ten pages"),
    pages: cue(s, "十页分析", "the ten pages"),
    decision: cue(s, "哪个决定", "which decision"),
    first3: cue(s, "委托时要划清边界", "So delegate with a clear boundary"),
    clear: cue(s, "边界", "a clear boundary"),
    pile: cue(s, "只给一堆", "not a pile of context"),
    important: cue(s, "重要的委托", "A consequential delegation"),
    // Each of the five comes on its own words; the English acceptance on "will be accepted", so its name, Acceptance,
    // leads "accepted" by under LEAD (p05/kit.js; EN15-n9), where "how the result" led it by 0.85 s.
    five: cues(s, [
      ["目的和范围", "purpose and scope"],
      ["交什么", "the deliverable"],
      ["限制和权限", "the limits and permissions"],
      ["怎么验收", "will be accepted"],
      ["停下交接", "when to stop"],
    ]),
    first4: cue(s, "比如这样委托", "A delegation for last night"),
    delegation: cue(s, "这样委托", "A delegation for last night"),
    purposeClause: cue(s, "为了决定要不要换供应商", "To help decide whether to change vendors"),
    purpose: cue(s, "要不要换供应商", "whether to change vendors"),
    readOnly: cue(s, "只查不改", "Work read-only"),
    find: cue(s, "昨晚的发布时间", "find last night's"),
    times: cues(s, [
      ["发布时间", "publication time"],
      ["任务启动时间", "the time our job started"],
    ]),
    source: cue(s, "从哪里查到的", "where each time came from"),
    unverified: cue(s, "没法核实", "could not verify"),
    schedule: cue(s, "调度", "the schedule"),
    stop: cue(s, "停下来请示", "Stop and ask"),
    stopWay: cue(s, "要改调度", "Stop and ask"),
    first5: cue(s, "调用智能体的人", "The person who calls an Agent"),
    submit: cue(s, "提交", "Submitting"),
    vouch: cues(s, [
      ["看懂了", "understood"],
      ["检查过", "checked"],
      ["为后果负责", "accept responsibility"],
    ]),
  };
  const from = (zh, en, at) => cueFrom(s, zh, en, at);
  c.stays = [
    from("方向", "Direction", c.refusals[1]),
    from("授权", "authorization", c.refusals[1]),
    from("决定", "decisions", c.refusals[1]),
    from("后果的责任", "responsibility", c.refusals[1]),
  ];
  c.agent5 = from("智能体", "an Agent", c.first5);
  c.owns = [
    from("背景材料", "context", c.first5),
    from("权限", "permissions", c.first5),
    from("核验", "verification", c.first5),
    from("结果", "result", c.first5),
  ];
  return c;
}

scenes["07"] = function (s, t) {
  const c = cuesOf(s);
  const A = stageOut(t, c.first2),
    B = stageIn(t, c.first2) * stageOut(t, c.first3),
    C = stageIn(t, c.first3) * stageOut(t, c.first4),
    D = stageIn(t, c.first4) * stageOut(t, c.first5),
    E = stageIn(t, c.first5);
  if (A > 0) collaborationStage(s, t, c, A);
  if (B > 0) pagesStage(s, t, c, B);
  if (C > 0) boundaryStage(s, t, c, C);
  if (D > 0) delegationStage(s, t, c, D);
  if (E > 0) callerStage(s, t, c, E);
  illustrative(B + D);
};
