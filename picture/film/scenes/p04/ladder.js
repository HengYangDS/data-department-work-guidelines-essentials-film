/* D and E (04.5-04.8). D, from 「要留多少记录」/ "Risk sets the process": one spine of rising risk down the frame,
 * named over its top (in Chinese with the question it answers, 要留多少记录, before 看风险); three tiers join it on
 * their words, the work of each at the spine's left and, at its right, the record it needs, a document as large as its
 * risk calls for: one clear exchange; the existing work record; a written decision with what else it takes, said one by
 * one. On 「说成小事」/ "downplay" a work item below the first tier rises toward it and stops at a bar. E, from 「昨晚的
 * 事」/ "Last night's case", the made-up case: the highest tier's document at the left with its work, last night's
 * timeline compact at the right, its two possible fixes branching into the tier; the tier lights as it is said to belong
 * there; under them the independent review, a lens with what it examines, and at the right the author and the Agent,
 * whose own accounts stop at a bar before the lens. */

import { link } from "../../drawing/links.js";
import { blend } from "../../drawing/colour.js";
import { dot, flowDot, line, measure } from "../../drawing/strokes.js";
import { token } from "../../drawing/symbols.js";
import { lastNight } from "../../drawing/timeline.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, growName, nameText, rejectedName, termRow } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { glide } from "../p01/failures.js";
import { voiceTime } from "../../timing/pauses.js";
import { bar } from "../p03/marks.js";
import { lens, speaker, tierDoc } from "./marks.js";

/* The tiers: each one's work (a term and its qualifier, key words) and the record it needs (a document's size, its name
 * and what it holds). */
const WORK = () =>
  L(
    [
      ["局部、可逆", "无对外承诺"],
      ["跨角色、做得久", "几种方案、重大不确定"],
      ["生产、资金、敏感数据、合规", "删除覆盖、对外承诺、不可逆"],
    ],
    [
      ["Local, reversible work", "no external commitment"],
      ["Cross-role or lasting work", "competing options, material uncertainty"],
      [
        "Production, funds, sensitive data, compliance",
        "deletion, overwrite, external commitment, irreversibility",
      ],
    ],
  );
/* The second tier's record: Chinese says the record and then what it holds, English what it holds and then the
 * record, so English names the contents as the record's term and the record as its qualifier, each on its words. */
const recordAt = (c) => L(c.record, c.recordQual);
const RECORD = () =>
  L(
    [
      ["一次讲清", ["结论、依据、做法"]],
      ["现有的工作记录", ["问题、方案、做法、验收"]],
    ],
    [
      ["One clear exchange", ["conclusion, basis, action"]],
      ["Problem, options, execution path, acceptance", ["existing work record"]],
    ],
  );
/* The highest tier's record: a written decision and what else it takes, one name built part by part on two lines. */
const WRITTEN = () =>
  L(
    ["书面决定、", "明确授权、", "回滚预案、", "独立评审、", "由人验收"],
    [
      "A written decision, ",
      "explicit authorization, ",
      "rollback path, ",
      "independent review, ",
      "human sign-off",
    ],
  );
const WRITTEN_WIDTH = () => L(380, 560);
/* The spine's names: its name over its top, and in Chinese what it decides at its two sides, how much record and how
 * much process; English names the process at its right. */
const HEAD = () =>
  L(
    { top: "风险", left: "多少记录", right: "多少手续" },
    { top: "Risk", left: null, right: "Process" },
  );
const TIER_Y = [330, 520, 720],
  DOCS = [
    [52, 66],
    [80, 102],
    [112, 144],
  ],
  SPINE = [236, 820],
  /* The spine's side names stand this far from it, so the spine with its names covers a tenth of the frame. */
  HEAD_GAP = 70,
  TO_WORK = 40,
  TO_DOC = 64;
/* The spine's x at t: what stands at its left and at its right, the widest of each so far, is centred on the frame,
 * the ladder gliding as one just after the words of each part that widens it. */
