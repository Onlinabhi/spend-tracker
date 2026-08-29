# Spend Tracker V21.01

Local-first Money + Wealth PWA test build.

## V21.01 focus
This build hardens the V21 architecture before production merge. Financial state remains local-first and backward compatible. Feature content and controllers are separated so future updates can target one domain without rewriting unrelated code.

### Key modules
- `assets/app-legacy.js` compatibility/data layer
- `assets/v21.js` application controllers and V21 presentation orchestration
- `src/features/fun-library.js` replaceable fun-content/language library
- `assets/styles.css` semantic theme and UI system
- `sw.js` versioned PWA cache

Do not treat `v21-test` as production. Test the full Money + Wealth flow before merging into `main`.
