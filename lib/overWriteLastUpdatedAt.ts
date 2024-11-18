import { writeFileSync } from "fs";

export function overWriteLastUpdatedAt() {
  // lastUpdatedAt を更新する
  const lastUpdatedAt = new Date();
  writeFileSync("lastUpdatedAt", lastUpdatedAt.toISOString());
}
