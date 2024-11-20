import { readFileSync } from "fs";
import { extractTags } from "./extractTags";
import { mdToHtml } from "./mdToHtml";
import { Config } from "../config";
import { addAnkiNote, updateAnkiNote } from "./ankiNoteApiOperation";
import { join } from "path";

type Props = {
  noteTitles: string[];
  currentNoteTitle2AnkiId: Record<string, number>;
} & Omit<Config, "createAllCards" | "ankiIdRecordPath">;

export async function generateAnkiCards({
  noteTitles,
  currentNoteTitle2AnkiId,
  vaultPath,
  notesPath,
  deck,
  modelName,
}: Props) {
  // NoteにAnkiIDが付与されていれば、AnkiIDをファイル名としてHTMLファイルを出力
  // そうでなければ、HTMLファイルを出力、Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存
  const newNoteTitle2AnkiId = { ...currentNoteTitle2AnkiId };
  for (const title of noteTitles) {
    const notePath = join(notesPath, `${title}.md`);
    const data = readFileSync(notePath, "utf8");
    const tags = extractTags(data);
    const html = await mdToHtml(data, notesPath, title, vaultPath);
    const ankiId = currentNoteTitle2AnkiId[title];
    if (ankiId) {
      await updateAnkiNote(ankiId, title, html, tags);
    } else {
      const newAnkiId = await addAnkiNote(deck, modelName, title, html, tags);
      newNoteTitle2AnkiId[title] = newAnkiId;
    }
  }
  return newNoteTitle2AnkiId;
}
