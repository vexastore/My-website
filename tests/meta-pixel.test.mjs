import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/components/MetaPixel.tsx', import.meta.url), 'utf8');

test('MetaPixel does not pass event handlers across the Server Component boundary', () => {
  assert.doesNotMatch(source, /\bon[A-Z][A-Za-z]*\s*=/);
});

test('MetaPixel remains deferred and production-only', () => {
  assert.match(source, /process\.env\.NODE_ENV\s*!==\s*["']production["']/);
  assert.match(source, /strategy=["']afterInteractive["']/);
});
