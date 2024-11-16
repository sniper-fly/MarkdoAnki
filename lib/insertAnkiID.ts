export function insertAnkiID(data: string, ankiId: number) {
  const frontMatter = data.match(/---\n([\s\S]*?)---/);
  if (!frontMatter) {
    // --- が存在しない場合は、先頭に追加する
    return `\
---
AnkiID:
  ${ankiId}
---
${data}`;
  }
  // FrontMatterが存在する場合は、2番目の---を置換する
  return data.replace(
    /---\n([\s\S]*?)---/,
    (_, frontMatter) => `\
---
${frontMatter.trim()}
AnkiID:
  ${ankiId}
---`
  );
}
