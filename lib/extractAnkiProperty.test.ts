import { extractAnkiProperty } from "./extractAnkiProperty";
import { describe, it, expect } from "vitest";

describe("extractAnkiProperty", () => {
  it("should extract Anki property from valid front matter", () => {
    const data = `\
---
title:
  Test
Anki: "false"
tags:
  - test
---
content`;
    expect(extractAnkiProperty(data)).toBe("false");
  });

  it("should extract Anki property from valid front matter", () => {
    const data = `\
---
Anki:
  "false"
---
content`;
    expect(extractAnkiProperty(data)).toBe("false");
  });

  it("should handle missing Anki property", () => {
    const data = `\
---
title:
  Test
tags:
  - test
---
content`;
    expect(extractAnkiProperty(data)).toBeNull();
  });

  it("should handle invalid front matter", () => {
    const data = `\
--
title:
  Test
Anki:
  "false"
--
content`;
    expect(extractAnkiProperty(data)).toBeNull();
  });

  it("should handle empty input", () => {
    expect(extractAnkiProperty("")).toBeNull();
  });

  it("should handle input without front matter", () => {
    const data = "# Just content\nNo front matter here";
    expect(extractAnkiProperty(data)).toBeNull();
  });

  it("should handle front matter without closing delimiter", () => {
    const data = `\
---
title: Test
Anki: "Basic"
content`;
    expect(extractAnkiProperty(data)).toBeNull();
  });

  it("should handle front matter with empty first line", () => {
    const data = `\

---
title:
  Test
Anki:
  "Basic"
---
content`;
    expect(extractAnkiProperty(data)).toBeNull();
  });
});
