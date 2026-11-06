/* D and E (04.5-04.8). D, from 「要留多少记录」/ "Risk sets the process": one spine of rising risk down the frame, named over
 * its top (in Chinese with the question it answers, 要留多少记录, before 看风险); three tiers join it on their words, the work
 * of each at the spine's left and, at its right, the record it needs, a document as large as its risk calls for: one
 * clear exchange; the existing work record; a written decision with what else it takes, said one by one. A point on the
 * spine stands at the tier being told. E, from 「昨晚的事」/ "Last night's case", the made-up case: the highest tier's
 * document at the left with its work, last night's timeline compact at the right, its two possible fixes branching into
 * the tier; the tier lights as it is said to belong there; under them, at the left, the author and the Agent, whose own
 * accounts stop at a bar on their way to the independent review at the right, a lens with what it examines, joined to
 * that bar by its own link. */

import { link } from "../../drawing/links.js";
import { blend } from "../../drawing/colour.js";
import { dot, line, measure } from "../../drawing/strokes.js";
import { lastNight } from "../../drawing/timeline.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, NOTE, growTexts, nameText, rejectedName, termRow } from "../../naming/names.js";
import { rowNameTop } from "../../naming/placement.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { travel } from "../../timing/pauses.js";
import { bar } from "../p03/marks.js";
import { lens, speaker, tierDoc } from "./marks.js";

/* Each tier's two sides are term rows: at the spine's left the work (a term and its qualifier), at its right the
 * record it needs (its name and what it holds or takes). Each edition sets its own lines: English sets its longer tiers
 * on more lines, and a tier's two sides always keep the same lines, so their rows share baselines. `width` wraps a term
 * and `noteWidth` its qualifier; English sets the highest tier's qualifiers on three lines a side, so the record side,
 * which begins after its document, reaches no further than the full ladder's balance allows. A side that lists several
 * things the narration names one by one holds each as a part of its own, which joins it on its words. */
const WORK = () =>
  L(
    [
      { term: ["局部、可逆"], qual: ["无对外承诺"] },
      { term: ["跨角色、做得久"], qual: ["几种方案、重大不确定"] },
      {
        term: ["生产、", "资金、", "敏感数据、", "安全合规"],
        qual: ["删除覆盖、", "对外承诺、", "不可逆"],
      },
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
        qual: ["deletion, ", "overwrite, ", "external commitment, ", "irreversibility"],
        width: 490,
        noteWidth: 300,
      },
    ],
  );
/* The records: one clear exchange, the existing work record and, for the highest tier, a written decision with its
 * explicit authorization, its other requirements as the qualifier, each part on its own words. English says the second
 * tier's contents before the record, so it names the contents as the term and the record as its qualifier. */
const RECORD = () =>
  L(
    [
      { term: ["一次讲清"], qual: ["结论、", "依据、", "做法"] },
      { term: ["现有的工作记录"], qual: ["问题、", "方案、", "做法、", "验收"] },
      { term: ["书面决定、", "明确授权"], qual: ["回滚或降级预案、", "独立评审、", "由人验收"] },
    ],
    [
      { term: ["One clear exchange"], qual: ["conclusion, ", "basis, ", "action"] },
      {
        term: ["Problem, ", "options, ", "execution path, ", "acceptance"],
        qual: ["existing work record"],
        width: 370,
        noteWidth: Infinity,
      },
      {
        term: ["A written decision, ", "explicit authorization"],
        qual: ["a rollback or degradation path, ", "independent review, ", "human acceptance"],
        width: 310,
        noteWidth: 360,
      },
    ],
  );
/* When each tier's work arrives, part by part: the term and the qualifier of the highest tier in their parts. */
const workTimes = (c) => [
  { term: [c.tiers[0]], qual: [c.tierQuals[0]] },
  { term: [c.tiers[1]], qual: [c.tierQuals[1]] },
  { term: [c.tiers[2], ...c.tierParts.term], qual: [c.tierQuals[2], ...c.tierParts.qual] },
];
/* When each record's term and qualifier arrive, part by part: the second tier's on their words in each edition's
 * order, the contents with their parts. */
