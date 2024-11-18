import { retrieveCurrentAnkiIds } from "./lib/retrieveCurrentAnkiIds";
import { listUpdatedNotes } from "./lib/listUpdatedNotes";
import { generateAnkiCards } from "./lib/generateAnkiCards";
import { deleteAnkiCards } from "./lib/deleteAnkiCards";
import { overWriteLastUpdatedAt } from "./lib/overWriteLastUpdatedAt";
import { readdirSync, unlinkSync } from "fs";
import { Config } from "./config";
import { invokeAnkiApi } from "./lib/invokeAnkiApi";
import { getLastUpdatedAt } from "./lib/getLastUpdatedAt";

export async function MarkdoAnki({
  createAllCards,
  vaultPath,
  notesPath,
  htmlGenPath,
  deckName,
  modelName,
  cardTemplates,
}: Config) {
  const lastUpdatedAt = createAllCards ? new Date(0) : getLastUpdatedAt();

  // noteディレクトリ内の.mdファイルを全て読み込み、AnkiIDを取り出してSetに格納
  const currentCardIdSet = retrieveCurrentAnkiIds(notesPath);

  // html出力先ディレクトリからファイルを読み込み、ファイル名の配列Xを作成
  const previousCardIds = readdirSync(htmlGenPath).map((file) =>
    file.replace(".html", "")
  );

  // 配列XにあってにSetにないAnkiID一覧配列Aを作成
  const deletedCardIds = previousCardIds.filter(
    (card) => !currentCardIdSet.has(card)
  );

  // 配列AのAnkiIDに対応するAnkiカード, HTMLファイルを削除
  deletedCardIds.forEach((id) => unlinkSync(`${notesPath}/${id}.md`));
  await deleteAnkiCards(deletedCardIds);

  // .mdファイルの中でUpdate日時が lastUpdatedAt より新しいものを探して、配列Bに格納
  const updatedNotes = listUpdatedNotes(notesPath, lastUpdatedAt);

  // deck作成 (すでにあればスキップ)
  await invokeAnkiApi("createDeck", { deckName });

  // NoteType(model)作成 (すでにあればスキップ)
  await invokeAnkiApi("createModel", {
    modelName,
    inOrderFields: ["Front", "Back"],
    cardTemplates,
  });

  // 配列BのファイルからHTMLを出力
  await generateAnkiCards({
    notes: updatedNotes,
    vaultPath,
    notesPath,
    htmlGenPath,
    deckName,
    modelName,
    cardTemplates,
  });

  // lastUpdatedAt を現在時刻に更新
  overWriteLastUpdatedAt();
}
