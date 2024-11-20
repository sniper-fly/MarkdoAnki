import { readdirSync, statSync } from "fs";

// path に存在する.mdファイルから、lastUpdatedAtより更新日時が新しいものを探してファイル名パスを配列に格納する
export function listUpdatedNoteTitles(
  path: string,
  currentNoteTitleSet: Set<string>,
  lastUpdatedAt: Date
): string[] {
  const updatedFiles: string[] = [];

  // path に存在する.mdファイルを全て読み込む
  const files = readdirSync(path);
  files.forEach((file) => {
    // .mdファイルのみを対象とする
    if (!file.match(/.*\.md$/)) {
      return;
    }
    const title = file.replace(/.md$/, "");
    if (!currentNoteTitleSet.has(title)) {
      return;
    }
    // ファイルの更新日時を取得する
    const stats = statSync(`${path}/${file}`);
    if (stats.mtime > lastUpdatedAt) {
      updatedFiles.push(`${title}`);
    }
  });

  return updatedFiles;
}
