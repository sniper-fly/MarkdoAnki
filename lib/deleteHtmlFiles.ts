import { unlink } from "fs";

export function deleteHtmlFiles(ids: string[], path: string) {
  // ファイルを削除する
  ids.forEach((id) => {
    unlink(`${path}/${id}.html`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Deleted ${id}.html`);
    });
  });
}
