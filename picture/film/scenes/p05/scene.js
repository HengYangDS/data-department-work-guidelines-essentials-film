/* 05 Data that means what it says. Saying data is usable takes evidence, and what merely looks right establishes nothing
 * (05.1); before using it, six questions, and data that cannot answer stays inside its authorized scope (05.2); last
 * night's prices, on the timeline and in a backtest, with the history of the patched data (05.3); what could be known
 * then against what is seen in hindsight (05.4); and the views derived from data, none of which may quietly become the
 * source of truth (05.5). Each thought's stage cuts in on its first words. The Illustrative chip stands while the
 * made-up case shows (05.3-05.4). */

import { illustrative } from "../../framing/chapters.js";
import { cue, cueFrom, cues } from "../../timing/cues.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { evidenceStage, fitStage, questionsStage, scopeStage, viewsStage } from "./data.js";
import { hindsightStage, nightStage } from "./night.js";

/* The spoken cues, in the order they are said. */
function cuesOf(s) {
  const c = {
    first1: cue(s, "说数据能用", "Calling data usable"),
    evidence: cue(s, "证据", "evidence"),
    nonProofs: cues(s, [
      ["能打开的文件", "A file that opens"],
      ["好看的图", "a chart that looks good"],
      ["看起来有效的模型信号", "a promising model signal"],
    ]),
    refuse: cue(s, "本身都证明不了", "none of them alone"),
    unknowns: cues(s, [
      ["含义", "meaning"],
      ["质量", "quality"],
      ["使用权限", "permission"],
      ["复现", "reproducibility"],
    ]),
    first1b: cue(s, "数据要先证明适合", "Data earns trust"),
    fit: cue(s, "证明适合", "shown fit"),
    use: cue(s, "具体用途", "a specific use"),
    trust: cue(s, "可信", "earns trust"),
    first2: cue(s, "用之前", "So before relying"),
    sixClause: cue(s, "先问六个问题", "So before relying"),
    six: cue(s, "六个问题", "six questions"),
    asks: cues(s, [
      ["它从哪里来", "Where did it come from"],
      ["最早什么时候能拿到", "When did it become available"],
      ["是什么意思", "What does it mean"],
      ["被什么改过", "What changed it"],
      ["质量怎么样", "How good is it"],
      ["能用在哪里", "And how may it be used"],
    ]),
    first2b: cue(s, "说不清这些的数据", "Data that cannot answer"),
    explore: cue(s, "探索", "explored"),
    scopeClause: cue(s, "可以在授权范围里探索", "Data that cannot answer"),
    scope: cue(s, "授权范围", "authorized scope"),
    staysOut: cue(s, "可要拿去", "but stays out"),
    uses: cues(s, [
      ["共享", "shared"],
      ["投产", "production"],
      ["做决策", "decision work"],
    ]),
    first3: cue(s, "昨晚那份价格", "Last night's prices"),
    measure: cue(s, "比平时", "two hours later"),
    usual: cue(s, "平时", "usual"),
    backtest: cue(s, "回测", "backtest"),
    later: cue(s, "晚到的时间", "that later time"),
    patched: cue(s, "连夜补上的数据", "The data patched in overnight"),
    who: cue(s, "谁补的", "who added it"),
    where: cue(s, "从哪里补的", "from where"),
    first4: cue(s, "做历史研究", "In historical research"),
    then: cue(s, "当时能知道什么", "what could have been known"),
    hindsight: cue(s, "事后看到了什么", "seen in hindsight"),
    corrected: cue(s, "修正过价格", "corrected its prices"),
    series: cue(s, "修正后的数据", "corrected series"),
    cannot: cue(s, "就证明不了", "cannot show"),
    first5: cue(s, "报告", "Reports"),
    views: cues(s, [
      ["报告", "Reports"],
      ["数据目录", "catalogs"],
      ["缓存", "caches"],
      ["智能体的摘要", "Agent summaries"],
    ]),
    derived: cue(s, "派生出来的", "derived"),
    become: cue(s, "不能悄悄变成", "none may quietly become"),
    truth: cue(s, "权威来源", "source of truth"),
  };
  c.fit2 = cueFrom(s, "证明它适合", "shown fit", c.first2b);
  return c;
}

scenes["05"] = function (s, t) {
  const c = cuesOf(s);
  const A = stageOut(t, c.first1b),
    A2 = stageIn(t, c.first1b) * stageOut(t, c.first2),
    B = stageIn(t, c.first2) * stageOut(t, c.first2b),
    B2 = stageIn(t, c.first2b) * stageOut(t, c.first3),
    C = stageIn(t, c.first3) * stageOut(t, c.first4),
    D = stageIn(t, c.first4) * stageOut(t, c.first5),
    E = stageIn(t, c.first5);
  if (A > 0) evidenceStage(s, t, c, A);
  if (A2 > 0) fitStage(s, t, c, A2);
  if (B > 0) questionsStage(s, t, c, B);
  if (B2 > 0) scopeStage(s, t, c, B2);
  if (C > 0) nightStage(s, t, c, C);
  if (D > 0) hindsightStage(s, t, c, D);
  if (E > 0) viewsStage(s, t, c, E);
  illustrative(C + D);
};
