/** No chapter title travels (edition 1.0.2): at each chapter opening the card's words keep their place at the centre
 * while they fade, and the running head and the part's name fade in at their own places in the head band. Until
 * edition 1.0.1 the title rose from the card into the running head, faster than the film's pace. */
import test from "node:test";
import assert from "node:assert/strict";

import { engineModule } from "../engine.mjs";
import { authoredTimeline } from "./page.mjs";

const { openComposition } = await import(engineModule("picture/headless-composition.mjs"));

const CARD = 540,
  HEAD = 72;

for (const code of ["zh", "en"])
  test(`${code} chapter titles keep their place while they fade`, async () => {
    const film = await authoredTimeline(code),
      composition = openComposition(film);
    const opens = film.segments.filter(
      (s, i) => i > 0 && film.segments[i - 1].chapter !== s.chapter,
    );
    assert.equal(opens.length, 3);
    for (const s of opens) {
      const left = new Map();
      let card = 0,
        head = 0,
        both = 0;
      for (let t = s.start - 0.5; t <= s.voice_start + 1; t += 1 / 60) {
        const texts = composition
          .render(t)
          .texts.filter((v) => !v.scene && v.role === "chapter" && v.alpha > 0.02);
        const bands = new Set();
        for (const v of texts) {
          const y = (v.bounds[1] + v.bounds[3]) / 2,
            band = Math.abs(y - CARD) < Math.abs(y - HEAD) ? CARD : HEAD;
          // Each such text stands in the card's line or in the head band, never between them.
          assert.ok(
            Math.abs(y - band) <= 12,
            `${s.id} ${v.text} at y ${y.toFixed(1)}, ${t.toFixed(2)} s`,
          );
          // And it keeps its left edge there, whatever its ink.
          const key = `${band} ${v.text}`;
          if (left.has(key))
            assert.ok(
              Math.abs(left.get(key) - v.bounds[0]) <= 1,
              `${s.id} ${v.text} moved from x ${left.get(key).toFixed(1)} to ${v.bounds[0].toFixed(1)}`,
            );
          else left.set(key, v.bounds[0]);
          bands.add(band);
          if (band === CARD) card = Math.max(card, v.alpha);
          else head = Math.max(head, v.alpha);
        }
        if (bands.size === 2) both++;
      }
      // The card read at full ink, the head arrived, and the two overlapped only while one dissolved into the other.
      assert.ok(card > 0.95, `${s.id} card peak ${card}`);
      assert.ok(head > 0.6, `${s.id} head peak ${head}`);
      assert.ok(both > 0 && both <= 30, `${s.id} card and head together for ${both} frames`);
    }
  });
