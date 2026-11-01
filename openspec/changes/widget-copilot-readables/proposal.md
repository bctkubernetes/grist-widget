# Change: Grist Widget Copilot Readables Sync

## Why
When a user views custom widgets embedded inside KnetDB (Grist) records, the parent Kue agent needs live situational awareness of the active widget record and content.

## What Changes
1. Add `copilot.js` emitting `knet:copilot-state` messages to `window.parent`.
2. Hook `activeWidgetRecord` into `notepad/index.js` on `grist.onRecord` and `grist.onNewRecord`.
3. Auto-prune context on unmount or record clear by emitting `null`.
