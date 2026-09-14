export type Page = {
  id: string;
  label: string;
  title: string;
  parent?: string;
  kind?: 'root' | 'project' | 'email' | 'music';
  position: { x: number; y: number };
  thumbnail?: string;
  side?: 'left';
  email?: string;
  selectable?: boolean;
  href?: string;
};

// Authored positions are independent of the visitor's temporary arrangement.
export const pages: Page[] = [
  { id: 'about', label: 'About Me', title: 'Botao Lu', kind: 'root', position: { x: 280, y: 380 } },
  { id: 'resume', label: 'Resume', title: 'Résumé', selectable: false, href: 'https://docs.google.com/document/d/1M-wuTFYqcQWkWmBgpEZfV0kIqLn93LAfLnW0XobU_74/edit?tab=t.0', parent: 'about', side: 'left', position: { x: 10, y: 260 } },
  { id: 'linkedin', href: 'https://www.linkedin.com/in/botaolu/', label: 'LinkedIn', title: 'LinkedIn', selectable: false, parent: 'about', side: 'left', position: { x: 10, y: 425 } },
  { id: 'email', label: 'Email', title: 'Email', selectable: false, parent: 'about', kind: 'email', email: 'botao.lu@outlook.com', side: 'left', position: { x: 10, y: 540 } },
  { id: 'music', label: 'Music', title: 'Music', selectable: false, parent: 'about', kind: 'music', position: { x: 280, y: 540 } },
  { id: 'mathworks', label: 'Work @MathWorks', title: 'Work at MathWorks', parent: 'about', position: { x: 535, y: 270 } },
  { id: 'ai-workflow', label: 'From Code to AI Workflow', title: 'From Code to AI Workflow', parent: 'mathworks', kind: 'project', thumbnail: './images/project-preview.png', position: { x: 800, y: 140 } },
  { id: 'matlab-grid', label: 'Rethinking the MATLAB grid', title: 'Rethinking the MATLAB grid', parent: 'mathworks', kind: 'project', thumbnail: './images/matlab-grid.png', position: { x: 800, y: 270 } },
  { id: 'icon-language', label: '4,500 Icons, One Design Language', title: '4,500 Icons, One Design Language', parent: 'mathworks', kind: 'project', thumbnail: './images/icon-language.png', position: { x: 800, y: 400 } },
  { id: 'writing', label: 'How I create this page?', title: 'How I create this page?', parent: 'about', position: { x: 535, y: 510 } },
  { id: 'gallery', label: 'Photo Gallery', title: 'Photo Gallery', parent: 'about', position: { x: 535, y: 660 } },
];

export const pageById = new Map(pages.map((page) => [page.id, page]));
export const navigationPages = pages.filter((page) => page.selectable !== false);
export function pageFromHash(hash: string): string {
  const id = hash.replace(/^#/, '');
  return navigationPages.some((page) => page.id === id) ? id : 'about';
}
