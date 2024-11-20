import { listUpdatedNoteTitles } from "./listUpdatedNoteTitles";
import { generateAnkiCards } from "./generateAnkiCards";
import { overWriteLastUpdatedAt } from "./overWriteLastUpdatedAt";
import { Config } from "../config";
import { invokeAnkiApi } from "./invokeAnkiApi";
import { getLastUpdatedAt } from "./getLastUpdatedAt";
import { listTargetNoteTitles } from "./listTargetNoteTitles";
import { parseAnkiIdRecord } from "./parseAnkiIdRecord";
import { getCurrentNoteTitle2AnkiId } from "./getCurrentNoteTitle2AnkiId";
import { recordLatestCardIds } from "./recordLatestCardIds";

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
  const currentNoteTitleSet = listTargetNoteTitles(notesPath);

  // Read previousCardIdsRecord from ankiIdRecordPath
  // and create an object with filename as key and AnkiID as value.
  const previousNoteTitle2AnkiId = parseAnkiIdRecord(ankiIdRecordPath);

  // Convert object to an object array of { key=filename, value=AnkiID },
  // creating an object array listing filenames not in the Set.
  const deletedCards = Object.entries(previousNoteTitle2AnkiId).filter(
    ([title]) => !currentNoteTitleSet.has(title)
  );

  // 対応するAnkiカードを削除
  await invokeAnkiApi("deleteNotes", {
    notes: deletedCards.map(([, id]) => id),
  });
  // Convert the title in currentNoteTitleSet to an array, and if the key
  // corresponding to the title already exists in previousNoteTitle2AnkiId,
  // use the key-value pair as is and store it in currentNoteTitle2AnkiId.
  const currentNoteTitle2AnkiId = getCurrentNoteTitle2AnkiId(
    currentNoteTitleSet,
    previousNoteTitle2AnkiId,
    deletedCards
  );

  // .mdファイルの中でUpdate日時が lastUpdatedAt より新しいものを探して、配列Bに格納
  const updatedNotes = listUpdatedNoteTitles(notesPath, lastUpdatedAt);

  // deck作成 (すでにあればスキップ)
  await invokeAnkiApi("createDeck", { deck });

  // NoteType(model)作成 (すでにあればスキップ)
  await invokeAnkiApi("createModel", {
    modelName,
    inOrderFields: ["Front", "Back"],
    cardTemplates,
  });

  // updatedNotes に対応するAnkiカードを作成, 更新
  const newNoteTitle2AnkiId = await generateAnkiCards({
    noteTitles: updatedNotes,
    currentNoteTitle2AnkiId,
    vaultPath,
    notesPath,
    deck,
    modelName,
    cardTemplates,
  });

  // __previousCardIdsRecord__.md にファイル名とAnkiIDを保存
  recordLatestCardIds(ankiIdRecordPath, newNoteTitle2AnkiId);

  // lastUpdatedAt を現在時刻に更新
  overWriteLastUpdatedAt();
}
