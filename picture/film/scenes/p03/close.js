/* E and F (03.7-03.8). E, the made-up case, from 「前面说的那场会」/ "The meeting at the start": failure 3's meeting
 * returns at the centre, larger, on the line of its own course; before it, a station from which what is to be decided,
 * who decides and which facts are needed hang as one list; when it ends, a station from which, either, the two empty
 * seats of failure 3 fill with a decision and with the person who does what by when, or a branch ends in an open
 * question, what is still missing. F1, from 「两种依据，不能」/ "Neither kind": the two kinds apart again, each one's way
 * toward the other stopping at the divider between them. F2, from 「行动依据再充分」/ "Authority to act cannot": the
 * two kinds at the top; the seal's way to a false fact and the record's way to an action each stop at a bar; when the
 * two conflict, the conflict stands between them and its way runs down to a report of the conflict and its impact,
 * beside which the two ways it must not take are refused. */

import { ctx } from "../../canvas.js";
import { link } from "../../drawing/links.js";
import { dot, flowDot, line, ring, stroke } from "../../drawing/strokes.js";
import { seal } from "../../drawing/symbols.js";
import { listIn, named } from "../../naming/lists.js";
import { NAME_GAP, growName, nameText, rejectedName } from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { stageIn, stageOut } from "../../timing/stages.js";
import { glide, meetingMark, openMark, people } from "../p01/failures.js";
import { KINDS, twoKinds } from "./kinds.js";
import { actionMark, bar, conflictMark, dashedPage, recordMark, reportMark } from "./marks.js";

/* E: the meeting drawn at K times failure 3's size about its centre, so that with its course it covers a tenth of the
 * frame from its first words. Its seats stand only once they fill. */
const MEET = { x: 960, y: 470, k: 1.8 },
  COURSE = [300, 1620],
  COURSE_Y = MEET.y + 7 * MEET.k,
  STATION_R = 11;
const AGENDA = () =>
  L(["决定什么", "谁决定", "哪些事实"], ["What to decide", "Who decides", "Which facts"]);
/* The meeting's point (x, y) on the screen, from a point of failure 3's mark. */
const at = (x, y) => [MEET.x + (x - MEET.x) * MEET.k, MEET.y + (y - MEET.y) * MEET.k];
export function stageMeeting(t, a, c) {
  const vt = voiceTime(t),
    { x, y, k } = MEET,
    decision = a * ramp(t, c.decision - 0.15, 0.4),
    doer = a * ramp(t, c.whoDoes - 0.15, 0.4);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.translate(-x, -y);
  meetingMark(x, y, { alpha: a, seats: [0, 0] });
  // The seats fill: the decision, a ring with its point, and the person who does the work.
  ring(x - 40, y + 56, 11, { color: P.authority, alpha: decision, width: 3 });
  dot(x - 40, y + 56, 3.5, { color: P.authority, alpha: decision });
  people([x + 40], y + 61, { alpha: doer });
  ctx.restore();
  const top = at(x, y - 10 - 14 - 2.15 * 9)[1],
    half = at(x + 86, y)[0] - x;
  nameText(L("那场会", "The meeting"), x, top - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.meeting),
  });
  // The meeting's course, through its table, with a point running along it.
  // The course touches the table at both sides, so the meeting and its course read as one mark.
  stroke(
    () => {
      ctx.moveTo(COURSE[0], COURSE_Y);
      ctx.lineTo(x - half - 6, COURSE_Y);
      ctx.moveTo(x + half + 6, COURSE_Y);
      ctx.lineTo(COURSE[1], COURSE_Y);
    },
    { color: P.line, alpha: a, width: 4 },
  );
  const q = (vt * 0.2) % 1;
  flowDot(mix(COURSE[0], COURSE[1], q), COURSE_Y, 5, q, { color: P.ink, alpha: a });
  // Before it: the station and its agenda, one list.
  const before = a * ramp(t, c.before - 0.15, 0.4),
    over = COURSE_Y - STATION_R - NAME_GAP,
    under = COURSE_Y + STATION_R + NAME_GAP;
  station(COURSE[0], COURSE_Y, before);
  nameText(L("会前", "Before it"), COURSE[0], over, {
    valign: "bottom",
    alpha: a * named(t, c.before),
  });
  AGENDA().forEach((v, i) =>
    nameText(v, COURSE[0], under + i * 46, {
      valign: "top",
      alpha: a * listIn(t, c.items, i),
      set: "agenda",
    }),
  );
  // When it ends: the station; the seats' names; or the other branch, an open question.
  const ends = a * ramp(t, c.ends - 0.15, 0.4);
  station(COURSE[1], COURSE_Y, ends);
  nameText(L("散会时", "When it ends"), COURSE[1], over, {
    valign: "bottom",
    alpha: a * named(t, c.ends),
  });
  const [dx, dy] = at(x - 40, y + 56),
    [px] = at(x + 40, y + 61);
  nameText(L("决定", "A decision"), dx - 11 * k - NAME_GAP, dy, {
    align: "right",
    alpha: a * named(t, c.decision),
  });
  growName(
    t,
    L(["谁去做、", "什么时候做完"], ["Who does what"]),
    L([c.whoDoes, c.byWhen], [c.whoDoes]),
    px + 14 * k + NAME_GAP,
    dy,
    { valign: "middle", build: true, alpha: a },
  );
  const missing = a * ramp(t, c.missing - 0.15, 0.4),
    openY = COURSE_Y + 110;
  link(COURSE[1], COURSE_Y + STATION_R + 2, COURSE[1], openY - 24, {
    alpha: missing,
    upto: soon(t, c.missing + 0.05, 0.4),
    width: 2.5,
  });
  openMark(COURSE[1], openY, 20, { alpha: missing, turn: vt * 0.6 });
  nameText(L("还缺什么", "Still missing"), COURSE[1], openY + 20 + NAME_GAP, {
    valign: "top",
    alpha: a * named(t, c.missing),
  });
}
function station(x, y, alpha) {
  if (alpha < 0.01) return;
  dot(x, y, STATION_R, { color: P.ground, alpha });
  ring(x, y, STATION_R, { color: P.ink, alpha, width: 3 });
}

