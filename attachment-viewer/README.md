# Attachment viewer

Shows the selected record's attachments inside Grist: images, and PDFs in the browser's own PDF
viewer, one at a time with ← / →. Map the widget's "Attachment column" to an Attachments column.

## Source and attribution

This widget is the **viewer** from
[rambip/grist-attachment-widgets](https://github.com/rambip/grist-attachment-widgets)
by **Antonin Peronnet**, made at **[OpenSourcePolitics](https://opensourcepolitics.eu/)**
(commit `420b47e20480ef9b8455fc4056877f1ce599ec10`, 2026-01-19). Used and hosted in KNet's widget
gallery with the author's confirmation that it is open source (2026-10-16).

KNet changes, marked `KNet` in the code:

- `index.html` loads `grist-plugin-api.js` from the KnetDB host, like the other gallery widgets,
  instead of `docs.getgrist.com`.
- `index.js` releases old object URLs from `att.data.objectUrl` (the original read `att.objectUrl`,
  which is never set, so URLs were not released).
