## Context

Edition 1.0.0 passed review round 16 without a finding. This Change repairs that round's notes and three findings of the release preparation. The film's method, narrator, runtime and argument do not change, so the design of the formation Change still describes the film; this document records only the decisions that the repairs need.

## Goals / Non-Goals

**Goals:**

- Repair every note of round 16 that the film owns, each against its own reverification line.
- Bring the scripts' descriptive fields and the requirements in line with what the release publishes.
- Calibrate the picture floors with a rebuild that owes nothing to the production build.

**Non-Goals:**

- No change to approved wording without the owner's decision on the exact text.
- No change of the engine: EN16-n8 stays with `filmkit`.

## Decisions

1. **The published review records own the notes.** Tasks cite a note by its id; the observation, repair and reverification lines are read in the review records of release 1.0.0. A copy in this Change would be a second record that could drift.
2. **Fidelity comes before the caption-echo measure (EN16-n1).** The English 04.7 list regains "independent review", and the cue that it then echoes is declared by name. The alternative, breaking the caption elsewhere, would change the caption timing of a sentence that reads well.
3. **A structure draws each arm on that arm's words.** 01.3's rail ends at the third failure until the fourth is told, as 01.2 does since round 16. The stage is placed so that the three-failure state keeps the film's balance limit. Both editions share the scene, so one repair serves ZH16-n2 and EN16-n3.
4. **The closing point starts early enough to arrive (EN16-n4).** It starts on the words that name the judgment and rests at the listener by the last word. Dropping the point was considered; the passage is the film's last picture of its argument and reads better complete.
5. **The ring's stations use the questions' words (ZH16-n1),** as the English ring does since round 16, so both editions name the same things in the same kind of word.
6. **A new take must meet the thought rule on its own (EN16-n5).** 03.2 is auditioned for a take at 17.0 dB or more. Only if no take meets it does the design state that a thought of fewer than 150 kept frames is judged with its segment, with the measured spread as the reason.
7. **The floors come from a clean checkout (release finding 3).** The comparison of 14 November ran against a release folder staged from the accepted build, so every frame was identical. The rebuild that calibrates the floors is made from an anonymous clone of the `v1.0.0` tag with no earlier output, following the README.

## Risks / Trade-offs

- A script-field change alters the digests of film-bound sources. → The edition is rebuilt, reviewed and released as 1.0.1; nothing is patched into 1.0.0.
- The repaired scenes could move the balance or sync of their neighbours. → The picture audits run on both editions before any render, and each repair is checked against the whole reverification list of its note.
- The clean rebuild could show a film below 45 dB. → The manifest then records the measured floor after the lowest frames are inspected side by side, as the reproduction requirement says.
