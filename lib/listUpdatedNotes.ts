import { readdir, statSync } from "fs";

// path に存在する.mdファイルから、lastUpdatedAtより更新日時が新しいものを探してファイル名パスを配列に格納する
export function listUpdatedNotes(path: string, lastUpdatedAt: Date): string[] {
  const updatedFiles: string[] = [];

  // path に存在する.mdファイルを全て読み込む
  readdir(path, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((file) => {
      // .mdファイルのみを対象とする
      if (!file.match(/.*\.md$/)) {
        return;
      }
      // ファイルの更新日時を取得する
      const stats = statSync(`${path}/${file}`);
      if (stats.mtime > lastUpdatedAt) {
        updatedFiles.push(`${file}`);
      }
    });
  });

  return updatedFiles;
}
