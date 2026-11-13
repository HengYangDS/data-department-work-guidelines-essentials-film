/** Parts 01-04 of the composition, composer a's: for each part and stage, on the authored timeline, the part paints,
 * never plays speech over an empty picture, and at three times in each stage its lit picture keeps the reviewers'
 * balance and cover limits, holds at most twelve names and sets no two of them over each other; the points that come
 * to rest over their lists stand on the lists' axes; the key-word labels the sync audit cannot time arrive on their
 * words. The modules load one edition per process, so this file runs its edition (PARTS_EDITION, Chinese by default)
 * and runs itself again for the other. */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { authoredTimeline, emptySpeech, openModules } from "./page.mjs";

const CODE = process.env.PARTS_EDITION ?? "zh";
const film = await authoredTimeline(CODE);
const composition = await openModules(film);
const en = CODE === "en";
const segment = (id) => film.segments.find((v) => v.id === id);

/* The start of the first word of a phrase in a segment, matched by letters as the scenes' cues match it. */
const units = (v) => v.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
function wordAt(s, zh, english, after = -Infinity) {
  const target = units(en ? english : zh);
  let spoken = "";
  const starts = s.words.map((w) => {
    const at = spoken.length;
    spoken += units(w.text);
    return at;
  });
  const from = s.words.findIndex((w) => w.start >= after);
  const index = spoken.indexOf(target, from < 0 ? spoken.length : starts[from]);
  assert.ok(index >= 0, `${s.id}: no ${en ? english : zh}`);
  return s.words[starts.findLastIndex((v) => v <= index)].start;
}

/* Each part's stages, as the phrase whose words cut each one in. */
const STAGES = {
  "01": [
    ["昨晚", "Last night"],
    ["有人马上说", "Someone says at once"],
    ["大家都在忙碌", "Everyone keeps busy"],
    ["数据部门工作指南", "The Data Department Work Guidelines"],
  ],
  "02": [
    ["这份指南", "The guidelines"],
    ["数据工作的价值", "The value of data work"],
    ["一项任务", "a task"],
    ["连夜", "The colleague"],
  ],
  "03": [
    ["两种依据", "Two kinds of authority"],
    ["有先后", "an order of precedence"],
    ["另一种", "Authority about facts"],
    ["优先看原始记录", "primary records"],
    ["拿昨晚的事来说", "Take last night"],
    ["开头那场会", "The meeting at the start"],
    ["两种依据不能", "Neither kind"],
  ],
  "04": [
    ["四条底线", "Four boundaries"],
    ["第一", "First"],
    ["在这四条底线之内", "Inside these boundaries"],
    ["要留多少记录", "Risk sets the process"],
    ["昨晚的事", "Last night's case"],
    ["风险高低", "Whatever the risk"],
  ],
};
/* Three times in each stage: two seconds in (or its middle, if it is shorter), its middle and just before the next
 * stage cuts in, the instants the reviewers' limits are stated for. */
function stageTimes(id) {
  const s = segment(id),
    starts = STAGES[id].map(([zh, english]) => wordAt(s, zh, english));
  return starts.map((start, k) => {
    const end = starts[k + 1] ?? s.voice_end,
      middle = (start + end) / 2;
    return [Math.min(start + 2, middle), middle, end - 0.3];
  });
}

/* The gate's lit box: every stroke, fill and text of the scene bright enough over the ground in the content band. */
const rgb = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const luma = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
const GROUND = luma(rgb("#0F1519"));
const lit = (color, alpha, share) =>
  /^#[0-9a-f]{6}$/i.test(color ?? "") && GROUND + (luma(rgb(color)) - GROUND) * alpha * share > 48;
