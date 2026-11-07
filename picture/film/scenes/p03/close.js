/* E and F (03.7-03.8). E, the made-up case, from 「前面说的那场会」/ "The meeting at the start": failure 3's meeting
 * returns at the centre, larger, on the line of its own course; before it, a station from which what is to be decided,
 * who decides and which facts are needed hang as one list; when it ends, a station from which, either, the two empty
 * seats of failure 3 fill with a decision and with the person who does what by when, or a branch ends in an open
 * question, what is still missing. F, from 「两种依据，不能」/ "Neither kind", one stage laid out once for its one
 * thought: the two kinds apart at the top, each named with what it answers; a divider rises between the two kinds,
 * each one's way toward the other stopping at a bar beside it; the seal's way to a false fact and the record's way to
 * an action each stop at a bar, over a rail drawn with the false fact on which the outcomes stand; when the two
 * conflict, the divider runs on down to the conflict, between them, and its way runs down to a report of the conflict
 * and its impact, under which the two ways it must not take are refused. */

import { ctx } from "../../canvas.js";
import { link } from "../../drawing/links.js";
import { dot, flowAt, flowDot, line, ring, stroke } from "../../drawing/strokes.js";
import { seal } from "../../drawing/symbols.js";
import { listIn, named } from "../../naming/lists.js";
import {
  NAME_GAP,
  growName,
  nameText,
  rejectedName,
  termRow,
  termRowLayout,
} from "../../naming/names.js";
import { P } from "../../palette.js";
import { L } from "../../timeline.js";
import { mix, ramp, soon } from "../../timing/easing.js";
import { voiceTime } from "../../timing/pauses.js";
import { meetingMark, openMark, people } from "../p01/failures.js";
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
  const runs = flowAt(t, COURSE[1] - COURSE[0]);
  flowDot(mix(COURSE[0], COURSE[1], runs?.q ?? 0), COURSE_Y, 5, runs, { color: P.ink, alpha: a });
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
    L(["谁去做、", "什么时候做完"], ["Who does what", " by when"]),
    [c.whoDoes, c.byWhen],
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

/* F's places: the kinds on the top row, each named beside itself at its outer side; the divider between them, named
 * over itself, and the conflict under it; the false fact, the report and the action over one rail, their names on one
 * baseline under it, and the refusals the report keeps under its name. The rail is drawn whole with the first outcome,
 * the false fact, on its words. The stage stands once, low enough that the two kinds alone on the top row stand within
 * the reviewers' limit of the content centre two seconds into the thought, and short enough that the whole thought's
 * picture stays balanced on it: the seal's way stops at a bar 114 px under the kinds' row and the record's at 90 px,
 * and the outcomes stand 30 px under the seal's bar, so nothing has to move to make room for what comes under the
 * kinds. */
const TOP = 418,
  DIVIDER = [TOP - 56, TOP + 56],
  /* The conflict stands far enough under the kinds' ways that its name, beside it, names it and not them. */
  CONFLICT_Y = DIVIDER[1] + 56,
  STOPS = [TOP + 114, TOP + 90],
  MID = STOPS[0] + 30 + 52,
  RAIL = MID + 60,
  MID_NAMES = RAIL + NAME_GAP,
  SIDES = [600, 1320],
  BARS = [944, 976];
