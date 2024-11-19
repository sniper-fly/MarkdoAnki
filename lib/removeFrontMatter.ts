export function removeFrontMatter(data: string) {
  const frontMatter = data.match(/---\n([\s\S]*?)---/);
  if (!frontMatter) {
    return data;
  }
  return data.replace(/---\n([\s\S]*?)---/, "");
}
