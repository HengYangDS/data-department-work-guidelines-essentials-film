# Design

## Context

The 25-minute DDWG films, which `ddwg-film` builds on `filmkit`, explain the Data Department Work Guidelines document by document; their version 1.2.0 repairs the concepts they name against a concept contract. On 2026-11-01 the user approved an outline for a ten-minute essentials film that says what the guidelines are for and why they hold before how to follow them, and that follows one made-up incident: price data that arrived two hours late. On 2026-11-02 the user approved its bilingual text, revision 4 and then revision 7, which came with samples joined at its pauses. `filmkit` builds one film per repository, with two editions of equal length, so on 2026-11-02 `ethos adopt --create` formed `ddwg-essentials-film` with the foundation starter under ETHOS `0.2.0-alpha.27`: an ETHOS profile, the agent entry, a README and the OpenSpec configuration. The essentials film reuses what the DDWG and ETHOS films have qualified: the engine with its concept and readings checks, the narrator, the visual system, the review contract and the delivery.

## Goals / Non-Goals

**Goals:**

- Two independent editions, Chinese and English, each exactly 660 seconds at 60 fps, 2D only, narration without music, with small single-line captions.
- What the guidelines are for and why they hold, before how to follow them, carried by one incident that the narration calls made up.
- Every claim traced to a cited section of the guidelines at `v8.0.0`, and every concept the film names kept in its source meaning, in each edition's one approved rendering.
- A repository that rebuilds both films from tracked sources and pinned supply, as `ddwg-film` and `ethos-film` do.
- Delivery to Documents with whole-file checks and readback, then the user's acceptance.

**Non-Goals:**

- Changes to the 25-minute films or to `ddwg-film`.
- Changes to `filmkit` made here. A gap in the engine is fixed by a Change and a release there, then adopted here.
- A shared library of picture primitives, music, 3D, or languages other than Chinese and English.
- Publishing, which waits for the user's confirmation of the owner, namespace, name and visibility.

## Decisions

### Repository and engine

The toolchain matches `filmkit` at `v0.9.0`: Node 26.13.0, CPython 3.12.16 and uv 0.13.7, with ETHOS `0.2.0-alpha.29` bound through the Mise declaration published with its release; the family moved to `0.2.0-alpha.28` from `0.2.0-alpha.27` on 2026-11-03 and to `0.2.0-alpha.29` on 2026-11-04, each time keeping the previous release as its rollback. The film depends on `filmkit` 0.9.0 as a uv Git source at its tag, so the lock pins the tag's commit; since 0.3.0 the engine checks the concept contract and the declared readings before any narration. This is a new production, so it takes the speech engine `filmkit` declares, `mlx-audio` 0.6.4 with MLX 0.32.4 in its lock, not the older one `ddwg-film` holds to reproduce its 1.1.0 takes. The npm lock pins HyperFrames 0.9.9, the renderer `filmkit` 0.9.0 requires, with `puppeteer-core` 25.16.0, `@puppeteer/browsers` 3.2.6, GSAP 3.15.0, esbuild 0.28.2, Prettier 3.9.10 and the `undici` 7.30.1 override, and the film pins the browser build the engine renders with. Both locks hold the newest releases their declarations admitted when the owner asked on 2026-11-02 for the latest stable supply, and again on 2026-11-03, when the film moved to `filmkit` 0.5.0 before any narration; a renderer published during production moves with the next recheck, not within the edition. The gate registry and the check policies follow `filmkit`'s, so the same gate-exact formatters and linters run here. The film's Python checks of the declaration, the scripts, the players and the fonts are tooling that a `film-checks` command gate runs in the portable proof, as in `ethos-film`. The engine is installed, not copied.

### Story and sources

The script is revision 7 as the user approved it, with the nine repairs of revision 7b that the user approved on 2026-11-03 after the script review: eight parts under the draft's four headings, the third of which now counts five essentials.

| Heading                                | Part | Chinese title        | English title                        | Paragraphs |
| -------------------------------------- | ---- | -------------------- | ------------------------------------ | ---------: |
| 1 一次延迟 · One delay                 | 01   | 晚了两个小时         | Two hours late                       |          4 |
| 2 指南是什么 · What the guidelines are | 02   | 工作的价值           | What the work is worth               |          5 |
| 3 五个要点 · Five essentials           | 03   | 两种依据             | Two kinds of authority               |          6 |
|                                        | 04   | 四条底线             | Four boundaries                      |          7 |
|                                        | 05   | 让数据名副其实       | Data that means what it says         |          3 |
|                                        | 06   | 证据决定结论能说到哪 | Evidence sets the limit of the claim |          6 |
|                                        | 07   | 人与人工智能的协作   | Human–AI collaboration               |          4 |
| 4 下一次 · Next time                   | 08   | 让下一次做得更好     | Making the next attempt better       |          4 |

