export type Page = {
  id: string;
  label: string;
  title: string;
  parent?: string;
  kind?: 'root' | 'project';
  position: { x: number; y: number };
  thumbnail?: string;
  side?: 'left';
};

// Authored positions are independent of the visitor's temporary arrangement.
export const pages: Page[] = [
  { id: 'about', label: 'About Me', title: 'Botao Lu', kind: 'root', position: { x: 280, y: 380 } },
  { id: 'resume', label: 'resume.md', title: 'Résumé', parent: 'about', side: 'left', position: { x: 10, y: 310 } },
  { id: 'linkedin', label: 'LinkedIn', title: 'LinkedIn', parent: 'about', side: 'left', position: { x: 10, y: 425 } },
  { id: 'mathworks', label: 'Work at MathWorks', title: 'Work at MathWorks', parent: 'about', position: { x: 535, y: 270 } },
  { id: 'ai-workflow', label: 'From Code to AI Workflow', title: 'From Code to AI Workflow', parent: 'mathworks', kind: 'project', thumbnail: '/images/project-preview.png', position: { x: 800, y: 140 } },
  { id: 'matlab-grid', label: 'Rethinking the MATLAB grid', title: 'Rethinking the MATLAB grid', parent: 'mathworks', kind: 'project', thumbnail: '/images/project-preview.png', position: { x: 800, y: 270 } },
  { id: 'icon-language', label: '4,500 Icons, One Design Language', title: '4,500 Icons, One Design Language', parent: 'mathworks', kind: 'project', thumbnail: '/images/project-preview.png', position: { x: 800, y: 400 } },
  { id: 'writing', label: 'Writing', title: 'Writing', parent: 'about', position: { x: 535, y: 510 } },
  ...Array.from({ length: 4 }, (_, i): Page => ({ id: `writing-${i + 1}`, label: `Writing ${String(i + 1).padStart(2, '0')}`, title: `Writing ${String(i + 1).padStart(2, '0')}`, parent: 'writing', position: { x: 800, y: 550 + i * 110 } })),
  { id: 'gallery', label: 'Gallery', title: 'Gallery', parent: 'about', position: { x: 535, y: 660 } },
  ...Array.from({ length: 8 }, (_, i): Page => ({ id: `gallery-${i + 1}`, label: `Gallery ${String(i + 1).padStart(2, '0')}`, title: `Gallery ${String(i + 1).padStart(2, '0')}`, parent: 'gallery', position: { x: 1070, y: 550 + i * 110 } })),
];

export const pageById = new Map(pages.map((page) => [page.id, page]));
export const initialCollapsed = new Set(['writing', 'gallery']);

export function ancestors(id: string): string[] {
  const result: string[] = [];
  let parent = pageById.get(id)?.parent;
  while (parent) {
    result.push(parent);
    parent = pageById.get(parent)?.parent;
  }
  return result;
}

export function descendants(id: string): string[] {
  return pages.filter((page) => ancestors(page.id).includes(id)).map((page) => page.id);
}

export function isHidden(id: string, collapsed: Set<string>): boolean {
  return ancestors(id).some((parent) => collapsed.has(parent));
}

export function expandAncestors(id: string, collapsed: Set<string>): Set<string> {
  const next = new Set(collapsed);
  ancestors(id).forEach((parent) => next.delete(parent));
  return next;
}

export function pageFromHash(hash: string): string {
  const id = hash.replace(/^#/, '');
  return pageById.has(id) ? id : 'about';
}
