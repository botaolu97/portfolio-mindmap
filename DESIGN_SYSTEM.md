# Portfolio design system

Version: 0.1 — design analysis and proposed implementation specification
Reviewed: 14 September 2026
Source: [Figma — homepage (default), node 1540:1871](https://www.figma.com/design/VdBbHsw55r7PefmZUsBnaq/portfolio?node-id=1540-1871)

## Scope and evidence

This document covers the linked desktop frame, its extracted design context, screenshot, and returned variables. It does not claim to audit every page or component in the Figma file. No website code or Figma changes have been made.

- **Observed** means present in the linked frame or returned design properties.
- **Proposed** means a recommended rule that fills a gap or resolves an implementation issue. These values are not existing Figma tokens.
- Dimensions below are CSS-pixel references at the original 1701 × 997 frame size, not measurements from the scaled screenshot.

## Design direction

Preserve the contrast between an exploratory, dark workspace and a calm, light reading surface. Use simple white cards, restrained corner rounding, Inclusive Sans, and one vivid orange accent. Images and writing provide personality; interface decoration stays quiet.

The map is portfolio navigation. Visitors may explore, move nodes, and collapse branches, but cannot change the authored relationships or content.

## Analysis of the supplied frame

### Strengths to retain

- Dark canvas and pale content panel clearly separate exploration from reading.
- The orange outline identifies About Me as the selected node, matching the panel content.
- Project cards use thumbnails to distinguish work from general navigation.
- Consistent 4 px card corners and mostly 16/24 typography give the interface a coherent character.
- The panel selector offers a promising second navigation path.
- Canvas controls stay visually separate from content.

### Gaps and recommended decisions

| Finding in this frame | Proposed resolution |
| --- | --- |
| No connector lines are visible in the screenshot or returned node content. | Draw persistent, subdued connections so the hierarchy is readable before interaction. |
| About Me is spatially central, with résumé/LinkedIn to the left and work to the right; this differs from the original verbal top-down tree. | Follow the Figma placement as the visual direction while retaining About Me as the logical root. |
| The right panel overlaps the end of the longest project card. | Fit the initial graph into the unobscured map region; keep selected nodes clear of the panel. |
| MathWorks displays a count of 3 while all three projects are visible. | Show the numeric badge only when collapsed, meaning hidden descendants. Use a chevron while expanded. |
| Writing and Gallery show 4 and 8, but their children are not supplied in this frame. | Treat these as mockup counts; derive live badges from actual content, never hard-code them. |
| One thumbnail is reused on the three work cards. | Allow a distinct image per project; retain a consistent thumbnail crop. |
| The name is 64 px but its extracted text box/line height is 24 px. | Use a natural text box and a proposed 1.1 line height to avoid clipping. |
| Introductory copy is 24/26, which is dense for several paragraphs. | Keep 24 px on wide screens, with a proposed 32 px line height. |
| The visible link uses a placeholder destination and the copy says “4 year.” | Replace the destination and proofread copy before publishing; verify experience and audience figures with the owner. |
| Mobile, focus, hover, dragging, and project-detail screens are not supplied. | Use the proposed behavior and component rules below as the initial specification. |

## Foundations

### Colors

Use semantic token names in implementation. The Figma variable names are recorded separately so inconsistent naming does not spread into code.

| Token | Value | Status / source | Purpose |
| --- | --- | --- | --- |
| `color.surface.node` | `#FFFFFF` | Observed; `--color-surface-default` | Node and selector surfaces |
| `color.surface.panel` | `#F3F1F1` | Observed panel fill | Reading panel |
| `color.surface.control` | `#1F1F1F` | Observed control fill | Canvas controls |
| `color.surface.canvas` | `#1F1F1F` | Proposed; consistent with visible dark canvas and measured control fill | Canvas background; frame background value was not returned |
| `color.text.primary` | `#000000` | Observed; `Black` | Text on light surfaces |
| `color.text.inverse` | `#FFFFFF` | Observed | Text on dark surfaces |
| `color.accent` | `#FF2700` | Observed; `Accent` | Active outline, accent swatch |
| `color.accent.soft` | `#FBBCB0` | Observed secondary selection border | Selection halo |
| `color.border.control` | `#AAABA9` | Observed; `Color/icon/deslected` | Borders and secondary icons on dark canvas |
| `color.canvas.dot` | `#454545` | Proposed | Subtle dot grid |
| `color.edge.default` | `#858682` | Proposed | Connectors against dark background |
| `color.text.secondary` | `#595959` | Proposed | Metadata on light surfaces |
| `color.focus.on-light` | `#000000` | Proposed | Keyboard outline on white cards |
| `color.focus.on-dark` | `#FFFFFF` | Proposed | Keyboard outline on dark controls |

Orange is an accent, not a general paragraph or link text color. White on `#FF2700` has approximately 3.79:1 contrast, below the 4.5:1 target for normal-sized text. Use black numerals on orange badges (approximately 5.54:1), or choose and verify a darker badge fill if white numerals are essential. Do not silently darken the global brand accent.

### Typography

Observed family: **Inclusive Sans**. Fallback: `system-ui, sans-serif`. The returned style is named `Portfolio/Mono/Body`, but its actual font is Inclusive Sans; do not interpret “Mono” as a monospace font requirement.

| Role | Size / line height | Weight | Status |
| --- | --- | --- | --- |
| Default node/body label | 16 / 24 px | 400 | Observed |
| Root node label | 20 / 24 px | 400 | Observed |
| Selector label and count | 16 / 24 px | 600 | Observed |
| About name, desktop | 64 / 70.4 px | 500 | Size/weight observed; line height proposed |
| About introduction, desktop | 24 / 32 px | 400 | Size observed; line height proposed |
| Project title | 40 / 48 px | 500 | Proposed |
| Content section heading | 24 / 32 px | 500 | Proposed |
| Project body | 18 / 28 px | 400 | Proposed |
| Caption/metadata | 14 / 20 px | 400 | Proposed |

Use sentence case in interface labels. Preserve proper names such as MathWorks, MATLAB, and LinkedIn. Use underlines and explicit external-link cues for links in body content. Long card titles may wrap to two lines; never hide the complete project name without an accessible alternative.

### Spacing, shape, and depth

- Proposed spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 px. The frame explicitly uses 16 px padding/gaps in project cards.
- Observed radius: cards/controls/selector 4 px; reading panel 10 px. Badges are circular.
- Observed border: panel 1 px black; canvas controls 1 px `#AAABA9`; selected node 3 px orange plus an overlapping 8 px soft-accent border treatment.
- Proposed selection rendering: 3 px outline with an outer soft halo, without changing node size or moving connectors.
- Proposed default shadows: none. Maintain the flat visual character; use color and borders for separation.
- Proposed grid: 1 px dots at 24 px intervals. Keep it subtle and exclude it from hit testing.

## Layout

### Desktop reference — observed

- Frame: 1701 × 997 px.
- Panel: x=1133, y=31, width=548, height=944 px; approximately 32% of frame width.
- Panel text inset: approximately 46 px. Selector: 243 × 53 px.
- Basic nodes: 162 × 75 px. Project cards: 16 px padding, 16 px image/text gap, 72 × 58 px thumbnails; width varies with title.
- Accent control: top-left, 116 × 43 px.
- Three canvas controls: bottom-left, 43 × 43 px, separated by 8 px.
- Portrait: 308 × 289 px in the About panel; retain the source image's intended framing without stretching it.

### Responsive rules — proposed

| Available width | Layout |
| --- | --- |
| 1200 px and above | Map with floating right panel; panel width `clamp(420px, 32vw, 548px)`, 24 px viewport inset, 48 px interior padding. |
| 768–1199 px | Map plus narrower 360–420 px panel, 16 px viewport inset and 24 px interior padding. If map space becomes unusable, use the compact layout early. |
| Below 768 px | Full-width map with a clearly labelled “Read” action opening a full-screen content sheet; close returns to the same map position and focused node. Provide a content selector in the sheet. |

Use container space as well as viewport width when choosing layout. Fit the graph within the area left of the panel on first load. Preserve node positions when the window resizes; change the viewport, not the authored layout. Keep controls anchored to the screen rather than inside the zoom transform.

The panel scrolls independently. Scrolling over text must not zoom the map. On compact screens, use 40/44 px for the About name and 20/28 px for the introductory copy. Account for mobile safe areas and dynamic viewport height.

## Components

| Component | Variants / content | Behavior |
| --- | --- | --- |
| `PortfolioNode` | Root, category, project, external link | Selectable, draggable; consistent active/focus treatment |
| `ProjectNode` | Thumbnail, title | Opens a project in the panel; crop thumbnail with `object-fit: cover` |
| `BranchToggle` | Expanded chevron; collapsed numeric badge | Toggles descendants without activating the node body |
| `Connector` | Default; selected path | Follows nodes; visible but not selectable or editable |
| `CanvasControls` | Zoom in, zoom out, fit view | Labelled buttons; visible tooltips and disabled states at zoom limits |
| `AccentControl` | Swatch and “Accent” label | Present in Figma; proposed optional preset selector, not a required first-release feature |
| `ContentPanel` | About, résumé, category, project, writing, gallery | Stable outer shell; changes content by selection |
| `ContentSelector` | Current item and grouped alternatives | Synchronized with map; selecting an item reveals its branch |
| `ProjectArticle` | Title, metadata, cover, Markdown body | Shared layout for all projects |
| `Figure` | Image, alt text, optional caption | Preserves aspect ratio; optional full-size view |

The supplied control icons do not establish an unambiguous complete zoom-control contract. The three proposed controls above prioritize understandable navigation. Reuse the original exported icons where their meaning matches; otherwise resolve icon design during implementation.

### States — proposed

- **Default:** white surface, black label, no heavy shadow.
- **Hover:** subtle neutral outline; show relevant control tooltip.
- **Selected:** orange outline and soft halo; panel reflects this item. Selection persists while reading.
- **Keyboard focus:** independent 2 px high-contrast outline, offset 4 px, visible even on selected nodes.
- **Dragging:** grabbing cursor and elevated stacking order; connections update continuously. Do not switch panel content on drag release.
- **Collapsed:** parent remains in place; descendants and their edges hide; badge shows actual hidden descendant count.
- **Disabled control:** subdued appearance plus disabled semantics; never communicate state by opacity alone.

## Interaction contract — proposed unless noted

1. About Me is selected on first visit, matching the supplied default frame.
2. Click a node body to select it and display its content. A parent body displays its category overview; its separate toggle controls collapse.
3. Drag nodes to reposition them. Start dragging after approximately 5 screen pixels of movement to distinguish clicks from drags.
4. Drag empty canvas to pan. Support pinch zoom, explicit zoom buttons, and wheel zoom within the canvas. Do not capture these gestures over panel content or controls.
5. Use an initial bounded world of 4000 × 3000 world units and a zoom range of 0.35–1.8. These are tuning defaults, not Figma measurements; verify map fit on supported screens.
6. Keep nodes and the camera within configured bounds. Fit view targets visible nodes and the available map region. A separate reset-layout action is optional; fit view must not overwrite dragged positions.
7. Hide every descendant and connected edge on collapse without deleting data. Preserve positions and nested collapse state for expansion.
8. If collapsing a branch hides the selected node, select the parent and show its overview. If navigation selects a hidden node, expand its ancestors and bring it into view.
9. Visitors cannot create, delete, reconnect, rename, or edit nodes/edges. Disable deletion keys and connection handles; enforce the same policy in state updates.
10. Keep exploration changes in memory for the visit initially. Author content and default positions locally. Browser persistence is optional and must never modify published content.
11. Use a URL fragment or route for the selected content so refresh, sharing, and browser back/forward restore the selection.
12. LinkedIn is an explicitly labelled external destination. Résumé opens a local content view with an optional downloadable PDF. The content selector must identify external destinations as such.

### Keyboard and accessible navigation

- Every content destination is reachable without dragging or precise pointer movement, through focusable nodes and the content selector.
- Enter/Space activates a node or branch toggle. Toggles expose `aria-expanded` and an accessible label such as “Expand MathWorks, 3 projects.”
- Keep visual badges approximately 23 px as observed, but provide a proposed 44 × 44 px non-overlapping hit target. Enlarge the observed 43 px controls to 44 px for consistency.
- Provide a short canvas instruction and named zoom/fit buttons. Ensure keyboard users can leave the map; avoid a focus trap.
- Announce the selected content title politely when the panel changes. Keep focus on the activating node; offer a “Read selected content” action that moves focus to the panel heading.
- Use meaningful image alt text, logical article headings, and focus restoration when the compact content sheet closes.
- Selected state must have both a structural cue (outline/current-item semantics) and color.

### Motion

Proposed durations: hover/focus 120 ms; panel content transition 160 ms; viewport movement 220 ms. Use a short ease-out. Keep dragging immediate. Do not animate node coordinates when selection changes. Respect reduced-motion preferences by removing travel animations and crossfades. Avoid force simulation or perpetual floating motion that makes nodes harder to click.

## Local content model

Keep navigation data separate from editorial content. Suggested future structure (not created by this document):

```text
content/
  about.md
  resume.md
  mathworks.md
  projects/
    code-to-ai-workflow.md
    matlab-grid.md
    icon-design-language.md
public/images/
  portrait.webp
  projects/...
src/data/
  portfolio-map.ts
```

Each map record contains a stable ID, parent ID, label, node type, initial position, and content ID or external URL. Generate edges and counts from these records. The project files supply their own images and editorial metadata.

Proposed Markdown front matter example, with illustrative values only:

```yaml
---
id: matlab-grid
title: Rethinking the MATLAB grid
organization: MathWorks
role: Replace with your project role
period: Replace with project dates
summary: Replace with a short project summary.
thumbnail: /images/projects/matlab-grid/thumbnail.webp
cover: /images/projects/matlab-grid/cover.webp
coverAlt: Replace with a description of the cover image.
order: 2
---
```

The shared article template renders metadata and cover once, followed by Markdown sections such as Overview, Problem, My contribution, Process, and Outcome. Sections are optional; do not invent results to fill a template. Standard images may use Markdown image syntax. Use shared renderers for headings, links, figures, and blockquotes to keep styling consistent.

Start with Markdown plus front-matter parsing. Add MDX only if the writing needs embedded components such as a comparison slider or custom gallery. Edit files locally, preview, then rebuild/publish the static site. A database or content-management service is not required by this design.

## Implementation handoff

- Recommended baseline from the earlier research: React, Vite, React Flow, and a Markdown renderer. This remains a proposal; the workspace has no existing app stack.
- Implement tokens as CSS custom properties and keep graph coordinates separate from responsive panel layout.
- Use the supplied Figma assets for implementation; exported asset URLs are temporary and must not become permanent content references. Download the exact assets when building, then give them stable local names.
- Use CSS outline/box-shadow for selected rings so node geometry remains stable. Render connectors behind nodes.
- Keep the panel outside the map pan/zoom transform. Synchronize both views through a single selected content ID.

## Verification before release

- At the reference desktop size, compare typography, colors, padding, card shape, and panel proportions to the Figma frame.
- Confirm that all initial project titles and connectors are visible outside the panel overlay.
- Verify click versus drag, bounded pan/zoom, fit view, expand/collapse, accurate badges, and preservation of positions.
- Confirm that Delete/Backspace and pointer interactions cannot alter authored nodes or connections.
- Verify selector/map synchronization, direct links, browser history, and collapse of the currently selected branch.
- Check long articles and images, independent panel scrolling, keyboard navigation, focus visibility, compact layouts, and reduced motion.
- Confirm actual URLs, portrait/project images, résumé download, dates, and all claims with the portfolio owner.

## Remaining design choices

These do not block this specification: whether the Accent control is interactive; actual Writing/Gallery content; preferred project-detail compositions; and whether visitor positions should persist across visits. Keep the documented defaults until these choices are refined.
