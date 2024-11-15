import { invokeAnkiApi } from "./invokeAnkiApi";

export async function deleteAnkiCards(ids: string[]) {
  // string Ids を number に変換する
  const numIds = ids.map((id) => Number(id));
  // Number に変換できないものがある場合はエラーを返す
  if (numIds.some((id) => isNaN(id))) {
    throw new Error("Invalid Ids");
  }

  const res = await invokeAnkiApi("deleteNotes", { notes: numIds });
  return res;
}
