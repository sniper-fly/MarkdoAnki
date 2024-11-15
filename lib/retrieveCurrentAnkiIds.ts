import { readdir, readFileSync } from "fs";

/*
mdファイルの形式
---
tags:
  - mysql
AnkiID:
  1234
---

ファイルの先頭に---があり、その中にAnkiIDが記述されている
AnkiIDが存在しない場合もある
---が存在しない場合もある
*/

export function retrieveCurrentAnkiIds(path: string): Set<string> {
  let ankiIds: Set<string> = new Set();
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
      // .mdファイルを読み込む
      const data = readFileSync(`${path}/${file}`, "utf8");
      // --- を見つけたら、その中にAnkiIDがあるかを確認する
      const frontMatter = data.match(/---\n([\s\S]*?)---/);
      if (!frontMatter) {
        return;
      }
      const ankiId = frontMatter[1].match(/AnkiID:\s*([-\d]+)/);
      if (ankiId) {
        ankiIds.add(ankiId[1]);
      }
    });
  });

  return ankiIds;
}
