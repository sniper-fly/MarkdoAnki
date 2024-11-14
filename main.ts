import mdToHtml from "./mdToHtml";
import { lastUpdatedAt } from "./lastUpdatedAt";

function main() {
  // 指定されたディレクトリ内の.mdファイルを全て読み込み、AnkiIDを取り出してSet1に格納

  // HTML出力ディレクトリからファイルを読み込み、ファイル名のSet2を作成

  // Set2にあってSet1にないAnkiID一覧配列Aを作成

  // 配列AのAnkiIDに対応するAnkiカード, HTMLファイルを削除

  // .mdファイルの中でUpdate日時が lastUpdatedAt より新しいものを探して、配列Bに格納

  // 配列BのファイルにAnkiIDが付与されていれば、AnkiIDをファイル名としてHTMLファイルを出力

  // そうでなければ、HTMLファイルを出力、Ankiカードを作成してからAnkiIDを.mdファイルに付与して保存

  // lastUpdatedAt を現在時刻に更新
}

main();
