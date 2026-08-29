# Spend Tracker V21 baseline

## Principles
- Local-first. Existing V20 data remains the source of truth.
- Presentation, business logic, data, and persistence are separate domains.
- Stable IDs prevent duplicate imports.
- Schema migrations are additive and versioned.
- Themes are tokens, not scattered hard-coded colors.
- Profile is the global settings entry point; no standalone More navigation.
- Money and Wealth share the shell but have separate domain calculations.
- Temporary previews/modals have one global lifecycle and close on outside tap/scroll.
- Fun/personalization content lives in its own library/domain so library growth does not require editing financial logic.

## Domain map
`core/` = app-wide contracts; `features/` = independently replaceable feature domains; `data/` = persistence/schema boundary.

The existing `assets/app-legacy.js` is a compatibility layer. It is deliberately retained during V21 so the UI can be modernized without a destructive data rewrite. New feature work should be extracted from it one domain at a time.
