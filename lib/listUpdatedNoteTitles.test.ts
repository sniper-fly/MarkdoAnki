import { listUpdatedNoteTitles } from "./listUpdatedNoteTitles";
import { readdirSync, statSync } from "fs";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fs");

describe("listUpdatedNoteTitles", () => {
  const mockPath = "/path/to/notes";
  const mockLastUpdatedAt = new Date("2024-01-01");
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return updated markdown files", () => {
    const currentSet = new Set(["note1", "note2", "note3"]);
    vi.mocked(readdirSync).mockReturnValue([
      "note1.md",
      "note2.md",
      "note3.md"
    ] as any);

    vi.mocked(statSync).mockImplementation((path: string) => {
      const dates: Record<string, Date> = {
        "/path/to/notes/note1.md": new Date("2024-01-02"),
        "/path/to/notes/note2.md": new Date("2023-12-31"),
        "/path/to/notes/note3.md": new Date("2024-01-03")
      };
      return { mtime: dates[path] } as any;
    });

    const result = listUpdatedNoteTitles(mockPath, currentSet, mockLastUpdatedAt);
    expect(result).toEqual(["note1", "note3"]);
  });

  it("should filter non-markdown files", () => {
    const currentSet = new Set(["note1", "note2"]);
    vi.mocked(readdirSync).mockReturnValue([
      "note1.md",
      "note2.txt",
      "image.png"
    ] as any);

    vi.mocked(statSync).mockImplementation(() => ({
      mtime: new Date("2024-01-02")
    } as any));

    const result = listUpdatedNoteTitles(mockPath, currentSet, mockLastUpdatedAt);
    expect(result).toEqual(["note1"]);
  });

  it("should handle empty directory", () => {
    const currentSet = new Set<string>();
    vi.mocked(readdirSync).mockReturnValue([] as any);

    const result = listUpdatedNoteTitles(mockPath, currentSet, mockLastUpdatedAt);
    expect(result).toEqual([]);
  });

  it("should filter files not in current set", () => {
    const currentSet = new Set(["note1"]);
    vi.mocked(readdirSync).mockReturnValue([
      "note1.md",
      "note2.md"
    ] as any);

    vi.mocked(statSync).mockImplementation(() => ({
      mtime: new Date("2024-01-02")
    } as any));

    const result = listUpdatedNoteTitles(mockPath, currentSet, mockLastUpdatedAt);
    expect(result).toEqual(["note1"]);
  });
});
