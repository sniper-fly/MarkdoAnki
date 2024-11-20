import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { ankiIdRecordFileName } from "./constants";

export function recordLatestCardIds(
  ankiIdRecordPath: string,
  newNoteTitle2AnkiId: Record<string, number>
) {
  const CardIdsRecordStr = Object.entries(newNoteTitle2AnkiId)
    .map(([filename, id]) => `${id}/[[${filename}]]`)
    .join("\n");
  mkdirSync(ankiIdRecordPath, { recursive: true });
  writeFileSync(
    join(ankiIdRecordPath, ankiIdRecordFileName),
    CardIdsRecordStr
  );
}
