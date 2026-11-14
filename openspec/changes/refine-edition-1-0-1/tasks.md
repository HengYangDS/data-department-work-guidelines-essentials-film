## 1. Specification

- [x] 1.1 Amend the three requirements so that they name each edition's four films and both staged picture documents (release finding 2); done when `openspec validate refine-edition-1-0-1 --strict` passes and every asset a scenario names is listed in `content/release.json`.

## 2. Reproduction

- [ ] 2.1 Rebuild release 1.0.0 from an anonymous clone of the `v1.0.0` tag that holds no earlier output, by the README's steps, and compare it with the published assets (release finding 3); done when the reproduction report lists a minimum for each of the eight films.
- [ ] 2.2 Inspect each film's lowest frames side by side and record its floor in `content/release.json` at or below the measured minimum; done when the comparison passes against the recorded floors.

## 3. Text

- [ ] 3.1 State the natural voice reference and its derivation in the scripts' `pacing_profile`, `provider_notes` and `performance_intent` fields (release finding 1); done when the fields name the recording that `content/voice-reference.json` names as `reference_audio`.
- [ ] 3.2 Adopt the wording of 08.4.2 that the owner approved on 14 November 2026 (EN16-n6): "the time each fact became available" for "the facts available at the time", 「每项事实最早能拿到的时间」 for 「当时能拿到的事实」, and the labels "When it was available" and 「最早能拿到的时间」; done when both scripts, narration texts and labels hold it and the readings and concept checks pass.

## 4. Voice

- [ ] 4.1 Audition the English thought 03.2 (EN16-n5); done when the selected take reads at most 1.0 dB under the edition on the soundtrack by the note's reverification line, or the design states the rule for short thoughts with the measured spread.
- [ ] 4.2 Narrate again every segment whose text task 3.2 changes, and qualify the takes; done when the release checks accept both soundtracks at exactly 600 seconds.

## 5. Picture

- [ ] 5.1 Name the three stations of 05.2's ring in the words of their questions in the Chinese edition (ZH16-n1); done when the sync audit judges all six stations in sync.
- [ ] 5.2 Draw 01.3's fourth arm on the fourth failure's own words in both editions (ZH16-n2, EN16-n3); done when no rail arm of 01.2 or 01.3 stands more than 1.0 s before the mark and name under it and every state of 2 s or more keeps the balance limit.
- [ ] 5.3 Give the names under 07.5's rail an even distance (ZH16-n3); done when every gap between adjacent names is at least 1.5 em and the rings' pitch is even within 2 px.
- [ ] 5.4 Restore "independent review" in the English 04.7 list and set the list with its separators like its three neighbours (EN16-n1, EN16-n2); done when both editions' 04.7 lists name the same five things and the echoed cue is declared by name.
- [ ] 5.5 Light the way of 08.4 through to the listener within the last aim's words in both editions, with no point running it (EN16-n4); done when the way stands whole no later than 0.3 s after the last word and no mark moves in the closing pause.
- [ ] 5.6 Keep the English cue at 356.27 s declared by name with its measured rate (EN16-n7); done when the engine lists no other caption above 25 characters per second.
- [ ] 5.7 Run the picture audits on both staged editions; done when `mise run film:picture` reports no gated finding before its first render.

## 6. Edition

- [ ] 6.1 Set the version to 1.0.1 and record the edition in the Changelog, with a Fixed entry that corrects how the 1.0.0 section names the ETHOS release the films were built under; done when `mise run check` passes.
- [ ] 6.2 Build both editions; done when `mise run film:build` ends with every film verified.
- [ ] 6.3 Obtain an independent review of each edition; done when every dimension is at 95 or above and no material or minor finding stands.
- [ ] 6.4 Deliver the reviewed editions; done when the delivery reads back from Documents.
- [ ] 6.5 Record the 1.0.1 assets in `content/release.json`; done when `tests/delivery/test_release.py` passes against the staged release folder.
