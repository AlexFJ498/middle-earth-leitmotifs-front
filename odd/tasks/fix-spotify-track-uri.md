# Fix Spotify track URI loading

## Objective
Make track selection load the Spotify embed reliably for valid track links, including localized `/intl-es/track/{id}` URLs.

## Problem and why
Tracks passes a web URL to the Spotify iFrame API's URI-only `loadUri` and `createController({ uri })` paths. Themes uses a separate embed URL builder, so it does not exercise this path.

## Scope and constraints
- Normalize and validate track links at the player boundary for initial controller creation and later track changes.
- Preserve existing playback behavior and handle invalid links without throwing.
- Add focused regression tests. Do not change the Themes embed behavior.
- Do not include pre-existing edits in `CoffeeIcon.tsx`, `About.tsx`, or `Footer.tsx`.

## Task and acceptance
- [x] T1 — Implement canonical Spotify track URI loading with regression coverage for localized URLs, ordinary URLs, and invalid input. Verify focused tests, full Jest suite, lint, and build; commit the coherent fix.

## Execution
- Route: delegated direct. Reading that prepares the write and changes to the component plus tests trigger delegation.
- TDD: enabled by session instruction. Runner: `npx jest --config=jest.config.js --runInBand --watch=false`. Require RED → GREEN → REFACTOR evidence.
- Forecast: about 100 authored changed lines; delivery strategy `ask-on-risk`, single PR expected under the 400-line review budget.
- Branch: `codex/fix-spotify-track-uri`; branch point `2b5ae264ae6d8dcffff884f8959ac3eb936b5722`.
- Verification evidence: strict TDD RED 8 failed/1 passed before implementation; GREEN 9/9 passed in focused and full Jest after implementation. Independent verifier and parent reran focused Jest (9/9 passed). `git diff --check` and staged security gate passed. `npm run lint` failed with 1,424 repo-wide issues; the new test file is lint-clean. `npm run build` failed before this feature at unresolved `@vercel/analytics/react`, which is declared in the lockfile but missing from local `node_modules`. Live Spotify playback was not verified because the app cannot build locally.
- Runtime harness: N/A while local build is blocked by the missing dependency; mocked iFrame API calls are covered by Jest.
- Rollback boundary: `src/components/SpotifyIFrame.tsx` and `tests/SpotifyIFrame.test.tsx`.
- Commit: `7d3060c333ca75fb659d048a0d40933e3cb515ad` (`fix: normalize Spotify track links for iframe API`).
- RDD assessment: initial attempt was unassessable because this task file was untracked; reassess after tracking it.
- Next step: restore the missing dependency in an authorized environment, rerun build and targeted verification, then complete review and PR delivery.
