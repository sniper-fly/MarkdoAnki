import { lastUpdatedAt } from "./lastUpdatedAt";
import { retrieveCurrentAnkiIds } from "./lib/retrieveCurrentAnkiIds";
import { listUpdatedNotes } from "./lib/listUpdatedNotes";
import { generateAnkiCards } from "./lib/generateAnkiCards";
import { deleteAnkiCards } from "./lib/deleteAnkiCards";
import { overWriteLastUpdatedAt } from "./lib/overWriteLastUpdatedAt";
import { readdirSync, unlinkSync } from "fs";
import { Config } from "./config";

export async function MarkdoAnki(config: Config) {
  // noteディレクトリ内の.mdファイルを全て読み込み、AnkiIDを取り出してSetに格納
  const currentCardIdSet = retrieveCurrentAnkiIds(config.notesPath);

  // html出力先ディレクトリからファイルを読み込み、ファイル名の配列Xを作成
  const previousCardIds = readdirSync(config.htmlGenPath).map((file) =>
    file.replace(".html", "")
  );

  // 配列XにあってにSetにないAnkiID一覧配列Aを作成
  const deletedCardIds = previousCardIds.filter(
    (card) => !currentCardIdSet.has(card)
  );

  // 配列AのAnkiIDに対応するAnkiカード, HTMLファイルを削除
  deletedCardIds.forEach((id) => unlinkSync(`${config.notesPath}/${id}.md`));
  await deleteAnkiCards(deletedCardIds);

  // .mdファイルの中でUpdate日時が lastUpdatedAt より新しいものを探して、配列Bに格納
  const updatedNotes = listUpdatedNotes(config.notesPath, lastUpdatedAt);

  // 配列BのファイルからHTMLを出力
  await generateAnkiCards(
    config.vaultPath,
    config.htmlGenPath,
    config.notesPath,
    updatedNotes
  );

  // lastUpdatedAt を現在時刻に更新
  overWriteLastUpdatedAt();
}