/* F: F1 the two kinds apart, their ways toward each other stopping at the divider; F2 the refusals and the conflict. */
export function stageApart(s, t, a, c) {
  const F1 = a * stageOut(t, c.actAgain),
    F2 = a * stageIn(t, c.actAgain);
  if (F1 > 0) {
    twoKinds(s, t, F1, c, { facts: true });
    const ways = F1 * ramp(t, c.substitute - 0.15, 0.4),
      reach = soon(t, c.substitute + 0.05, 0.5);
    line(KINDS.left + 64, KINDS.y, mix(KINDS.left + 64, 944, reach), KINDS.y, {
      alpha: ways,
      width: 2.5,
    });
    line(KINDS.right - 61, KINDS.y, mix(KINDS.right - 61, 976, reach), KINDS.y, {
      alpha: ways,
      width: 2.5,
    });
    [944, 976].forEach((bx) =>
      bar(bx, KINDS.y, { alpha: ways * (reach > 0.95 ? 1 : 0), vertical: true, length: 34 }),
    );
    rejectedName(L("替代", "Substitution"), 960, KINDS.y + 110 + NAME_GAP, {
      valign: "top",
      alpha: F1 * named(t, c.substitute),
      mark: ramp(t, c.substitute + 0.05, 0.3),
    });
  }
  if (F2 > 0) refusals(t, F2, c);
}

/* F2's places: the kinds on the top row, the false fact, the report and the action on the middle row, their names on
 * one baseline under them, and the refusals the report keeps under its name. */
const TOP = 285,
  MID = 560,
  MID_NAMES = MID + 52 + NAME_GAP,
  SIDES = [600, 1320];
