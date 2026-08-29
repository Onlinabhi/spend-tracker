# Spend Tracker V21

## Architecture/UI baseline
- Replaced standalone More navigation with global profile/settings entry.
- Added modular V21 shell and reusable theme/message libraries.
- Added five preset color themes with global variables.
- Modernized Money Home with balance, quick stats, recent-money search and last-7-days focus.
- Modernized Wealth Home, Wealth Analytics, Wealth Activity and Goals.
- Added richer transaction preview details with Edit/Delete actions.
- Added global modal dismissal and accordion single-open behavior.
- Added viewport-width protections against horizontal layout drift.
- Preserved the existing localStorage data keys and core business logic for compatibility.

## Modular files
- `js/fun-library.js` is the message library.
- `js/theme-library.js` is the theme library.
- `css/v21.css` is the V21 presentation layer.
- `js/v21.js` is the V21 shell/adapter layer.
- `js/app.js` remains the compatibility core until the data/business services are fully split.
