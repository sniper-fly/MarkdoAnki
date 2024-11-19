import { readFileSync } from "fs";
import { join } from "path";

export function parseAnkiIdRecord(ankiIdRecordPath: string) {
  let ankiIdRecord = "";
  try {
    ankiIdRecord = readFileSync(
      join(ankiIdRecordPath, "__previousCardIdsRecord__.md"),
      "utf8"
    );
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      console.log("Record File not found. Continue without it.");
    } else {
      throw err;
    }
  }
  const filename2AnkiId = ankiIdRecord
    .trim()
    .split("\n")
    .reduce((acc, line) => {
      const [idStr, filename] = line.split("/[[");
      const id = Number(idStr);
      if (filename && id && !isNaN(id)) {
        acc[filename.replace("]]", "")] = id;
      }
      return acc;
    }, {} as Record<string, number>);
  return filename2AnkiId;
}