export function stageApart(t, a, c) {
  // The two kinds on the top row stand from the stage's first frame; the outcomes' rail is drawn with the false fact.
  line(SIDES[0] - 60, RAIL, SIDES[1] + 60, RAIL, {
    color: P.line,
    alpha: a * ramp(t, c.falseTrue - 0.15, 0.4),
    width: 2.5,
  });
  seal(SIDES[0], TOP, 46, { alpha: a });
  recordMark(SIDES[1], TOP, 88, 112, { alpha: a });
  // Each kind keeps the whole name it has had since 03.2 and 03.4, its term and what it answers, centred on its row.
  [
    [L("行动依据", "Authority to act"), L("谁可以决定做什么", "who may decide"), -1],
    [
      L("事实依据", "Authority about facts"),
      L("靠什么认定一件事是真的", "what can establish truth"),
      1,
    ],
  ].forEach(([term, qual, side]) => {
    const { height } = termRowLayout([term], [qual], Infinity, false);
    termRow(
      t,
      [term],
      [-Infinity],
      [qual],
      [-Infinity],
      side < 0 ? SIDES[0] - 46 - NAME_GAP : SIDES[1] + 44 + NAME_GAP,
      TOP - height / 2,
      { align: side < 0 ? "right" : "left", inline: false, alpha: a },
    );
  });
  // Neither stands in for the other: on 「互相替代」/ "stands in for" a divider rises between them, named over itself as
  // the substitution refused, and each kind's way toward the other stops at a bar beside it.
  const ways = a * ramp(t, c.substitute - 0.15, 0.4),
    reach = soon(t, c.substitute + 0.05, 0.5),
    rise = soon(t, c.substitute + 0.05, 0.6);
  if (rise > 0)
    line(960, DIVIDER[1], 960, mix(DIVIDER[1], DIVIDER[0], rise), {
      color: P.line,
      alpha: a * Math.min(1, rise * 3),
      width: 3,
    });
  line(SIDES[0] + 52, TOP, mix(SIDES[0] + 52, BARS[0], reach), TOP, { alpha: ways, width: 2.5 });
  line(SIDES[1] - 50, TOP, mix(SIDES[1] - 50, BARS[1], reach), TOP, { alpha: ways, width: 2.5 });
  // The bars stand as the ways reach them, by a short fade of their own rather than at once.
  BARS.forEach((bx) =>
    bar(bx, TOP, { alpha: ways * ramp(t, c.substitute + 0.25, 0.4), vertical: true, length: 34 }),
  );
  rejectedName(L("替代", "Substitution"), 960, DIVIDER[0] - NAME_GAP, {
    valign: "bottom",
    alpha: a * named(t, c.substitute),
    mark: ramp(t, c.substitute + 0.05, 0.3),
  });
  // Authority to act cannot make a false fact true: the seal's way down to it stops at a bar.
  const falseOn = a * ramp(t, c.falseTrue - 0.15, 0.4),
    [stop, stop2] = STOPS;
  line(SIDES[0], TOP + 50, SIDES[0], mix(TOP + 50, stop - 6, soon(t, c.falseTrue + 0.05, 0.5)), {
    alpha: falseOn,
    width: 2.5,
  });
  bar(SIDES[0], stop, { alpha: falseOn * ramp(t, c.falseTrue + 0.45, 0.3) });
  dashedPage(SIDES[0], MID, 84, 104, { alpha: falseOn });
  nameText(L("假的事实", "A false fact"), SIDES[0], MID_NAMES, {
    valign: "top",
    alpha: a * named(t, c.falseTrue),
  });
  // A fact does not grant permission to act: the record's way down to the action stops at a bar.
  const actOn = a * ramp(t, c.permission - 0.15, 0.4);
  // The record's way is shorter than the seal's, its bar nearer the record: two refusals, not one repeated shape.
  line(SIDES[1], TOP + 60, SIDES[1], mix(TOP + 60, stop2 - 6, soon(t, c.permission + 0.05, 0.5)), {
    alpha: actOn,
    width: 2.5,
  });
  bar(SIDES[1], stop2, { alpha: actOn * ramp(t, c.permission + 0.45, 0.3), length: 34 });
  // Once refused, a point runs down each way in voice time and stops at its bar, its first from the way's top.
  [
    [SIDES[0], TOP + 50, c.falseTrue],
    [SIDES[1], TOP + 60, c.permission, stop2],
  ].forEach(([wx, top, at, end = stop]) => {
    const runs = flowAt(t, end - 8 - top, { from: at + 0.6 });
    flowDot(wx, mix(top, end - 8, runs?.q ?? 0), 4.5, runs, { color: P.line, alpha: a });
  });
  actionMark(SIDES[1], MID, { alpha: actOn });
  nameText(L("去做的权限", "Permission to act"), SIDES[1], MID_NAMES, {
    valign: "top",
    alpha: a * named(t, c.permission),
  });
  // When the two conflict: the divider runs on down to the conflict between them, named beside it, and its way runs
  // down to the report.
  const conflict = a * ramp(t, c.conflict - 0.15, 0.4);
  line(960, DIVIDER[1], 960, mix(DIVIDER[1], CONFLICT_Y - 12, soon(t, c.conflict + 0.05, 0.4)), {
    alpha: conflict,
    width: 3,
  });
  conflictMark(960, CONFLICT_Y, { alpha: conflict });
  nameText(L("冲突", "Conflict"), 960 + 22 + NAME_GAP, CONFLICT_Y, {
    align: "left",
    alpha: a * named(t, c.conflict),
  });
  const report = a * ramp(t, c.report - 0.15, 0.4);
  link(960, CONFLICT_Y + 12, 960, MID - 36, {
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
  L(["改记录", "悄悄照一边做"], ["Altering the record", "Acting as if one side had won"]).forEach(
    (v, i) =>
      rejectedName(v, 960, MID_NAMES + 52 + i * 44, {
        valign: "top",
        alpha: a * listIn(t, refused, i),
        mark: ramp(t, refused[i] + 0.05, 0.3),
        set: "refused",
      }),
  );
}
