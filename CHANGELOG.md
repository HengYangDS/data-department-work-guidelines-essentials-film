# Changelog

All notable changes to the DDWG essentials films and their build are recorded here. The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and releases follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The repository runs ETHOS 0.2.0-beta.12 instead of 0.2.0-beta.10, the hosted GitHub job installs
  Mise 2026.11.14 instead of 2026.11.8, and the hosted jobs keep their CI artifacts for 14 days.
- Mise, npm and uv take a release only once it is a day old: Mise's `minimum_release_age` is 24
  hours, npm reads `min-release-age=1` from the repository's own `.config/npm/npmrc`, and uv's
  `exclude-newer` is 24 hours. No locked version changes. The films of 1.0.2 are unchanged.
- The GitLab jobs select their runners by `macos-latest` with `review` or `protected`, the one label
  the owner chose for both forges on 25 November 2026, where they selected `ci-macos-arm64-review`
  and `ci-macos-arm64-shell`. The CI files stay generated from `.config/ci/`, and GitHub's comes out
  unchanged.

### Removed

- Windows from the Mise supply: ETHOS's pin loses its `windows-arm64` and `windows-x64` archives,
  and the Mise lock loses the `windows-x64` table of each of its four tools (ETHOS, Node, Python and
  uv). Its Linux tables stay.

## [1.0.2] - 2026-11-17

### Added

- The film declares its pace limit, 450 px/s at 1080p, so `film:picture` refuses a glide or a flow that its motion audit measures moving faster, and a picture test holds every chapter title to its place while it fades.

### Changed

- No chapter title travels: the chapter card dissolves where it stands, for 1.07 s at half its ink or more in Chinese and 1.67 s in English, and the running head and the first part's name fade in at their own places, where the title rose into the running head at 622 to 688 px/s; a chapter's first scene begins as the card leaves.
- Every glide and flow the motion audit measures keeps the film's pace limit. The motion audit had recorded three Chinese and four English stretches over it in 1.0.1, the fastest at 518 px/s, and each is timed by its way: 01.3's glide of the two told failures, 04.1's point, 04.2's hand-over of the field and 05's point up the trunk. One mark the audit does not measure stays over the limit, as in 1.0.1: the turned-down end of 01.3's rail travels with the rail's drawing end, at the draw pace of 820 px/s, as the row opens. Review round 18 lists it as EN18-n4, and the next edition recuts it.
- Neighbouring names on one row stand at least 1.7 times their size apart: 06's chain takes a pitch of 188 px, 07's English stations 202 px, and 04's refused account stands further from the Agent's name.
- Three Chinese names say the words of their clauses: 什么情况下成立 in 02.3, 不对外承诺 in 04.5 and 修掉直接的原因 in 06.2.
- 03.4's way over the five leads and 08.3's rail under the rule light along themselves to each station as it is said, as 06.3's chain does, so no lit rail stands ahead of the name under it. 06.3's point runs the whole chain and rests on its last station as its thought ends, where it rested a quarter of the way past the fifth station.
- 03.4's observation inks in half a second before its words, so its record does not stand alone far off the centre, and the lighter chain of 06.3 ends on its end points.
- No spoken word changes and nothing is narrated again: both soundtracks, timelines and captions hold the bytes of 1.0.1. The Chinese narration has 2,443 Han characters and the English 1,549 words, and each soundtrack lasts exactly 600 seconds.
- The review prompt states what a single thought's clarity is judged against, as the owner decided on 16 November 2026: the floor of 18 dB in Chinese and 17 dB in English holds for the soundtrack and for each part, and a single thought is judged against the floor less 1.0 dB. The English 07.5 at 16.86 dB and 02.4 at 16.98 dB stand between the two lines, as in 1.0.1; the English soundtrack reads 17.84 dB.
- The films are built by `filmkit` 0.22.3 instead of 0.22.2. Every other locked package keeps its version.
- A release page now carries the release's record (the review records, captions, transcripts, covers and `SHA256SUMS`), and the page of the current edition also one film to watch per edition, the 1080p film with captions; the UHD films and the films without captions are not published, and the pages of 1.0.0 and 1.0.1 keep their records only. The repository's owner decided this on 16 November 2026; the README says what is published and where the comparison runs.
- Review round 18 scored the Chinese edition 99.8 and the English edition 99.5, with every one of the twelve dimensions at 97 or more, each of 信, 达 and 雅 passing and no material or minor finding. Its 2 Chinese notes and 6 English notes are listed in the published review records, `ddwg-essentials-zh-production-review.md` and `ddwg-essentials-en-production-review.md`. The review scores the audio from measurements; human listening is a separate acceptance.

