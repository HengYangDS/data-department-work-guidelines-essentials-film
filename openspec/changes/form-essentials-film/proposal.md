# Proposal

## Why

The 25-minute DDWG films explain the Data Department Work Guidelines in full. On 2026-11-01 the user asked for a ten-minute essentials film beside them that puts what the guidelines are for and why they hold before how to follow them, carried by one incident: price data that arrived two hours late. The user approved its outline that day and its bilingual text on 2026-11-02, revision 4 and then revision 7 with its samples and runtime; on 2026-11-02 the user also allowed a runtime to change in whole minutes, and the film runs eleven minutes because its samples' pace does not fit ten. `filmkit` builds one film per repository, with two editions of equal length, so the essentials film cannot be extra editions of `ddwg-film`; it needs a repository of its own.

## What Changes

- Build out `ddwg-essentials-film`, which `ethos adopt --create` formed under ETHOS `0.2.0-alpha.27`: bind the toolchain through Mise, depend on the released `filmkit` 0.4.0 through a uv Git source at its tag, and pin the renderer, browser automation, browser build, bundler and animation library through npm.
- Declare the film in `content/film.toml`: two independent editions, Chinese and English, each exactly 660 seconds at 60 fps, 2D only, narration without music, in four chapters and eight parts.
- Adopt the approved revision-7 text, with every part bound to the guideline sections it states, and pin the guidelines' repository at its `v8.0.0` release with each cited document's SHA-256 in `content/source-manifest.json`.
- Bind every concept the film names to its passage at that release in a concept contract, with the renderings the user approved for the 25-minute films, and declare the reading of every ambiguous Chinese character and the spoken form of every name.
- Narrate with the narrator the DDWG and ETHOS films share, at its native pace, and have the user listen to both narrations before the picture is composed.
- Compose a new picture under the DDWG visual system, with Noto Sans CJK SC subset to the characters the film draws and unmodified IBM Plex Sans.
- Review the text before narration and the exact build before delivery; deliver both editions to Documents and read them back.
- Add the README, the licensing (MIT for code, CC BY 4.0 for the film content, the SIL Open Font License for the fonts), the CI projection and the `v1.0.0` release preparation, without publishing.

## Capabilities

### New Capabilities

- `film-production`: the film's content, concepts, narration, picture and review contract, and its delivery.
- `film-reproduction`: rebuilding both films from tracked sources and pinned supply, and the standard a rebuild must meet.
- `film-publication`: licensing, release assets and the record of what was published.

### Modified Capabilities

None.

## Impact

- Repository `ddwg-essentials-film`, governed by ETHOS `0.2.0-alpha.27`. Its forge remotes are added only after the user confirms the push; the owner, namespace, name and visibility are decided then.
- Dependencies: `filmkit` 0.4.0, which checks concept contracts and readings and renders with HyperFrames 0.9.3; npm `hyperframes` 0.9.3, `puppeteer-core`, `@puppeteer/browsers`, `esbuild` and `gsap`; Python `pydantic` and `pypinyin` through the engine.
- A new Documents folder, `~/Documents/ddwg-essentials-film/`, receives the films; `~/Documents/ddwg-introduction-film/` and its 25-minute editions are not touched.
- The guidelines' repository is read only, at `v8.0.0`. `ddwg-film` is read only: its concept contract, casts and pronunciation contract are copied, not shared at build time.
- Out of scope: changes to the 25-minute films, changes to `filmkit` beyond its own Changes and releases, a shared library of picture primitives, music, 3D, and publishing before the user confirms.
