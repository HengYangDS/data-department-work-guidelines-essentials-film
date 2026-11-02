# Design

## Context

The 25-minute DDWG films, which `ddwg-film` builds on `filmkit`, explain the Data Department Work Guidelines document by document; their version 1.2.0 repairs the concepts they name against a concept contract. On 2026-11-01 the user approved an outline for a ten-minute essentials film that says what the guidelines are for and why they hold before how to follow them, and that follows one made-up incident: price data that arrived two hours late. On 2026-11-02 the user approved its bilingual text, revision 4 and then revision 7, which came with samples joined at its pauses. `filmkit` builds one film per repository, with two editions of equal length, so on 2026-11-02 `ethos adopt --create` formed `ddwg-essentials-film` with the foundation starter under ETHOS `0.2.0-alpha.27`: an ETHOS profile, the agent entry, a README and the OpenSpec configuration. The essentials film reuses what the DDWG and ETHOS films have qualified: the engine with its concept and readings checks, the narrator, the visual system, the review contract and the delivery.

## Goals / Non-Goals

**Goals:**

- Two independent editions, Chinese and English, each exactly 600 seconds at 60 fps, 2D only, narration without music, with small single-line captions.
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

The toolchain matches `filmkit` at `v0.3.0`: Node 26.13.0, CPython 3.12.16 and uv 0.13.6, with ETHOS `0.2.0-alpha.27` bound through the Mise declaration published with its release. The film depends on `filmkit` 0.3.0 as a uv Git source at its tag, so the lock pins the tag's commit; that release checks the concept contract and the declared readings before any narration. This is a new production, so it takes the speech engine `filmkit` 0.3.0 declares, `mlx-audio` 0.6.3 with MLX 0.32.4 in its lock, not the older one `ddwg-film` holds to reproduce its 1.1.0 takes. The npm lock pins HyperFrames 0.8.225, `puppeteer-core` 25.16.0, `@puppeteer/browsers` 3.2.6, GSAP 3.15.0, esbuild 0.25.12 and Prettier 3.9.10, and the film pins the browser build the engine renders with. The gate registry and the check policies follow `filmkit`'s, so the same gate-exact formatters and linters run here. The film's Python checks of the declaration, the scripts, the players and the fonts are tooling that a `film-checks` command gate runs in the portable proof, as in `ethos-film`. The engine is installed, not copied.

### Story and sources

The script is revision 7 as the user approved it, in eight parts under four chapters:

| Chapter                                | Part | Chinese title        | English title                        | Paragraphs |
| -------------------------------------- | ---- | -------------------- | ------------------------------------ | ---------: |
| 1 一次延迟 · One delay                 | 01   | 晚了两个小时         | Two hours late                       |          4 |
| 2 指南是什么 · What the guidelines are | 02   | 工作的价值           | What the work is worth               |          5 |
| 3 四个要点 · Four essentials           | 03   | 两种依据             | Two kinds of authority               |          6 |
|                                        | 04   | 四条底线             | Four boundaries                      |          7 |
|                                        | 05   | 让数据名副其实       | Data that means what it says         |          3 |
|                                        | 06   | 证据决定结论能说到哪 | Evidence sets the limit of the claim |          6 |
|                                        | 07   | 人与人工智能的协作   | Human–AI collaboration               |          4 |
| 4 下一次 · Next time                   | 08   | 让下一次做得更好     | Making the next attempt better       |          4 |

The opening's four failures each meet their answer later: the choice made before the facts in 03, which separates a fact, a hypothesis and a choice; the meeting without a decision, also in 03; the patch that leaves the mechanism untouched in 06, with the three layers of a fix; and the ten pages in 07, which name the decision an analysis must support. Each paragraph of the draft, a group between blank lines, is cut into thoughts where the idea shifts, at the same places in both editions. The ⊕ marks and the draft's notes are review aids and are not narrated.

Each part is one segment whose `source_sections` name the guideline sections its Sources line names and whose `concepts` name the contract entries it uses. `content/source-manifest.json` records the guidelines' repository, the commit `v8.0.0` names (`b9da15d`) and the SHA-256 of each cited document: the README, the seven documents under `docs/` and DR-0001. The draft was written against that release, and each part's cited sections are checked to exist there.

The script follows the rules the DDWG and ETHOS reviews established. A claim keeps the conditions, modality and scope of its section. The late price data and the example delegation in 07 are illustrations, and the narration says the incident is made up. Each concept keeps one rendering in each edition, and a term is explained the first time it is heard. The Chinese is spoken Chinese, written on its own, not translated from the English. The text is adopted before any synthesis: an independent sentence-by-sentence review of both scripts as written must score at least 90 in fidelity, concept fidelity, clarity on first hearing and idiom, with no material finding. A repair that changes approved words goes back to the user, and an adopted text change reopens narration, the picture cues and every later acceptance.

### Concepts and readings

`content/concepts.toml` copies the concept contract of `ddwg-film` as the user approved it, at commit `bf61bf9`. It holds the fourteen concepts the essentials film names, each with its essence, a passage quoted from `v8.0.0` and each edition's rendering, accepted forms and avoided words. Among them are 行动依据 / authority to act, 事实依据 / authority about facts, 决策负责人 / decision owner, 权限 / authority, 授权 / authorization, 人与人工智能的协作 / human–AI collaboration, 权威来源 / source of truth, 线索 / lead and 契约 / contract. The engine checks both scripts against the contract before narration. A rendering changes first in `ddwg-film`'s contract, with the user's approval, and is copied here, so that both films keep one rendering for each concept.

