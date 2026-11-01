# Widget Copilot Readables Spec

## Requirements

### Requirement: Real-Time Widget Screen Awareness
The Grist widget SHALL publish active record and widget context to the parent Kue window using the `knet:copilot-state` message protocol.

#### Scenario: Active widget record updates
- **GIVEN** a user selects or edits a record in a Grist widget
- **WHEN** `grist.onRecord` fires
- **THEN** the widget SHALL post `{ type: 'knet:copilot-state', name: 'activeWidgetRecord', value: ... }` to `window.parent`.

#### Scenario: Active widget record unmounts or resets
- **GIVEN** a user deselects or creates a new record
- **WHEN** `grist.onNewRecord` fires or the widget unmounts
- **THEN** the widget SHALL post `{ type: 'knet:copilot-state', name: 'activeWidgetRecord', value: null }` to `window.parent`.
