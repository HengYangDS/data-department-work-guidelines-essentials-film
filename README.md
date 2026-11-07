# Data Department Work Guidelines Essentials: Film

Two short introduction films to the [Data Department Work Guidelines](https://github.com/HengYangDS/data-department-work-guidelines), one in Chinese and one in English, and everything needed to rebuild them from source.

Each film says what the guidelines are for and why they hold before how to follow them, through one made-up incident: price data that arrived two hours late. It is the short companion of the full [DDWG films](https://github.com/HengYangDS/data-department-work-guidelines-film), which explain the seven documents one by one. Each edition lasts exactly 600 seconds: 36,000 native 60 fps frames of 2D picture in 16:9, 48 kHz stereo narration in one synthetic voice, small single-line captions and no music. Each comes as a UHD master and a 1080p film, each with its captions drawn in the picture and again without them; the player's captions control switches between the two.

Author: Yang HENG.

## The films

A release publishes the films as release assets, together with their captions, transcripts, covers, independent review records and `SHA256SUMS`. Its manifest, `content/release.json`, records each asset's name, size and SHA-256, the digests of the soundtrack and staged picture each edition was made from, and those of the film-bound sources whose exact bytes the build reads. The independent review scores the audio from automated evidence; human listening is a separate acceptance.

## Rebuilding the films

The films are built by [filmkit](https://github.com/HengYangDS/filmkit), the film engine, at the release that `pyproject.toml` pins by its tag `v0.13.0` and `uv.lock` by its commit; this repository holds the film's sources and none of the engine's. A rebuild needs an Apple-silicon Mac with [mise](https://mise.jdx.dev), which installs the locked Node, Python, uv and ETHOS, and three Homebrew tools: FFmpeg with VideoToolbox, ExifTool and rsync 3.

```bash
brew install mise ffmpeg exiftool rsync
```

```bash
mise install --locked
```

```bash
mise run bootstrap
```

`film:supply` is the only step that reaches the network. It installs the browser build that the locked renderer pins and the speech models at their pinned revisions below `build/runtime/tool-cache/`, and checks each against its pinned SHA-256. Set `HF_ENDPOINT` to a Hugging Face mirror where the hub is unreachable.

```bash
mise run film:supply
```

`film:build` then narrates both editions from the seeds in their casts, assembles the soundtracks and captions, renders and packages the pictures and verifies every film, offline and only under `build/`.

```bash
mise run film:build
```

The stages also run one at a time: `film:narrate`, `film:sound`, `film:picture`, `film:package` and `film:verify`.

## Comparing a rebuild with the published films

Download a release's assets into `build/artifacts/release/` and compare:

```bash
mise run film:compare
```

The comparison refuses a published asset or a film-bound source that differs from the release manifest, and accepts a published review only when it binds the published films and the current script and composition. It then compares the rebuild layer by layer: each soundtrack and staged picture document must hold the recorded bytes, the captions, transcripts and covers the published bytes, and each film must have the published frame count, decoded audio, streams, chapters and tags, with every decoded frame's PSNR at or above the floor the manifest records. The picture alone is not byte-identical, because GPU capture and encoding vary between renders of the same stage. The report goes to `build/evidence/reproduction/report.json`.

## Checks

`mise run check` runs the picture and Python test suites and the Markdown format check. The repository is governed by [ETHOS](https://github.com/HengYangDS/ethos): `ethos prove --full --execute` runs the portable proof, including the `film-checks` gate, which runs the Python tests of the declaration, narration mirrors and fonts through the installed engine, and after a rebuild `ethos prove --host --gate film-media --gate film-reproduction --execute` verifies the films and their reproduction on this host. [CONTRIBUTING.md](CONTRIBUTING.md) explains how to change, verify, rebuild and release the films.

## Layout

| Path                            | Contents                                                                                                                                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/`                      | The film's declaration `film.toml`, which holds the summary and colours of the players the engine renders, both editions' scripts, casts and narration texts, the entry page, the concept contract and the source manifest. |
| `picture/`                      | The film's picture composition: the modules under `picture/film/` and the bundle `picture/film.js` the renderer loads.                                                                                                      |
| `assets/`                       | The narrator's reference recordings, the covers and the fonts.                                                                                                                                                              |
| `tests/`                        | The film's tests: its composition against both scripts, its fonts, its declaration and its narration mirrors.                                                                                                               |
| `openspec/`                     | The accepted specification and any open Change.                                                                                                                                                                             |
| `system/gates.toml`, `.config/` | The ETHOS gates, the check policies and the locked toolchain with its tasks.                                                                                                                                                |

## License

The code is licensed under the [MIT License](LICENSE). The films' content, which is the scripts, narration texts, casts and pronunciation contract, the narrator's reference recordings, the covers, and the films, captions and transcripts built from them, is licensed under [Creative Commons Attribution 4.0 International](LICENSES/CC-BY-4.0.txt). The fonts in `assets/fonts/` keep the SIL Open Font License 1.1, whose texts lie beside them. [NOTICE](NOTICE) names the content's paths, the third-party software and models the build installs under their own licenses, and where the narrator's voice came from.
