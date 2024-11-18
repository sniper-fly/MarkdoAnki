import { describe, it, expect, vi, afterEach } from "vitest";
import { retrieveCurrentAnkiIds } from "./retrieveCurrentAnkiIds";
import { readdirSync, readFileSync } from "fs";
import { extractAnkiId } from "./extractAnkiId";

vi.mock("fs");
vi.mock("./extractAnkiId");

describe("retrieveCurrentAnkiIds", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should retrieve Anki IDs from markdown files", () => {
    const mockFiles = ["file1.md", "file2.md", "file3.txt"];
    vi.mocked(readdirSync).mockReturnValue(mockFiles);
    vi.mocked(readFileSync).mockReturnValue("");
    vi.mocked(extractAnkiId).mockReturnValue("1234");

    const result = retrieveCurrentAnkiIds("mock/path");
    expect(result).toEqual(new Set(["1234"]));
  });
});
