/* Chapter cards, the running head with the part being shown and the illustrative chip of the head band. From ddwg-film v1.0.0 (c4e8aac), picture/film.js. */

import { ctx, measuring, resolution } from "../canvas.js";
import { blend } from "../drawing/colour.js";
import { font, line, measure, text } from "../drawing/strokes.js";
import { pill } from "../drawing/symbols.js";
import { cameraOf } from "./camera.js";
import { P, TYPE } from "../palette.js";
import { L, en, film } from "../timeline.js";
import { clamp, ease, mix, ramp } from "../timing/easing.js";

const chapterOrder = film.chapters.map((c) => c.id);
const chapterNumber = (id) => String(chapterOrder.indexOf(id) + 1).padStart(2, "0");
export const opensChapter = (s) => {
  const i = film.segments.indexOf(s);
  return i > 0 && film.segments[i - 1].chapter !== s.chapter;
};

/* Marks in the rising chapter title's path wait until it has risen above them: a mark at height y begins to fade in as
 * the title passes y - 45 and stands CLEAR seconds later, a short fade rather than one gated on the title's travel, so
 * the two never meet and the mark never snaps in behind the moving title; they still stand by the first word. */
const CLEAR = 0.4;
/* The time the rising title passes height h on the screen, on its way from its card's line (540) to the running head's
 * (72); never, for a height it does not rise past. */
function titlePasses(s, h) {
  const { start, duration } = riseOf(s);
  if (h >= 540) return start;
  if (h <= 72) return Infinity;
  const share = (540 - h) / (540 - 72);
  let lo = start,
    hi = start + duration;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (risen(s, mid) < share) lo = mid;
    else hi = mid;
  }
  return hi;
}
/* How far a mark drawn at height y has faded in behind the rising chapter title, the height measured on screen through
 * the scene's camera, so a closer shot keeps clear of the title as well as the scene's own frame. */
export const clearOfTitle = (s, t, y = 400) => {
  if (!opensChapter(s)) return 1;
  const c = cameraOf(s, t);
  return ramp(t, titlePasses(s, c.oy + c.k * (y - c.ay) - 45), CLEAR);
};

/* A chapter opens on one centred line, its number and title, with a short rule beneath, once the previous chapter has
 * faded. The line then rises and shrinks into the running head it becomes, landing LAND after the first word. From
 * rest it gathers pace over the first RAMP_IN of its way, while it still stands near the centre, crosses the content
 * band at an even CRUISE px/s and settles over the last RAMP_OUT in the head band, its pace eased in and out. So it no
 * longer flies up in 1.1 s at up to 1300 px/s, and it still crosses the content band in under 1.5 s, the longest a
 * build-up may stand off the content centre (filmkit's reviewed balance, rules/balance.mjs), which a slower crossing
 * would break. The rule fades in place below it as it leaves, so nothing crosses. */
const LAND = 0.3,
  CRUISE = 560,
  RAMP_IN = 0.12,
  RAMP_OUT = 0.07;
const cardLanding = (s) => s.voice_start + LAND;
/* A chapter title's rise: its way's length in px, from the card's centre to the running head's, when it sets off and
 * how long it takes, at CRUISE pace unless the opening is too short for that. */
function riseOf(s) {
  const title = film.chapters.find((c) => c.id === s.chapter).title,
    head = measure(`${chapterNumber(s.chapter)}  ${title}`, 24, false, "chapter"),
    way = Math.hypot(960 - (96 + head / 2), 540 - 72),
    start = Math.max(s.start, cardLanding(s) - ((1 + RAMP_IN + RAMP_OUT) * way) / CRUISE);
  return { way, start, duration: cardLanding(s) - start };
}
/* The share of its way the title has risen at t: its pace grows from rest by the smoothstep curve over the first
 * RAMP_IN, holds over the middle and falls to rest over the last RAMP_OUT; `covered` is the integral of smoothstep. */