## [1.0.1] - 2026-11-15

### Added

- Release 1.0.0 is rebuilt from a clean checkout. On 14 November 2026 an anonymous clone of the `v1.0.0` tag built both editions by the README's steps, with nothing taken from the production build, and `film:compare` passed against the assets downloaded from the release: both soundtracks hold the recorded bytes, the captions, transcripts and covers the published bytes, and each of the eight films decodes to the published film's 36,000 frames with every frame, the decoded audio and the container identical. The recorded picture floors of 45 dB stand; a rebuild on another host or renderer build is not yet compared.
- `film:sound` ends each edition with the engine's sound gate, which refuses a soundtrack with a part under its clarity floor or a thought or heard phrase that stops instead of dying away, and `film:picture` refuses neighbouring names on one row that stand closer than one and a half times their size.

### Changed

- 08.4 names what the next user of the data needs as the owner approved on 14 November 2026: "the time each fact became available" where 1.0.0 said "the facts available at the time", and 「每项事实最早能拿到的时间」 for 「当时能拿到的事实」, with the labels "When it was available" and 「最早能拿到的时间」. 08.4 is narrated again in both editions; nothing else in either narration changes. The Chinese narration has 2,443 Han characters.
- Each thought stands within 0.4 dB of its part's level, where the tolerance was 0.5 dB, so the largest step between adjacent thoughts inside a part is 0.8 LU in both editions. Each soundtrack still lasts exactly 600 seconds at −16.5 LUFS.
- The English 03.2 takes a clearer recording, 17.27 dB on the soundtrack where the 1.0.0 take read 16.81 dB, and the English 01.1 a recording whose last word dies away: the engine's sharper ending measure found that the 1.0.0 take faded and was then cut to silence within 2 ms, which no review had heard.
- The Chinese ring of 05.2 names three of its stations in the words of their questions, 从哪里来, 改过 and 用在哪, as the English ring does. The English list of 04.7 says "independent review" again, so both editions' lists name the same five things, and its high-risk response is set with the voice's separators like its three neighbours.
- The names under 07.5's rail and along 06's chain stand at least one and a half times their size apart; the chain takes a pitch of 182 px for it. The way of 08.4 lights through its three aims on their words and on to the listener within the last aim's words, so the film's last picture is whole when the voice ends, and the ring of 05.3's due hour inks in on its name.
- Both scripts' `pacing_profile`, `provider_notes` and `performance_intent` fields name the reference recording that each cast reads.
- The films are built by `filmkit` 0.22.2 instead of 0.21.2 and rendered with HyperFrames 0.9.46 instead of 0.9.9; GSAP moves to 3.15.1, `puppeteer-core` to 25.17.0, `@puppeteer/browsers` to 3.2.7, `undici` to 7.30.2 and Prettier to 3.10.1. Node, Python, uv and Chrome Headless Shell keep their versions.
- Review round 17 scored the Chinese edition 99.9 and the English edition 99.4, with every one of the twelve dimensions at 96 or more, each of 信, 达 and 雅 passing and no material or minor finding. Its 1 Chinese note and 6 English notes are listed in the published review records, `ddwg-essentials-zh-production-review.md` and `ddwg-essentials-en-production-review.md`. The review scores the audio from automated evidence; human listening is a separate acceptance.

### Removed

- The Prettier and Taplo configuration files under `.config/checks/`, which repeated the settings ETHOS ships.

### Fixed

- The 1.0.0 section lists ETHOS 0.2.0-alpha.29 in the locked supply. The tree that `v1.0.0` tags locks ETHOS 0.2.0-beta.10, as the same section's last entry says: the films were built and reviewed while the repository ran alpha.29, and the rebind to beta.10 that followed changed no film-bound source.
- `NOTICE` names Prettier 3.10.1, the version the lock holds.

