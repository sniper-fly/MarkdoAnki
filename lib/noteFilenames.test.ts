import { readdirSync } from "fs";
import { noteFilenames } from "./noteFilenames";
import { describe, it, expect, vi } from "vitest";

// Mock the fs module
vi.mock("fs");

describe("noteFilenames", () => {
  it("should return a set of filenames without extensions", () => {
    const mockFiles = ["note1.md", "note2.md", "note3.md"];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);

    const result = noteFilenames("/path/to/notes");
    const expected = new Set(["note1", "note2", "note3"]);
    expect(result).toEqual(expected);
  });

  it("should ignore non-markdown files", () => {
    const mockFiles = ["note1.md", "note2.txt", "note3.md", "image.png"];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);

    const result = noteFilenames("/path/to/notes");
    const expected = new Set(["note1", "note3"]);
    expect(result).toEqual(expected);
  });

  it("should return an empty set if no markdown files are present", () => {
    const mockFiles = ["note1.txt", "image.png"];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);

    const result = noteFilenames("/path/to/notes");
    const expected = new Set();
    expect(result).toEqual(expected);
  });

  it("should return an empty set if the directory is empty", () => {
    const mockFiles: string[] = [];
    vi.mocked(readdirSync).mockReturnValue(mockFiles as any);

    const result = noteFilenames("/path/to/notes");
    const expected = new Set();
    expect(result).toEqual(expected);
  });
});
