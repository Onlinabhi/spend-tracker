# Spend Tracker V21.02

## Surgical structural rollback
- Restored the previously approved Settings/profile structure by removing the V21.01 view-first Settings rewrite.
- Preserved the V21.01 financial, search, theme, backup, routing, profile-sync, progress and Fun Engine fixes.
- Stopped normal page scrolling from closing the Settings overlay.
- Kept the redundant Wealth Net Worth quick-link removal and Portfolio naming fix.

## Floating dice
- Kept the existing floating dice design.
- Added direct drag/reposition control.
- Added collision avoidance so automatic movement does not intentionally overlap interactive controls.
- Pauses automatic movement after manual placement.
- Clicking/tapping the dice opens Brain Food through the modular Fun Engine.
- No multilingual UI was added; the language-map contract remains ready for future library expansion.

## Validation
- JavaScript syntax checked with Node.
- Service-worker cache key bumped to V21.02.
- This build is for `v21-test`; do not merge to `main` until the phone regression pass is complete.
