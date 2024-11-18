import { invokeAnkiApi } from './invokeAnkiApi';

export async function updateAnkiNote(
  ankiId: string,
  note: string,
  html: string,
  tags: string[]
) {
  const ankiIdNum = Number(ankiId);
  if (isNaN(ankiIdNum)) {
    throw new Error("Invalid Anki ID" + ": " + ankiId);
  }

  const response = await invokeAnkiApi("updateNote", {
    note: {
      id: ankiIdNum,
      fields: {
        Front: note.replace(/\.md$/, ""),
        Back: html,
      },
      tags: tags,
    },
  });
  const err = (await response.json()).error;
  if (err) {
    throw new Error(err + ": " + note);
  }
}

export async function addAnkiNote(
  deck: string,
  modelName: string,
  note: string,
  html: string,
  tags: string[]
) {
  const response = await invokeAnkiApi("addNote", {
    note: {
      deckName: deck,
      modelName,
      fields: {
        Front: note.replace(/\.md$/, ""),
        Back: html,
      },
      tags: tags,
    },
  });
  const json = await response.json();
  if (json.error) {
    throw new Error(json.error + ": " + note);
  }
  return json.result.noteId;
}
