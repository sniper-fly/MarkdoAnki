import { extractAnkiId } from "./extractAnkiId";
import { readFileSync, writeFileSync } from "fs";
import { invokeAnkiApi } from "./invokeAnkiApi";

export async function generateAnkiCards(vaultPath: string, htmlPathRelative: string, notePathRelative: string, notes: string[]) {
  // NoteにAnkiIDが付与されていれば、AnkiIDをファイル名としてHTMLファイルを出力
  // そうでなければ、HTMLファイルを出力、Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存

  for (const note of notes) {
    const notePath = `${vaultPath}/${notePathRelative}/${note}`;
    const data = readFileSync(notePath, "utf8");
    const ankiId = extractAnkiId(data);
    if (ankiId) {
      const html = mdToHtml(data, `${notePathRelative}/${note}`);
      writeFileSync(`${vaultPath}/${htmlPathRelative}/${ankiId}.html`, html);
    } else {
      const html = mdToHtml(data);
      writeFileSync(`${vaultPath}/${htmlPathRelative}/${note}.html`, html);
      const response = await invokeAnkiApi("addNote", {
        note: {
          deckName: "test1",
          modelName: "基本",
          fields: {
            表面: "link test",
            裏面: `<a href="Obsidian://open?vault=til_vault&file=${notePath}">Open in Obsidian</a>`,
          },
          tags: ["test"],
        },
      });
      const data = await response.json();
      console.log(data);
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
