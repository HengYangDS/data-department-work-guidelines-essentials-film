/* 05 Data that means what it says. Saying data is usable takes evidence, and what merely looks right establishes
 * nothing (05.1); before using it, six questions, and data whose meaning, quality or earliest availability is still
 * unclear stays inside its authorized scope (05.2); last night's prices, on the timeline and in a backtest (05.3);
 * what could be known then against what is seen in hindsight (05.4); and the views that hang from data, none of which
 * may quietly be treated as the source of truth (05.5). Each thought's stage cuts in on its first words. The
 * Illustrative chip stands while the made-up case shows (05.3-05.4). */

import { illustrative } from "../../framing/chapters.js";
import { cue, cueFrom, cues } from "../../timing/cues.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { evidenceStage, fitStage, questionsStage, scopeStage, viewsStage } from "./data.js";
import { hindsightStage, nightStage } from "./night.js";

/* The spoken cues, in the order they are said. */
function cuesOf(s) {
  const evidence = cue(s, "证据", "evidence");
  const c = {
    first1: cue(s, "说数据能用", "Calling data usable"),
    evidence,
    nonProofs: [
      // The file stands on its own word: 「文件」 comes half a second into its Chinese clause, 「能打开的文件」, and a
      // name leads its words by at most LEAD (kit.js; ZH14-n1).
      cueFrom(s, "文件", "A file that opens", evidence),
      ...cues(s, [
        ["好看的图", "a chart that looks good"],
        ["模型信号", "model signal"],
      ]),
    ],
    refuse: cue(s, "本身都说明不了", "none of them alone"),
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
    sixClause: cue(s, "先答清六个问题", "So before relying"),
    six: cue(s, "六个问题", "six questions"),
    // Each question's station fills as it is asked; the English last on "may it be used", so its name, Use, stands
    // within half a second of "used" (EN9-n6), and the second on "become available", so Availability stands within
    // 0.45 s of "available" in its own question (EN12-n6).
    asks: cues(s, [
      ["它从哪里来", "Where did it come from"],
      ["最早什么时候能拿到", "become available"],
      ["含义是什么", "What does it mean"],
      ["被什么改过", "What changed it"],
      ["质量怎么样", "How good is it"],
      ["能用在哪里", "may it be used"],
    ]),
    // The scope's stage cuts in on the words that name its data: in English its first words, and in Chinese
    // 「还说不清」, which follow the three unknowns, so the six questions' ring, whose stations name them, stands while
    // they are said.
    first2b: cue(s, "还说不清", "Data with unknown meaning"),
    explore: cue(s, "探索", "explored"),
    scopeClause: cue(s, "可以在授权范围里探索", "Data with unknown meaning"),
    scope: cue(s, "授权范围", "authorized scope"),
    staysOut: cue(s, "但若用于", "but must stay out"),
    uses: cues(s, [
      ["共享", "sharing"],
      ["投产", "production"],
      ["做决策", "decisions"],
    ]),
    first3: cue(s, "昨晚那份价格", "Last night's prices"),
    usual: cue(s, "平时", "usual"),
    backtest: cue(s, "回测", "backtest"),
    later: cue(s, "晚到的时间", "that later time"),
    first4: cue(s, "做历史研究", "In historical research"),
    // What could be known then: its card stands from the clause that says it, so the stage has it two seconds in, and
    // its name at most LEAD ahead of its own words (night.js).
    thenClause: cue(s, "当时能知道什么", "what could have been known"),
    then: cue(s, "当时能知道什么", "known then"),
    hindsight: cue(s, "事后看到了什么", "seen in hindsight"),
    corrected: cue(s, "修正过价格", "corrected its prices"),
    series: cue(s, "修正后的数据", "corrected series"),
    cannot: cue(s, "就证明不了", "cannot show"),
    first5: cue(s, "报告", "No report"),
    views: cues(s, [
      ["报告", "report"],
      ["数据目录", "catalog"],
      ["缓存", "cache"],
      ["智能体的摘要", "Agent summary"],
    ]),
    become: cue(s, "不能悄悄被当成", "may quietly be treated as"),
    truth: cue(s, "权威来源", "source of truth"),
  };
  c.fit2 = cueFrom(s, "证明它适合", "qualified", c.first2b);
  // The Chinese names the arrival on the words that say when the prices could first be had, in 05.3, since 05.2 says
  // 最早能拿到 first; the English names it "Arrival" on "reached us", the words that say it (EN15-n11). The voice's own
  // words "Reached us" would raise the stage's labels to 90 % of the caption "Last night's prices reached us two hours
  // later than usual,", an echo the gate records (EN15-n6), against 70 % with "Arrival".
  c.arrival = cueFrom(s, "最早能拿到", "reached us", c.first3);
  // The two hours draw on and are named on their own words: in Chinese 「晚了两个小时」, half a second after 「比平时」
  // opens the clause, so the name leads its words by at most LEAD (ZH14-n1); in English "two hours later".
  c.measure = cueFrom(s, "晚了两个小时", "two hours later", c.first3);
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
