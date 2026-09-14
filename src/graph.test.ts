import assert from 'node:assert/strict';
import test from 'node:test';
import { pages, navigationPages, pageFromHash } from './graph.ts';

test('writing and photography are content destinations without child nodes', () => {
  for (const id of ['writing', 'gallery']) {
    assert.equal(pageFromHash(`#${id}`), id);
    assert.equal(pages.some((page) => page.parent === id), false);
  }
});
test('external links and components do not route to content', () => {
  for (const id of ['resume', 'linkedin', 'email', 'music']) {
    assert.equal(pageFromHash(`#${id}`), 'about');
    assert.equal(navigationPages.some((page) => page.id === id), false);
  }
  assert.equal(pageFromHash('#icon-language'), 'icon-language');
});
test('component connections and parent references are valid', () => {
  for (const id of ['email', 'music']) assert.equal(pages.find((page) => page.id === id)?.parent, 'about');
  for (const page of pages) if (page.parent) assert.ok(pages.some((parent) => parent.id === page.parent));
});
