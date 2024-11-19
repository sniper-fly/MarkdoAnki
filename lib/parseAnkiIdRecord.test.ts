import { readFileSync } from "fs";
import { parseAnkiIdRecord } from "./parseAnkiIdRecord";
import { describe, it, expect, vi } from "vitest";

// Mock the fs module
vi.mock("fs");

describe("parseAnkiIdRecord", () => {
  it("should return an object with filename as key and AnkiID as value", () => {
    const mockData = `
1331414/[[filename1]]
-1/[[filename2]]
`;
    vi.mocked(readFileSync).mockReturnValue(mockData);
    const result = parseAnkiIdRecord("/path/to/ankiIdRecord");
    const expected = {
      filename1: 1331414,
      filename2: -1,
    };
    expect(result).toEqual(expected);
  });

  it("should ignore if the line has invalid id format", () => {
    const mockData = `
1331414/[[filename1]]
undefined/[[filename2]]
-1/[[filename3]]
`;
    vi.mocked(readFileSync).mockReturnValue(mockData);
    const result = parseAnkiIdRecord("/path/to/ankiIdRecord");
    const expected = {
      filename1: 1331414,
      filename3: -1,
    };
    expect(result).toEqual(expected);
  });

  it("should return empty object if the record content is empty", () => {
    const mockData = "";
    vi.mocked(readFileSync).mockReturnValue(mockData);
    const result = parseAnkiIdRecord("/path/to/ankiIdRecord");
    const expected = {};
    expect(result).toEqual(expected);
  });

  it("should return an empty object if the file does not exist", () => {
    const error = new Error("File not found") as NodeJS.ErrnoException;
    error.code = "ENOENT";
    vi.mocked(readFileSync).mockImplementation(() => {
      throw error;
    });
    const result = parseAnkiIdRecord("/path/to/ankiIdRecord");
    const expected = {};
    expect(result).toEqual(expected);
  });

  it("should throw an error for other errors", () => {
    const error = new Error("Some other error");
    vi.mocked(readFileSync).mockImplementation(() => {
      throw error;
    });
    expect(() => parseAnkiIdRecord("/path/to/ankiIdRecord")).toThrow("Some other error");
  });
});