The opening's four failures each meet their answer later: the choice made before the facts in 03, which separates a fact, a hypothesis and a choice; the meeting without a decision, also in 03; the patch that leaves the mechanism untouched in 06, with the three layers of a fix; and the ten pages in 07, which name the decision an analysis must support. Each of the draft's four headings is a chapter of the film and each part one segment. Each paragraph of the draft, a group between blank lines, is spoken as one thought, as it was in the samples the user approved, so the engine joins thoughts at the samples' paragraph pause and parts at their part pause. A paragraph longer than the longest thoughts the narrator has qualified, about 18 seconds, is cut once at a sentence end, at the same place in both editions; ten paragraphs are cut so, into 49 thoughts in all, and no word or mark changes; the review asked for the tenth, which sets 05's source-of-truth rule apart. The ⊕ marks and the draft's notes are review aids and are not narrated.

Each segment's `source_sections` name the sections its part's Sources line names, and its `concepts` name the contract entries both editions of it say. A document's opening, its text before the first second-level heading, is cited as `<document stem>:opening`; every other entry names a heading. `content/source-manifest.json` records the guidelines' repository, the commit `v8.0.0` names (`b9da15d`) and the SHA-256 of each cited document: the README, the seven documents under `docs/` and DR-0001. The draft was written against that release, and each segment's cited sections are checked to exist there.

The script follows the rules the DDWG and ETHOS reviews established. A claim keeps the conditions, modality and scope of its section. The late price data and the example delegation in 07 are illustrations, and the narration says the incident is made up. Each concept keeps one rendering in each edition, and a term is explained the first time it is heard. The Chinese is spoken Chinese, written on its own, not translated from the English. The text is adopted before any synthesis: an independent sentence-by-sentence review of both scripts as written must score at least 95 in fidelity, concept fidelity, clarity on first hearing and idiom, with no material finding; the owner raised this bar from 90 on 2026-11-03. A repair that changes approved words goes back to the user, and an adopted text change reopens narration, the picture cues and every later acceptance.

### Concepts and readings

`content/concepts.toml` copies the concept contract of `ddwg-film` as the user approved it, at commit `bf61bf9`. It holds the fourteen concepts the essentials film names, each with its essence, a passage quoted from `v8.0.0` and each edition's rendering, accepted forms and avoided words. Among them are 行动依据 / authority to act, 事实依据 / authority about facts, 决策负责人 / decision owner, 权限 / authority, 授权 / authorization, 人与人工智能的协作 / human–AI collaboration, 权威来源 / source of truth, 线索 / lead and 契约 / contract. The engine checks both scripts against the contract before narration. A rendering changes first in `ddwg-film`'s contract, with the user's approval, and is copied here, so that both films keep one rendering for each concept.

The review readings declare the reading in context of every ambiguous Chinese character the narration speaks, proposed from the spoken text by the engine's readings tool and then reviewed, and the spoken form of each name. The Chinese edition says 智能体 for Agent and names no Latin-script term; the English edition names the guidelines and Agents. Every declared reading and name is auditioned before full narration. Recognition alone cannot certify a heteronym, so a flagged reading is compared with takes of its homophones, and what that leaves unsettled goes to the user's ear.

On 2026-11-04 the narration of both editions was checked this way. Every declared Chinese occurrence, 564 of them, is heard as written or as its homophone in its word's span, and the last syllable or word of every thought of both editions is heard. The 22 Chinese occurrences whose readings recognition cannot tell apart match their declared readings by the measure that decides each pair, the pitch for a tone and the spectrum for a sound. 划不出 and 调用 were read huá and tiáo at every seed tried, so the pronunciation contract speaks them as their homophones 画不出 and 掉用. Of the 31 English heteronyms, 23 match their declared readings in both references of the deciding measure, after "the log records it" (03.5) was narrated again from a seed that says the verb. The other eight, close (04.5), contracts (03.3), duplicates (08.4), uses (06.5) and four occurrences of subject, stay undecided by this measure, which separates stress poorly; one subject (06.5) leans to the verb's stress, and all eight go to the user's ear.

### Runtime and pace

Each edition is exactly 660 seconds: 657 seconds of narration and designed quiet, then 3 seconds of credits. The narrator keeps its native articulation and its own pauses between the sentences of a take; a cap of 0.6 seconds in Chinese and 0.7 seconds in English, above the longest pause the samples hold, only guards against an outlier.

