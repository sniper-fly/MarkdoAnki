import { generateAnkiCards } from "./generateAnkiCards";
import { mdToHtml } from "./mdToHtml";
import { addAnkiNote, updateAnkiNote } from "./ankiNoteApiOperation";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractTags } from "./extractTags";

// Mock dependencies
vi.mock("fs");
vi.mock("./mdToHtml");
vi.mock("./ankiNoteApiOperation");
vi.mock("./extractTags");

describe("generateAnkiCards", () => {
  const mockConfig = {
    noteTitles: ["note1", "note2", "note3"],
    previousNoteTitle2AnkiId: {
      note2: 1234,
      note3: -1,
    },
    ankiIdRecordPath: "/path/to/record",
    vaultPath: "/path/to/vault",
    notesPath: "/path/to/notes",
    deck: "Test Deck",
    modelName: "Basic",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readFileSync).mockReturnValue("# Test Note\ntags: test");
    vi.mocked(extractTags).mockReturnValue(["test"]);
    vi.mocked(mdToHtml).mockResolvedValue("<h1>Test Note</h1>");
    vi.mocked(addAnkiNote).mockResolvedValue(5678);
    vi.mocked(updateAnkiNote).mockResolvedValue();
  });

  it("should create new cards and update existing ones", async () => {
    await generateAnkiCards(mockConfig);

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
  });

  it("should create record file with correct format", async () => {
    await generateAnkiCards(mockConfig);

    expect(mkdirSync).toHaveBeenCalledWith("/path/to/record", {
      recursive: true,
    });
    expect(writeFileSync).toHaveBeenCalledWith(
      "/path/to/record/__previousCardIdsRecord__.md",
      "5678/[[note1]]\n1234/[[note2]]\n-1/[[note3]]"
    );
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
