import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export function recordLatestCardIds(
  ankiIdRecordPath: string,
  newNoteTitle2AnkiId: Record<string, number>
) {
  const CardIdsRecordStr = Object.entries(newNoteTitle2AnkiId)
    .map(([filename, id]) => `${id}/[[${filename}]]`)
    .join("\n");
  mkdirSync(ankiIdRecordPath, { recursive: true });
  writeFileSync(
    join(ankiIdRecordPath, "__previousCardIdsRecord__.md"),
    CardIdsRecordStr
  );
}
