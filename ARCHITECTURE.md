# Spend Tracker V21 Architecture

## Baseline
V21 is local-first and modular. The existing V20 business logic is preserved in `js/app.js`; V21 UI/adapters live in `js/v21.js`, theme presets in `js/theme-library.js`, and message content in `js/fun-library.js`.

## Editable modules
- `js/fun-library.js`: message library only.
- `js/theme-library.js`: five preset color themes.
- `css/v21.css`: V21 visual system.
- `js/v21.js`: navigation/UI adapters and cross-screen behavior.
- `js/app.js`: legacy/core application logic retained for compatibility.

## Data safety
V21 does not clear localStorage and keeps existing storage keys and data structures. Future schema changes should use explicit migrations rather than destructive resets.

## Update principle
UI, message libraries, themes, and feature modules should be independently replaceable wherever possible.