function picture(id, t) {
  const paints = [];
  const { texts } = composition.render(t, (p) => paints.push(p));
  const box = [Infinity, Infinity, -Infinity, -Infinity],
    grow = ([x, y]) => {
      if (y < 120 || y > 900) return;
      box[0] = Math.min(box[0], x);
      box[1] = Math.min(box[1], y);
      box[2] = Math.max(box[2], x);
      box[3] = Math.max(box[3], y);
    };
  for (const p of paints) {
    if (p.scene !== id || p.kind === "text") continue;
    const pts = p.subs.flat();
    if (!pts.length) continue;
    const xs = pts.map((q) => q[0]),
      ys = pts.map((q) => q[1]),
      share =
        p.kind === "fill"
          ? Math.min(1, (Math.max(...xs) - Math.min(...xs)) / 7) *
            Math.min(1, (Math.max(...ys) - Math.min(...ys)) / 7)
          : Math.min(1, (p.lineWidth * p.scale) / 7);
    if (lit(p.color, p.alpha, share)) pts.forEach(grow);
  }
  const names = texts.filter((v) => v.scene === id && v.role === "label" && v.alpha > 0.3);
  for (const v of names.filter((v) => lit(v.color, v.alpha, 0.5)))
    [
      [v.bounds[0], v.bounds[1]],
      [v.bounds[2], v.bounds[3]],
    ].forEach(grow);
  return { box, names };
}

/* Points that come to rest over the list that names them: from the last words of their stage's thought until the next
 * stage cuts in, each stands on its list's axis, within 10 px of the ink centre of every line, and the points stand
 * level, as 04.4's halted point stands over what is done at the edge and its free point over what is welcome (EN10-n2).
 * Each entry is a stage, by its index in STAGES, and the sets of its lists, left to right. */
const RESTS = { "04": [{ stage: 2, sets: ["free", "edge"] }] };
/* The points a scene paints at t, its ink fills 16 px across, by their centres left to right, and its texts. */
function restingPlaces(id, t) {
  const paints = [];
  const { texts } = composition.render(t, (p) => paints.push(p));
  const points = paints
    .filter(
      (p) => p.scene === id && p.kind === "fill" && /^#ece8df$/i.test(p.color) && p.alpha > 0.3,
    )
    .map((p) => {
      const xs = p.subs.flat().map((q) => q[0]),
        ys = p.subs.flat().map((q) => q[1]);
      return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    })
    .filter(([x0, y0, x1, y1]) => Math.abs(x1 - x0 - 16) < 3 && Math.abs(y1 - y0 - 16) < 3)
    .map(([x0, y0, x1, y1]) => [(x0 + x1) / 2, (y0 + y1) / 2])
    .sort((a, b) => a[0] - b[0]);
  return { points, texts: texts.filter((v) => v.scene === id && v.alpha > 0.3) };
}

for (const id of Object.keys(STAGES)) {
  test(`${CODE} ${id} paints through its speech and never speaks over an empty picture`, () => {
    const s = segment(id);
    for (const q of [0.1, 0.4, 0.7, 0.95])
      assert.ok(
        composition
          .render(s.voice_start + q * (s.voice_end - s.voice_start))
          .texts.some((v) => v.scene === id),
      );
    assert.deepEqual(
      emptySpeech(composition, film).filter((v) => v.startsWith(`${id}@`)),
      [],
    );
  });

  test(`${CODE} ${id} keeps balance, cover, name load and clear names in every stage`, () => {
    stageTimes(id).forEach((times, k) =>
      times.forEach((t) => {
        const where = `${id} stage ${k + 1} at ${t.toFixed(2)}`,
          { box, names } = picture(id, t);
        assert.ok(box[2] > box[0], `${where}: nothing lit`);
        const dx = ((box[0] + box[2]) / 2 - 960) / 1920,
          dy = ((box[1] + box[3]) / 2 - 510) / 1080,
          cover = ((box[2] - box[0]) * (box[3] - box[1])) / (1920 * 780);
        assert.ok(Math.abs(dx) <= 0.12 && Math.abs(dy) <= 0.12, `${where}: off ${dx}, ${dy}`);
        assert.ok(cover >= 0.05, `${where}: covers ${cover}`);
        const wholes = new Set(names.map((v) => v.whole));
        assert.ok(wholes.size <= 12, `${where}: ${wholes.size} names`);
        for (let i = 0; i < names.length; i++)
          for (let j = i + 1; j < names.length; j++) {
            const a = names[i].bounds,
              b = names[j].bounds;
            if (names[i].whole === names[j].whole) continue;
            const apart = a[2] <= b[0] || b[2] <= a[0] || a[3] <= b[1] || b[3] <= a[1];
            assert.ok(apart, `${where}: ${names[i].text} over ${names[j].text}`);
          }
      }),
    );
    for (const { stage, sets } of RESTS[id] ?? []) {
      const s = segment(id),
        next = wordAt(s, ...STAGES[id][stage + 1]),
        last = s.words.findLast((w) => w.start < next);
      for (const t of [last.end, next + 0.16]) {
        const where = `${id} stage ${stage + 1} at rest at ${t.toFixed(2)}`,
          { points, texts } = restingPlaces(id, t);
        assert.equal(points.length, sets.length, `${where}: ${points.length} points`);
        sets.forEach((set, k) => {
          const lines = texts.filter((v) => v.set === set);
          assert.ok(lines.length > 0, `${where}: no ${set} list`);
          for (const v of lines) {
            const off = points[k][0] - (v.bounds[0] + v.bounds[2]) / 2;
            assert.ok(
              Math.abs(off) <= 10,
              `${where}: the ${set} point ${off.toFixed(1)} px off ${v.text}`,
            );
          }
        });
        const rise = points[0][1] - points.at(-1)[1];
        assert.ok(
          Math.abs(rise) <= 2,
          `${where}: the points stand ${rise.toFixed(1)} px apart in height`,
        );
      }
    }
  });
}

