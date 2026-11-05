/* D and E (04.5-04.8). D, from 「要留多少记录」/ "Risk sets the process": one spine of rising risk down the frame, named over
 * its top (in Chinese with the question it answers, 要留多少记录, before 看风险); three tiers join it on their words, the work
 * of each at the spine's left and, at its right, the record it needs, a document as large as its risk calls for: one
 * clear exchange; the existing work record; a written decision with what else it takes, said one by one. E, from
 * 「昨晚的事」/ "Last night's case", the made-up case: the highest tier's document at the left with its work, last night's
 * timeline compact at the right, its two possible fixes branching into the tier; the tier lights as it is said to
 * belong there; under them the independent review, a lens with what it examines, and at the right the author and the
 * Agent, whose own accounts stop at a bar before the lens. */

import { link } from "../../drawing/links.js";
import { blend } from "../../drawing/colour.js";
import { dot, flowDot, line, measure } from "../../drawing/strokes.js";
import { lastNight } from "../../drawing/timeline.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, growTexts, nameText, rejectedName, termRow } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { bar } from "../p03/marks.js";
import { lens, speaker, tierDoc } from "./marks.js";

/* Each tier's two sides are term rows: at the spine's left the work (a term and its qualifier), at its right the
 * record it needs (its name and what it holds or takes). Each edition sets its own lines: English sets its longer tiers
 * on more lines, and a tier's two sides always keep the same lines, so their rows share baselines. `width` wraps a term
 * and `noteWidth` its qualifier. */
const WORK = () =>
  L(
    [
      { term: ["局部、可逆"], qual: ["无对外承诺"] },
      { term: ["跨角色、做得久"], qual: ["几种方案、重大不确定"] },
      { term: ["生产、资金、敏感数据、安全合规"], qual: ["删除覆盖、对外承诺、不可逆"] },
    ],
    [
      { term: ["Local, reversible work"], qual: ["no external commitment"] },
      {
        term: ["Cross-role ", "or extended work"],
        qual: ["competing options, material uncertainty"],
        width: 260,
        noteWidth: Infinity,
      },
      {
        term: ["Production, funds, sensitive data, ", "security or compliance"],
        qual: ["deletion, overwrite, ", "external commitment, irreversibility"],
        width: 490,
        noteWidth: 420,
      },
    ],
  );
/* The records: one clear exchange, the existing work record and, for the highest tier, a written decision with its
 * explicit authorization, its other requirements as the qualifier, each part on its own words. English says the second
 * tier's contents before the record, so it names the contents as the term and the record as its qualifier. */
const RECORD = () =>
  L(
    [
      { term: ["一次讲清"], qual: ["结论、依据、做法"] },
      { term: ["现有的工作记录"], qual: ["问题、方案、做法、验收"] },
      { term: ["书面决定、", "明确授权"], qual: ["回滚或降级预案、", "独立评审、", "由人验收"] },
    ],
    [
      { term: ["One clear exchange"], qual: ["conclusion, basis, action"] },
      {
        term: ["Problem, options, ", "execution path, acceptance"],
        qual: ["existing work record"],
        width: 370,
        noteWidth: Infinity,
      },
      {
        term: ["A written decision, ", "explicit authorization"],
        qual: ["a rollback or degradation path, ", "independent review, ", "human acceptance"],
        width: 310,
        noteWidth: 470,
      },
    ],
  );
/* When each record's term and qualifier arrive: the second tier's on their words in each edition's order, the third's
 * part by part. */
const recordTimes = (c) => [
  { term: [c.oneClear], qual: [c.clearQual] },
  { term: [L(c.record, c.recordQual)], qual: [L(c.recordQual, c.record)] },
  { term: c.written.slice(0, 2), qual: c.written.slice(2), build: true },
];
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
  TO_DOC = 64,
  /* The documents stand with their right edges on one line, so the three records begin at one left edge. */
  DOC_RIGHT = TO_DOC + DOCS[2][0];
/* The widest line of a term row's block, as termRow sets it. */
const blockWidth = ({ term, qual, width = Infinity, noteWidth = width }) =>
  Math.max(
    ...growTexts(term, width).map((line) => line.reduce((w, [, v]) => w + measure(v), 0)),
    ...growTexts(qual, noteWidth, NOTE).map((line) =>
      line.reduce((w, [, v]) => w + measure(v, NOTE), 0),
    ),
  );
/* The spine's x: it never moves, so no name moves once shown. The ladder builds side by side, and each state it holds
 * stands off the frame's centre by half the difference of its two sides; the spine stands where the most off-centre
 * of those states, at either side, is off by as little as possible, which keeps every state within the reviewers'
 * 90 px. */
