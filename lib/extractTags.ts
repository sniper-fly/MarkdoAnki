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
  const frontMatter = data.match(/---\n([\s\S]*?)---/);
  if (!frontMatter) {
    return [];
  }
  // tags: が存在する場合、それ以降の行を取得する
  const tags = frontMatter[1].match(/tags:\n([\s\S]*)/);
  if (!tags) {
    return [];
  }

  // - で始まる行を取得し、次のプロパティが始まるまでを取得する
  const tagsArray = tags[1].match(/\s+-.*\n/g);
  if (!tagsArray) {
    return [];
  }

  // "- ", "\n", 前後の空白を削除して配列に格納する
  const result = tagsArray.map((tag) =>
    tag.replace(/- /, "").replace(/\n/, "").trim()
  );
  return result;
}