function spineX(t, c) {
  const head = HEAD(),
    work = WORK().map(([v, q]) => TO_WORK + Math.max(measure(v), measure(q, NOTE))),
    records = [
      ...RECORD().map(
        ([v, q], k) => TO_DOC + DOCS[k][0] + NAME_GAP + Math.max(measure(v), measure(q[0], NOTE)),
      ),
      TO_DOC + DOCS[2][0] + NAME_GAP + WRITTEN_WIDTH(),
    ],
    parts = [
      [c.risk, head.left ? HEAD_GAP + measure(head.left) : 0, HEAD_GAP + measure(head.right)],
      ...c.tiers.map((at, k) => [at, work[k], 0]),
      [c.oneClear, 0, records[0]],
      [recordAt(c), 0, records[1]],
      [c.written[0], 0, records[2]],
    ].sort((p, q) => p[0] - q[0]);
  let left = 0,
    right = 0;
  const steps = parts.map(([at, l, r]) => {
    left = Math.max(left, l);
    right = Math.max(right, r);
    return [at, 960 + (left - right) / 2];
  });
  return glide(t, steps[0][1], steps.slice(1));
}
export function stageLadder(t, a, c) {
  const x = spineX(t, c),
    head = HEAD(),
    top = SPINE[0];
  line(x, top, x, SPINE[1], { color: P.line, alpha: a, width: 4 });
  // Its two ends are points, and a point runs down it in voice time: the risk rising.
  dot(x, top, 6, { color: P.line, alpha: a });
  dot(x, SPINE[1], 6, { color: P.line, alpha: a });
  const q = (voiceTime(t) * 0.2) % 1;
  flowDot(x, mix(top, SPINE[1], q), 6, q, { color: P.authority, alpha: a });
  nameText(head.top, x, top - 14 - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, L(c.riskWord, c.risk)),
  });
  if (head.left)
    nameText(head.left, x - HEAD_GAP, top + 12, { align: "right", alpha: a * named(t, c.risk) });
  nameText(head.right, x + HEAD_GAP, top + 12, { align: "left", alpha: a * named(t, c.process) });
  WORK().forEach(([term, qual], k) => {
    const y = TIER_Y[k],
      on = a * ramp(t, c.tiers[k] - 0.15, 0.4);
    line(x - 10, y, x + 10, y, { color: P.ink, alpha: on, width: 4 });
    termRow(t, [term], [c.tiers[k]], [qual], [c.tierQuals[k]], x - TO_WORK, y - 32, {
      align: "right",
      inline: false,
      alpha: a,
    });
  });
  // The records, each a document at the spine's right, named beside itself.
  const docX = x + TO_DOC;
  RECORD().forEach(([name, holds], k) => {
    const [w, h] = DOCS[k],
      at = k ? recordAt(c) : c.oneClear,
      on = a * ramp(t, at - 0.15, 0.4);
    tierDoc(docX + w / 2, TIER_Y[k], w, h, { alpha: on, rows: 2 + k });
    termRow(
      t,
      [name],
      [at],
      holds,
      [k ? L(c.recordQual, c.record) : c.clearQual],
      docX + w + NAME_GAP,
      TIER_Y[k] - 32,
      {
        align: "left",
        inline: false,
        alpha: a,
      },
    );
  });
  const [w3, h3] = DOCS[2];
  tierDoc(docX + w3 / 2, TIER_Y[2], w3, h3, {
    alpha: a * ramp(t, c.written[0] - 0.15, 0.4),
    rows: 4,
  });
  growName(t, WRITTEN(), c.written, docX + w3 + NAME_GAP, TIER_Y[2], {
    valign: "middle",
    size: NOTE,
    width: WRITTEN_WIDTH(),
    build: true,
    alpha: a,
  });
  // Downplaying: a work item below the first tier rises toward it and stops at a bar.
  const down = a * ramp(t, c.downplay - 0.15, 0.4),
    rise = soon(t, c.downplay + 0.05, 0.7),
    stop = TIER_Y[0] + 46;
  if (down > 0.01) {
    token(x, mix(TIER_Y[0] + 120, stop + 22, rise), { alpha: down, r: 9 });
    bar(x, stop, { alpha: down * ramp(t, c.downplay + 0.55, 0.2), length: 40 });
  }
  rejectedName(L("说成小事", "Downplaying work"), x - TO_WORK, TIER_Y[0] + 100, {
    align: "right",
    alpha: down,
    mark: ramp(t, c.downplay + 0.05, 0.3),
  });
}

