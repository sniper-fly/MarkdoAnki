import { retrieveCurrentAnkiIds } from "./lib/retrieveCurrentAnkiIds";
import { listUpdatedNotes } from "./lib/listUpdatedNotes";
import { generateAnkiCards } from "./lib/generateAnkiCards";
import { deleteAnkiCards } from "./lib/deleteAnkiCards";
import { overWriteLastUpdatedAt } from "./lib/overWriteLastUpdatedAt";
import { Config } from "./config";
import { invokeAnkiApi } from "./lib/invokeAnkiApi";
import { getLastUpdatedAt } from "./lib/getLastUpdatedAt";
import { noteFilenames } from "./lib/noteFilenames";
import { parseAnkiIdRecord } from "./lib/parseAnkiIdRecord";

export async function MarkdoAnki({
  createAllCards,
  vaultPath,
  notesPath,
  ankiIdRecordPath,
  deck,
  modelName,
  cardTemplates,
}: Config) {
  const lastUpdatedAt = createAllCards ? new Date(0) : getLastUpdatedAt();

  // Get a list of .md files in the note directory and store it in Set
  const noteFilesSet = noteFilenames(notesPath);

  // Read previousCardIdsRecord from ankiIdRecordPath
  // and create an object with filename as key and AnkiID as value.
  const previousFilename2AnkiId = parseAnkiIdRecord(ankiIdRecordPath);

  // Convert object to an object array of { key=filename, value=AnkiID },
  // creating an object array listing filenames not in the Set.
  const deletedCardIds = Object.entries(previousFilename2AnkiId)
    .filter(([filename]) => !noteFilesSet.has(filename))
    .map(([, id]) => id);

  // 対応するAnkiカードを削除
  await invokeAnkiApi("deleteNotes", { notes: deletedCardIds });

  // .mdファイルの中でUpdate日時が lastUpdatedAt より新しいものを探して、配列Bに格納
  const updatedNotes = listUpdatedNotes(notesPath, lastUpdatedAt);

  // deck作成 (すでにあればスキップ)
  await invokeAnkiApi("createDeck", { deck });

  // NoteType(model)作成 (すでにあればスキップ)
  await invokeAnkiApi("createModel", {
    modelName,
    inOrderFields: ["Front", "Back"],
    cardTemplates,
  });

  // 配列BのファイルからHTMLを出力
  await generateAnkiCards({
    notes: updatedNotes,
    previousFilename2AnkiId,
    ankiIdRecordPath,
    vaultPath,
    notesPath,
    deck,
    modelName,
    cardTemplates,
  });

  // lastUpdatedAt を現在時刻に更新
  overWriteLastUpdatedAt();
}
