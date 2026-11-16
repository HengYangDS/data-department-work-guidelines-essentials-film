## Context

Edition 1.0.1 passed review round 17 without a finding. This Change repairs that round's notes, takes up what design decision 13 of the edition's Change left to the next edition, and brings the film to two standards the sister films' reviews set on 16 November 2026. The film's method, narrator, runtime, argument and every spoken word stay as they are, so the design of the formation Change still describes the film; this document records only the decisions that the repairs need.

## Goals / Non-Goals

**Goals:**

- Repair every note of round 17 that the film owns, each against its own reverification line, or declare it with the measured reason.
- Remove the travelling chapter title and hold every move to a declared pace limit.
- State in the review prompt what a single thought's clarity is judged against, as the owner decided.

**Non-Goals:**

- No change to approved wording, and no narration: both soundtracks stay those of release 1.0.1.
- No change of the engine beyond adopting its current release: EN17-n2 stays with `filmkit`.

## Decisions

1. **The published review records own the notes.** Tasks cite a note by its id; the observation, repair and reverification lines are read in the review records of release 1.0.1. A copy in this Change would be a second record that could drift.
2. **No chapter title travels.** Rests on: the DDWG film's review round 41, which judged that film's chapter titles, travelling to the running head at about 1,150 px/s, a mark that races, a pattern the owner rejected; headless scans of release 1.0.1, which read this film's titles at 622 to 688 px/s at each of its three chapter openings in both editions, under the 900 px/s at which a mark races and over the 450 px/s the film's own glides keep. Considered: (a) a travel within 450 px/s, which over a way of about 900 px takes 2.2 to 3.1 s where a chapter's lead holds 1.86 s in Chinese and 2.45 s in English; (b) the card dissolving where it stands while the running head, the same words, fades in at its own place, as both sister films do since 16 November. Chosen because: (b) holds the pace in both editions and leaves the chapter pause its calm; (a) fits neither edition without lengthening pauses that the approved soundtracks fix. Applies to: `picture/film/framing/chapters.js`, the scene loop in `picture/film/playback.js`, the part's name in the head band, which arrived with the landing title and now fades in with the running head, and the marks that waited for the title to rise past them.
3. **The film declares its pace limit, 450 px/s at 1080p.** Rests on: design decision 13 of the previous Change; the motion audit of release 1.0.1, which recorded three Chinese and four English stretches at 453 to 518 px/s (01's failure flow, 04's ladder and its marks, 05's kit flow) with no limit declared; the sister films, which declare 450 px/s and whose reviewers hold every glide and flow to it. Considered: (a) declaring the stretches by name; (b) recutting each at its cause. Chosen because: (b): each is a few percent over, and a move that takes the time its distance needs costs nothing a viewer sees. Applies to: `content/film.toml` and the scenes of the recorded stretches.
4. **Neighbouring names on one row stand at least 1.7 times their size apart.** Rests on: design decision 13 of the previous Change, which names four English pairs between 1.54 and 1.61 ("Agent" and "Own account" in 04, "Decision owner" and "Limits" and "The claim" and "Acceptance" in 06, "Permissions" and "Verification" in 07); the engine's gate holds 1.5, and the sister films keep 1.7. Considered: widening the pitch of each row in both editions, or in English alone. Chosen because: one drawing for both editions where the balance allows it, as 06's chain took one pitch in the previous edition. Applies to: the rows of 04, 06 and 07.
5. **A single thought's clarity is judged against the floor less 1.0 dB, as the owner decided on 16 November 2026 (EN17-n1).** Rests on: the owner's answer of 16 November 2026 to two paths put with their measurements for the sister films, which keeps the floor (18 dB in Chinese, 17 dB in English) for the soundtrack and for each part and judges a single thought against the floor less 1.0 dB, with the thoughts between the two lines listed as notes; this film's English 07.5 at 16.86 dB and 02.4 at 16.98 dB by the engine's median over the frame grid's phases, the clearest of the takes design decision 9 of the previous Change weighed. Considered: nothing else: the standard is the owner's. Applies to: the fourth rejected pattern of `content/review/prompt.md`, which ends with the owner's sentence, unchanged, as in the sister films.
6. **Each stroke that draws on publishes the share it has drawn.** Rests on: the DDWG film's review round 41, which found a bracket resting three fifths drawn through a quiet; the motion audit judges what moves, not what stopped half made. Considered: a scan of drawn pieces alone, which cannot tell a stroke at rest part-drawn from a step of a build. Chosen because: the composition knows each stroke's share exactly. Applies to: `picture/film/drawing/strokes.js` and the frame's published layout.

## Risks / Trade-offs

- The repaired scenes could move the balance or sync of their neighbours. → The picture audits run on both staged editions before any render, and each repair is checked against the whole reverification list of its note.
- A declared pace limit turns a recorded stretch into a refusal on any later timeline. → Each recut leaves a margin under the limit, and the audits run again on both timelines after the last change.
- The engine's release could assemble a soundtrack that differs from release 1.0.1's. → The sound stage runs on the new release before any picture work, and the soundtracks' and timelines' digests are compared with the release's.
