import { generateAnkiCards } from "./generateAnkiCards";
import { mdToHtml } from "./mdToHtml";
import { addAnkiNote, updateAnkiNote } from "./ankiNoteApiOperation";
import { readFileSync } from "fs";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractTags } from "./extractTags";

// Mock dependencies
vi.mock("fs");
vi.mock("./mdToHtml");
vi.mock("./ankiNoteApiOperation");
vi.mock("./extractTags");

describe("generateAnkiCards", () => {
  const mockConfigTemplate = {
    noteTitles: ["note1", "note2", "note3"],
    currentNoteTitle2AnkiId: {
      note2: 1234,
      note3: 5678,
    },
    ankiIdRecordPath: "/path/to/record",
    vaultPath: "/path/to/vault",
    notesPath: "/path/to/notes",
    deck: "Test Deck",
    modelName: "Basic",
  };
  let mockConfig: typeof mockConfigTemplate;

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfig = { ...mockConfigTemplate };
    vi.mocked(readFileSync).mockReturnValue("# Test Note\ntags: test");
    vi.mocked(extractTags).mockReturnValue(["test"]);
    vi.mocked(mdToHtml).mockResolvedValue("<h1>Test Note</h1>");
    vi.mocked(addAnkiNote).mockResolvedValue(5678);
    vi.mocked(updateAnkiNote).mockResolvedValue();
  });

  it("should create new cards and update existing ones", async () => {
    const result = await generateAnkiCards(mockConfig);

    // Check new card creation
    expect(addAnkiNote).toHaveBeenCalledWith(
      "Test Deck",
      "Basic",
      "note1",
      "<h1>Test Note</h1>",
      ["test"]
    );

    // Check existing card update
    expect(updateAnkiNote).toHaveBeenCalledWith(
      1234,
      "note2",
      "<h1>Test Note</h1>",
      ["test"]
    );

    // Check skipped card
    expect(addAnkiNote).not.toHaveBeenCalledWith(
      "Test Deck",
      "Basic",
      "note3",
      expect.any(String),
      expect.any(Array)
    );

    // Check the returned newNoteTitle2AnkiId
    expect(result).toEqual({
      note2: 1234,
      note3: 5678,
      note1: 5678,
    });
  });

  it("should handle errors in file operations", async () => {
    vi.mocked(readFileSync).mockImplementation(() => {
      throw new Error("File read error");
    });
    await expect(generateAnkiCards(mockConfig)).rejects.toThrow(
      "File read error"
    );
  });

  it("should handle errors in Anki operations", async () => {
    vi.mocked(addAnkiNote).mockRejectedValue(new Error("Anki error"));

    await expect(generateAnkiCards(mockConfig)).rejects.toThrow("Anki error");
  });
});
