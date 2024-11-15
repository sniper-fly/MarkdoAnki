import mdToHtml from "./mdToHtml";
import { lastUpdatedAt } from "./lastUpdatedAt";
import * as fs from "fs";
import { listPreviousCardIds } from "./lib/listPreviousCardIds";
import { retrieveCurrentAnkiIds } from "./lib/retrieveCurrentAnkiIds";
import { listUpdatedCards } from "./lib/listUpdatedCards";
import { generateHtmlFiles } from "./lib/generateHtmlFiles";
import { deleteHtmlFiles } from "./lib/deleteHtmlFiles";
import { deleteAnkiCards } from "./lib/deleteAnkiCards";
import { overWriteLastUpdatedAt } from "./lib/overWriteLastUpdatedAt";

async function main() {
  // vault/notes内の.mdファイルを全て読み込み、AnkiIDを取り出してSet1に格納
  const currentCardSet = retrieveCurrentAnkiIds("vault/notes");

  // vault/htmlからファイルを読み込み、ファイル名の配列Xを作成
  const previousCards = listPreviousCardIds("vault/html");

  // 配列XにあってにSet1ないAnkiID一覧配列Aを作成
  const deletedCards = previousCards.filter(
    (card) => !currentCardSet.has(card)
  );

  // 配列AのAnkiIDに対応するAnkiカード, HTMLファイルを削除
  deleteHtmlFiles(deletedCards);
  await deleteAnkiCards(deletedCards);

  // .mdファイルの中でUpdate日時が lastUpdatedAt より新しいものを探して、配列Bに格納
  const updatedCards = listUpdatedCards("vault/notes", lastUpdatedAt);

  // 配列BのファイルからHTMLを出力
  await generateHtmlFiles(updatedCards);

  // lastUpdatedAt を現在時刻に更新
  overWriteLastUpdatedAt();
}

(async () => {
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
