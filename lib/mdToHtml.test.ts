import { describe, it, expect } from 'vitest';
import { mdToHtml } from './mdToHtml';

describe('mdToHtml', () => {
  it('should convert markdown to HTML and add Obsidian link', async () => {
    const markdown = `
---
title: Example
tags:
  - test
---
# Hello World

This is a test.
`;
    const notePath = 'path/to/hello.md';
    const result = await mdToHtml(markdown, notePath, 'path/to/til_vault/');
    const expectedHtml = `
<a href="obsidian://open?vault=til_vault&file=path%2Fto%2Fhello">Open in Obsidian</a>
<h1>Hello World</h1>
<p>This is a test.</p>
`.trim();

    expect(result.trim()).toBe(expectedHtml);
  });

  it('should handle markdown without front matter', async () => {
    const markdown = `
# Hello World

This is a test.
`;
    const notePath = 'path/to/hello.md';
    const result = await mdToHtml(markdown, notePath, '/full/path/til_vault/');
    const expectedHtml = `
<a href="obsidian://open?vault=til_vault&file=path%2Fto%2Fhello">Open in Obsidian</a>
<h1>Hello World</h1>
<p>This is a test.</p>
`.trim();

    expect(result.trim()).toBe(expectedHtml);
  });

  it('should handle empty markdown', async () => {
    const markdown = ``;
    const notePath = 'path/to/hello.md';
    const result = await mdToHtml(markdown, notePath, 'til_vault');
    const expectedHtml = `
<a href="obsidian://open?vault=til_vault&file=path%2Fto%2Fhello">Open in Obsidian</a>
`.trim();

    expect(result.trim()).toBe(expectedHtml);
  });
});
