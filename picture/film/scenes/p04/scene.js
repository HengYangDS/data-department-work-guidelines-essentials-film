/* 04 四条底线 / Four boundaries. A (04.1): the field of the four boundaries, four separate sides that count in one after
 * another, centred, named over itself on their words; a point inside runs to a side and stops at it. B (04.2-04.3,
 * from its first words 「第一」/ "First"): without a cut, the point fades and the field glides wider and deeper from its
 * top round a list of the four boundaries that builds inside it, its sides lighting one by one, and its name stays over
 * it (lines.js). C (04.4): the field and the two cases, inside it and near a side, the field named at the same place
 * (lines.js). D (04.5-04.7): the ladder of risk and the record each tier needs; E (04.8): last night's case in the
 * highest tier, and the independent review that examines the work, not its authors' account (ladder.js). F (04.9, from
 * 「风险高低」/ "Whatever the risk"): three tiers' documents, each inside the same field, every field's sides lit
 * together. */

import { dot } from "../../drawing/strokes.js";
import { illustrative } from "../../framing/chapters.js";
import { named } from "../../naming/lists.js";
import { NAME_GAP, nameText } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { cue, cueFrom } from "../../timing/cues.js";
import { mix, ramp } from "../../timing/easing.js";
import { drawShare } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { FIELD, handover, listField, stageCases, stageLines } from "./lines.js";
import { stageLadder, stageReview } from "./ladder.js";
import { field, fieldRow, tierDoc } from "./marks.js";

/* Each edition's cues where the two editions say a list in different parts; only the edition drawn is resolved. */
const each = (zh, en) => L(zh, en)();
function cuesOf(s) {
  const lastCase = cue(s, "昨晚的事", "Last night's case"),
    // The highest tier's name begins with "Production", so the English tier arrives on "touching production", within
    // half a second of its name's word (EN9-n6).
    tiers = [
      cue(s, "局部", "Local"),
      cue(s, "跨角色", "Cross-role"),
      cue(s, "涉及生产", "touching production"),
    ],
    oneClear = cue(s, "一次讲清", "one clear exchange"),
    recordQual = cue(s, "问题", "the problem");
  return {
    four: cue(s, "四条底线", "Four boundaries"),
    never: cue(s, "不能越过", "never be crossed"),
    // The ordinal that brings each boundary; the first, 04.2's first word, cuts the list's stage in.
    ordinals: [
      cue(s, "第一", "First"),
      cue(s, "第二", "Second"),
      cue(s, "第三", "Third"),
      cue(s, "第四", "Fourth"),
    ],
    rows: [
      cue(s, "说真话", "tell the truth"),
      cue(s, "守边界", "stay in bounds"),
      cue(s, "责任落到人", "name the owner"),
      cue(s, "不虚报完成", "do not claim false completion"),
    ],
    quals: [
      [
        cue(s, "不编造", "no fabrication"),
        cue(s, "不隐瞒", "no hiding"),
        cue(s, "不挑着说", "no cherry-picking"),
        cue(s, "没把握", "no uncertainty"),
      ],
      [
        cue(s, "对象和时间", "subject"),
        cue(s, "专业能力和权限", "competence"),
        cue(s, "数据", "data"),
        ...each(
          () => [cue(s, "安全", ""), cue(s, "合规", "")],
          () => [cue(s, "", "security"), cue(s, "", "compliance"), cue(s, "", "action")],
        ),
      ],
      [
        cue(s, "重要的判断", "every important judgment"),
        cue(s, "决定", "decision"),
        cue(s, "变更", "and acceptance"),
      ],
      each(
        () => [
          cue(s, "做完了", ""),
          cue(s, "做对了", ""),
          cue(s, "能用了", ""),
          cue(s, "有人在用", ""),
          cue(s, "都要有当前", ""),
          cue(s, "对得上", ""),
        ],
        () => [cue(s, "", "without current evidence"), cue(s, "", "call nothing complete")],
      ),
    ],
    // The fourth boundary's last words, on which the list of the four counts as said.
    listEnd: cue(s, "证据", "adopted"),
    inside: cue(s, "在这四条底线之内", "Inside these boundaries"),
    // What is welcome inside them, each on its words: autonomy, exploration and creative work.
    free: cue(s, "自主", "autonomy"),
    explore: cue(s, "探索", "exploration"),
    create: cue(s, "创造", "creative work"),
    near: cue(s, "发现会越线时", "When an action would cross one"),
    // What is done at the edge, each on its words: stop, make it visible, escalate.
    edge: [
      cue(s, "停下来", "stop"),
      cue(s, "讲出来", "make it visible"),
      cue(s, "上报", "escalate"),
    ],
    ladder: cue(s, "要留多少记录", "Risk sets the process"),
    risk: cue(s, "多少记录", "Risk sets the process"),
    riskWord: cue(s, "看风险", "Risk sets the process"),
    process: cue(s, "多少手续", "the process"),
    tiers,
    tierQuals: [
      cue(s, "不对外承诺", "no external commitment"),
      cue(s, "几种方案", "competing options"),
      cue(s, "删除覆盖", "deletion"),
    ],
    // The later parts of the highest tier's work, its term's and its qualifier's, each on its words; English sets its
    // term in its two lines.
    tierParts: each(
      () => ({
        term: [cue(s, "资金", ""), cue(s, "敏感数据", ""), cueFrom(s, "安全合规", "", tiers[2])],
        qual: [cueFrom(s, "对外承诺", "", tiers[2]), cue(s, "不可逆", "")],
      }),
      () => ({
        term: [cueFrom(s, "", "security", tiers[2])],
        qual: [
          cueFrom(s, "", "an external commitment", tiers[2]),
          cue(s, "", "or anything irreversible"),
        ],
      }),
    ),
    oneClear,
    clearQual: cue(s, "结论", "conclusion"),
    // The later parts of the first record's qualifier and of the second record's contents.
    clearParts: [cue(s, "依据", "basis"), cueFrom(s, "行动", "action", oneClear)],
    record: cue(s, "现有的工作记录", "existing work record"),
    recordQual,
    recordParts: [
      cueFrom(s, "方案", "options", recordQual),
      cueFrom(s, "做法", "execution path", recordQual),
      cueFrom(s, "验收", "and acceptance", recordQual),
    ],
    written: [
      cue(s, "书面决定", "a written decision"),
      cue(s, "明确授权", "explicit authorization"),
      cue(s, "回滚", "a rollback"),
      cue(s, "独立评审", "independent review"),
      cue(s, "由人验收", "human acceptance"),
    ],
    lastCase,
    fixes: [
      cue(s, "换供应商", "a new vendor"),
      cue(s, "改生产环境", "a change to the collection job"),
    ],
    belongs: cue(s, "都属于这一类", "belongs here"),
    review: cueFrom(s, "独立评审", "Independent review", lastCase),
    examined: [
      cue(s, "实际的事实", "the actual facts"),
      cue(s, "推理", "reasoning"),
      cueFrom(s, "变更", "changes", lastCase),
      cueFrom(s, "证据", "evidence", lastCase),
    ],
    author: cue(s, "作者", "the author's"),
    agent: cue(s, "智能体", "the Agent's"),
    own: cue(s, "自己怎么说", "own account"),
    whatever: cue(s, "风险高低", "Whatever the risk"),
    duty: cue(s, "该尽的义务", "every duty"),
  };
}

