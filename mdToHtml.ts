import { Marked, use } from "marked";
import * as fs from "fs";
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
export default function mdToHtml() {
  const md = fs.readFileSync("./hello.md", "utf-8");
  const html = marked.parse(md);
  console.log(html);
}
