// describe("MarkdoAnki", () => {
//   it("should do integrated test", async () => {
//     // 前処理
//     // test/html_backup にあるファイルを test/html にコピー

//     // test/vault_backup にあるファイルを test/vault にコピー

//     // AnkiID がないファイルは 新たに AnkiID を付与されているか
//     // AnkiID をファイル名として持つファイルが test/html にあるか

//     // 後処理
//     // test/html のファイルを削除

//     // test/vault のファイルを削除
//   });
// });

import { MarkdoAnki } from "./MarkdoAnki";
import { listTargetNoteTitles } from "./listTargetNoteTitles";
import { parseAnkiIdRecord } from "./parseAnkiIdRecord";
import { listUpdatedNoteTitles } from "./listUpdatedNoteTitles";
import { invokeAnkiApi } from "./invokeAnkiApi";
import { generateAnkiCards } from "./generateAnkiCards";
import { getLastUpdatedAt } from "./getLastUpdatedAt";
import { overWriteLastUpdatedAt } from "./overWriteLastUpdatedAt";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCurrentNoteTitle2AnkiId } from "./getCurrentNoteTitle2AnkiId";

// Mock all dependencies
vi.mock("./listTargetNoteTitles");
vi.mock("./parseAnkiIdRecord");
vi.mock("./listUpdatedNoteTitles");
vi.mock("./invokeAnkiApi");
vi.mock("./generateAnkiCards");
vi.mock("./lastUpdatedAt");
vi.mock("./getLastUpdatedAt");
vi.mock("./overWriteLastUpdatedAt");
vi.mock("./getCurrentNoteTitle2AnkiId");

function excludeKey<T extends object, K extends keyof T>(
  obj: T,
  key: K
): Omit<T, K> {
  const { [key]: _, ...rest } = obj;
  return rest;
}

describe("MarkdoAnki", () => {
  const vaultPath = "/path/to/vault";
  const mockConfig = {
    createAllCards: false,
    vaultPath,
    notesPath: `${vaultPath}/notes`,
    ankiIdRecordPath: `${vaultPath}/.ankirecord`,
    deck: "Test Deck",
    modelName: "Basic",
    cardTemplates: [
      {
        Name: "Card 1",
        Front: "{{Front}}",
        Back: "{{Back}}",
      },
    ],
  };

  const mockDate = new Date("2024-01-01");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getLastUpdatedAt).mockReturnValue(mockDate);
    vi.mocked(listTargetNoteTitles).mockReturnValue(
      new Set(["note1", "note2"])
    );
    vi.mocked(parseAnkiIdRecord).mockReturnValue({ note2: 1234, note3: 5678 });
    vi.mocked(listUpdatedNoteTitles).mockReturnValue(["note1"]);
    vi.mocked(invokeAnkiApi).mockResolvedValue(undefined);
    vi.mocked(generateAnkiCards).mockResolvedValue(undefined);
    vi.mocked(getCurrentNoteTitle2AnkiId).mockReturnValue({
      note2: 1234,
      note3: 5678,
    });
  });

  it("should process notes correctly", async () => {
    await MarkdoAnki(mockConfig);

    // Should delete cards that no longer exist
    expect(invokeAnkiApi).toHaveBeenCalledWith("deleteNotes", {
      notes: [5678], // note3's ID should be deleted
    });

    // Should create deck
    expect(invokeAnkiApi).toHaveBeenCalledWith("createDeck", {
      deck: "Test Deck",
    });

    // Should create model
    expect(invokeAnkiApi).toHaveBeenCalledWith("createModel", {
      modelName: "Basic",
      inOrderFields: ["Front", "Back"],
      cardTemplates: mockConfig.cardTemplates,
    });

    // Should generate cards
    expect(generateAnkiCards).toHaveBeenCalledWith({
      noteTitles: ["note1"],
      currentNoteTitle2AnkiId: { note2: 1234, note3: 5678 },
      ...excludeKey(mockConfig, "createAllCards"),
    });

    // Should update last updated timestamp
    expect(overWriteLastUpdatedAt).toHaveBeenCalled();
  });

  it("should process all cards when createAllCards is true", async () => {
    await MarkdoAnki({ ...mockConfig, createAllCards: true });

    expect(getLastUpdatedAt).not.toHaveBeenCalled();
    expect(listUpdatedNoteTitles).toHaveBeenCalledWith(
      mockConfig.notesPath,
      new Date(0)
    );
  });

  it("should handle errors from Anki API", async () => {
    vi.mocked(invokeAnkiApi).mockRejectedValueOnce(new Error("Anki error"));

    await expect(MarkdoAnki(mockConfig)).rejects.toThrow("Anki error");
  });

  it("should handle empty note list", async () => {
    vi.mocked(listTargetNoteTitles).mockReturnValue(new Set());
    vi.mocked(listUpdatedNoteTitles).mockReturnValue([]);

    await MarkdoAnki(mockConfig);

    expect(generateAnkiCards).toHaveBeenCalledWith(
      expect.objectContaining({
        noteTitles: [],
      })
    );
  });
});