/* A: the field centred, its four sides counting in on 「四条底线」/ "Four boundaries", lit in the colour of authority, and
 * named over itself, where B and C name it too; a point stands at its centre, and on 「不能越过」/ "never be crossed" it
 * runs to its right side and stops there. The phrase ends its thought within a second, so the run eases out over 0.8 s
 * of the film's own time and settles before the quiet that follows (at most 465 px/s), rather than resting part way.
 * On 04.2's first words A hands its field over to B's list without a cut (ZH6-4): the point fades out over 0.3 s, and
 * the field glides from A's size to B's, keeping its top, over 0.9 s of voice time (lines.js handover, at most about
 * 400 px/s), its sides but the first easing back to the line colour, to light again on their ordinals as B says
 * them. */
const A = { x: 960, y: FIELD.y, w: 520, h: FIELD.h };
function stageField(t, a, c) {
  const q = handover(t, c),
    to = listField(),
    w = mix(A.w, to.w, q),
    h = mix(A.h, to.h, q);
  field(A.x, A.y - A.h / 2 + h / 2, w, h, {
    alpha: a,
    // Each side draws on at the tip pace by its own length, a gap short of each corner.
    drawn: [A.w, A.h, A.w, A.h].map((side, k) => drawShare(t, c.four - 0.15 + 0.08 * k, side - 32)),
    lit: c.ordinals.map((at, k) => (k ? mix(1, ramp(t, at - 0.15, 0.4), q) : 1)),
  });
  nameText(L("四条底线", "Four boundaries"), A.x, A.y - A.h / 2 - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.four),
  });
  // A point stands inside from the first words; on 「不能越过」/ "never be crossed" it runs to the right side and stops.
  const run = ramp(t, c.never - 0.05, 0.8);
  dot(mix(A.x, A.x + A.w / 2 - 12, run), A.y, 8, {
    color: P.ink,
    alpha: a * ramp(t, c.four - 0.15, 0.3) * (1 - ramp(t, c.ordinals[0] + 0.05, 0.3)),
  });
}

/* F: three documents of the three tiers' sizes, each inside a field of one size, the fields one stroke; on 「该尽的义务」
 * / "every duty" every side of every field lights together and the duties are named over the row. */
const F = { xs: [600, 960, 1320], y: 480, s: 260 },
  DOCS = [
    [60, 76],
    [88, 112],
    [120, 152],
  ];
function stageDuty(t, a, c) {
  fieldRow(F.xs, F.y, F.s, { alpha: a, lit: ramp(t, c.duty - 0.15, 0.4) });
  F.xs.forEach((x, k) => tierDoc(x, F.y, ...DOCS[k], { alpha: a, rows: 2 + k }));
  nameText(L("风险高低", "Every level of risk"), 960, F.y + F.s / 2 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.whatever),
  });
  nameText(L("该尽的义务", "Every duty"), 960, F.y - F.s / 2 - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.duty),
  });
}

scenes["04"] = function (s, t) {
  const c = cuesOf(s);
  const SAB = stageOut(t, c.inside),
    SC = stageIn(t, c.inside) * stageOut(t, c.ladder),
    SD = stageIn(t, c.ladder) * stageOut(t, c.lastCase),
    SE = stageIn(t, c.lastCase) * stageOut(t, c.whatever),
    SF = stageIn(t, c.whatever);
  if (SAB > 0) {
    stageField(t, SAB, c);
    stageLines(t, SAB, c);
  }
  if (SC > 0) stageCases(t, SC, c);
  if (SD > 0) stageLadder(t, SD, c);
  if (SE > 0) stageReview(t, SE, c);
  if (SF > 0) stageDuty(t, SF, c);
  illustrative(SE);
};