Revision 7 was planned at ten minutes from the speaking rate of the clear reference. The samples that came with it, which the user approved, were narrated from the identity root, and they join the paragraphs of part 01 with about 1.7 seconds of heard quiet in Chinese and 2.2 seconds in English. On 2026-11-02 one take of every thought, narrated with the samples' settings, measured 540 seconds of speech in Chinese and 536 seconds in English. At the samples' pauses, with the planned 2.25 and 3.3 seconds between parts, the editions run about 10.5 and 10.9 minutes, and ten minutes would need every pause cut nearly in half. The user allowed a runtime to change in whole minutes, so both editions run eleven. The English keeps its samples' pauses, about 2.15 seconds between thoughts and up to 4 seconds between parts. The Chinese has nearly the same speech and the same runtime, so it needs nearly the same quiet: about 2.1 seconds between thoughts, a quarter longer than its samples and within the range of the paragraph pauses of the released ETHOS film, and up to about 4 seconds between parts. The selected takes of 2026-11-03, measured at assembly, hold about 565 seconds of Chinese speech, with the retakes that end every Chinese thought on its own, and 558 seconds of English, so the thoughts are 1.95 seconds apart in Chinese and 2.0 seconds in English on average: about a seventh longer than the Chinese samples' pauses and a little shorter than the English samples'. The English reading retakes of 2026-11-04 add about a second of speech, so its thoughts are 1.97 seconds apart.

The runtime is fitted with the engine's designed pauses: speech is never time-stretched, no quiet is inserted inside a take, and no necessary punctuation is removed. The pauses between thoughts stay between four fifths and four thirds of the samples' pauses between paragraphs, and each pause between parts is longer than the thought pauses and at most 5 seconds. A fit outside those bounds, or a pace the user's listening rejects, changes the text, which is adopted again, or, by the user's decision, the runtime.

### Narrator

Both editions use the narrator the DDWG and ETHOS films share, set as it was for the revision-7 samples the user approved. The Chinese cast speaks from the unchanged identity root (`a355801a`) with the transcript those samples used, and the English cast from the unmodified English reference (`a763e48e`). Both carry the qualified model revision of Qwen3-TTS 12 Hz 1.7B Base (`a6eb4f68`), temperature 0.46 and an in-context repetition penalty of 1.05, with this film's own seeds, so a thought the samples hold is narrated again as the same take. The 25-minute films speak from a clear reference (`7ff6347e`) whose inner silences are all shortened to 0.12 seconds; a narration from it speaks through its commas, which the samples do not, so this film does not use it. The user listens to both narrations before the picture is planned.

### Picture

The composition in `picture/` is new and follows the DDWG visual system, including the patterns the user rejected in the 25-minute films:

- every name stays with its mark and is placed by a primitive, never as hand-set text;
- a list builds and leaves whole, never as a sliding window, with the current item in full ink and earlier ones at 0.58;
- two text sizes, no pills and no dot joins;
- relations are drawn as orthogonal links with end dots, not plain arrows;
- each thought holds at most twelve names, balanced on the content centre (960, 510), and a list that builds over one thought grows about that centre;
- emphasis never makes a concept look like a person.

The composition is authored as ES modules under `picture/film/`, which esbuild bundles unminified into the tracked `picture/film.js` that the engine reads, as in `ethos-film`. The primitives for names, placement, timing, framing and links are copied from `ethos-film`'s composition at `v1.0.1`, whose modules name their source; moving them into `filmkit` stays rejected for the reason `ethos-film` gives, since each film would keep its own copy until its next edition.

The film's motif is the timeline of the late price data: when it was due, when it arrived and the two hours between. The first plan for each part draws its mechanism on that timeline or beside it: the four failures leading away from it; signals becoming judgments, data assets and actions, and the three outcomes of a task; the two kinds of authority, and last night's fact, hypothesis and choice; the four boundaries and the forms that follow risk; the six questions and the availability time that moved two hours late; the three layers of the fix and the chain of trust; the boundary of a delegation; and the monitor that alerts when the data is late, before the ending returns to the data the next person uses. The plan is refined from the accepted narration, and picture cues follow the narration, never the reverse. The render waits until the frame audits of the current composition and timeline report no gated finding; an audit's exit status alone is not its verdict.

