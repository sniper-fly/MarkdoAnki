import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js"; // highlight.jsをインポート

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
export async function mdToHtml(data: string, notePath: string, vaultPath: string) {
  // data 先頭の Front Matter を削除
  const html = marked.parse(data.replace(/---\n([\s\S]*?)---/, ""));
  // notePath から末尾の .md を削除
  const noteTitle = notePath.replace(/\.md$/, "");
  // vault名は/で区切られていた場合は最後の空白でない要素を取得
  const vaultName = vaultPath.split("/").filter((x) => x !== "").pop();
  // obsidianへのリンクを作成し、URLエンコード
  const obsidianLink = `obsidian://open?vault=${vaultName}&file=${encodeURIComponent(
    noteTitle
  )}`;
  // html 先頭にObsidianリンクを追加
  const obsidianTag = `<a href="${obsidianLink}">Open in Obsidian</a>`;
  return obsidianTag + "\n" + html;
}
