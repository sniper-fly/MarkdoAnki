import { describe, it, expect } from 'vitest';
import { insertAnkiID } from './insertAnkiID';

describe('insertAnkiID', () => {
  it('should insert AnkiID into front matter if it does not exist', () => {
    const data = `\
---
title: Example
tags:
  - mysql
  - database
---
Some content here`;
    const ankiId = 1234;
    const result = insertAnkiID(data, ankiId);
    const expected = `\
---
title: Example
tags:
  - mysql
  - database
AnkiID:
  1234
---
Some content here`;
    expect(result).toBe(expected);
  });

  it('should add front matter with AnkiID if it does not exist', () => {
    const data = `Some content here`;
    const ankiId = 1234;
    const result = insertAnkiID(data, ankiId);
    const expected = `\
---
AnkiID:
  1234
---
Some content here`;
    expect(result).toBe(expected);
  });

  it('should handle empty content', () => {
    const data = ``;
    const ankiId = 1234;
    const result = insertAnkiID(data, ankiId);
    const expected = `\
---
AnkiID:
  1234
---
`; // Empty string lies on this line
    expect(result).toBe(expected);
  });

  it('should handle file with long bar ----------', () => {
    const data = `\
SomeContent below
--------------
`;
    const ankiId = 1234;
    const result = insertAnkiID(data, ankiId);
    const expected = `\
---
AnkiID:
  1234
---
SomeContent below
--------------
`; // Empty string lies on this line
    expect(result).toBe(expected);
  });

  it('should throw an error when ankiId is undefined', () => {
    const data = `Some content here`;
    expect(() => insertAnkiID(data)).toThrow("AnkiID is not defined");
  });
});
