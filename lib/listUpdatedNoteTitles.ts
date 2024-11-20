import { statSync } from "fs";
import { basename, join } from "path";

// lastUpdatedAt以降に更新されたファイルから、拡張子を除いたノートタイトルを返す
export function listUpdatedNoteTitles(
  path: string,
  currentNoteTitleSet: Set<string>,
  lastUpdatedAt: Date
): string[] {
  const investigateFiles = Array.from(currentNoteTitleSet).map((title) =>
    join(path, `${title}.md`)
  );
  return investigateFiles.reduce((acc, file) => {
    const stats = statSync(file);
    if (stats.mtime > lastUpdatedAt) {
      acc.push(basename(file, ".md"));
    }
    return acc;
  }, [] as string[]);
}
