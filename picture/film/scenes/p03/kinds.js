/* The two kinds of authority apart (03.1-03.2 and 03.4's opening): authority to act, a seal, at the left and
 * authority about facts, a record with its check, at the right, joined by one fork under their one name, with a
 * divider between them. */

import { ctx } from "../../canvas.js";
import { flowAt, flowDot, line, stroke } from "../../drawing/strokes.js";
import { seal } from "../../drawing/symbols.js";
import { clearOfTitle } from "../../framing/chapters.js";
import { named } from "../../naming/lists.js";
import { NAME_GAP, nameText, termRow } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { recordMark } from "./marks.js";

/* A and C1: the two kinds apart, joined by one fork under their one name. The seal and the record stand far enough
 * apart that the pair covers a tenth of the frame from its first word, and the fork joins them into one mark that the
 * name names; a point runs out along the fork to each in voice time. In A the shared name gives way as the narration
 * turns to authority to act; it stands again where the two are shown together. Each kind's name and what it answers
 * hang one gap under it, on one baseline. */
const KINDS = { left: 560, right: 1360, y: 490, name: 350 },
  SEAL_R = 58,
  RECORD = [110, 140];
export function twoKinds(s, t, a, c, { facts = false } = {}) {
  const g = a * clearOfTitle(s, t, KINDS.name - 30),
    on = g * ramp(t, s.voice_start - 0.4, 0.35),
    fork = KINDS.name + 16,
    joint = fork + 24,
    names = Math.max(KINDS.y + SEAL_R, KINDS.y + RECORD[1] / 2) + NAME_GAP;
  nameText(L("两种依据", "Two kinds of authority"), 960, KINDS.name, {
    valign: "bottom",
    alpha: g * (facts ? 1 : named(t, c.two) * (1 - ramp(t, c.act - 0.15, 0.4))),
  });
  const out = flowAt(t, KINDS.right - 960);
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
    { color: P.line, alpha: on, width: 2.5 },
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
