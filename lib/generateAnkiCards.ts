import { extractAnkiId } from "./extractAnkiId";
import { readFileSync, writeFileSync } from "fs";
import { invokeAnkiApi } from "./invokeAnkiApi";
import { extractTags } from "./extractTags";
import { mdToHtml } from "./mdToHtml";
import { insertAnkiID } from "./insertAnkiID";
import { Config } from "../config";
import { addAnkiNote, updateAnkiNote } from "./ankiNoteApiOperation";

type Props = {
  notes: string[];
} & Omit<Config, "createAllCards">;

export async function generateAnkiCards({
  notes,
  vaultPath,
  notesPath,
  htmlGenPath,
  deck,
  modelName,
}: Props) {
  // NoteにAnkiIDが付与されていれば、AnkiIDをファイル名としてHTMLファイルを出力
  // そうでなければ、HTMLファイルを出力、Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存

  for (const note of notes) {
    const notePath = `${notesPath}/${note}`;
    const data = readFileSync(notePath, "utf8");
    const ankiId = extractAnkiId(data);
    const tags = extractTags(data);
    const html = await mdToHtml(data, `${notesPath}/${note}`, vaultPath);
    if (ankiId) {
      if (ankiId === "-1") {
        continue;
      }
      await updateAnkiNote(ankiId, note, html, tags);
      writeFileSync(`${htmlGenPath}/${ankiId}.html`, html);
    } else {
      const ankiId = await addAnkiNote(deck, modelName, note, html, tags);
      writeFileSync(`${htmlGenPath}/${ankiId}.html`, html);
      // AnkiIDを.mdファイルに付与して保存
      writeFileSync(notePath, insertAnkiID(data, ankiId));
    }
  }

  // notePathのファイルを順番に読み込む
  // for (const notePath of notePaths) {
  //   // notePathのファイルを読み込む
  //   const data = readFileSync(notePath, "utf8");
  //   // --- を見つけたら、その中にAnkiIDがあるかを確認する
  //   const ankiId = extractAnkiId(data);
  //   if (ankiId) {
  //     // AnkiIDが存在する場合
  //     // AnkiIDをファイル名としてHTMLファイルを出力
  //     const html = mdToHtml(data);
  //     writeFileSync(`${exportPath}/${ankiId}.html`, html);
  //   } else {
  //     // AnkiIDが存在しない場合
  //     // HTMLファイルを出力
  //     const html = mdToHtml(data);
  //     writeFileSync(`${exportPath}/${notePath}.html`, html);
  //     // Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存
  //     const response = await invokeAnkiApi("addNote", {
  //       note: {
  //         deckName: "test1",
  //         modelName: "基本",
  //         fields: {
  //           表面: "link test",
  //           裏面: `<a href="Obsidian://open?vault=til_vault&file=${notePath}">Open in Obsidian</a>`,
  //         },
  //         tags: ["test"],
  //       },
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //   }
  // }
}