/* Labels set in key words, which the sync audit lists as unmatched: each is first legible within 1.5 s before its
 * words and no later than half a second after them. */
const KEY_WORDS = [
  ["02", "委托", "Delegation", "委托", "delegate"],
  ["02", "解决问题", "Problem resolved", "解决问题", "resolve the problem"],
  [
    "03",
    "有效的契约、制度、规范、决策记录",
    "Contracts, policies, specifications, decision records",
    "有效的契约",
    "contracts",
  ],
  [
    "03",
    "工作计划、临时约定、个人偏好",
    "Work plans, provisional agreements, personal preferences",
    "工作计划",
    "Work plans",
  ],
  ["03", "假的事实", "A false fact", "假的变成真的", "false fact"],
  ["04", "停下来", "Stop", "停下来", "stop"],
  ["04", "局部、可逆", "Local, reversible work", "局部", "Local"],
];
test(`${CODE} key-word labels arrive on their words`, () => {
  for (const [id, zh, english, zhCue, enCue] of KEY_WORDS) {
    const s = segment(id),
      at = wordAt(s, zhCue, enCue),
      label = en ? english : zh;
    let first = null;
    for (let t = at - 2; t <= at + 1 && first === null; t += 0.05)
      if (
        composition
          .render(t)
          .texts.some((v) => v.scene === id && v.alpha > 0.3 && v.whole.startsWith(label))
      )
        first = t;
    assert.ok(first !== null, `${id}: ${label} never legible`);
    assert.ok(first >= at - 1.5 && first <= at + 0.5, `${id}: ${label} at ${first} for ${at}`);
  }
});

if (!process.env.PARTS_EDITION)
  test("en edition passes the same checks", () => {
    // The child runs as a test runner of its own, not as a subprocess reporting to this one, and with its own reporter:
    // a runner that wraps this one may name its reporter and one destination in NODE_OPTIONS, as ETHOS's behavior gate
    // does, and the child's reporter cannot share them.
    const env = { ...process.env, PARTS_EDITION: "en" };
    delete env.NODE_TEST_CONTEXT;
    delete env.NODE_OPTIONS;
    const run = spawnSync(
      process.execPath,
      ["--test", "--test-reporter=tap", fileURLToPath(import.meta.url)],
      { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 600000 },
    );
    const out = run.stdout + run.stderr;
    assert.equal(run.status, 0, out.slice(-4000));
    assert.match(out, /# pass 9\b/);
    assert.match(out, /# fail 0\b/);
  });
