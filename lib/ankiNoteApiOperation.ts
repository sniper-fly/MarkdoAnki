import { invokeAnkiApi } from './invokeAnkiApi';

export async function listAnkiNotes(deck: string): Promise<number[]> {
  const data = await invokeAnkiApi("findNotes", {
    query: `deck:${deck}`,
  });
  const json = await data.json();
  return json.result;
}

export async function updateAnkiNote(
  ankiId: number,
  note: string,
  html: string,
  tags: string[]
) {
  const response = await invokeAnkiApi("updateNote", {
    note: {
      id: ankiId,
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
): Promise<number> {
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
  return json.result;
}
