# Tasks

## 1. Repository and toolchain

- [x] 1.1 Bind the toolchain: the Mise configuration and lock for Node 26.13.0, CPython 3.12.16, uv 0.13.6 and ETHOS `0.2.0-alpha.27` through its release's Mise declaration; `filmkit` 0.5.0 as a uv Git source at `v0.5.0`; the npm lock with HyperFrames 0.9.5, `puppeteer-core` 25.16.0, `@puppeteer/browsers` 3.2.6, GSAP 3.15.0, esbuild 0.28.2 and Prettier 3.9.10, and the `undici` 7.30.1 override. Verify that `mise install --locked`, `uv sync --frozen` and `npm ci` succeed and that the installed `filmkit` reports 0.5.0. The Mise declaration and lock are those of `filmkit` 0.4.0. On 2026-11-03, after the move to the latest stable releases (design, Repository and engine), the three commands succeeded, OSV reported no advisory in either lock, and `filmkit` reported 0.4.0 with Node v26.13.0. The same day the film moved to `filmkit` 0.5.0: the locks moved only `filmkit`, `mlx-audio` to 0.6.4, HyperFrames to 0.9.5 and semver to 7.8.6, the film's bootstrap installed them, OSV reported no advisory, and `filmkit` reported 0.5.0.
- [x] 1.2 Declare the gate registry, the portable gates and the check policies as `filmkit` declares them; verify that `ethos status` reports no gap and that the gate-exact Ruff, ESLint, Prettier and Taplo accept the tree under both the shipped and the repository policies. On 2026-11-02 `ethos status` reported no required gap, the film's tests passed, and the gate-exact Ruff, Prettier and Taplo accepted the tree under both policies; ESLint has no JavaScript to check until the composition in 4.2.
- [x] 1.3 Record the guidelines' repository, the commit `v8.0.0` names and the SHA-256 of the README, the seven documents under `docs/` and DR-0001 in `content/source-manifest.json`; verify each digest against the document at that commit. On 2026-11-02 `v8.0.0` named `b9da15d`, the latest release, and all nine digests matched the documents at it.

## 2. Script, concepts and readings

- [ ] 2.1 Check every part's `source_sections` against the cited documents at the pinned commit; verify that each named section exists and states the part's claims.
- [x] 2.2 Write both editions' scripts from revision 7, with the chapters, segments, thoughts, release metadata and pause policy, and add the declaration, the players, the entry page, the review prompt and the font subsets cut from the scripts; verify that the engine loads the declaration and that each edition's words equal the approved text. On 2026-11-02 the engine loaded the declaration, the film's tests passed, and each segment's text equalled its part's paragraphs of revision 7, nine of them cut once at a sentence end.
- [x] 2.3 Copy the concept contract from `ddwg-film` at `bf61bf9` and declare each segment's concepts; verify that the `filmkit` concept check passes and finds every quotation at the pinned commit. On 2026-11-02 it passed with 14 concepts and 62 declarations, every quotation verified.
- [ ] 2.4 Pass the independent sentence-by-sentence review of both scripts at 90 or more in fidelity, concept fidelity, first-hearing clarity and idiom, with no material finding, and take any repair that changes approved words to the user; verify that the review binds both scripts' SHA-256.
- [x] 2.5 Write the pronunciation contract with every name's spoken form and the reading in context of every ambiguous Chinese character, and the review readings; verify that the `filmkit` readings check passes and that every review reading names an occurrence in the current scripts. On 2026-11-02 the readings check passed with 561 Chinese occurrences, and the listening plan bound every review reading to the current scripts, with the verb reading of _records_ added for 03.

## 3. Narration and sound

- [ ] 3.1 Add the casts with the narrator's references and the settings the approved samples were narrated with; verify each reference's SHA-256 and that the engine narrates one thought the samples hold as the same take.
- [ ] 3.2 Audition every declared name and reading; verify that each is heard as declared, comparing a flagged reading with takes of its homophones and leaving what stays unsettled to the user's ear.
- [ ] 3.3 Narrate both editions and select each thought's take; verify that every selected take ends on its own, matches its text by recognition and keeps its pauses within the declared caps.
- [ ] 3.4 Assemble each soundtrack and its captions at exactly 660 seconds; verify the runtime, the fitted pauses within the declared bounds of the approved samples' pauses, the program loudness, the caption timing and that no thought's tail is released.
- [ ] 3.5 Have the user listen to both narrations and confirm the titles, and record the decision; verify that the record names both soundtracks and the titles, and reopen 2.2 or 3.3 for a requested change.

## 4. Picture

- [ ] 4.1 Plan each thought's picture from the accepted narration; verify the plan against the gates for names, placement, whole lists and balance.
- [ ] 4.2 Compose the picture as the ES modules under `picture/film/`, with the primitives copied from `ethos-film` at `v1.0.1`, and bundle them into `picture/film.js`; cut the font subsets again from the scripts and the composition, and paint both covers; verify the composition tests and their coverage, the font test, the concept check on picture labels, the geometry, still, motion and sync audits with no gated finding, and the cover check.
- [ ] 4.3 Render a 10 fps draft and scan its stills; verify that no frame shows a collision, clipping or a blank picture under speech.

## 5. Render, review and delivery

- [ ] 5.1 Render, package and verify both editions; verify the technical checks and that the tracked tree is unchanged.
- [ ] 5.2 Pass the independent production review of the exact build at 90 or more overall and in every declared dimension, concept fidelity among them; a fixed build is reviewed again.
- [ ] 5.3 Deliver both editions to `~/Documents/ddwg-essentials-film/` and read them back; verify every delivered file's SHA-256 and both players in a real browser.
- [ ] 5.4 Record the user's acceptance of the delivered films; verify that the record names both editions' delivered films.

## 6. Publication

- [ ] 6.1 Write the README with the supply, build and comparison steps, `LICENSE`, `NOTICE`, the CC BY 4.0 legal code, the fonts' licenses and `CHANGELOG.md`; verify that `ethos lane repair-paradigm --json` reports no gap.
- [ ] 6.2 Record the release manifest from the accepted films and verify a rebuild against it with `film:compare`; prepare `v1.0.0` with `.ethos/release.toml` and the release folder with `SHA256SUMS`.
- [ ] 6.3 Once the user has named the forges, project the portable gates into their CI; verify that `ethos lane project --check` passes and that each projection validates against its forge's schema.

## Workflow follow-up

- Archive the Change, prove the archived head once, run the film gates on it, land it and close out.
- After the user confirms the forge owner, namespace, name and visibility: add the remotes, publish, tag `v1.0.0` and upload the release; then read back every asset and `SHA256SUMS` on each forge.
