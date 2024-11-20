import { recordLatestCardIds } from "./recordLatestCardIds";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("fs");

describe("recordLatestCardIds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create directory and write record file with correct format", () => {
    const ankiIdRecordPath = "/path/to/record";
    const noteTitle2AnkiId = {
      "note1": 1234,
      "note2": 5678,
      "note3": -1
    };

    recordLatestCardIds(ankiIdRecordPath, noteTitle2AnkiId);

    expect(mkdirSync).toHaveBeenCalledWith(ankiIdRecordPath, { recursive: true });
    expect(writeFileSync).toHaveBeenCalledWith(
      join(ankiIdRecordPath, "__previousCardIdsRecord__.md"),
      "1234/[[note1]]\n5678/[[note2]]\n-1/[[note3]]"
    );
  });

  it("should handle empty record object", () => {
    const ankiIdRecordPath = "/path/to/record";
    const noteTitle2AnkiId = {};

    recordLatestCardIds(ankiIdRecordPath, noteTitle2AnkiId);

    expect(mkdirSync).toHaveBeenCalledWith(ankiIdRecordPath, { recursive: true });
    expect(writeFileSync).toHaveBeenCalledWith(
      join(ankiIdRecordPath, "__previousCardIdsRecord__.md"),
      ""
    );
  });
});
