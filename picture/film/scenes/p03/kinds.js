/* The two kinds of authority apart (03.1-03.2 and 03.4's opening): authority to act, a seal, at the left and
 * authority about facts, a record with its check, at the right, joined by one fork under their one name, with a
 * divider between them. */

import { ctx } from "../../canvas.js";
import { flowAt, flowDot, line, stroke } from "../../drawing/strokes.js";
import { seal } from "../../drawing/symbols.js";
import { clearOfTitle } from "../../framing/chapters.js";
import { NAME_GAP, nameText, termRow } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { early } from "../p05/kit.js";
import { recordMark } from "./marks.js";

/* A and C1: the two kinds apart, joined by one fork under their one name. The seal and the record stand far enough
 * apart that the pair covers a tenth of the frame, and the fork joins them into one mark that the name names. In A the
 * fork, its name and the two kinds stand from the clause that says 「两种依据」/ "Two kinds of authority", which in
 * Chinese opens on 工作里有 while the chapter title clears: three firm marks must stand through every voiced frame, so
 * the kinds cannot wait for their name's own words. The name stays over the fork until the stage leaves, so neither
 * kind stands unnamed; on 「分开看」/ "stay apart" a point runs out along the fork to each kind once and rests. In C1 the
 * pair stands from the cut and its points run once on the stage's first words. Each kind's name and what it answers
 * hang one gap under it, on one baseline. */
const KINDS = { left: 560, right: 1360, y: 490, name: 350 },
  SEAL_R = 58,
  RECORD = [110, 140];
export function twoKinds(s, t, a, c, { facts = false } = {}) {
  const g = a * clearOfTitle(s, t, KINDS.name - 30),
    named0 = facts ? 1 : early(t, s.words[0].start, c.two),
    on = g * named0,
    fork = KINDS.name + 16,
    joint = fork + 24,
    names = Math.max(KINDS.y + SEAL_R, KINDS.y + RECORD[1] / 2) + NAME_GAP;
  nameText(L("两种依据", "Two kinds of authority"), 960, KINDS.name, {
    valign: "bottom",
    alpha: g * named0,
  });
  const out = flowAt(t, KINDS.right - 960, { from: facts ? c.another : c.apart, passes: 1 });
  [KINDS.left, KINDS.right].forEach((x) =>
    flowDot(mix(960, x, out?.q ?? 0), joint, 4.5, out, { color: P.line, alpha: on }),
  );
  stroke(
    () => {
      ctx.moveTo(960, fork);
      ctx.lineTo(960, joint);
      ctx.moveTo(KINDS.left, KINDS.y - SEAL_R - 4);
      ctx.lineTo(KINDS.left, joint);
      ctx.lineTo(KINDS.right, joint);
      ctx.lineTo(KINDS.right, KINDS.y - RECORD[1] / 2 - 4);
    },
    { color: P.line, alpha: g * named0, width: 2.5 },
  );
  seal(KINDS.left, KINDS.y, SEAL_R, { alpha: on });
  recordMark(KINDS.right, KINDS.y, ...RECORD, { alpha: on });
  // 「分开看」/ "stay apart": a divider rises between the two kinds, under the fork.
  const rise = facts ? 1 : soon(t, c.apart + 0.05, 0.6);
  if (rise > 0)
    line(960, KINDS.y + 110, 960, KINDS.y + 110 - 190 * rise, {
      color: P.line,
      alpha: g * Math.min(1, rise * 3),
      width: 3,
    });
  termRow(
    t,
    [L("行动依据", "Authority to act")],
    [facts ? -Infinity : c.act],
    [L("谁可以决定做什么", "who may decide")],
    [facts ? -Infinity : c.who],
    KINDS.left,
    names,
    { align: "center", inline: false, alpha: g },
  );
  if (facts)
    termRow(
      t,
      [L("事实依据", "Authority about facts")],
      [c.facts],
      [L("靠什么认定一件事是真的", "what can establish truth")],
      [c.what],
      KINDS.right,
      names,
      { align: "center", inline: false, alpha: g },
    );
}
