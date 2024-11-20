import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { extractTags } from "./extractTags";
import { mdToHtml } from "./mdToHtml";
import { Config } from "../config";
import { addAnkiNote, updateAnkiNote } from "./ankiNoteApiOperation";
import { join } from "path";

type Props = {
  noteTitles: string[];
  currentNoteTitle2AnkiId: Record<string, number>;
} & Omit<Config, "createAllCards">;

export async function generateAnkiCards({
  noteTitles,
  currentNoteTitle2AnkiId,
  ankiIdRecordPath,
  vaultPath,
  notesPath,
  deck,
  modelName,
}: Props) {
  // NoteにAnkiIDが付与されていれば、AnkiIDをファイル名としてHTMLファイルを出力
  // そうでなければ、HTMLファイルを出力、Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存
  for (const title of noteTitles) {
    const notePath = join(notesPath, `${title}.md`);
    const data = readFileSync(notePath, "utf8");
    const tags = extractTags(data);
    const html = await mdToHtml(data, notesPath, title, vaultPath);
    const ankiId = currentNoteTitle2AnkiId[title];
    if (ankiId) {
      await updateAnkiNote(ankiId, title, html, tags);
    } else {
      const ankiId = await addAnkiNote(deck, modelName, title, html, tags);
      currentNoteTitle2AnkiId[title] = ankiId;
    }
  }

  // __previousCardIdsRecord__.md にファイル名とAnkiIDを保存
  const CardIdsRecordStr = Object.entries(currentNoteTitle2AnkiId)
    .map(([filename, id]) => `${id}/[[${filename}]]`)
    .join("\n");
  // ディレクトリが存在しない場合は作成
  mkdirSync(ankiIdRecordPath, { recursive: true });
  writeFileSync(
    join(ankiIdRecordPath, "__previousCardIdsRecord__.md"),
    CardIdsRecordStr
  );
}
