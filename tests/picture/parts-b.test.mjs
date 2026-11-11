/** Parts 05-08 (composer b) on the modules under picture/film/ themselves, as authored: for each part and both
 * editions, the part paints, never plays speech over an empty picture, and at three times in each of its stages its
 * lit picture stands within the balance and cover limits with no overlapping names. Each process loads the modules
 * once, on one edition's timeline, so the Chinese edition runs here and the English one in a child process. Stage
 * times are taken from each stage's first words, as the scenes cue them, because the authored timeline spaces words
 * evenly. */
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { authoredTimeline, emptySpeech, openModules } from "./page.mjs";

const EDITION = process.env.PARTS_B_EDITION ?? "zh";
const PARTS = ["05", "06", "07", "08"];
/* Each stage's first words, [zh, en], in the order the scenes cut to them. */
const STAGES = {
  "05": [
    ["说数据能用", "Calling data usable"],
    ["数据要先证明适合", "Data earns trust"],
    ["用之前", "So before relying"],
    ["还说不清", "Data with unknown meaning"],
    ["昨晚那份价格", "Last night's prices"],
    ["做历史研究", "In historical research"],
    ["报告", "No report"],
  ],
  "06": [
    ["回到昨晚", "Back to last night"],
    ["这件事要分三层处理", "The fix has three layers"],
    ["决策负责人批准", "The decision owner approves"],
    ["汇报时", "Report the state"],
    ["核验通过了", "Verified means"],
    ["每次说完成", "Every completion claim"],
    ["测试通过", "A passing test"],
  ],
  "07": [
    ["在人与人工智能的协作里", "In human–AI collaboration"],
    ["开头那十页分析", "Before the ten pages"],
    ["委托时要划清边界", "So delegate with a clear boundary"],
    ["比如这样委托", "A delegation for last night"],
    ["调用智能体的人", "The person who calls an Agent"],
  ],
  "08": [
    ["这种延迟", "This kind of delay"],
    ["学习的目的", "The aim of learning"],
    ["出事之前", "There may have been early signs"],
    ["那个监控", "The monitor needs"],
    ["一条规则", "Retire a rule"],
    ["回到开头那份数据", "Back to the price data"],
    ["把判断讲给别人", "And when you convey a judgment"],
  ],
};

if (!process.env.PARTS_B_EDITION)
  test("the English edition passes the same checks in its own process", () => {
    // The child runs as a test runner of its own, not as a subtest of this one.
    const env = { ...process.env, PARTS_B_EDITION: "en" };
    delete env.NODE_TEST_CONTEXT;
    const run = spawnSync(process.execPath, ["--test", fileURLToPath(import.meta.url)], {
      env,
      encoding: "utf8",
    });
    assert.equal(run.status, 0, `${run.stdout}\n${run.stderr}`);
    assert.match(run.stdout, /pass 12/u, run.stdout);
  });

const film = await authoredTimeline(EDITION);
const composition = await openModules(film);
// The modules are loaded now, so the cue resolver reads this edition's words.
const { cue } = await import("../../picture/film/timing/cues.js");
const ground = "#0f1519";

/** The lit box of a scene at t and its legible texts, as the kit's balance measure reads a frame: strokes and fills
 * above 0.2 opacity that are not the ground colour, and texts above 0.2 opacity, within the content band. */
function litFrame(id, t) {
  const paints = [];
  const layout = composition.render(t, (paint) => paints.push(paint));
  const points = [];
  for (const p of paints) {
    if (p.scene !== id || p.kind === "text" || p.alpha <= 0.2) continue;
    if ((p.color ?? "").toLowerCase() === ground) continue;
    for (const sub of p.subs ?? [])
      for (const [x, y] of sub) if (y >= 120 && y <= 900) points.push([x, y]);
  }
  const texts = layout.texts.filter(
    (v) =>
      v.scene === id &&
      v.alpha > 0.2 &&
      v.role !== "marker" &&
      v.bounds[1] >= 110 &&
      v.bounds[3] <= 905,
  );
  for (const v of texts) points.push([v.bounds[0], v.bounds[1]], [v.bounds[2], v.bounds[3]]);
  if (!points.length) return { box: null, texts };
  const xs = points.map((p) => p[0]),
    ys = points.map((p) => p[1]);
  return { box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], texts };
}
const overlapping = (texts) => {
  const legible = texts.filter((v) => v.alpha > 0.3);
  for (let i = 0; i < legible.length; i++)
    for (let j = i + 1; j < legible.length; j++) {
      const a = legible[i].bounds,
        b = legible[j].bounds;
      const w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]),
        h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
      if (w > 2 && h > 2) return `${legible[i].text} | ${legible[j].text}`;
    }
  return null;
};

for (const id of PARTS) {
  const segment = film.segments.find((v) => v.id === id);

  test(`${EDITION} ${id} paints its words while its voice runs`, () => {
    for (const q of [0.15, 0.5, 0.85]) {
      const at = segment.voice_start + q * (segment.voice_end - segment.voice_start);
      const { texts } = composition.render(at);
      assert.ok(
        texts.some((v) => v.scene === id && v.alpha > 0.3),
        `${id} shows no name at ${at.toFixed(2)}`,
      );
    }
  });

  test(`${EDITION} ${id} never plays speech over an empty picture`, () => {
    const runs = emptySpeech(composition, { ...film, segments: [segment] });
    assert.deepEqual(runs, []);
  });

  test(`${EDITION} ${id} keeps each stage balanced, covered and its names apart`, () => {
    const starts = STAGES[id].map(([zh, en]) => cue(segment, zh, en));
    starts.forEach((start, k) => {
      const end = starts[k + 1] ?? segment.voice_end,
        span = end - (start + 0.18);
      // From half way, a stage's parts have built; a glide between two of its states lasts under a second, which
      // the limits allow for under two seconds of speech.
      for (const q of [0.5, 0.75, 0.97]) {
        const t = start + 0.18 + q * span,
          { box, texts } = litFrame(id, t),
          where = `${id} stage ${k + 1} at ${t.toFixed(2)}`;
        assert.ok(box, `${where}: nothing lit`);
        const dx = ((box[0] + box[2]) / 2 - 960) / 1920,
          dy = ((box[1] + box[3]) / 2 - 510) / 1080,
          cover =
            ((box[2] - box[0]) * (Math.min(box[3], 900) - Math.max(box[1], 120))) / (1920 * 780);
        assert.ok(
          Math.abs(dx) <= 0.12 && Math.abs(dy) <= 0.12,
          `${where}: off centre ${dx.toFixed(3)}/${dy.toFixed(3)}`,
        );
        assert.ok(cover >= 0.05, `${where}: covers ${(cover * 100).toFixed(1)}%`);
        assert.equal(overlapping(texts), null, `${where}: overlapping names`);
      }
    });
  });
}
