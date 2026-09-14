# Botao Lu — mind-map portfolio

React, TypeScript, Vite, React Flow, Markdown, and plain CSS. The latest UI rules are at the top of `DESIGN_SYSTEM.md`.

## Local development

Use Node.js 22.18+ or a newer supported LTS.

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. `npm run build` checks TypeScript and creates a static build; `npm run preview` serves that build. `npm test` checks navigation and graph relationships.

## Content and design

Edit Markdown files in `content/`; their filenames match the content node IDs in `src/graph.ts`. The development preview updates when files are saved. Put images in `public/images/` and reference them as `![Description](/images/example.jpg)`. Shared styling is in `src/styles.css`.

About Me, MathWorks, three projects, “How I create this page?” (`writing.md`), and Photo Gallery (`gallery.md`) open content in the floating panel. Writing and Photo Gallery have no child nodes or collapse controls. Earlier placeholder files remain on disk but are not used in navigation.

Resume and LinkedIn open the destinations supplied in Figma. Email copies the address configured in `src/graph.ts`. Music is an empty component; no audio is loaded. External links and components do not change the selected page. GitHub is no longer shown in the map.

Drag nodes or the background to explore. Zoom with the wheel, pinch, or controls; fit view frames the graph in the area clear of the panel. The dotted canvas continues beneath the panel and scales with zoom. Nodes and edges cannot be deleted or reconnected. On narrow screens, Read opens the selected content in a sheet.

## Git

The implementation branch is `codex/portfolio-shell`. Commit source changes and `package-lock.json`; dependencies and generated builds are ignored.

The first project logo is animated with plain SVG and CSS (`src/WaveformLogo.tsx`). Hover or keyboard-focus its card to scan the waveform; leave to reverse it. It follows the accent color and respects reduced motion. No Framer dependency is required.

All three project logos are now live SVG components. `ScaleLogo.tsx` morphs the second logo with CSS; `SystemLogo.tsx` animates the third logo's original orbit and rotation tracks with a small requestAnimationFrame loop. Both use whole-card hover/keyboard focus, reverse on leave, and respect reduced motion.
