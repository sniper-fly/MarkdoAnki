export function removeFrontMatter(data: string) {
  // Check if string is empty or doesn't start with ---\n
  if (!data || !data.startsWith("---\n")) {
    return data;
  }

  // Find the second --- delimiter
  const match = data.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);

  // If no match or the second delimiter is not exactly ---, return original
  if (!match) {
    return data;
  }

  // Remove the front matter
  return data.replace(/^---\n([\s\S]*?)\n---(?:\n|$)/, "");
}