function spineX(c) {
  const head = HEAD(),
    top = measure(head.top) / 2,
    records = recordTimes(c),
    parts = [
      [c.risk, Math.max(top, head.left ? HEAD_GAP + measure(head.left) : 0), Math.max(top, HEAD_GAP + measure(head.right))],
      ...WORK().map((row, k) => [c.tiers[k], TO_WORK + blockWidth(row), 0]),
      ...RECORD().map((row, k) => [records[k].term[0], 0, DOC_RIGHT + NAME_GAP + blockWidth(row)]),
    ].sort((p, q) => p[0] - q[0]);
  let left = 0,
    right = 0;
  const offsets = parts.map(([, l, r]) => {
    left = Math.max(left, l);
    right = Math.max(right, r);
    return (right - left) / 2;
  });
  return 960 - (Math.max(...offsets) + Math.min(...offsets)) / 2;
}
export function stageLadder(t, a, c) {
  const x = spineX(c),
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
  WORK().forEach(({ term, qual, width = Infinity, noteWidth = width }, k) => {
    const y = TIER_Y[k],
      on = a * ramp(t, c.tiers[k] - 0.15, 0.4);
    line(x - 10, y, x + 10, y, { color: P.ink, alpha: on, width: 4 });
    termRow(t, term, [c.tiers[k]], qual, [c.tierQuals[k]], x - TO_WORK, y - 32, {
      align: "right",
      inline: false,
      width,
      noteWidth,
      alpha: a,
    });
  });
  // The records, each a document at the spine's right, their right edges on one line, named beside it.
  const docRight = x + DOC_RIGHT,
    times = recordTimes(c);
  RECORD().forEach(({ term, qual, width = Infinity, noteWidth = width }, k) => {
    const [w, h] = DOCS[k],
      at = times[k].term[0],
      on = a * ramp(t, at - 0.15, 0.4);
    tierDoc(docRight - w / 2, TIER_Y[k], w, h, { alpha: on, rows: 2 + k });
    termRow(t, term, times[k].term, qual, times[k].qual, docRight + NAME_GAP, TIER_Y[k] - 32, {
      align: "left",
      inline: false,
      width,
      noteWidth,
      build: times[k].build ?? false,
      buildTerm: times[k].build ?? false,
      alpha: a,
    });
  });
}

/* E's places: the highest tier at the left, last night compact at the right, the review under them. */
/* The column of the tier and the review: English stands it further right, so its longer tier name keeps the settled
 * picture within 50 px of the centre. */
const columnX = () => L(520, 545);
const TIER = { y: 350 },
  NIGHT = { x: 1360, y: 330, scale: 0.55 },
  FIX_Y = [318, 420],
  /* The upper group, the tier and last night's case, stands this much below the places above for the whole stage: the
   * drop that centres it alone on the content centre is 134 px and the one that centres it with the review and the
   * accounts under it -6 px, so it stands at their midpoint, where neither state stands far off. */
  DROP = 64,
  LENS = { y: 660, r: 30 },
  SPEAKERS = [1250, 1430],
  SPEAK_Y = 690;
export function stageReview(t, a, c) {
  const [w3, h3] = DOCS[2],
    lit = ramp(t, c.belongs - 0.15, 0.4),
    vt = voiceTime(t),
    tierY = TIER.y + DROP,
    nightY = NIGHT.y + DROP;
  const tierX = columnX();
  tierDoc(tierX, tierY, w3, h3, { alpha: a, color: blend(P.ink, P.authority, lit), rows: 4 });
  // The tier's work under its document, its term and its qualifier each on one line: the review stands under them.
  const { term, qual } = WORK()[2];
  termRow(t, term, [-Infinity], qual, [-Infinity], tierX, tierY + h3 / 2 + NAME_GAP, {
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
    const y = FIX_Y[i] + DROP,
      on = a * ramp(t, c.fixes[i] - 0.15, 0.4);
    link(night.left - 6, i ? nightY + 4 : nightY - 4, tierX + w3 / 2 + 10, y, {
      route: "hvh",
      mid: night.left - 40 - i * 24,
      alpha: on,
      upto: soon(t, c.fixes[i] + 0.05, 0.7),
      width: 2.5,
    });
    nameText(v, (tierX + w3 / 2 + night.left - 40) / 2, y - NAME_GAP + 6, {
      valign: "bottom",
      alpha: a * listIn(t, c.fixes, i),
      set: "fixes",
    });
  });
  // The independent review: a lens, named with what it examines, built part by part.
  const review = a * ramp(t, c.review - 0.15, 0.4);
  lens(tierX, LENS.y, LENS.r, { alpha: review });
  termRow(
    t,
    [L("独立评审", "Independent review")],
    [c.review],
    L(["事实、", "推理、", "变更、", "证据"], ["facts, ", "reasoning, ", "changes, ", "evidence"]),
    c.examined,
    tierX + LENS.r * 1.4 + NAME_GAP,
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
