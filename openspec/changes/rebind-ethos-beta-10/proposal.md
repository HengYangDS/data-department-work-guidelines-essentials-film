## Why

The repository declares and runs ETHOS 0.2.0-alpha.29, and its first edition, 1.0.0, has landed on
`dev` without a publication. The owner decided on 4 November 2026 that the films are published on
GitHub and on the GitLab peer, and asked that every governed repository run the latest ETHOS
release. Under 0.2.0-alpha.29 a release declaration must carry forge fields that this public
repository must not track; from 0.2.0-beta.6 on the declaration names only Git remotes. So the
repository moves to 0.2.0-beta.10 first and declares its publication and its hosted verification
there. 0.2.0-beta.10 upgrades directly from 0.2.0-alpha.29, and it publishes its own Mise
declaration, whose platform checksums equal the release's `SHA256SUMS` and the published asset
digests.

What 0.2.0-beta.10 asks of a repository that 0.2.0-alpha.29 did not:

- **Breaking: Markdown lists follow one blank-line rule** in the Markdown format, its check, the
  Markdown gate and `pre-commit`: a list item with one paragraph is followed directly by the next
  item. A file that breaks it fails `markdown_list_spacing:<path>:<line>` until
  `ethos lane format --apply` repairs it in a Work Lane.
- **Breaking: the canonical text files have an acting owner.** INI and `.cfg` files, the Vale
  vocabularies, `LICENSE`, `VERSION`, `.editorconfig`, `.gitattributes`, `.gitignore`, `.gitkeep`,
  `.shellcheckrc` and the CI supply's `Dockerfile` and `.dockerignore` take no blank line at the
  start or the end, at most one in a row and one final newline; the source-format gate reports
  `source_format_drift:<path>`.
- **Breaking: every authored `__init__.py` opens with a docstring** that names its package's
  purpose, or the paradigm reports `repository_paradigm_package_docstring:<path>`.
- **Breaking: every README that the docs registry admits declares `role: index`** and holds at most
  100 lines that are not blank; docs health reports `docs_readme_not_index:<path>` and
  `docs_index_too_long:<path>:<lines>>100`.
- A paradigm refusal that `ethos lane repair-paradigm` can repair names its preview as the next
  action, and `.config/mise/mise.lock` is required only when `.config/mise/config.toml` selects a
  tool.
- Its Node.js supply moves to 26.13.1, a security release with nine High-severity fixes under seven
  CVE identifiers.
- Its results use schema 3, where 0.2.0-alpha.29 wrote schema 2, and it embeds OpenSpec 2.0.0. A
  rollback after the declaration repair is not qualified. Among its known open defects, npm 12.2.2
  still bundles `glob` 13.0.6 and `minimatch` 10.2.5 (GHSA-3g3m-2fjr-6pw4, GHSA-g3hv-75wg-m249), and
  Go's GO-2026-6859 still affects the bundled `cue`, `vale` and `shfmt`, which ETHOS runs only as
  local commands over repository files without starting an HTTP server.

A static check of `dev` under the 0.2.0-beta.10 runtime finds no file that the four Breaking rules
refuse.

## What Changes

- Replace the 0.2.0-alpha.29 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-beta.10, unchanged, and lock it again with native `mise lock`; the lock stays
  at version 3.
- Bind the repository family to the 0.2.0-beta.10 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.29 runtime as the rollback.
- Declare the publication in `.ethos/release.toml`: protected `v*` tags, the GitLab peer and the
  GitHub peer by their Git remote names, and `main` as the mirror of the accepted `dev`.
- Declare the hosted verification in `.config/ci/` and generate `.github/workflows/ci.yml` and
  `.gitlab-ci.yml` from it with `ethos lane project --apply`: the portable full proof on
  Apple-silicon macOS, with Mise 2026.11.8 in the GitHub job.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The films, their build and their checks behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `.ethos/release.toml`, `.config/ci/`,
`.config/checks/ci-projection/policy.toml`, the two generated pipelines, `CHANGELOG.md` and the
repository-common runtime selection. `content/release.json`, the format-selection carriers and every
film-bound source stay as they are. Creating the forge projects, their runners, the tag `v1.0.0` and
the first publication are not part of this Change. `tasks.md` is the sole progress ledger.
