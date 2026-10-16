# Dashboards

Website-style dashboards inside Grist: pages of KPI cards, charts (11 types, Apache ECharts),
slicers that filter the whole page, searchable data tables, maps, calendars and printable report
layouts. Add it as a custom widget ("Dashboards") with full access; the design is saved in the
document (widget options, mirrored in a `Dashboard_Config` table).

## Source and attribution

This widget is **Advanced Charts for Grist** by **ANUPRESS**,
[anupress/grist-advanced-charts](https://github.com/anupress/grist-advanced-charts)
(commit `13cd3ff3f70fe00996a075cc695c089234f3e07d`, 2026-10-15, version 3.10.14), used under the
**MIT License** — see [LICENSE](LICENSE) (Copyright ANUPRESS), kept unchanged. Third-party
libraries and their licences: [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

KNet changes (marked `KNet` in the code where they are code):

- Branding: KNet AI badge logo, KNet palette (navy `#0f172a`, cyan `#06b6d4`) as the default,
  "Built with KNet AI" footer, KNet wording on the consent screen, page title "Dashboards — KNet AI";
  sample content links to knetai.com. The upstream guide link stays, as the widget's manual.
- Storage names: `ANUPRESS_Config` → `Dashboard_Config`, `ANUPRESS_Theme` → `Dashboard_Theme`,
  widget options `anupressDashboard` / `anupressSiteConfig` → `knetDashboard` / `knetSiteConfig`.
- `grist-plugin-api.js` loads from the KnetDB host like the other gallery widgets; the vendored
  copy was removed (so its entry in THIRD-PARTY-NOTICES no longer applies to this folder).
- Served from source (native ES modules); the upstream obfuscated build, CI, scripts and examples
  are not included.

Map blocks load background tiles from public tile providers (OpenStreetMap / Esri / OpenTopo);
nothing else leaves the browser.

Tests: `node tests/run.mjs` (24 suites).
