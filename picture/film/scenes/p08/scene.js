/* 08 Making the next attempt better. Before calling last night fixed, a check is left: a monitor on the schedule
 * (08.1), and learning aims at the next failure, not at more files; the early signs and the safeguard that must not
 * wait (08.2); the monitor's owner and later look, and when a rule is retired (08.3); and the price data's next user,
 * with what a judgment owes to the next person (08.4). Each thought's stage cuts in on its first words. The Illustrative
 * chip stands while the made-up case shows (08.1 A, 08.2, 08.3 C, 08.4 E1). */

import { clearOfTitle, illustrative } from "../../framing/chapters.js";
import { cue, cueFrom, cues } from "../../timing/cues.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { LANES_TOP, aimStage, lanesStage, signsStage } from "./lanes.js";
import { aimsStage, monitorStage, nextUserStage, retireStage } from "./rules.js";

/* The spoken cues, in the order they are said; words the part says more than once are cued from their thought. */
function cuesOf(s) {
  const c = {
    first1: cue(s, "这种延迟", "This kind of delay"),
    recur: cue(s, "还会出现", "can recur"),
    fixed: cue(s, "修好了", "fixed"),
    schedule: cue(s, "调度", "the schedule"),
    monitor: cue(s, "监控", "a monitor"),
    agreed: cue(s, "约定时间", "the agreed time"),
    warns: cue(s, "告警", "warns"),
    first1b: cue(s, "学习的目的", "The aim of learning"),
    aim: cue(s, "学习的目的", "The aim of learning"),
    gains: cues(s, [
      ["更早被发现", "find the next failure earlier"],
      ["更容易判断", "judge it more easily"],
      ["少靠人救火", "need less manual rescue"],
    ]),
    notFiles: cue(s, "不是让", "not to increase"),
    files: cue(s, "文件变多", "the file count"),
    first2: cue(s, "出事之前", "There may have been early signs"),
    signsClause: cue(s, "可能早有苗头", "There may have been early signs"),
    signs: cue(s, "苗头", "early signs"),
    changes: cue(s, "这些小变化", "to rescue the run"),
    minutes: cue(s, "偶尔晚几分钟", "a few minutes late"),
    rescue: cue(s, "一再临时救场", "stepping in again and again"),
    look: cues(s, [
      ["规律", "pattern"],
      ["影响", "impact"],
      ["走向", "direction"],
    ]),
    guard: cue(s, "该有的防护", "a safeguard that is needed"),
    wait: cue(s, "等出了事", "wait for an incident"),
    first3: cue(s, "那个监控", "The monitor needs"),
    look3: cue(s, "复查", "a later look"),
    earlier: cue(s, "更早发现了问题", "caught problems earlier"),
    first3b: cue(s, "一条规则", "Retire a rule"),
    rule3: cue(s, "一条规则", "a rule"),
    retire: cues(s, [
      ["失去适用对象", "nothing left to govern"],
      ["没人在用", "has no user"],
      ["和权威来源重复", "duplicates"],
      ["得不偿失", "costs more"],
    ]),
    retired: cue(s, "撤掉", "Retire"),
    lift: cue(s, "就该撤掉", "costs more"),
    first4: cue(s, "回到开头那份数据", "Back to the price data"),
    data: cue(s, "那份数据", "the price data"),
    user: cue(s, "下一位用它的人", "Its next user"),
    needs: cues(s, [
      ["清楚的含义", "clear meaning"],
      ["当时能拿到的事实", "the facts available"],
      ["对得上说法的证据", "evidence that matches"],
      ["获准的", "a permitted"],
    ]),
    first4b: cue(s, "把判断讲给别人", "And when you convey a judgment"),
    other: cue(s, "别人", "someone else"),
    aims: cues(s, [
      ["先求信", "be faithful first"],
      ["再求达", "then clear"],
      ["再求雅", "then elegant"],
    ]),
  };
  c.monitor3 = cueFrom(s, "监控", "The monitor", c.first3);
  c.owner = cueFrom(s, "有人负责", "an owner", c.first3);
  return c;
}

scenes["08"] = function (s, t) {
  const c = cuesOf(s);
  const A = stageOut(t, c.first1b),
    A2 = stageIn(t, c.first1b) * stageOut(t, c.first2),
    B = stageIn(t, c.first2) * stageOut(t, c.first3),
    C = stageIn(t, c.first3) * stageOut(t, c.first3b),
    D = stageIn(t, c.first3b) * stageOut(t, c.first4),
    E1 = stageIn(t, c.first4) * stageOut(t, c.first4b),
    E2 = stageIn(t, c.first4b);
  if (A > 0) lanesStage(s, t, c, A);
  if (A2 > 0) aimStage(s, t, c, A2);
  if (B > 0) signsStage(s, t, c, B);
  if (C > 0) monitorStage(s, t, c, C);
  if (D > 0) retireStage(s, t, c, D);
  if (E1 > 0) nextUserStage(s, t, c, E1);
  if (E2 > 0) aimsStage(s, t, c, E2);
  // The chip of the made-up case comes in with the case's first stage, as its marks clear the rising chapter title,
  // not with the chapter card before it.
  illustrative(A * clearOfTitle(s, t, LANES_TOP) + B + C + E1);
};
