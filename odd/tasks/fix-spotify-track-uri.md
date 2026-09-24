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
- Verification evidence: strict TDD RED 8 failed/1 passed before implementation; GREEN 9/9 passed in focused and full Jest after implementation. Independent verifier and parent reran focused Jest (9/9 passed). After restoring locked dependencies with `CYPRESS_INSTALL_BINARY=0; npm ci --no-audit --no-fund`, full Jest passed (9/9) and `npm run build` passed (2034 modules; chunk-size warning only). `git diff --check` and staged security gate passed. `npm run lint` still fails with 1,424 repo-wide issues; targeted ESLint reports 72 errors and 11 warnings in the pre-existing component, while the new test file is clean.
- Runtime harness: live Spotify playback was not exercised; mocked iFrame API calls are covered by Jest and the production build passes.
- Rollback boundary: `src/components/SpotifyIFrame.tsx` and `tests/SpotifyIFrame.test.tsx`.
- Commit: `7d3060c333ca75fb659d048a0d40933e3cb515ad` (`fix: normalize Spotify track links for iframe API`).
- RDD assessment: medium risk (`executable_change`), 158 changed lines, `review_due: false` (`under_budget`) against the branch point; no native review started.
- Delivery: branch pushed to `origin/codex/fix-spotify-track-uri`; PR #6 is open at https://github.com/AlexFJ498/middle-earth-leitmotifs-front/pull/6. Its description discloses existing lint debt and the lack of live Spotify playback verification.
- Next step: review the PR and, if needed, verify playback against the live Spotify widget before merging.
