## Why

Release 1.0.1 published the films that review round 17 accepted: Chinese 99.9 and English 99.4, with no finding and seven notes, one on the Chinese edition and six on the English one. The owner asked that notes are repaired, not set aside, and design decision 13 of that edition's Change left three things to this one by name: the film's pace limit, the wider row line and the notes.

On 16 November 2026 the sister films' reviews set two standards that release 1.0.1 does not meet. A chapter title that travels to the running head faster than the film's pace was judged a mark that races, a pattern the owner rejected (the DDWG film's review round 41); this film's titles travel at 622 to 688 px/s. And the owner decided what a single thought's clarity is judged against, which the review prompt of this film does not yet state.

The notes are recorded, each with its observation, repair and reverification line, in the review records that release 1.0.1 publishes, `ddwg-essentials-zh-production-review.md` and `ddwg-essentials-en-production-review.md`, under the ids ZH17-n1 and EN17-n1 to EN17-n6. This Change cites them by id and does not copy them.

## What Changes

- No chapter title travels: the chapter card dissolves where it stands, and the running head and the part's name fade in at their own places.
- The film declares its pace limit, 450 px/s at 1080p, so the picture gate refuses a mark that moves faster, and the stretches the motion audit recorded over it in release 1.0.1 are recut.
- Neighbouring names on one row stand at least 1.7 times their size apart; four English pairs stood between 1.54 and 1.61.
- Three Chinese names say the words of their clauses (ZH17-n1).
- The rails that stand ahead of their names are drawn so that no arm waits in full ink over empty ground, or are declared by name with the measured reason (EN17-n3).
- 06.3's point comes to rest on the chain's last station by the last word, or the chain's lighting alone carries the passage (EN17-n4).
- The whole-pixel steps of text under the slow camera are measured against a sub-pixel setting, and repaired or declared by what the measurement shows (EN17-n5).
- The review prompt states the owner's line for a single thought's clarity, by which 07.5 and 02.4 are listed and not findings (EN17-n1).
- Each stroke that draws on publishes the share it has drawn, so a scan can find one that rests part-drawn in a quiet.
- Two repairs that the staged audits and scans asked for: 03.4's observation comes half a second before its words, so its record does not stand alone far off the centre, and the lighter chain of 06.3 ends on its end points, so the wider chain stays inside the safe area.
- The films are built on `filmkit` 0.22.3.

No spoken word changes and nothing is narrated: both soundtracks, timelines and captions stay those of release 1.0.1. The films stay 600 seconds, with the same narrator, chapters and argument. The result is edition 1.0.2.

Out of scope: the English rate measure between thoughts (EN17-n2), which the engine owns; the one English cue above the caption reading rate (EN17-n6), which stays declared by name; any approved wording; the engine's release.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `film-production`: a requirement is added that marks keep the film's declared pace and that no chapter title travels.

## Impact

- `picture/film/framing/chapters.js`, `picture/film/playback.js`, `picture/film/drawing/strokes.js` and the scenes of the parts the notes name, with the picture tests that pin them.
- `content/film.toml` for the pace limit and `content/review/prompt.md` for the owner's sentence; `pyproject.toml`, `uv.lock`, `README.md` and `NOTICE` for the engine.
- The scripts, casts and recordings do not change, so no film-bound source of the soundtracks changes; the composition does, so both editions are rendered and reviewed again. Release 1.0.1 stays published as it is.
