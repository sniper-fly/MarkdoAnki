import { describe, it, expect } from "vitest";
import { extractTags } from "./extractTags";

describe("extractTags", () => {
  it("should extract tags from front matter", () => {
    const data = `\
---
title: Example
tags:
  - mysql
  - database
AnkiID:
  1234
---
Some content here
`;
    const result = extractTags(data);
    expect(result).toEqual(["mysql", "database"]);
  });

  it("should return an empty array if tags are not present", () => {
    const data = `\
---
title: Example
---
Some content here
`;
    const result = extractTags(data);
    expect(result).toEqual([]);
  });

  it("should return an empty array if front matter is not present", () => {
    const data = `\
Some content here
`;
    const result = extractTags(data);
    expect(result).toEqual([]);
  });

  it("should handle tags with extra spaces", () => {
    const data = `\
---
tags:
  - mysql
  - database
  -   spaced tag  
---
Some content here
`;
    const result = extractTags(data);
    expect(result).toEqual(["mysql", "database", "spaced tag"]);
  });

  it("should handle empty tags", () => {
    const data = `\
---
tags:
AnkiID:
  1234
---
Some content here
`;
    const result = extractTags(data);
    expect(result).toEqual([]);
  });

  it("should do nothing with long bar ---------", () => {
    const data = `\
Some content here
------------
aaa
`;
    const result = extractTags(data);
    expect(result).toEqual([]);
  });

  it("should not replace if first line is empty", () => {
    const data = `\

---
title: Example
tags:
  - test
---
some content`;
    const result = extractTags(data);
    expect(result).toEqual([]);
  });

  it("should handle content with malformed front matter", () => {
    const data = `\
---
title: Example
tags:
  - test
--`;
    const result = extractTags(data);
    expect(result).toEqual([]);
  });

  it("should handle content with malformed end front matter", () => {
    const data = `\
---
--------
some content
`;
    const result = extractTags(data);
    expect(result).toEqual([]);
  });
});
