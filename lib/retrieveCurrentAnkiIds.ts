import { readdirSync, readFileSync } from "fs";
import { extractAnkiId } from "./extractAnkiId";

export function retrieveCurrentAnkiIds(path: string): Set<string> {
  let ankiIds: Set<string> = new Set();

  // path に存在する.mdファイルを全て読み込む
  const files = readdirSync(path);
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

  return ankiIds;
}