On 2026-11-04 the picture was composed from the plan (`build/evidence/picture-plan/2026-11-03-essentials-picture-plan.md`) in two halves, parts 01–04 and 05–08, from the shared primitives and under the rules above and the reviewers' measures of balance and cover. Where a rule and the plan disagreed, the rule won, and each departure is recorded with its reason (`build/evidence/picture-audit/2026-11-04-composition/`). Names are noun phrases, not clauses the caption already says, so no caption cue is mostly drawn as labels; the three layers of the fix in 06 take the renderings `ddwg-film` approved, 控制影响, 修复 and 防止再发生 (Containment, Repair, Prevention). The five ETHOS primitives no scene uses were not copied. Under `filmkit` 0.9.0 the composition over both assembled timelines passes `check-picture` with no gated or recorded finding in 19,801 frames of each edition.

### Fonts, captions and covers

Text with a Chinese character uses Noto Sans CJK SC subset to the characters the film draws; Latin-only text uses unmodified IBM Plex Sans, whose license reserves its name, so it is never subset. A test checks that each font maps every character drawn with it. The subsets are first cut from the adopted scripts and cut again once the picture is drawn, which keeps the repository small enough for either forge. Captions are small and single-line, and a term that reads as one name stays on one line. Each edition has a 16:9 cover with its title and the author, Yang HENG, painted by the composition's `renderCover`. The working titles are 「DDWG · 数据部门工作指南 · 精华版」 and "DDWG · Data Department Work Guidelines: The Essentials", and the user confirms them before the covers are painted.

### Review and delivery

The production review scores the exact build in the nine dimensions `ddwg-film` declares, concept fidelity among them, with the subject dimension stated for the essentials; every dimension and the overall mean must reach 95, a bar the owner raised from 90 on 2026-11-03. At most one round of fixes follows, and a fixed build is reviewed again: unchanged frames are first proved identical, and the review covers the change.

Both editions are delivered to `~/Documents/ddwg-essentials-film/`, a new folder, through the engine's delivery with whole-file readback; both players are opened in a real browser. `~/Documents/ddwg-introduction-film/` and the 25-minute films are not touched.

### Publication

Code is MIT, the film content (script, narration, picture, covers and captions) is CC BY 4.0, and the fonts keep the SIL Open Font License; `NOTICE` names the narrator's provenance and the sources. A release carries the films and their checksums as Release assets, as `ddwg-film` and `ethos-film` do. The forge owner, namespace, name and visibility are decided by the user with the push, and the CI projection follows the forges then declared.

## Risks / Trade-offs

- [The guidelines change after `v8.0.0`] → The manifest names one commit; a later change reaches the film only through a new adopted text.
- [The selected takes and the pauses do not fill 660 seconds within the declared bounds] → The text changes and is adopted again, or the user decides the runtime; the voice is never forced.
- [The full narration differs in voice or pace from the samples] → The model revision, the references and the sampling settings are pinned, and the user listens to both full narrations before the picture.
- [The copied concept contract drifts from `ddwg-film`'s] → It names its source commit, a rendering changes there first, and the engine checks the copy on every build.
- [The voice misreads a heteronym or a name] → The declared readings, the auditions before full narration, the comparison with homophones and the user's ear.
- [A copied picture primitive diverges from its source] → The module names its source commit; the gates check the result, not the copy.

## Migration Plan

1. `filmkit` 0.3.0 was released on 2026-11-02, and `ethos adopt --create` formed `ddwg-essentials-film` the same day. Before any narration the film moved to `filmkit` 0.4.0, released on 2026-11-03 with the latest stable supply, and the same day to `filmkit` 0.5.0, which renders with HyperFrames 0.9.5 and narrates with `mlx-audio` 0.6.4. Still before any narration it moved to `filmkit` 0.6.0, which renders with HyperFrames 0.9.6, refuses a render whose picture fails its headless gate and binds each retake to the speech it was auditioned on. Before any picture, on 2026-11-04, it moved to `filmkit` 0.8.1, which renders with HyperFrames 0.9.9, checks how the picture's text lines up and how it balances with the film's own fonts, as the owner's reviewers measure, and keeps a Chinese caption's closing quote on its line; `mlx-audio` stays 0.6.4, so the narration keeps every take it binds.
2. Carry out this Change in the order of `tasks.md`: toolchain, script, concepts and readings, narration, the user's listening, picture, render, review, delivery and the release preparation.

Rollback: before delivery nothing outside the repository changes. The delivery writes only `~/Documents/ddwg-essentials-film/`.

## Open Questions

- The titles, which the user confirms before the covers are painted.
- The forge owner, namespace, name and visibility of `ddwg-essentials-film`, decided by the user with the push.
