import { lastUpdatedAt } from "./lastUpdatedAt";
import { listPreviousCardIds } from "./lib/listPreviousCardIds";
import { retrieveCurrentAnkiIds } from "./lib/retrieveCurrentAnkiIds";
import { listUpdatedNotes } from "./lib/listUpdatedNotes";
import { generateAnkiCards } from "./lib/generateAnkiCards";
import { deleteHtmlFiles } from "./lib/deleteHtmlFiles";
import { deleteAnkiCards } from "./lib/deleteAnkiCards";
import { overWriteLastUpdatedAt } from "./lib/overWriteLastUpdatedAt";
import { invokeAnkiApi } from "./lib/invokeAnkiApi";

// pathは全てこのmainに対する相対パス
const config = {
  vaultPath: "vault", // vaultのパス
  notesPath: "vault", // .mdファイルが格納されているディレクトリ
  htmlGenPath: "vault/html", // .htmlファイルを出力するディレクトリ
}

async function main() {
  // vault/notes内の.mdファイルを全て読み込み、AnkiIDを取り出してSet1に格納
  const currentCardIdSet = retrieveCurrentAnkiIds(config.notesPath);

  // vault/htmlからファイルを読み込み、ファイル名の配列Xを作成
  const previousCardIds = listPreviousCardIds(config.htmlGenPath);

  // 配列XにあってにSet1ないAnkiID一覧配列Aを作成
  const deletedCardIds = previousCardIds.filter(
    (card) => !currentCardIdSet.has(card)
  );

  // 配列AのAnkiIDに対応するAnkiカード, HTMLファイルを削除
  deleteHtmlFiles(deletedCardIds, config.htmlGenPath);
  await deleteAnkiCards(deletedCardIds);

  // .mdファイルの中でUpdate日時が lastUpdatedAt より新しいものを探して、配列Bに格納
  const updatedNotes = listUpdatedNotes(config.notesPath, lastUpdatedAt);

  // 配列BのファイルからHTMLを出力
  await generateAnkiCards(config.vaultPath, config.htmlGenPath, config.notesPath, updatedNotes);

  // lastUpdatedAt を現在時刻に更新
  overWriteLastUpdatedAt();
}

(async () => {
  const res = await invokeAnkiApi("findNotes", { query: "deck:test1" });
  console.log(await res.json());
  // await main();
  // const response = await invokeAnkiApi("addNote", {
  //   note: {
  //     deckName: "test1",
  //     modelName: "基本",
  //     fields: {
  //       表面: "link test",
  //       裏面: '<a href="Obsidian://open?vault=til_vault&file=OUJ_MOC">Open in Obsidian</a>',
  //     },
  //     tags: ["test"],
  //   },
  // });
  // const data = await response.json();
  // console.log(data);
})();
