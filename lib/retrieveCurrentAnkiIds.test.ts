import { describe, it, expect, vi, afterEach } from "vitest";
import { retrieveCurrentAnkiIds } from "./retrieveCurrentAnkiIds";
import { readdir, readFileSync } from "fs";
import { extractAnkiId } from "./extractAnkiId";

vi.mock("fs");
vi.mock("./extractAnkiId");

describe("retrieveCurrentAnkiIds", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should retrieve Anki IDs from markdown files", () => {
    const mockFiles = ["file1.md", "file2.md", "file3.txt"];
    vi.mocked(readdir).mockImplementation((path, callback) => {
      callback(null, mockFiles);
    });
    vi.mocked(readFileSync).mockReturnValue("");
    vi.mocked(extractAnkiId).mockReturnValue("1234");

    const result = retrieveCurrentAnkiIds("mock/path");
    expect(result).toEqual(new Set(["1234"]));
  });
});
