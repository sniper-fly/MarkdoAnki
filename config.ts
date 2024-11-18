// pathは全てこのファイルのディレクトリに対する相対パス
export type Config = typeof config;

export const config = {
  // true: 全ての.mdファイルをAnkiカードに変換。初回起動時など。
  // false: 更新された.mdファイルのみをAnkiカードに変換。高速。
  createAllCards: true,

  vaultPath: "vault", // vaultのパス
  notesPath: "vault", // .mdファイルが格納されているディレクトリ
  htmlGenPath: "vault/html", // .htmlファイルを出力するディレクトリ
  deck: "ObsidianTIL", // Ankiのデッキ名
  modelName: "MarkdoAnki", // Ankiのノートタイプ名 (モデル名)
  cardTemplates: [
    {
      Name: "DefaultCard",
      Front: "{{Front}}",
      Back: /* html */ `
        {{FrontSide}}
        <hr id=answer>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css">
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/graphql.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/sql.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dockerfile.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/makefile.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/nginx.min.js"></script>
        {{Back}}
      `,
    },
  ],
};
