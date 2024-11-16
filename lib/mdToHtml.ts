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
export async function mdToHtml(data: string, notePath: string) {
  const html = marked.parse(data);
  return html;
}
