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
    // Each layer stands with its name on its words, the words the sync audit takes for it. In Chinese they are the
    // words each name takes (止住影响, 修掉, 防止它再发生), the first two said after the actions the timeline above
    // shows; in English "contain the damage" and "to repair", and for Prevention "did not prevent", a word before
    // "prevent" in the question the third layer answers, so its name leads it by less than LEAD (p05/kit.js).
    layers: cues(s, [
      ["止住影响", "contain the damage"],
      ["修掉", "to repair"],
      ["防止它再发生", "did not prevent"],
    ]),
    // The third layer is said from these words: the second layer's light ends on them, as each layer's does when the
    // next is said, though the English third layer stands only on its own words.
    last: cue(s, "防止它再发生", "Last, guard against a recurrence"),
    missing: cue(s, "缺的数据", "the missing data"),
    fill: cue(s, "补上", "fill in"),
    earlier: cue(s, "提前启动", "start the job earlier"),
    safeguard: cue(s, "刚好够用的防护", "lightest safeguard"),
    firstTwo: cue(s, "只做前两层", "Doing only the first two"),
    notFix: cue(s, "不算治本", "Doing only the first two"),
    systemic: cue(s, "治本", "systemic fix"),
    asks: cues(s, [
      ["讲清现有的工作体系", "explain why"],
      ["预防", "prevent"],
      ["发现", "detect"],
    ]),
    first3: cue(s, "决策负责人批准", "The decision owner approves"),
    stations: cues(s, [
      ["决策负责人批准", "The decision owner approves"],
      ["划定了范围", "its limits"],
      ["改动只在这个范围里做", "The job is changed"],
      ["当前的运行", "The runs since the change"],
      ["话只说到", "The claim stays"],
      ["最后验收", "Then come acceptance"],
      ["从中学习", "and learning"],
    ]),
    chainClause: cue(s, "这是一条信任链", "This is a chain of trust"),
    chain: cue(s, "信任链", "chain of trust"),
    lighter: cue(s, "手续可以随风险变轻", "less process"),
    // The skipped link is drawn and named on its words, in English "skip a link", which its name's stems repeat in
    // order, so the sync audit times it (EN15-n9).
    skip: cue(s, "但一环都不能少", "skip a link"),
    first5: cue(s, "汇报时", "Report the state"),
    stateClause: cue(s, "说做到哪一步", "Report the state"),
    state: cue(s, "哪一步", "the state"),
    // The effort's bar inks from the first words of its clause, 「不说」 in Chinese, and its name comes on its own words,
    // in Chinese 「力气」, which claims.js leads by at most LEAD (ZH15-n1); in English both come on "not the effort".
    effortClause: cue(s, "不说", "not the effort"),
    effort: cue(s, "力气", "not the effort"),
    first5b: cue(s, "核验通过了", "Verified means"),
    bounds: cues(s, [
      ["对象", "subject"],
      ["版本", "version"],
      ["环境", "environment"],
      ["限度", "limit"],
    ]),
    published: cue(s, "发布到约定的地方", "the agreed destination"),
    notMean: cue(s, "不代表有人在用", "does not mean anyone uses the result"),
    inUse: cue(s, "有人在用", "anyone uses the result"),
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
    // What a passing test does not make stands from the words that say it, 「整体正确或已验收」/ "overall correctness
    // nor acceptance", so the test's sheet does not stand alone through the English line's 2 s before "acceptance".
    acceptance: cue(s, "整体正确或已验收", "overall correctness nor acceptance"),
    // The two states a passing test does not make are named each on its own words (ZH13-n1, ZH13-n2, EN13-n15).
    correct: cue(s, "整体正确", "overall correctness"),
    agentSays: cue(s, "智能体说完成了", "And an Agent reporting completion"),
    complete: cueFrom(s, "也不等于完成了", "the work complete", 0),
  };
  // The earlier start is first said in 06.2 in Chinese, so the one that is approved is cued from 06.3's first words.
  c.approved = cueFrom(s, "任务提前启动", "an earlier start", c.first3);
  // "acceptance" is said in 06.3 already, so the refused acceptance of 06.6 is cued from its test.
  c.accepted = cueFrom(s, "已验收", "acceptance", c.test);
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
