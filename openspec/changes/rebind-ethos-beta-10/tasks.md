## 1. Runtime

- [x] 1.1 Replace the 0.2.0-alpha.29 declaration in `.config/mise/config.toml` with the one
      published with 0.2.0-beta.10, checked against the release's `SHA256SUMS` and asset digests,
      and lock it again with native `mise lock`; done when the lock holds 0.2.0-beta.10 for every
      platform it held 0.2.0-alpha.29 for, no 0.2.0-alpha.29 entry remains and it keeps
      `lockfile_version = 3`. The declaration is the release's own file (`sha256:2163ceaa…`), read
      back against `SHA256SUMS` and the asset digests; the lock holds 0.2.0-beta.10 for the same six
      platforms, holds no 0.2.0-alpha.29 entry and keeps `lockfile_version = 3`.
- [x] 1.2 Bind the repository family to the 0.2.0-beta.10 runtime with the locked console's
      `hook install`, keeping 0.2.0-alpha.29 as the rollback; done when `ethos status` reports pass
      in the lane under the 0.2.0-beta.10 runtime. CURRENT names the 0.2.0-beta.10 runtime
      `526c2ebafeba` and ROLLBACK the 0.2.0-alpha.29 runtime `a4323cd92099`; `ethos status` reports
      pass in the lane.

## 2. Publication and hosted verification

- [x] 2.1 Add `.ethos/release.toml` with the protected `v*` tags, the two peers by remote name and
      the `accepted_ff` mirror; done when the repository paradigm reports no gap for it.
      `.ethos/release.toml` is in commit `2fb4ea6`; `ethos lane repair-paradigm` reports the lane
      conforming with no gap.
- [x] 2.2 Add `.config/ci/pipeline.cue`, `.config/ci/runners.toml`, `.config/ci/verification.toml`
      and `.config/checks/ci-projection/policy.toml`, and generate `.github/workflows/ci.yml` and
      `.gitlab-ci.yml`; done when `ethos lane project --check --json` reports both projections
      conforming. `.config/ci/runners.toml` went into commit `2fb4ea6` first, because the projection
      admits its references only from the committed baseline; `ethos lane project --apply` then
      generated both pipelines, and the check reports both projections conforming.
- [x] 2.3 Record the move in the Changelog; done when `mise run check` passes. The 1.0.0 section
      names the runtime, the two peers and the hosted full proof; `mise run check` passes with 37
      Node tests and 13 Python tests, and the format check and the `markdown-lint`, `prose`,
      `openspec`, `config-quality` and `docs-registry` gates pass.
