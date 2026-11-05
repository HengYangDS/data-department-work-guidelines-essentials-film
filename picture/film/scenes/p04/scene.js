/* 04 四条底线 / Four boundaries. A (04.1): the field of the four boundaries, four separate sides that count in one after
 * another, centred, named on their words; a point inside runs to a side and stops at it. B (04.2-04.3, from 「说真话」/
 * "tell the truth"): the field at the left, its sides lighting one by one as a column of the four boundaries builds at
 * its right (lines.js). C (04.4): the field and the two cases, inside it and near a side (lines.js). D
 * (04.5-04.7): the ladder of risk and the record each tier needs; E (04.8): last night's case in the highest tier, and
 * the independent review that examines the work, not its authors' account (ladder.js). F (04.9, from 「风险高低」/
 * "Whatever the risk"): three tiers' documents, each inside the same field, every field's sides lit together. */

import { dot } from "../../drawing/strokes.js";
import { illustrative } from "../../framing/chapters.js";
import { named } from "../../naming/lists.js";
import { NAME_GAP, nameText } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { cue, cueFrom } from "../../timing/cues.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { scenes } from "../registry.js";
import { stageCases, stageLines } from "./lines.js";
import { stageLadder, stageReview } from "./ladder.js";
import { field, fieldRow, tierDoc } from "./marks.js";

/* Each edition's cues where the two editions say a list in different parts; only the edition drawn is resolved. */
const each = (zh, en) => L(zh, en)();
function cuesOf(s) {
  const lastCase = cue(s, "昨晚的事", "Last night's case");
  return {
    four: cue(s, "四条底线", "Four boundaries"),
    never: cue(s, "不能越过", "never be crossed"),
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
      [cue(s, "对象和时间", "subject"), cue(s, "能力和权限", "competence"), cue(s, "数据", "data")],
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
        ],
        () => [cue(s, "", "without current evidence"), cue(s, "", "call nothing complete")],
      ),
    ],
    inside: cue(s, "在这四条底线之内", "Inside them"),
    free: cue(s, "自主", "autonomy"),
    near: cue(s, "快要越线时", "When an action would cross one"),
    halt: cue(s, "停下来", "stop"),
    ladder: cue(s, "要留多少记录", "Risk sets the process"),
    risk: cue(s, "多少记录", "Risk sets the process"),
    riskWord: cue(s, "看风险", "Risk sets the process"),
    process: cue(s, "多少手续", "the process"),
    tiers: [
      cue(s, "局部", "Local"),
      cue(s, "跨角色", "Cross-role"),
      cue(s, "涉及生产", "Work touching production"),
    ],
    tierQuals: [
      cue(s, "不对外承诺", "no external commitment"),
      cue(s, "几种方案", "competing options"),
      cue(s, "删除覆盖", "deletion"),
    ],
    oneClear: cue(s, "一次讲清", "one clear exchange"),
    clearQual: cue(s, "结论", "conclusion"),
    record: cue(s, "现有的工作记录", "existing work record"),
    recordQual: cue(s, "问题", "the problem"),
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
 * named under itself; a point stands at its centre, and on 「不能越过」/ "never be crossed" it runs to its right side
 * and stops there. */
const A = { x: 960, y: 480, w: 520, h: 440 };
function stageField(t, a, c) {
  field(A.x, A.y, A.w, A.h, {
    alpha: a,
    drawn: [0, 1, 2, 3].map((k) => soon(t, c.four - 0.15 + 0.08 * k, 0.3)),
    lit: [1, 1, 1, 1],
  });
  nameText(L("四条底线", "Four boundaries"), A.x, A.y + A.h / 2 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.four),
  });
  // A point stands inside from the first words; on 「不能越过」/ "never be crossed" it runs to the right side and stops.
  const run = soon(t, c.never + 0.05, 0.7);
  dot(mix(A.x, A.x + A.w / 2 - 12, run), A.y, 8, {
    color: P.ink,
    alpha: a * ramp(t, c.four - 0.15, 0.3),
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
  const SA = stageOut(t, c.rows[0]),
    SB = stageIn(t, c.rows[0]) * stageOut(t, c.inside),
    SC = stageIn(t, c.inside) * stageOut(t, c.ladder),
    SD = stageIn(t, c.ladder) * stageOut(t, c.lastCase),
    SE = stageIn(t, c.lastCase) * stageOut(t, c.whatever),
    SF = stageIn(t, c.whatever);
  if (SA > 0) stageField(t, SA, c);
  if (SB > 0) stageLines(t, SB, c);
  if (SC > 0) stageCases(t, SC, c);
  if (SD > 0) stageLadder(t, SD, c);
  if (SE > 0) stageReview(t, SE, c);
  if (SF > 0) stageDuty(t, SF, c);
  illustrative(SE);
};
