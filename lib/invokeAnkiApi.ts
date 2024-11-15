export async function invokeAnkiApi(action: string, params: Object) {
  return fetch("http://localhost:8765", {
    method: "POST",
    body: JSON.stringify({ action, version: 6, params }),
  });
}