const recordTimes = (c) => [
  { term: [c.oneClear], qual: [c.clearQual, ...c.clearParts] },
  {
    term: L([c.record], [c.recordQual, ...c.recordParts]),
    qual: L([c.recordQual, ...c.recordParts], [c.record]),
  },
  { term: c.written.slice(0, 2), qual: c.written.slice(2) },
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
      [
        c.risk,
        Math.max(top, head.left ? HEAD_GAP + measure(head.left) : 0),
        Math.max(top, HEAD_GAP + measure(head.right)),
      ],
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
  // Its two ends are points.
  dot(x, top, 6, { color: P.line, alpha: a });
  dot(x, SPINE[1], 6, { color: P.line, alpha: a });
  nameText(head.top, x, top - 14 - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, L(c.riskWord, c.risk)),
  });
  if (head.left)
    nameText(head.left, x - HEAD_GAP, top + 12, { align: "right", alpha: a * named(t, c.risk) });
  nameText(head.right, x + HEAD_GAP, top + 12, { align: "left", alpha: a * named(t, c.process) });
  const works = workTimes(c);
  WORK().forEach(({ term, qual, width = Infinity, noteWidth = width }, k) => {
    // A tier's tick joins the spine with the part of its name that reaches the spine, the last of its first line, so
    // the tick never stands unnamed while a name builds toward it.
    const y = TIER_Y[k],
      reaching = growTexts(term, width)[0].at(-1)[0],
      on = a * ramp(t, (works[k].term[reaching] ?? works[k].term[0]) - 0.15, 0.4);
    line(x - 10, y, x + 10, y, { color: P.ink, alpha: on, width: 4 });
    termRow(t, term, works[k].term, qual, works[k].qual, x - TO_WORK, y - 32, {
      align: "right",
      inline: false,
      width,
      noteWidth,
      build: true,
      buildTerm: true,
      alpha: a,
    });
  });
  // A point on the spine marks the tier being told: it arrives with the first tier at that tier's height, glides down
  // to each next tier from that tier's first words over 0.9 s of voice time (at most about 330 px/s), and holds there,
  // so it never stands at a tier not told and never moves in the quiet before a tier's thought.
  const marked = c.tiers.reduce((y, at, k) => mix(y, TIER_Y[k], travel(t, at, 0.9)), TIER_Y[0]);
  dot(x, marked, 6, { color: P.authority, alpha: a * ramp(t, c.tiers[0] - 0.15, 0.4) });
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
      build: true,
      buildTerm: true,
      alpha: a,
    });
  });
}

/* E's places. The upper group: the highest tier's document with its work under it, set in the lines D gave it, and
 * last night compact at its right, four hours of it, beyond the tier's two possible fixes, which branch from the night
 * into the tier with room for their longest name between. The lower group, under them: the author and the Agent on one
 * line under the tier's work, their way running right to a bar, and beyond the bar the review's lens, joined to the bar
 * by its own link, with the review's name and what it examines at the lens's right, its widest line ending under the
 * night's end. The upper group stands centred on the frame, so the stage's box stays centred while the lower group
 * builds inside it, and the heavier parts, the tier's work and the review, stand at opposite corners; the stage stands
 * `lean` px right of that centre, toward its lighter half, so its ink centres within the reviewers' 60 px while its
 * box keeps well within their 40 px (80 UHD px). The upper group stands `drop` px below the places above for the whole
 * stage, near the midpoint of the drops that centre it alone on the content centre and with the lower group under it
 * (Chinese 132 and 52 px, English 82 and 14 px, its five lines of work standing taller), so neither state stands far
 * off. */
const E = {
    tierY: 350,
    nightY: 330,
    drop: L(64, 48),
    lean: 24,
    scale: 0.55,
    hours: [-1, 3],
    lens: 30,
    agent: 180,
  },
  FIX_Y = [318, 420],
  /* The night's rail reaches two hours, 99 px each at its scale, each side of its anchor; its fixes turn 40 px and
   * 64 px before its left end, and their names centre between the tier's side and the inner turn. */
  NIGHT_REACH = 2 * 99,
  FIX_TURN = 40,
  FIX_STEP = 24,
  /* The speakers' bubbles rise this far over their line, the review's name 32 px. */
  BUBBLE = 39;
const EXAMINED = () =>
  L(["事实、", "推理、", "变更、", "证据"], ["facts, ", "reasoning, ", "changes, ", "evidence"]);
const FIXES = () =>
  L(["换供应商", "改生产环境里的采集任务"], ["A new vendor", "Collection job in production"]);
