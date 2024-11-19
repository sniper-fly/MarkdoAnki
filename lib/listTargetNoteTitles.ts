import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { extractAnkiProperty } from "./extractAnkiProperty";

export function listTargetNoteTitles(notesPath: string) {
  return readdirSync(notesPath).reduce((acc, file) => {
    if (!file.endsWith(".md")) {
      return acc;
    }
    const data = readFileSync(join(notesPath, file), "utf8");
    const ankiProperty = extractAnkiProperty(data);
    if (ankiProperty && ankiProperty === "false") {
      return acc;
    }
    return acc.add(file.replace(/.md$/, ""));
  }, new Set<string>());
}
