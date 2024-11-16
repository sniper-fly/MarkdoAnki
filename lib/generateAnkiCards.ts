import { extractAnkiId } from "./extractAnkiId";
import { readFileSync, writeFileSync } from "fs";
import { invokeAnkiApi } from "./invokeAnkiApi";
import { extractTags } from "./extractTags";
import { mdToHtml } from "./mdToHtml";

export async function generateAnkiCards(
  vaultPath: string,
  htmlPathRelative: string, // vaultPathからの相対パス
  notePathRelative: string, // vaultPathからの相対パス
  notes: string[] // ファイル名の配列
) {
  // NoteにAnkiIDが付与されていれば、AnkiIDをファイル名としてHTMLファイルを出力
  // そうでなければ、HTMLファイルを出力、Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存

  for (const note of notes) {
    const data = readFileSync(
      `${vaultPath}/${notePathRelative}/${note}`,
      "utf8"
    );
    const ankiId = extractAnkiId(data);
    const tags = extractTags(data);
    const html = await mdToHtml(data, `${notePathRelative}/${note}`);
    if (ankiId) {
      if (ankiId === "-1") {
        continue;
      }
      const response = await invokeAnkiApi("updateNotes", {
        note: {
          id: Number(ankiId),
          fields: {
            表面: note,
            裏面: html,
          },
          tags: tags,
        },
      });
      const err = (await response.json()).error;
      if (err) {
        throw new Error(err);
      }
      writeFileSync(`${vaultPath}/${htmlPathRelative}/${ankiId}.html`, html);
    } else {
      const response = await invokeAnkiApi("addNote", {
        note: {
          deckName: "ObsidianTIL",
          modelName: "基本",
          fields: {
            表面: note,
            裏面: html,
          },
          tags: tags,
        },
      });
      const json = await response.json();
      const ankiId: number = json.result;
      const err = json.error;
      if (err) {
        throw new Error(err);
      }
      writeFileSync(`${vaultPath}/${htmlPathRelative}/${ankiId}.html`, html);
      // AnkiIDを.mdファイルに付与して保存

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