function refusals(t, a, c) {
  // Until the first refusal the two kinds stand alone at the frame's middle; they glide up to the top row as it comes.
  ctx.save();
  ctx.translate(0, glide(t, MID - TOP - 50, [[c.falseTrue, 0]]));
  seal(SIDES[0], TOP, 46, { alpha: a });
  recordMark(SIDES[1], TOP, 88, 112, { alpha: a });
  nameText(L("行动依据", "Authority to act"), SIDES[0] - 46 - NAME_GAP, TOP, {
    align: "right",
    alpha: a,
  });
  nameText(L("事实依据", "Authority about facts"), SIDES[1] + 44 + NAME_GAP, TOP, {
    align: "left",
    alpha: a,
  });
  // Authority to act cannot make a false fact true: the seal's way down to it stops at a bar.
  const falseOn = a * ramp(t, c.falseTrue - 0.15, 0.4),
    stop = TOP + 150;
  line(SIDES[0], TOP + 50, SIDES[0], mix(TOP + 50, stop - 6, soon(t, c.falseTrue + 0.05, 0.5)), {
    alpha: falseOn,
    width: 2.5,
  });
  bar(SIDES[0], stop, { alpha: falseOn * ramp(t, c.falseTrue + 0.45, 0.2) });
  dashedPage(SIDES[0], MID, 84, 104, { alpha: falseOn });
  nameText(L("假的事实", "A false fact"), SIDES[0], MID_NAMES, {
    valign: "top",
    alpha: a * named(t, c.falseTrue),
  });
  // A fact does not grant permission to act: the record's way down to the action stops at a bar.
  const actOn = a * ramp(t, c.permission - 0.15, 0.4);
  // The record's way is shorter than the seal's, its bar nearer the record: two refusals, not one repeated shape.
  const stop2 = stop - 36;
  line(SIDES[1], TOP + 60, SIDES[1], mix(TOP + 60, stop2 - 6, soon(t, c.permission + 0.05, 0.5)), {
    alpha: actOn,
    width: 2.5,
  });
  bar(SIDES[1], stop2, { alpha: actOn * ramp(t, c.permission + 0.45, 0.2), length: 34 });
  // Once refused, a point runs down each way in voice time and stops at its bar.
  const q = (voiceTime(t) * 0.4) % 1;
  [
    [SIDES[0], TOP + 50, c.falseTrue],
    [SIDES[1], TOP + 60, c.permission, stop2],
  ].forEach(([wx, from, at, end = stop]) => {
    if (t > at + 0.6) flowDot(wx, mix(from, end - 8, q), 4.5, q, { color: P.line, alpha: a });
  });
  actionMark(SIDES[1], MID, { alpha: actOn });
  nameText(L("去做的权限", "Permission to act"), SIDES[1], MID_NAMES, {
    valign: "top",
    alpha: a * named(t, c.permission),
  });
  // When the two conflict: the conflict between them, joined to each; its way runs down to the report.
  const conflict = a * ramp(t, c.conflict - 0.15, 0.4),
    meet = soon(t, c.conflict + 0.05, 0.5);
  stroke(
    () => {
      ctx.moveTo(SIDES[0] + 52, TOP);
      ctx.lineTo(mix(SIDES[0] + 52, 930, meet), TOP);
      ctx.moveTo(SIDES[1] - 50, TOP);
      ctx.lineTo(mix(SIDES[1] - 50, 990, meet), TOP);
    },
    { color: P.line, alpha: conflict, width: 2.5 },
  );
  conflictMark(960, TOP, { alpha: conflict });
  nameText(L("冲突", "Conflict"), 960, TOP - 12 - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.conflict),
  });
  const report = a * ramp(t, c.report - 0.15, 0.4);
  link(960, TOP + 16, 960, MID - 36, {
    alpha: report,
    upto: soon(t, c.report + 0.05, 0.5),
    width: 2.5,
  });
  reportMark(960, MID, { alpha: report });
  nameText(L("冲突和影响", "The conflict and its impact"), 960, MID_NAMES, {
    valign: "top",
    alpha: a * named(t, c.report),
  });
  const refused = [c.alter, c.oneSide];
  L(["改记录", "照其中一边去做"], ["Altering the record", "Acting for one side"]).forEach((v, i) =>
    rejectedName(v, 960, MID_NAMES + 58 + i * 44, {
      valign: "top",
      alpha: a * listIn(t, refused, i),
      mark: ramp(t, refused[i] + 0.05, 0.3),
      set: "refused",
    }),
  );
  ctx.restore();
}
