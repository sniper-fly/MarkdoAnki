async function invoke(action: string, params: Object) {
  return fetch("http://localhost:8765", {
    method: "POST",
    body: JSON.stringify({ action, version: 6, params }),
  });
}

(async () => {
  const response = await invoke("addNote", {
    note: {
      deckName: "test1",
      modelName: "基本",
      fields: {
        表面: "link test",
        裏面: '<a href="Obsidian://open?vault=til_vault&file=OUJ_MOC">Open in Obsidian</a>',
      },
      tags: ["test"],
    },
  });
  const data = await response.json();
  console.log(data);
})();
