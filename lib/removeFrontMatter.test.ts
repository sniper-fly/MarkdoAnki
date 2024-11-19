import { removeFrontMatter } from "./removeFrontMatter";
import { describe, it, expect } from "vitest";

describe("removeFrontMatter", () => {
  it("should remove front matter from markdown content", () => {
    const data = `\
---
title: Example
tags:
  - test
---
# Hello World
This is a test.`;
    const result = removeFrontMatter(data);
    const expected = `\
# Hello World
This is a test.`;
    expect(result).toBe(expected);
  });

  it("should return the original content if no front matter is present", () => {
    const data = `# Hello World
This is a test.`;
    const result = removeFrontMatter(data);
    expect(result).toBe(data);
  });

  it("should handle empty content", () => {
    const data = ``;
    const result = removeFrontMatter(data);
    expect(result).toBe(data);
  });

  it("should handle content with only front matter", () => {
    const data = `\
---
title: Example
tags:
  - test
---`;
    const result = removeFrontMatter(data);
    const expected = ``;
    expect(result).toBe(expected);
  });

  it("should handle content with malformed front matter", () => {
    const data = `\
---
title: Example
tags:
  - test
--`;
    const result = removeFrontMatter(data);
    expect(result).toBe(data);
  });

  it("should not replace if first line is empty line.", () => {
    const data = `\

---
title: Example
tags:
  - test
---
some content`;
    const result = removeFrontMatter(data);
    expect(result).toBe(data);
  });

  it("should not replace just a long --------- ", () => {
    const data = `\
---
--------
some content
`;
    const result = removeFrontMatter(data);
    expect(result).toBe(data);
  });

});
