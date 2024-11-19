// date input is like below
/*
---
title: Example
tags:
  - mysql
  - database
AnkiID:
  1234
---
Some content here
*/

export function extractTags(data: string): string[] {
  // Check if string is empty or doesn't start with ---\n
  if (!data || !data.startsWith("---\n")) {
    return [];
  }

  const frontMatter = data.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!frontMatter) {
    return [];
  }
  // tags: が存在する場合、それ以降の行を取得する
  const tags = frontMatter[1].match(/tags:\n([\s\S]*)/);
  if (!tags) {
    return [];
  }

  // - で始まる行を取得し、次のプロパティが始まるまで、又はFrontMatterの終わりまでを取得する
  const tagsArray = tags[1].match(/\s+-.*(?:\n|$)/g);
  if (!tagsArray) {
    return [];
  }

  // 先頭の "  - " を削除し、空白を削除する
  return tagsArray.map((tag) => tag.replace(/^\s+- /, "").trim());
}
