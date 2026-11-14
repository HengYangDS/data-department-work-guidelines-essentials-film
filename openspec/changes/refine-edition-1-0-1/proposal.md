## Why

Release 1.0.0 published the films that review round 16 accepted: Chinese 99.8 and English 99.1, with no finding and eleven notes, three on the Chinese edition and eight on the English one. The owner asked that notes are repaired, not set aside. Preparing the release found three more things: script fields that name the wrong voice reference, two requirements that name fewer assets than the release publishes, and a picture floor that no rebuild from a clean checkout has exercised.

The notes are recorded, each with its observation, repair and reverification line, in the review records that release 1.0.0 publishes, `ddwg-essentials-zh-production-review.md` and `ddwg-essentials-en-production-review.md`, under the ids ZH16-n1 to ZH16-n3 and EN16-n1 to EN16-n8. This Change cites them by id and does not copy them.

## What Changes

- The picture names what the voice says where three notes found it does not: the six stations of 05.2's ring in the Chinese edition (ZH16-n1), and "independent review" in the English 04.7 list, set like its neighbours (EN16-n1, EN16-n2).
- No part of the picture waits for words that have not come: 01.3's fourth arm is drawn on its own words in both editions (ZH16-n2, EN16-n3), and the point of 08.4 reaches its listener by the last word (EN16-n4).
- The names under 07.5's rail keep an even distance (ZH16-n3).
- The English thought 03.2 is auditioned for a clearer take (EN16-n5).
- The one English cue above the caption reading rate stays declared by name (EN16-n7).
- The scripts' three descriptive fields name the voice reference the casts read.
- The requirements name the four films and both staged picture documents that each edition publishes.
- Each film's picture floor comes from a rebuild of release 1.0.0 in a clean checkout.
- The wording of 08.4.2 (EN16-n6) changes only if the owner decides so on the exact text.

The films stay 600 seconds, with the same narrator, chapters and argument. The result is edition 1.0.1.

Out of scope: the English rate measure between thoughts (EN16-n8), which the engine owns and which no measure here establishes as audible; any other approved wording; the engine's release.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `film-production`: the media contract names the four films of each edition.
- `film-publication`: a release carries four films per edition and records both staged picture documents.
- `film-reproduction`: the comparison covers both staged picture documents of each edition.

## Impact

- `picture/film/scenes` for chapters 1, 4, 5, 7 and 8, and the picture tests that pin their labels.
- `content/film-script.json` and `content/en/film-script.json`, which are film-bound sources: their digests, the release manifest and every review binding change with them.
- `content/en/cast.json` if a new 03.2 take is selected, and `content/release.json` for the floors and the new assets.
- Both editions are narrated where their text or cast changes, rendered and reviewed again; release 1.0.0 stays published as it is.
