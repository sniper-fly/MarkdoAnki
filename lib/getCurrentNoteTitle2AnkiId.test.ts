import { getCurrentNoteTitle2AnkiId } from "./getCurrentNoteTitle2AnkiId";
import { describe, it, expect } from "vitest";

describe("getCurrentNoteTitle2AnkiId", () => {
  it("should retain existing IDs for current notes", () => {
    const currentSet = new Set(["note1", "note2"]);
    const previousIds = { note1: 1234, note2: 5678, note3: 9012 };
    const deletedCards: [string, number][] = [];

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds, deletedCards);

    expect(result).toEqual({
      note1: 1234,
      note2: 5678
    });
  });

  it("should exclude deleted cards", () => {
    const currentSet = new Set(["note1", "note2", "note3"]);
    const previousIds = { note1: 1234, note2: 5678, note3: 9012 };
    const deletedCards: [string, number][] = [["note2", 5678]];

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds, deletedCards);

    expect(result).toEqual({
      note1: 1234,
      note3: 9012
    });
  });

  it("should handle new notes without previous IDs", () => {
    const currentSet = new Set(["note4", "note5"]);
    const previousIds = { note1: 1234, note2: 5678 };
    const deletedCards: [string, number][] = [];

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds, deletedCards);

    expect(result).toEqual({});
  });

  it("should handle empty inputs", () => {
    const currentSet = new Set<string>();
    const previousIds = {};
    const deletedCards: [string, number][] = [];

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds, deletedCards);

    expect(result).toEqual({});
  });

  it("should handle mixed scenario", () => {
    const currentSet = new Set(["note1", "note2", "note3", "note4"]);
    const previousIds = { note1: 1234, note2: 5678, note3: 9012 };
    const deletedCards: [string, number][] = [["note2", 5678]];

    const result = getCurrentNoteTitle2AnkiId(currentSet, previousIds, deletedCards);

    expect(result).toEqual({
      note1: 1234,
      note3: 9012
    });
  });
});