## [1.0.0] - 2026-11-14

### Added

- The Chinese and English essentials films of the Data Department Work Guidelines, each exactly 600 seconds at 60 fps: 36,000 frames of 2D picture in 16:9, 48 kHz stereo narration in one synthetic voice, small single-line captions and no music. Each film says what the guidelines are for and why they hold before how to follow them, through one made-up incident, price data that arrived two hours late, and the four failures it invites.
- Four chapters and eight parts in each edition, spoken as 46 thoughts: One delay (01 Two hours late), What the guidelines are (02 What the work is worth), Five essentials (03 Two kinds of authority, 04 Four boundaries, 05 Data that means what it says, 06 Evidence sets the limit of the claim, 07 Human–AI collaboration) and Next time (08 Making the next attempt better). The Chinese narration has 2,439 Han characters and the English 1,549 words.
- The films explain the guidelines at `v8.0.0`, commit `b9da15d`. `content/source-manifest.json` pins that commit and the SHA-256 of the nine documents the films cite: the README, the seven documents under `docs/` and decision record DR-0001. Each part names the sections it states, 31 entries in each script. The five essentials are the two kinds of authority, to act and about facts; the four boundaries and the process that risk sets; the six questions that qualify data for a use; evidence as the limit of a claim, with the three layers of a fix; and the delegated boundary of human–AI collaboration. The last part covers the check left behind after a failure and the retirement of a rule.
- Release assets: all four films of each edition, a UHD master and a 1080p film, each with its captions drawn in the picture and again without them, with SRT and WebVTT captions, a transcript, a cover and the review record as JSON and Markdown, and `SHA256SUMS`, which lists the other 20 assets: 21 assets, named from `ddwg-essentials-zh` and `ddwg-essentials-en`. `content/release.json` records each asset's name, size and SHA-256, the digests of the soundtrack and of the two staged pictures each edition was made from, and those of the film-bound sources.
- Each film names its version in its QuickTime Information key, as 版本号 1.0.0 or Version 1.0.0. The build also makes an entry page and a player for each edition, and the player's captions control switches between the films with and without captions while keeping the time and the play state.
- Narration by the synthetic narrator of the DDWG and ETHOS introduction films, spoken by the Qwen3-TTS 12Hz 1.7B Base model at revision `a6eb4f68` through mlx-audio 0.6.4 and MLX 0.32.4, at temperature 0.46 with an in-context repetition penalty of 1.05. The Chinese cast speaks from `assets/audio/narration-reference-natural.wav`, which is derived from the identity recording `assets/audio/narration-reference.wav` in the two steps the cast records, and the English cast from `assets/audio/en/narration-reference.wav`. Each cast records the seeds of its takes: one for the full narration and one for each thought narrated again, 40 in Chinese and 42 in English.
- Each soundtrack lasts exactly 600 seconds at −16.5 LUFS. Speech is never time-stretched or pitch-shifted, and the runtime is fitted with designed pauses between thoughts, parts and chapters. The captions hold 149 Chinese and 205 English cues.
- A 2D picture composed as 52 ES modules under `picture/film/`, which esbuild bundles into `picture/film.js`. Text with a Chinese character is set in Noto Sans CJK SC, subset to the characters the films draw, and Latin-only text in unmodified IBM Plex Sans. Each picture is drawn in Chrome's software rasterizer, which `content/film.toml` declares as `capture = "software"`, because the GPU rasterizer drew random one-frame faults into the glyphs of Chinese pictures. The UHD films are 3840×2160, and each 1080p film averages each 2×2 block of its UHD picture.
- Before packaging, the engine compares each edition's two pictures at every frame and refuses a one-frame fault; it found none in the 36,000 frames of either edition.
- `content/concepts.toml`, the concept contract, copied from the DDWG films' contract at `bf61bf9`. It binds 14 concepts of the guidelines that the films name to a quoted passage at the pinned commit, an essence and one rendering per edition, such as 行动依据 and "authority to act", 事实依据 and "authority about facts", and 决策负责人 and "decision owner", and it lists 8 Chinese and 5 English renderings to avoid. Each part declares the concepts it states, 30 declarations in each edition, and the `filmkit` concept check refuses an avoided rendering in the narration, titles, caption terms, release metadata, player summaries and picture sources.
- The pronunciation contract `content/voice-performance.json`: the reading in context of 137 Chinese words, which cover all 503 occurrences of an ambiguous character in the Chinese narration, and 9 English targets, with English stress taken from CMUdict at commit `74790861`. `content/review/readings.json` holds the review's readings: 2 Chinese context readings, the stress of 14 English heteronyms and 2 variants by part of speech, and the part of speech of 31 occurrences of 18 words in the English script.
- The review contract in `content/film.toml`. An independent review scores each edition on twelve dimensions, and the verifier refuses a review whose overall score or any dimension is below 95, or that records a material finding. Voice quality has a clarity floor of 18 dB in Chinese and 17 dB in English, measured as cepstral peak prominence. Each of the owner's three levels, 信, 达 and 雅 (faithful, conveyed and graceful), must pass, and the review prompt lists fourteen patterns the owner rejected in earlier films, any occurrence of which is a material finding.
- Review round 16 scored the Chinese edition 99.8 and the English edition 99.1, with every one of the twelve dimensions at 96 or more, each of 信, 达 and 雅 passing and no material or minor finding. Its 3 Chinese and 8 English notes are listed in the published review records, `ddwg-essentials-zh-production-review.md` and `ddwg-essentials-en-production-review.md`. The review scores the audio from automated evidence; human listening is a separate acceptance.
- The Mise tasks that rebuild both editions from the tracked sources with the published `filmkit` 0.21.2 release, which `pyproject.toml` pins by its tag `v0.21.2` and `uv.lock` by its commit `38242472`: `film:supply` installs the pinned browser build and speech models, `film:build` narrates, assembles, renders, packages and verifies both editions offline, `film:compare` compares a rebuild with a published release, and `film:deliver` delivers the reviewed editions to the film's Documents folder and reads them back.
- The reproduction standard that `film:compare` holds a rebuild to: each soundtrack and each edition's two staged picture documents must hold the bytes `content/release.json` records, the captions, transcripts and covers the published bytes, and each of the eight films the published frame count, decoded audio, streams, chapters and tags, with every decoded frame's PSNR at or above the floor the manifest records, 45 dB for each film.
- The locked supply: Node 26.13.1, CPython 3.12.16, uv 0.13.7 and ETHOS 0.2.0-alpha.29 through Mise; HyperFrames 0.9.9, `puppeteer-core` 25.16.0, `@puppeteer/browsers` 3.2.6, GSAP 3.15.0, esbuild 0.28.2 and Prettier 3.9.10 through npm, with `undici` overridden to 7.30.1; Chrome Headless Shell 152.0.7977.30, which `film:supply` installs and checks against its pinned SHA-256; and the speech models `Qwen3-TTS-12Hz-1.7B-Base-bf16` at `a6eb4f68`, `Qwen3-ASR-0.6B-bf16` at `eae2b51f` and `Qwen3-ForcedAligner-0.6B-bf16` at `53c8c0e4`.
- ETHOS governance with its portable proof, whose `film-checks` gate runs the film's Python tests of the declaration, narration mirrors, fonts and release manifest through the installed engine.
- The MIT License for the code and CC BY 4.0 for the films' content, with the fonts under the SIL Open Font License 1.1 and the third-party notices and the narrator's provenance in `NOTICE`.
- `README.md` and `CONTRIBUTING.md`: how to rebuild the films and compare a rebuild with a release, and how to change, verify, commit and release them.
- The repository runs ETHOS 0.2.0-beta.10, declares its GitLab and GitHub publication peers by
  remote name, and verifies every change with the portable full proof on Apple-silicon macOS in
  the hosted jobs of both forges.

[Unreleased]: https://github.com/HengYangDS/data-department-work-guidelines-essentials-film/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/HengYangDS/data-department-work-guidelines-essentials-film/releases/tag/v1.0.2
[1.0.1]: https://github.com/HengYangDS/data-department-work-guidelines-essentials-film/releases/tag/v1.0.1
[1.0.0]: https://github.com/HengYangDS/data-department-work-guidelines-essentials-film/releases/tag/v1.0.0
