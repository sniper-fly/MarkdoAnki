import { readdir } from "fs";

export function listPreviousCardIds(path: string) {
  let cardHtmlFiles: Array<string> = [];
  readdir(path, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    // .html 拡張子を取り除いてSet2に格納
    cardHtmlFiles = files.map((file) => file.replace(".html", ""));
  });
  return cardHtmlFiles;
}
