async function invoke(action: string, params: Object) {
  return fetch("http://localhost:8765", {
    method: "POST",
    body: JSON.stringify({ action, version: 6, params }),
  });
}

(async () => {
  const response = await invoke("createDeck", {
    deck: 'test1'
  });
  const data = await response.json();
  console.log(data);
})();
