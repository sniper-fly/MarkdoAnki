import { readdirSync, readFileSync } from "fs";
import { listTargetNoteTitles } from "./listTargetNoteTitles";
import { describe, it, expect, vi } from "vitest";
import { extractAnkiProperty } from "./extractAnkiProperty";

// Mock the fs module
vi.mock("fs");
vi.mock("./extractAnkiProperty");

describe("listTargetNoteTitles", () => {
  it("should return a set of filenames without extensions", () => {
    const mockFiles = ["note1.md", "note2.md", "note3.md"];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);

    const result = listTargetNoteTitles("/path/to/notes");
    const expected = new Set(["note1", "note2", "note3"]);
    expect(result).toEqual(expected);
  });

  it("should ignore non-markdown files", () => {
    const mockFiles = ["note1.md", "note2.txt", "note3.md", "image.png"];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);

    const result = listTargetNoteTitles("/path/to/notes");
    const expected = new Set(["note1", "note3"]);
    expect(result).toEqual(expected);
  });

  it("should return an empty set if no markdown files are present", () => {
    const mockFiles = ["note1.txt", "image.png"];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);

    const result = listTargetNoteTitles("/path/to/notes");
    const expected = new Set();
    expect(result).toEqual(expected);
  });

  it("should return an empty set if the directory is empty", () => {
    const mockFiles: string[] = [];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);

    const result = listTargetNoteTitles("/path/to/notes");
    const expected = new Set();
    expect(result).toEqual(expected);
  });

  it("should not list files with ankiProperty set to 'false'", () => {
    const mockFiles = ["note1.md", "note2.md", "note3.md"];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);
    vi.mocked(readFileSync).mockImplementation((path, encoding) => {
      if (path.includes("note2")) {
        return "note2";
      }
      return "";
    });
    vi.mocked(extractAnkiProperty).mockImplementation((data) => {
      if (data.includes("note2")) {
        return "false";
      }
      return "true";
    });

    const result = listTargetNoteTitles("/path/to/notes");
    const expected = new Set(["note1", "note3"]);
    expect(result).toEqual(expected);
  });
});
