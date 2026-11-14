## Context

See [proposal.md](proposal.md). The move follows ETHOS's successor-first adopter cutover: bind the
release in the lane, prove, land, and publish from the canonical root once the peers exist. Between
0.2.0-alpha.29 and 0.2.0-beta.10 the release declaration lost its forge fields, result schema 3
replaced schema 2, OpenSpec moved to 2.0.0, and four Breaking rules started to block: Markdown list
spacing, the canonical text owner, package docstrings and README index roles. The sister film
repository and the film kit already carry the same declaration and pipeline model.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in the hosted macOS jobs, on
  0.2.0-beta.10.
- Give the first publication a declaration and a pipeline that track no forge address.
- Keep the 0.2.0-alpha.29 runtime as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any film source, script, cast, manifest, carrier declaration, test or gate.
- Creating the forge projects or their runners, tagging `v1.0.0`, or publishing: the film's
  maintainer does that after this Change lands.
- Turning on `[peer_identity] mode = "required"`.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, after checking
  each platform checksum against the release's `SHA256SUMS` and the published asset digests; the
  lock stays at version 3 because locking an existing lock again keeps its version.
- Take the release declaration and the pipeline sources from the film kit's current ones: the same
  two peers by remote name, `accepted_ff`, the portable proof on one macOS runner per forge, and the
  GitLab runner tags the sister film uses. The film gates need the supplied models, a rebuild and
  the published release, so they stay local, as in the sister film.
- Generate both pipelines only through `ethos lane project --apply`; the generated files are never
  edited by hand.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.29 fails under 0.2.0-beta.10] → The lane runs the gates
  after the bind, and the full proof runs at the archived head before landing. A failure is repaired
  at its owner, or the family restores the 0.2.0-alpha.29 declaration in a new Change and binds the
  retained runtime.
- [A rollback after the declaration change is not qualified by 0.2.0-beta.10's journey] → A rollback
  restores the 0.2.0-alpha.29 declaration and lock in a new Change and runs the full proof before it
  lands, so this repository proves its own rollback instead of assuming it.
- [The hosted jobs cannot run until the forge projects and the GitLab runners exist] → The Change is
  accepted on the local full proof and the projection check; the first hosted runs are read when
  the maintainer has created the projects, before the tag.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, add the release
declaration and the pipeline sources, generate the pipelines, run the gates and prove the archived
head. To roll back, restore the 0.2.0-alpha.29 declaration and lock in a new Change, then bind the
retained runtime with the current console's `hook install --runtime <0.2.0-alpha.29 runtime>`.
