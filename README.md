# Spend Tracker V21

Local-first personal finance PWA baseline for the full V21 redesign.

## Run
Open `index.html` in a browser. For PWA/service-worker behavior, use HTTPS or localhost.

## Architecture
- `js/app.js` - compatibility/core business logic retained from V20.2.
- `js/v21.js` - V21 navigation, responsive shell, profile/settings hub, transaction preview, theme wiring and global interaction rules.
- `js/fun-library.js` - standalone message library. Update this file to grow the fun/knowledge library without touching screen code.
- `js/theme-library.js` - five standalone theme presets.
- `css/base.css` - retained V20.2 base styles.
- `css/v21.css` - V21 design system and responsive overrides.
- `ARCHITECTURE.md` - baseline architecture notes.

## Data safety
The app keeps the existing localStorage keys/data model from V20.2. This V21 redesign does not intentionally clear existing data. Future schema changes must use migrations.

## Backup
The current JSON backup/restore engine remains compatible. CSV export remains available as a separate spreadsheet-oriented export.
