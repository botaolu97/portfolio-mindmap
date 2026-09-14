# Botao Lu — mind-map portfolio

A local-first static portfolio built with React, TypeScript, Vite, React Flow, and plain CSS. The visual direction comes from the [Figma design](https://www.figma.com/design/VdBbHsw55r7PefmZUsBnaq/portfolio?node-id=1540-1871) and `DESIGN_SYSTEM.md`.

## Run locally

Use Node.js 22.18+ (or a newer supported LTS) and npm.

```sh
npm ci
npm run dev
```

Open the localhost address printed by Vite. Build with `npm run build`; inspect the production build with `npm run preview`. Run graph behavior checks with `npm test`.

## Edit content

Every destination has a matching file in `content/`. These files intentionally contain only a mockup heading. Edit a file to add Markdown paragraphs, links, headings, and images. Vite refreshes the local preview when you save. Content is bundled at build time; there is no backend or CMS.

Add images to `public/images/` and reference them with `![Description](/images/file-name.jpg)`. Shared Markdown styling lives in `src/styles.css`.

Node labels, hierarchy, starting positions, and thumbnail paths live in `src/graph.ts`. The content filename matches the node ID, for example `content/matlab-grid.md`. When adding a page, add its record and corresponding Markdown file. The selector, connections, and collapse counts follow that data automatically.

## Interactions

- Click a node to select its page. Drag nodes or the background to explore.
- Use a category's corner button to collapse/expand it. Counts show hidden descendants.
- Zoom with the wheel/pinch or the +/− buttons; fit view frames visible nodes without resetting positions.
- Select any page from the reading panel to reveal it in the map. URL hashes support direct links and browser history.
- On narrow screens, select a node and tap Read to open the page. Close or Escape returns to the map.
- Nodes and connections cannot be deleted, added, or reconnected by visitors. Rearrangements last for the current visit.
- Accent offers three local color presets. The Figma orange is the default.

Writing 01–04 and Gallery 01–08 are title-only placeholders matching the counts in the design. LinkedIn is also a placeholder page until a verified profile URL is provided. The repeated project thumbnail is the original asset from Figma. No biography, résumé, or project descriptions have been added.

## Version control

Use Git for changes and keep `package-lock.json` committed. The implementation is on `codex/portfolio-shell`. Generated builds, dependencies, and local environment files are ignored.