const covered = (x) => x ** 3 - x ** 4 / 2;
function risen(s, t) {
  const { start, duration } = riseOf(s),
    pace = (1 + RAMP_IN + RAMP_OUT) / duration,
    gather = (2 * RAMP_IN) / pace,
    settle = (2 * RAMP_OUT) / pace,
    into = t - start;
  if (into <= 0) return 0;
  if (into < gather) return pace * gather * covered(into / gather);
  if (into < duration - settle) return RAMP_IN + pace * (into - gather);
  if (into < duration) {
    const y = (into - duration + settle) / settle;
    return 1 - RAMP_OUT + pace * settle * (y - covered(y));
  }
  return 1;
}
export function chapterCard(s, t) {
  if (!opensChapter(s) || t >= cardLanding(s)) return;
  const enter = ramp(t, s.start, 0.3);
  if (enter <= 0) return;
  const chapter = film.chapters.find((c) => c.id === s.chapter),
    number = chapterNumber(s.chapter);
  const large = en ? 54 : 60,
    q = risen(s, t),
    size = mix(large, 24, q);
  // The head's own spacing, scaled with the line: the number, two spaces, then the title.
  ctx.save();
  ctx.font = font(24, false, `${number}  ${chapter.title}`);
  const prefix = ctx.measureText(`${number}  `).width;
  ctx.restore();
  const gap = (prefix * size) / 24,
    total = gap + measure(chapter.title, size, false, "chapter");
  const left = mix(960 - total / 2, 96, q),
    y = mix(540, 72, q),
    ink = mix(1, 0.72, q) * enter;
  text(number, left, y, size, {
    color: blend(P.evidence, P.muted, q),
    alpha: ink,
    role: "chapter",
  });
  text(chapter.title, left + gap, y, size, {
    color: blend(P.ink, P.muted, q),
    alpha: ink,
    role: "chapter",
  });
  line(900, 600, 1020, 600, {
    color: P.line,
    alpha: enter * (1 - ramp(t, riseOf(s).start + 0.2, 0.4)),
  });
}
/* The Illustrative chip of an illustrative case: one fixed slot at the right of the running head, in screen space, so
 * it keeps its place and size from scene to scene. Like the running head it is a marker of the head band rather than a
 * label of the argument, so it adds no reading load. */
export function illustrative(alpha) {
  // A measuring pass looks for the scene's own first label, so the chip in the head band is left out of it.
  if (alpha < 0.015 || measuring) return;
  ctx.save();
  ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
  pill(L("示意", "Illustrative"), 1824, 74, {
    alpha,
    color: P.muted,
    border: P.line,
    size: 22 * TYPE,
    align: "right",
    padX: 14,
    h: 36,
    role: "marker",
  });
  ctx.restore();
}
export function runningHead(s, t) {
  if (t < film.segments[0].voice_start) return;
  const first = film.segments.find((v) => v.chapter === s.chapter);
  // The first chapter's head fades in with the voice; later heads are the chapter titles that rose into place.
  const a =
    0.72 *
    (first === film.segments[0]
      ? ramp(t, first.voice_start, 0.6)
      : t >= cardLanding(first)
        ? 1
        : 0);
  const chapter = film.chapters.find((c) => c.id === s.chapter);
  text(`${chapterNumber(s.chapter)}  ${chapter.title}`, 96, 72, 24, {
    color: P.muted,
    alpha: a,
    role: "chapter",
  });
}

/* The part being shown, when its chapter holds more than one: after the running head and a short rule, its number in
 * the chapter and its title, so the five essentials are counted and named while each is explained. It arrives with the
 * running head and changes at the scene's own cut. */
export function partHead(v, t) {
  const parts = film.segments.filter((x) => x.chapter === v.chapter);
  if (parts.length < 2) return;
  const a = 0.72 * ramp(t, cardLanding(parts[0]), 0.3);
  if (a <= 0) return;
  const chapter = film.chapters.find((c) => c.id === v.chapter),
    x = 96 + measure(`${chapterNumber(v.chapter)}  ${chapter.title}`, 24, false, "chapter") + 22;
  line(x, 61, x, 83, { color: P.line, alpha: a });
  text(`${parts.indexOf(v) + 1}  ${v.title}`, x + 22, 72, 24, {
    color: P.muted,
    alpha: a,
    role: "chapter",
  });
}
