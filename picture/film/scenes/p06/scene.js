/* 06 Evidence sets the limit of the claim. Back to last night: the publication was on time and our own job started
 * late (06.1); the fix's three layers on the timeline (06.2); the chain of trust (06.3); report the state, and what
 * verification, publication and use each establish (06.4); a completion claim and its questions (06.5); and two states
 * that do not make the next (06.6). Each thought's stage cuts in on its first words. The Illustrative chip stands while
 * the made-up case shows (06.1-06.3). */

import { illustrative } from "../../framing/chapters.js";
import { cue, cueFrom, cues } from "../../timing/cues.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { chainStage, claimStage, pairsStage, stateStage, verifiedStage } from "./claims.js";
import { backStage, layersStage } from "./night.js";

/* The spoken cues, in the order they are said. */
function cuesOf(s) {
  const c = {
    first1: cue(s, "回到昨晚", "Back to last night"),
    night: cue(s, "昨晚", "last night"),
    checked: cue(s, "查过发布时间", "The publication time"),
    publication: cue(s, "发布时间", "publication time"),
    log: cue(s, "任务日志", "job log"),
    onTime: cue(s, "按时发布", "was on time"),
    lateJob: cue(s, "任务启动晚了", "job started late"),
    first2: cue(s, "这件事要分三层处理", "The fix has three layers"),
    three: cue(s, "三层", "three layers"),
    // Each layer stands with its name from the first words of its clause, except the Chinese first layer: its name,
    // 止住影响, is spoken after its action, 先把缺的数据补上, which the timeline above shows as it is said, so the layer
    // stands on its name's words rather than before them.
    layers: cues(s, [
      ["止住影响", "First, fill in"],
      ["再把任务提前启动", "Then start the job earlier"],
      ["最后是防止它再发生", "Last, stop it happening again"],
    ]),
    missing: cue(s, "缺的数据", "the missing data"),
    fill: cue(s, "补上", "fill in"),
    earlier: cue(s, "提前启动", "start the job earlier"),
    safeguard: cue(s, "刚好够用的防护", "lightest safeguard"),
    firstTwo: cue(s, "只做前两层", "Doing only the first two"),
    notFix: cue(s, "不算从根上修好", "Doing only the first two"),
    systemic: cue(s, "从根上修好", "systemic fix"),
    asks: cues(s, [
      ["弄清现有的系统", "work out why"],
      ["防住", "prevent"],
      ["发现", "catch"],
    ]),
    first3: cue(s, "决策负责人批准", "The decision owner approves"),
    stations: cues(s, [
      ["决策负责人批准", "The decision owner approves"],
      ["也划定了范围", "and sets its limits"],
      ["改动只在这个范围里做", "The job is changed"],
      ["当前的运行", "The runs since the change"],
      ["话只说到", "The claim stays"],
      ["最后验收", "Then come acceptance"],
      ["从中学习", "and learning"],
    ]),
    chainClause: cue(s, "这是一条信任链", "This is a chain of trust"),
    chain: cue(s, "信任链", "chain of trust"),
    lighter: cue(s, "手续可以随风险变轻", "lower risk means less process"),
    skip: cue(s, "但一环都不能少", "but the chain cannot skip"),
    first5: cue(s, "汇报时", "Report the state"),
    stateClause: cue(s, "说做到哪一步", "Report the state"),
    state: cue(s, "做到哪一步", "the state"),
    effort: cue(s, "不说花了多少力气", "not the effort"),
    first5b: cue(s, "核验通过了", "Verified means"),
    bounds: cues(s, [
      ["对象", "subject"],
      ["版本", "version"],
      ["环境", "environment"],
      ["限度", "limit"],
    ]),
    published: cue(s, "发布到了约定的地方", "Publication at the agreed destination"),
    notMean: cue(s, "不代表有人在用", "does not mean anyone uses it"),
    inUse: cue(s, "有人在用", "anyone uses it"),
    observed: cue(s, "实际看到了什么", "actually observed"),
    first6: cue(s, "每次说完成", "Every completion claim"),
    claim: cue(s, "说完成", "completion claim"),
    answers: cue(s, "都要答得上来", "must answer the same questions"),
    what: cue(s, "说的是什么", "What is claimed"),
    subject: cue(s, "针对哪个对象", "which subject and version"),
    signed: cue(s, "谁在什么时候", "Verified when"),
    covering: cue(s, "覆盖了什么", "Covering what"),
    unproved: cue(s, "还有什么没证明", "leaving what unproved"),
    narrow: cue(s, "就收窄说法", "narrow the claim"),
    inflate: cue(s, "别把话说大", "rather than inflate the wording"),
    first7: cue(s, "测试通过", "A passing test"),
    test: cue(s, "测试通过", "A passing test"),
    acceptance: cue(s, "不等于已经验收", "is not acceptance"),
    agentSays: cue(s, "智能体说完成了", "And an Agent reporting completion"),
    complete: cueFrom(s, "也不等于完成了", "does not make the work complete", 0),
  };
  // The earlier start is first said in 06.2 in Chinese, so the one that is approved is cued from 06.3's first words.
  c.approved = cueFrom(s, "任务提前启动", "an earlier start", c.first3);
  // "limits" is said in 06.3 already, so the bound is cued from the words that verify.
  c.bounds[3] = cueFrom(s, "限度", "limit", c.first5b);
  return c;
}

scenes["06"] = function (s, t) {
  const c = cuesOf(s);
  const A = stageOut(t, c.first2),
    B = stageIn(t, c.first2) * stageOut(t, c.first3),
    C = stageIn(t, c.first3) * stageOut(t, c.first5),
    E1 = stageIn(t, c.first5) * stageOut(t, c.first5b),
    E2 = stageIn(t, c.first5b) * stageOut(t, c.first6),
    F = stageIn(t, c.first6) * stageOut(t, c.first7),
    G = stageIn(t, c.first7);
  if (A > 0) backStage(s, t, c, A);
  if (B > 0) layersStage(s, t, c, B);
  if (C > 0) chainStage(s, t, c, C);
  if (E1 > 0) stateStage(s, t, c, E1);
  if (E2 > 0) verifiedStage(s, t, c, E2);
  if (F > 0) claimStage(s, t, c, F);
  if (G > 0) pairsStage(s, t, c, G);
  // The made-up case shows on the timeline through 06.1-06.3, whose chain stands under the story's earlier start.
  illustrative(A + B + C);
};
