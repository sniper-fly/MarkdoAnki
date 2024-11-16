import { describe, it, expect } from 'vitest';
import { extractAnkiId } from './extractAnkiId';

describe('extractAnkiId', () => {

  it('should extract AnkiID from front matter', () => {
    const data = `
---
tags:
  - mysql
AnkiID:
  1234
---
Some content here
AnkiID:
  3456
`;
    const result = extractAnkiId(data);
    expect(result).toBe('1234');
  });

  it('should extract AnkiID from front matter 2', () => {
    const data = `
---
AnkiID:
  1234
tags:
  - mysql
---
Some content here
AnkiID:
  3456
`;
    const result = extractAnkiId(data);
    expect(result).toBe('1234');
  });

  it('should return null if AnkiID is not present', () => {
    const data = `
---
tags:
  - mysql
---
Some content here
`;
    const result = extractAnkiId(data);
    expect(result).toBeNull();
  });

  it('should return null if front matter is not present', () => {
    const data = `
Some content here
`;
    const result = extractAnkiId(data);
    expect(result).toBeNull();
  });

  it('should extract negative AnkiID', () => {
    const data = `
---
tags:
  - mysql
AnkiID:
  -1234
---
Some content here
`;
    const result = extractAnkiId(data);
    expect(result).toBe('-1234');
  });

  it('should extract the very first frontMatter', () => {
    const data = `
---
tags:
  - mysql
AnkiID:
  1234
---
Some content here
---
AnkiID:
  3456
---
`;
    const result = extractAnkiId(data);
    expect(result).toBe('1234');
  });
});