/* E's places: the highest tier at the left, last night compact at the right, the review under them. */
const TIER = { x: 520, y: 350 },
  NIGHT = { x: 1360, y: 330, scale: 0.55 },
  FIX_Y = [318, 420],
  /* The upper group stands this much lower, centred on its own, until the review comes under it. */
  DROP = 120,
  LENS = { x: 520, y: 660, r: 30 },
  SPEAKERS = [1250, 1430],
  SPEAK_Y = 690;
export function stageReview(t, a, c) {
  const [w3, h3] = DOCS[2],
    lit = ramp(t, c.belongs - 0.15, 0.4),
    vt = voiceTime(t),
    dy = glide(t, DROP, [[c.review, 0]]),
    tierY = TIER.y + dy,
    nightY = NIGHT.y + dy;
  tierDoc(TIER.x, tierY, w3, h3, { alpha: a, color: blend(P.ink, P.authority, lit), rows: 4 });
  const [term, qual] = WORK()[2];
  termRow(t, [term], [-Infinity], [qual], [-Infinity], TIER.x, tierY + h3 / 2 + NAME_GAP, {
    align: "center",
    inline: false,
    alpha: a,
  });
  const night = lastNight(NIGHT.x, nightY, NIGHT.scale, {
    alpha: a,
    card: 1,
    flow: (vt * 0.25) % 1,
    names: { axis: { v: L("昨晚的事", "Last night's case"), alpha: named(t, c.lastCase) } },
  });
  // Its two possible fixes branch from the night into the tier, one list.
  L(
    ["换供应商", "改生产环境里的采集任务"],
    ["A new vendor", "Collection job in production"],
  ).forEach((v, i) => {
    const y = FIX_Y[i] + dy,
      on = a * ramp(t, c.fixes[i] - 0.15, 0.4);
    link(night.left - 6, i ? nightY + 4 : nightY - 4, TIER.x + w3 / 2 + 10, y, {
      route: "hvh",
      mid: night.left - 40 - i * 24,
      alpha: on,
      upto: soon(t, c.fixes[i] + 0.05, 0.7),
      width: 2.5,
    });
    nameText(v, (TIER.x + w3 / 2 + night.left - 40) / 2, y - NAME_GAP + 6, {
      valign: "bottom",
      alpha: a * listIn(t, c.fixes, i),
      set: "fixes",
    });
  });
  // The independent review: a lens, named with what it examines, built part by part.
  const review = a * ramp(t, c.review - 0.15, 0.4);
  lens(LENS.x, LENS.y, LENS.r, { alpha: review });
  termRow(
    t,
    [L("独立评审", "Independent review")],
    [c.review],
    L(["事实、", "推理、", "变更、", "证据"], ["facts, ", "reasoning, ", "changes, ", "evidence"]),
    c.examined,
    LENS.x + LENS.r * 1.4 + NAME_GAP,
    LENS.y - 32,
    { align: "left", inline: false, build: true, alpha: a },
  );
  // The author's and the Agent's own accounts: their ways to the lens stop at a bar.
  const author = a * ramp(t, c.author - 0.15, 0.4),
    agent = a * ramp(t, c.agent - 0.15, 0.4),
    names = SPEAK_Y + 34 + NAME_GAP;
  speaker(SPEAKERS[0], SPEAK_Y, { alpha: author });
  nameText(L("作者", "Author"), SPEAKERS[0], names, {
    valign: "top",
    alpha: a * named(t, c.author),
  });
  speaker(SPEAKERS[1], SPEAK_Y, { alpha: agent, agent: true });
  nameText(L("智能体", "Agent"), SPEAKERS[1], names, {
    valign: "top",
    alpha: a * named(t, c.agent),
  });
  const own = a * ramp(t, c.own - 0.15, 0.4),
    stopX = SPEAKERS[0] - 150;
  link(SPEAKERS[0] - 34, SPEAK_Y, stopX + 8, SPEAK_Y, {
    alpha: own,
    upto: soon(t, c.own + 0.05, 0.5),
    width: 2.5,
    end: false,
  });
  bar(stopX, SPEAK_Y, { alpha: own * ramp(t, c.own + 0.5, 0.2), vertical: true, length: 36 });
  rejectedName(L("自己怎么说", "Own account"), stopX, SPEAK_Y + 18 + NAME_GAP, {
    valign: "top",
    alpha: own,
    mark: ramp(t, c.own + 0.05, 0.3),
  });
}
