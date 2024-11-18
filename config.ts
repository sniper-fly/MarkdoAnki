// pathは全てこのファイルのディレクトリに対する相対パス
export type Config = typeof config;

export const config = {
  vaultPath: "vault", // vaultのパス
  notesPath: "vault", // .mdファイルが格納されているディレクトリ
  htmlGenPath: "vault/html", // .htmlファイルを出力するディレクトリ
};
