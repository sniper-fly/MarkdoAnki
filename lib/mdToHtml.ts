import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js"; // highlight.jsをインポート
import { makeObsidianURI } from "./makeObsidianURI";

const marked = new Marked(
  { breaks: true, gfm: true },
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

// ./hello.md を読み込んで HTML に変換
export async function mdToHtml(
  data: string,
  notesPath: string,
  noteTitle: string,
  vaultPath: string
) {
  // data 先頭の Front Matter を削除
  const html = marked.parse(data.replace(/---\n([\s\S]*?)---/, ""));
  const obsidianUri = makeObsidianURI(noteTitle, notesPath, vaultPath);
  // html 先頭にObsidianリンクを追加
  const obsidianTag = `<a href="${obsidianUri}">Open in Obsidian</a>`;
  return obsidianTag + "\n" + html;
}
