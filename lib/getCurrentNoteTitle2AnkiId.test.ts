import { getCurrentNoteTitle2AnkiId } from "./getCurrentNoteTitle2AnkiId";
import { describe, it, expect } from "vitest";

describe("getCurrentNoteTitle2AnkiId", () => {
  it("should preserve existing Anki IDs for current notes", () => {
    const currentSet = new Set(["note1", "note2"]);
    const previousIds = { note1: 1234, note2: 5678, note3: 9012 };

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds);

    expect(result).toEqual({
      note1: 1234,
      note2: 5678,
    });
  });

  it("should handle titles not in previous records", () => {
    const currentSet = new Set(["note4", "note5"]);
    const previousIds = { note1: 1234, note2: 5678 };

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds);

    expect(result).toEqual({});
  });

  it("should handle empty current set", () => {
    const currentSet = new Set<string>();
    const previousIds = { note1: 1234, note2: 5678 };

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds);

    expect(result).toEqual({});
  });

  it("should handle mixed existing and new titles", () => {
    const currentSet = new Set(["note1", "note3", "note4"]);
    const previousIds = { note1: 1234, note2: 5678 };

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds);

    expect(result).toEqual({
      note1: 1234,
    });
  });
});
