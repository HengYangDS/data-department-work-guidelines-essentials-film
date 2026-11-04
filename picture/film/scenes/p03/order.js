/* B (03.3, from 「最先是法律」/ "Law"): authority to act's order of sources, centred. The seal heads it, with its name
 * and what it answers; with the first rank a spine runs down from the seal the whole length of the order, the order's
 * span that 「有先后」/ "has an order" announced, and a point runs down it in voice time. The four ranks join it one by
 * one, each a station on the spine with its name, whole from its first words, the rank being said at full ink and
 * those before it at the list's second level. The explicit decision's owner stands as a small figure in the colour of
 * authority beside its station: the rank is the decision, never the person alone. The column glides as one to stay
 * centred as wider ranks arrive. */

import { dot, flowDot, line, measure } from "../../drawing/strokes.js";
import { person, seal } from "../../drawing/symbols.js";
import { listIn } from "../../naming/lists.js";
import { NAME_GAP, NOTE, nameText, termRow } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { glide } from "../p01/failures.js";

const HEAD_Y = 300,
  SEAL_R = 46,
  ROWS = [420, 510, 600, 690],
  TO_NAMES = 34,
  OWNER = { dx: -38, size: 0.55 };
/* The ranks in the guidelines' order; key words where the narration's whole span would echo its caption line. */
const RANKS = () =>
  L(
    [
      "法律、监管、安全要求和公司的强制性制度",
      "决策负责人作出的明确决定",
      "有效的契约、制度、规范、决策记录",
      "工作计划、临时约定、个人偏好",
    ],
    [
      "Law, regulation, security, mandatory policy",
      "The explicit decision of the decision owner",
      "Contracts, policies, specifications, decision records",
      "Plans, provisional agreements, personal preferences",
    ],
  );
const HEAD = () => L("行动依据", "Authority to act"),
  QUESTION = () => L("谁可以决定做什么", "who may decide");
/* The spine's x at t: the column's box, from the owner's figure to the widest name standing, is centred on the frame,
 * gliding as one just after the words of each rank that widens it. */
function spineX(t, c) {
  const left = OWNER.dx - 15 * OWNER.size,
    head = SEAL_R + NAME_GAP + Math.max(measure(HEAD()), measure(QUESTION(), NOTE)),
    right = (k) =>
      Math.max(
        head,
        ...RANKS()
          .slice(0, k)
          .map((v) => TO_NAMES + measure(v)),
      );
  const at = (k) => 960 - (left + right(k)) / 2;
  return glide(
    t,
    at(0),
    c.ranks.map((when, k) => [when, at(k + 1)]),
  );
}
export function stageOrder(t, a, c) {
  const x = spineX(t, c),
    grow = soon(t, c.order + 0.05, 0.8),
    top = HEAD_Y + SEAL_R + 4;
  seal(x, HEAD_Y, SEAL_R, { alpha: a });
  termRow(t, [HEAD()], [-Infinity], [QUESTION()], [-Infinity], x + SEAL_R + NAME_GAP, HEAD_Y - 32, {
    align: "left",
    inline: false,
    alpha: a,
  });
  line(x, top, x, top + (ROWS[3] - top) * grow, { color: P.line, alpha: a, width: 4 });
  // A point runs down the order in voice time, from the seal through the ranks standing.
  const q = (voiceTime(t) * 0.22) % 1;
  if (grow >= 1) flowDot(x, mix(top, ROWS[3], q), 5, q, { color: P.authority, alpha: a });
  RANKS().forEach((v, k) => {
    const on = a * ramp(t, c.ranks[k] - 0.15, 0.4);
    dot(x, ROWS[k], 7, { color: P.ink, alpha: on });
    nameText(v, x + TO_NAMES, ROWS[k], {
      align: "left",
      alpha: a * listIn(t, c.ranks, k),
      set: "ranks",
    });
    if (k === 1)
      person(x + OWNER.dx, ROWS[k] + 8, { size: OWNER.size, color: P.authority, alpha: on });
  });
}
