import { readdir, readFileSync } from "fs";
import { extractAnkiId } from "./extractAnkiId";

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
      const ankiId = extractAnkiId(data);
      if (ankiId) {
        ankiIds.add(ankiId);
      }
    });
  });

  return ankiIds;
}
