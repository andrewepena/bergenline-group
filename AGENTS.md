# AGENTS.md

## Cursor Cloud specific instructions

This is a Hugo static site (Bergenline Group corporate website) with two layers:
1. **Hugo site** (Hextra theme via Go modules) — content in `content/`, config in `hugo.yaml`, outputs to `public/`.
2. **Standalone landing page** — `index.html` + `styles.css` + `script.js` at the repo root.

### Prerequisites

- **Hugo** extended edition v0.147.3 (per `.github/workflows/pages.yaml`). Install from GitHub releases.
- **Go** ≥ 1.24.3 (used by Hugo for Go module theme fetching). Pre-installed on Cursor Cloud VMs.

### Running in development

- `hugo server --buildDrafts --buildFuture` — serves the Hugo site on port 1313 with live reload.
- `python3 -m http.server 8080` — serves the standalone landing page at the repo root on port 8080.

### Building

- `hugo --gc --minify --buildDrafts --buildFuture` — production build to `public/`.

### Notes

- No package managers (npm, pip, etc.), no databases, no Docker.
- The Hugo theme (`hextra`) is fetched automatically via Go modules on first build/serve — requires network access.
- The `public/` directory is checked into the repo (pre-built output).
- No linter or automated test suite is configured in this repository.
- Contact form uses external Formspree service (no local backend needed).
- `hugo.yaml` is the primary Hugo config; `hugo.yml` is an older CI workflow config file, not used by the dev server.