export function stageReview(t, a, c) {
  const [w3, h3] = DOCS[2],
    lit = ramp(t, c.belongs - 0.15, 0.4),
    tierY = E.tierY + E.drop,
    nightY = E.nightY + E.drop,
    work = WORK()[2],
    workTop = tierY + h3 / 2 + NAME_GAP,
    // From the tier's column: the night's anchor past the fixes' room, and the upper group's two ends.
    fixRoom = Math.max(...FIXES().map((v) => measure(v))) + 2 * NAME_GAP,
    nightAt = w3 / 2 + 10 + fixRoom + FIX_STEP + FIX_TURN + NIGHT_REACH,
    upperLeft = -Math.max(w3 / 2, blockWidth(work) / 2),
    tierX = 960 + E.lean - (upperLeft + nightAt + NIGHT_REACH) / 2;
  tierDoc(tierX, tierY, w3, h3, { alpha: a, color: blend(P.ink, P.authority, lit), rows: 4 });
  // The tier's work under its document, in the lines D gave it.
  const { term, qual, width = Infinity, noteWidth = width } = work;
  const workBlock = termRow(t, term, [-Infinity], qual, [-Infinity], tierX, workTop, {
    align: "center",
    inline: false,
    width,
    noteWidth,
    alpha: a,
  });
  const night = lastNight(tierX + nightAt, nightY, E.scale, {
    alpha: a,
    card: 1,
    hours: E.hours,
    flow: { t },
    names: { axis: { v: L("昨晚的事", "Last night's case"), alpha: named(t, c.lastCase) } },
  });
  // Its two possible fixes branch from the night into the tier, one list.
  FIXES().forEach((v, i) => {
    const y = FIX_Y[i] + E.drop,
      on = a * ramp(t, c.fixes[i] - 0.15, 0.4);
    link(night.left - 6, i ? nightY + 4 : nightY - 4, tierX + w3 / 2 + 10, y, {
      route: "hvh",
      mid: night.left - FIX_TURN - i * FIX_STEP,
      alpha: on,
      upto: soon(t, c.fixes[i] + 0.05, 0.7),
      width: 2.5,
    });
    nameText(v, (tierX + w3 / 2 + 10 + night.left - FIX_TURN - FIX_STEP) / 2, y - NAME_GAP + 6, {
      valign: "bottom",
      alpha: a * listIn(t, c.fixes, i),
      set: "fixes",
    });
  });
  // The lower group's line stands so that the speakers' bubbles over it keep one gap under the tier's work. Its
  // marks' names hang from one baseline, one gap under the lowest of them: the bar reaches 18 px under the line and
  // the Agent's diamond 20 px. The refused account centres its words and its cross under the bar (the words' width and
  // 42 px more, as rejectedName sets them), and the bar stands where the account's words keep two gaps from the Agent's
  // name and its cross two gaps from the lens.
  const y = Math.max(660, workBlock.bottom + NAME_GAP + BUBBLE),
    names = rowNameTop([y + 18, y + 20]),
    r = E.lens,
    reviewName = L("独立评审", "Independent review"),
    authorName = L("作者", "Author"),
    agentName = L("智能体", "Agent"),
    account = L("自己怎么说", "Own account"),
    refusal = (measure(account) + 42) / 2,
    stop = E.agent + measure(agentName) / 2 + 2 * NAME_GAP + refusal,
    lensAt = stop + refusal + 2 * NAME_GAP + r,
    textAt = lensAt + r * 1.4 + NAME_GAP,
    reach = textAt + blockWidth({ term: [reviewName], qual: EXAMINED() }),
    // The lower group ends where the night's rail ends.
    authorX = tierX + nightAt + NIGHT_REACH - reach,
    agentX = authorX + E.agent,
    stopX = authorX + stop,
    lensX = authorX + lensAt;
  // The independent review: a lens, named with what it examines, built part by part.
  const review = a * ramp(t, c.review - 0.15, 0.4);
  lens(lensX, y, r, { alpha: review });
  termRow(t, [reviewName], [c.review], EXAMINED(), c.examined, authorX + textAt, y - 32, {
    align: "left",
    inline: false,
    build: true,
    alpha: a,
  });
  // The author's and the Agent's own accounts: their way to the lens, through the Agent, stops at a bar, and the lens
  // is joined to the bar from its side by a link of its own.
  const author = a * ramp(t, c.author - 0.15, 0.4),
    agent = a * ramp(t, c.agent - 0.15, 0.4);
  speaker(authorX, y, { alpha: author });
  nameText(authorName, authorX, names, { valign: "top", alpha: a * named(t, c.author) });
  speaker(agentX, y, { alpha: agent, agent: true });
  nameText(agentName, agentX, names, { valign: "top", alpha: a * named(t, c.agent) });
  const own = a * ramp(t, c.own - 0.15, 0.4),
    way = soon(t, c.own + 0.05, 0.5);
  link(authorX + 24, y, agentX - 26, y, { alpha: own, upto: way, width: 2.5, end: false });
  link(agentX + 26, y, stopX - 8, y, { alpha: own, upto: way, width: 2.5, end: false });
  link(lensX - r - 6, y, stopX + 8, y, { alpha: own, upto: way, width: 2.5, end: false });
  bar(stopX, y, { alpha: own * ramp(t, c.own + 0.5, 0.2), vertical: true, length: 36 });
  rejectedName(account, stopX, names, {
    valign: "top",
    alpha: own,
    mark: ramp(t, c.own + 0.05, 0.3),
  });
}
