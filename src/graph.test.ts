import assert from 'node:assert/strict';
import test from 'node:test';
import { pages, navigationPages, descendants, expandAncestors, initialCollapsed, isHidden, pageFromHash } from './graph.ts';

test('collapsing branches hides their descendants without hiding the parent', () => {
  const collapsed = new Set(['mathworks']);
  assert.equal(isHidden('mathworks', collapsed), false);
  for (const id of ['ai-workflow', 'matlab-grid', 'icon-language']) assert.equal(isHidden(id, collapsed), true);
  assert.equal(isHidden('resume', collapsed), false);
  assert.equal(descendants('mathworks').length, 3);
  assert.equal(descendants('writing').length, 4);
  assert.equal(descendants('gallery').length, 8);
});

test('selecting a hidden page expands its ancestors while preserving other collapsed branches', () => {
  const collapsed = new Set(['about', ...initialCollapsed]);
  const next = expandAncestors('writing-3', collapsed);
  assert.equal(isHidden('writing-3', next), false);
  assert.equal(next.has('gallery'), true);
  assert.equal(collapsed.has('about'), true);
});

test('root collapse hides every child; hashes only resolve content pages', () => {
  assert.equal(descendants('about').length, pages.length - 1);
  assert.deepEqual(pages.filter((page) => !isHidden(page.id, new Set(['about']))).map((page) => page.id), ['about']);
  assert.equal(pageFromHash('#matlab-grid'), 'matlab-grid');
  assert.equal(pageFromHash('#unknown'), 'about');
  assert.equal(pageFromHash(''), 'about');
  for (const id of ['email', 'music', 'linkedin', 'github', 'writing', 'gallery']) {
    assert.equal(pageFromHash(`#${id}`), 'about');
    assert.equal(navigationPages.some((page) => page.id === id), false);
  }
  assert.equal(navigationPages.some((page) => page.kind === 'email' || page.kind === 'music'), false);
});
