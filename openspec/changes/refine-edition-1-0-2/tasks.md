## 1. Specification

- [ ] 1.1 Add the requirement that marks keep the film's declared pace and that no chapter title travels; done when `openspec validate refine-edition-1-0-2 --strict` passes.

## 2. Engine

- [ ] 2.1 Adopt `filmkit` 0.22.3: pin its tag and refresh the lock; done when the lock holds the tag's commit, the repository's check passes, and both soundtracks and timelines assembled on it hold the digests of release 1.0.1.

## 3. Picture

- [ ] 3.1 Dissolve the chapter card where it stands and fade the running head and the part's name in at their places; done when a headless trace at 60 fps finds no title travelling at any chapter opening of either edition and a picture test pins it.
- [ ] 3.2 Declare the pace limit of 450 px/s and recut the stretches the motion audit refuses; done when `check-picture` reports no stretch over the limit in either staged edition.
- [ ] 3.3 Set the four English row pairs of 04, 06 and 07 at 1.7 times their size or more; done when the row probe at 1.7 lists no pair in either staged edition.
- [ ] 3.4 Name the three Chinese labels of ZH17-n1 in their clauses' words; done when the sync audit lists none of the three under other words and no new label out of sync or repeating its whole cue, and the lists keep their edges.
- [ ] 3.5 Answer EN17-n3 for the rails of 01.3, 03.4 and 08.3; done when no rail in full ink stands more than 1.0 s ahead of the name under it, or the design declares each rail that does by name with its measured reason.
- [ ] 3.6 Answer EN17-n4 for 06.3's point; done when the point rests on the chain's last station by the last word's end in both editions, or no point runs the chain.
- [ ] 3.7 Measure the whole-pixel steps of text under the slow camera with and without sub-pixel positioning (EN17-n5); done when the steps are gone with no new finding of the audits, or the design declares whole-pixel text with the measurement.
- [ ] 3.8 Publish each drawn stroke's share in the frame's layout; done when the part-drawn scan reads the published shares and lists no stroke part-drawn in a quiet of either edition.
- [ ] 3.9 Run the picture audits on both staged editions; done when `mise run film:picture` reports no gated finding before its first render.

## 4. Review standard

- [ ] 4.1 State the owner's line for a single thought's clarity in the review prompt (EN17-n1); done when the fourth rejected pattern ends with the owner's sentence and the sound gate lists no thought under 16.0 dB in English or 17.0 dB in Chinese.

## 5. Edition

- [ ] 5.1 Set the version to 1.0.2 and record the edition in the Changelog; done when `mise run check` passes.
- [ ] 5.2 Build both editions; done when `mise run film:build` ends with every film verified.
- [ ] 5.3 Obtain an independent review of each edition; done when every dimension is at 95 or above and no material or minor finding stands.
- [ ] 5.4 Deliver the reviewed editions; done when the delivery reads back from Documents.
- [ ] 5.5 Record the 1.0.2 assets in `content/release.json`; done when `tests/delivery/test_release.py` passes against the staged release folder.
