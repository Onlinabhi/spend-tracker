# Spend Tracker V21

Local-first personal finance app for Money + Wealth tracking.

## Run
Open `index.html` in a browser for the local web build. For production/PWA use the existing HTTPS/hosted workflow. Android packaging uses the existing Capacitor setup in GitHub.

## Architecture
See `ARCHITECTURE-V21.md`. The legacy compatibility layer in `assets/app-legacy.js` preserves V20 behavior and storage while V21 domains are progressively isolated under `src/`.

## Data safety
Do not uninstall/clear app data when testing an Android update. The V20 storage boundary is intentionally preserved. Always export a backup before testing a major migration.
