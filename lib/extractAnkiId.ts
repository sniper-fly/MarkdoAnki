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
