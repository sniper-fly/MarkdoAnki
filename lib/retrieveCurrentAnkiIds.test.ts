import { describe, it, expect, vi } from "vitest";
import { retrieveCurrentAnkiIds } from "./retrieveCurrentAnkiIds";
import { readdir, readFileSync } from "fs";
import { afterEach } from "node:test";

vi.mock("fs");

describe("retrieveCurrentAnkiIds", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should retrieve Anki IDs from markdown files", () => {
    const mockFiles = ["file1.md", "file2.md", "file3.txt"];
    const mockFileContent = `
---
tags:
  - mysql
AnkiID:
  1234
---
AnkiID:
  5678
`;
    vi.mocked(readdir).mockImplementation((path, callback) => {
      callback(null, mockFiles);
    });
    vi.mocked(readFileSync).mockImplementation((path, encoding) => {
      if (typeof path === "string" && path.endsWith(".md")) {
        return mockFileContent;
      }
      return "";
    });
    const result = retrieveCurrentAnkiIds("/mock/path");
    expect(result).toEqual(new Set(["1234"]));
  });

  it("should retrieve minus Anki ID from markdown files", () => {
    const mockFiles = ["file1.md", "file2.md", "file3.txt"];
    const mockFileContent = `
---
tags:
  - mysql
AnkiID:
  -1
---
`;
    vi.mocked(readdir).mockImplementation((path, callback) => {
      callback(null, mockFiles);
    });
    vi.mocked(readFileSync).mockImplementation((path, encoding) => {
      if (typeof path === "string" && path.endsWith(".md")) {
        return mockFileContent;
      }
      return "";
    });
    const result = retrieveCurrentAnkiIds("/mock/path");
    expect(result).toEqual(new Set(["-1"]));
  });

  it("should handle files without AnkiID", () => {
    const mockFiles = ["file1.md", "file2.md"];
    const mockFileContentWithoutAnkiID = `
---
tags:
  - mysql
---
AnkiID: 12
AnkiID:
  34
`;
    vi.mocked(readdir).mockImplementation((path, callback) => {
      callback(null, mockFiles);
    });
    vi.mocked(readFileSync).mockImplementation((path, encoding) => {
      return mockFileContentWithoutAnkiID;
    });
    const result = retrieveCurrentAnkiIds("/mock/path");
    expect(result).toEqual(new Set());
  });

  it("should handle files without front matter", () => {
    const mockFiles = ["file1.md", "file2.md"];
    const mockFileContentWithoutFrontMatter = `
Some content without front matter
AnkiID:
  12
`;
    vi.mocked(readdir).mockImplementation((path, callback) => {
      callback(null, mockFiles);
    });
    vi.mocked(readFileSync).mockImplementation((path, encoding) => {
      return mockFileContentWithoutFrontMatter;
    });
    const result = retrieveCurrentAnkiIds("/mock/path");
    expect(result).toEqual(new Set());
  });
});
