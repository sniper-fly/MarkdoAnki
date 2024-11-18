// lastUpdatedAt ファイルを読み込み、最終更新日時を取得する関数
// lastUpdatedAt ファイルがない場合は、1970年1月1日に更新日時を設定する

import { readFileSync } from "fs";

export function getLastUpdatedAt() {
  try {
    const data = readFileSync("lastUpdatedAt", "utf8");
    return new Date(data);
  } catch (_e) {
    return new Date(0);
  }
}
