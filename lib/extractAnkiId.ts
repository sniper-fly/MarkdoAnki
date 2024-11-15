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

export function extractAnkiId(data: string): string | null {
  // --- を見つけたら、その中にAnkiIDがあるかを確認する
  const frontMatter = data.match(/---\n([\s\S]*?)---/);
  if (!frontMatter) {
    return null;
  }
  const ankiId = frontMatter[1].match(/AnkiID:\s*([-\d]+)/);
  if (ankiId) {
    return ankiId[1];
  }
  return null;
}
