import { makeObsidianURI } from "./makeObsidianURI";
import { describe, it, expect } from "vitest";

describe("makeObsidianURI", () => {
  describe("absolute paths", () => {
    it("should handle notes in vault root", () => {
      const result = makeObsidianURI(
        "note",
        "/home/user/vault/notes",
        "/home/user/vault"
      );
      expect(result).toBe("obsidian://open?vault=vault&file=notes%2Fnote");
    });

    it("should handle deeply nested notes", () => {
      const result = makeObsidianURI(
        "note",
        "/home/user/vault/notes/work/project",
        "/home/user/vault"
      );
      expect(result).toBe(
        "obsidian://open?vault=vault&file=notes%2Fwork%2Fproject%2Fnote"
      );
    });
  });

  describe("relative paths", () => {
    it("should handle relative path in vault root", () => {
      const result = makeObsidianURI("note", "./notes", ".");
      expect(result).toBe("obsidian://open?vault=.&file=notes%2Fnote");
    });

    it("should handle nested relative paths", () => {
      const result = makeObsidianURI("note", "./notes/work/project", ".");
      expect(result).toBe(
        "obsidian://open?vault=.&file=notes%2Fwork%2Fproject%2Fnote"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle vault at root path", () => {
      const result = makeObsidianURI("note", "/vault/notes", "/vault");
      expect(result).toBe("obsidian://open?vault=vault&file=notes%2Fnote");
    });

    it("should handle spaces and special characters", () => {
      const result = makeObsidianURI(
        "test note",
        "/home/user/my vault/my notes",
        "/home/user/my vault"
      );
      expect(result).toBe(
        "obsidian://open?vault=my%20vault&file=my%20notes%2Ftest%20note"
      );
    });
  });
});