The review readings declare the reading in context of every ambiguous Chinese character the narration speaks, proposed from the spoken text by the engine's readings tool and then reviewed, and the spoken form of each name. The Chinese edition says 智能体 for Agent and names no Latin-script term; the English edition names the guidelines and Agents. Every declared reading and name is auditioned before full narration. Recognition alone cannot certify a heteronym, so a flagged reading is compared with takes of its homophones, and what that leaves unsettled goes to the user's ear.

### Runtime and pace

Each edition is exactly 600 seconds: 597 seconds of narration and designed quiet, then 3 seconds of credits. The narrator keeps its native articulation and the pauses inside each take. At 0.8 seconds between the thoughts of a paragraph, 1.6 seconds between paragraphs and 2.6 seconds between parts, revision 7 runs about 10.2 minutes in Chinese and 9.6 minutes in English. On 2026-11-02 the user allowed a runtime to change in whole minutes; nine minutes cannot hold the Chinese, so both editions keep ten. The Chinese pauses therefore settle near 0.7, 1.4 and 2.25 seconds and the English near 1.0, 2.0 and 3.3 seconds, and each part takes its natural length. These are the pauses of the samples that came with revision 7 when the user approved it.

The runtime is fitted with the engine's designed pauses: speech is never time-stretched, pauses inside a thought keep their floors, and no necessary punctuation is removed. The fitted pauses stay within a fifth of those values. A fit outside that range, or a pace the user's listening rejects, changes the text, which is adopted again, or, by the user's decision, the runtime.

### Narrator

Both editions use the narrator the DDWG and ETHOS films share. The Chinese cast speaks from the clear in-context reference (`7ff6347e`) derived from the unchanged identity root (`a355801a`); the English cast speaks from the unmodified English reference (`a763e48e`). Both carry the qualified model revision of Qwen3-TTS 12 Hz 1.7B Base (`a6eb4f68`) and temperature 0.46, the Chinese cast also its repetition penalty of 1.05, with this film's own seeds. The user listens to both narrations before the picture is planned.

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

### Fonts, captions and covers

Text with a Chinese character uses Noto Sans CJK SC subset to the characters the film draws; Latin-only text uses unmodified IBM Plex Sans, whose license reserves its name, so it is never subset. A test checks that each font maps every character drawn with it. The subsets are first cut from the adopted scripts and cut again once the picture is drawn, which keeps the repository small enough for either forge. Captions are small and single-line, and a term that reads as one name stays on one line. Each edition has a 16:9 cover with its title and the author, Yang HENG, painted by the composition's `renderCover`. The working titles are 「DDWG · 数据部门工作指南 · 精华版」 and "DDWG · Data Department Work Guidelines: The Essentials", and the user confirms them before the covers are painted.

### Review and delivery

The production review scores the exact build in the nine dimensions `ddwg-film` declares, concept fidelity among them, with the subject dimension stated for the essentials; every dimension and the overall mean must reach 90. At most one round of fixes follows, and a fixed build is reviewed again: unchanged frames are first proved identical, and the review covers the change.

Both editions are delivered to `~/Documents/ddwg-essentials-film/`, a new folder, through the engine's delivery with whole-file readback; both players are opened in a real browser. `~/Documents/ddwg-introduction-film/` and the 25-minute films are not touched.

### Publication

Code is MIT, the film content (script, narration, picture, covers and captions) is CC BY 4.0, and the fonts keep the SIL Open Font License; `NOTICE` names the narrator's provenance and the sources. A release carries the films and their checksums as Release assets, as `ddwg-film` and `ethos-film` do. The forge owner, namespace, name and visibility are decided by the user with the push, and the CI projection follows the forges then declared.

## Risks / Trade-offs

- [The guidelines change after `v8.0.0`] → The manifest names one commit; a later change reaches the film only through a new adopted text.
- [The speech and the pauses do not fill 600 seconds within a fifth of the samples' pauses] → The text changes and is adopted again, or the user decides the runtime; the voice is never forced.
- [The full narration differs in voice or pace from the samples] → The model revision, the references and the sampling settings are pinned, and the user listens to both full narrations before the picture.
- [The copied concept contract drifts from `ddwg-film`'s] → It names its source commit, a rendering changes there first, and the engine checks the copy on every build.
- [The voice misreads a heteronym or a name] → The declared readings, the auditions before full narration, the comparison with homophones and the user's ear.
- [A copied picture primitive diverges from its source] → The module names its source commit; the gates check the result, not the copy.

## Migration Plan

1. `filmkit` 0.3.0 was released on 2026-11-02, and `ethos adopt --create` formed `ddwg-essentials-film` the same day.
2. Carry out this Change in the order of `tasks.md`: toolchain, script, concepts and readings, narration, the user's listening, picture, render, review, delivery and the release preparation.

Rollback: before delivery nothing outside the repository changes. The delivery writes only `~/Documents/ddwg-essentials-film/`.

## Open Questions

- The titles, which the user confirms before the covers are painted.
- The forge owner, namespace, name and visibility of `ddwg-essentials-film`, decided by the user with the push.
