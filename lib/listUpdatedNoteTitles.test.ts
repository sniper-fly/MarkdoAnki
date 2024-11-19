import { describe, it, expect, vi } from "vitest";
import { listUpdatedNoteTitles } from "./listUpdatedNoteTitles";
import { readdirSync, statSync } from "fs";

vi.mock("fs");

describe("listUpdatedNoteTitles", () => {
  it("should list updated markdown files", () => {
    const mockFiles = ["file1.md", "file2.md", "file3.txt"];
    const lastUpdatedAt = new Date("2023-01-01T00:00:00Z");
    const mockStats = {
      mtime: new Date("2023-02-01T00:00:00Z"),
    };

    vi.mocked(readdirSync).mockReturnValue(mockFiles);
    vi.mocked(statSync).mockImplementation((path) => {
      return mockStats;
    });

    const result = listUpdatedNoteTitles("/mock/path", lastUpdatedAt);
    expect(result).toEqual(["file1", "file2"]);
  });

  it("should handle files that are not updated", () => {
    const mockFiles = ["file1.md", "file2.md"];
    const lastUpdatedAt = new Date("2023-03-01T00:00:00Z");
    const mockStats = {
      mtime: new Date("2023-02-01T00:00:00Z"),
    };

    vi.mocked(readdirSync).mockReturnValue(mockFiles);
    vi.mocked(statSync).mockImplementation((path) => {
      return mockStats;
    });

    const result = listUpdatedNoteTitles("/mock/path", lastUpdatedAt);
    expect(result).toEqual([]);
  });

  it("should only process .md files", () => {
    const mockFiles = ["file1.md", "file2.md", "file3.txt"];
    const lastUpdatedAt = new Date("2023-01-01T00:00:00Z");
    const mockStats = {
      mtime: new Date("2023-02-01T00:00:00Z"),
    };

    vi.mocked(readdirSync).mockReturnValue(mockFiles);
    vi.mocked(statSync).mockImplementation((path) => {
      return mockStats;
    });

    const result = listUpdatedNoteTitles("/mock/path", lastUpdatedAt);
    expect(result).toEqual(["file1", "file2"]);
  });

  it("should handle empty directory", () => {
    const mockFiles: string[] = [];
    const lastUpdatedAt = new Date("2023-01-01T00:00:00Z");

    vi.mocked(readdirSync).mockReturnValue(mockFiles);

    const result = listUpdatedNoteTitles("/mock/path", lastUpdatedAt);
    expect(result).toEqual([]);
  });
});
