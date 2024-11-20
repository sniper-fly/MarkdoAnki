import { listUpdatedNoteTitles } from "./listUpdatedNoteTitles";
import { statSync } from "fs";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fs");

describe("listUpdatedNoteTitles", () => {
  const mockPath = "/path/to/notes";
  const mockLastUpdatedAt = new Date("2024-01-01T00:00:00Z");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return titles of files modified after lastUpdatedAt", () => {
    const currentSet = new Set(["note1", "note2", "note3"]);

    vi.mocked(statSync).mockImplementation(
      (path: string) =>
        ({
          mtime: path.includes("note1")
            ? new Date("2024-01-02T00:00:00Z")
            : path.includes("note2")
            ? new Date("2024-01-03T00:00:00Z")
            : new Date("2023-12-31T00:00:00Z"),
        } as any)
    );

    const result = listUpdatedNoteTitles(
      mockPath,
      currentSet,
      mockLastUpdatedAt
    );
    expect(result).toEqual(["note1", "note2"]);
  });

  it("should return empty array if no files were modified", () => {
    const currentSet = new Set(["note1", "note2"]);

    vi.mocked(statSync).mockImplementation(
      () =>
        ({
          mtime: new Date("2023-12-31T00:00:00Z"),
        } as any)
    );

    const result = listUpdatedNoteTitles(
      mockPath,
      currentSet,
      mockLastUpdatedAt
    );
    expect(result).toEqual([]);
  });

  it("should handle empty set", () => {
    const currentSet = new Set<string>();
    const result = listUpdatedNoteTitles(
      mockPath,
      currentSet,
      mockLastUpdatedAt
    );
    expect(result).toEqual([]);
  });

  it("should throw error if file stat fails", () => {
    const currentSet = new Set(["note1"]);
    vi.mocked(statSync).mockImplementation(() => {
      throw new Error("File not found");
    });

    expect(() =>
      listUpdatedNoteTitles(mockPath, currentSet, mockLastUpdatedAt)
    ).toThrow("File not found");
  });
});
