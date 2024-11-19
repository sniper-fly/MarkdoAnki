import { extractAnkiId } from "./extractAnkiId";
import { mkdir, mkdirSync, readFileSync, writeFileSync } from "fs";
import { extractTags } from "./extractTags";
import { mdToHtml } from "./mdToHtml";
import { insertAnkiID } from "./insertAnkiID";
import { Config } from "../config";
import { addAnkiNote, updateAnkiNote } from "./ankiNoteApiOperation";
import { join } from "path";

type Props = {
  notes: string[];
  previousNoteTitle2AnkiId: Record<string, number>;
} & Omit<Config, "createAllCards">;

export async function generateAnkiCards({
  notes,
  previousNoteTitle2AnkiId,
  ankiIdRecordPath,
  vaultPath,
  notesPath,
  deck,
  modelName,
}: Props) {
  // NoteにAnkiIDが付与されていれば、AnkiIDをファイル名としてHTMLファイルを出力
  // そうでなければ、HTMLファイルを出力、Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存
  const newFilename2AnkiId = {} as Record<string, number>;
  for (const note of notes) {
    const notePath = `${notesPath}/${note}`;
    const data = readFileSync(notePath, "utf8");
    const tags = extractTags(data);
    const html = await mdToHtml(data, `${notesPath}/${note}`, vaultPath);
    let ankiId = previousFilename2AnkiId[note];
    if (ankiId) {
      if (ankiId === -1) {
        newFilename2AnkiId[note] = ankiId;
        continue;
      }
      await updateAnkiNote(ankiId, note, html, tags);
    } else {
      ankiId = await addAnkiNote(deck, modelName, note, html, tags);
    }
    newFilename2AnkiId[note] = ankiId;
  }

  // __previousCardIdsRecord__.md にファイル名とAnkiIDを保存
  const CardIdsRecordStr = Object.entries(newFilename2AnkiId)
    .map(([filename, id]) => `${id}/[[${filename}]]`)
    .join("\n");
  // ディレクトリが存在しない場合は作成
  mkdirSync(ankiIdRecordPath, { recursive: true });
  writeFileSync(
    join(ankiIdRecordPath, "__previousCardIdsRecord__.md"),
    CardIdsRecordStr
  );
}
