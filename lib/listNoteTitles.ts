import { readdirSync } from "fs";

export function listNoteTitles(notesPath: string) {
  return new Set(
    readdirSync(notesPath)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(".md", ""))
  );
}
