export function extractAnkiProperty(data: string) {
  // Check if string is empty or doesn't start with ---\n
  if (!data || !data.startsWith("---\n")) {
    return null;
  }
  const frontMatter = data.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!frontMatter) {
    return null;
  }
  const ankiProperty = frontMatter[1].match(/Anki:\s*"(.+)"/);
  if (!ankiProperty) {
    return null;
  }
  return ankiProperty[1].trim();
}
