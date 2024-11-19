import { extractAnkiId } from "./extractAnkiId";
import { readFileSync, writeFileSync } from "fs";
import { extractTags } from "./extractTags";
import { mdToHtml } from "./mdToHtml";
import { insertAnkiID } from "./insertAnkiID";
import { Config } from "../config";
import { addAnkiNote, updateAnkiNote } from "./ankiNoteApiOperation";

type Props = {
  notes: string[];
  previousFilename2AnkiId: Record<string, number>;
} & Omit<Config, "createAllCards">;

export async function generateAnkiCards({
  notes,
  previousFilename2AnkiId,
  vaultPath,
  notesPath,
  deck,
  modelName,
}: Props) {
  // NoteにAnkiIDが付与されていれば、AnkiIDをファイル名としてHTMLファイルを出力
  // そうでなければ、HTMLファイルを出力、Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存

  for (const note of notes) {
    const notePath = `${notesPath}/${note}`;
    const data = readFileSync(notePath, "utf8");
    // const ankiId = extractAnkiId(data);
    const ankiId = previousFilename2AnkiId[note];
    const tags = extractTags(data);
    const html = await mdToHtml(data, `${notesPath}/${note}`, vaultPath);
    if (ankiId) {
      if (ankiId === -1) {
        continue;
      }
      await updateAnkiNote(ankiId, note, html, tags);
      // writeFileSync(`${htmlGenPath}/${ankiId}.html`, html);
    } else {
      const ankiId = await addAnkiNote(deck, modelName, note, html, tags);
      // writeFileSync(`${htmlGenPath}/${ankiId}.html`, html);
      // AnkiIDを.mdファイルに付与して保存
      // writeFileSync(notePath, insertAnkiID(data, ankiId));
    }
  }
}
