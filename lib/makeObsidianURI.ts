import { basename, relative } from "path";

export function makeObsidianURI(
  noteTitle: string,
  notesPath: string,
  vaultPath: string
) {
  // vaultPath から見た notesPath への相対パスを取得
  const notesPathRelative = relative(vaultPath, notesPath);
  const fullNoteTitle = `${notesPathRelative}/${noteTitle}`;
  const vaultName = basename(vaultPath);
  // obsidianへのリンクを作成し、URLエンコード
  return `obsidian://open?vault=${encodeURIComponent(
    vaultName
  )}&file=${encodeURIComponent(fullNoteTitle)}`;
}
