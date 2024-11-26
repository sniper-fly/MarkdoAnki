import { invokeAnkiApi } from "./invokeAnkiApi";

async function findNotes(deck: string): Promise<number[]> {
  const data = await invokeAnkiApi("findNotes", {
    query: `deck:${deck}`,
  });
  const json = await data.json();
  return json.result;
}

async function notesInfo(ids: number[]): Promise<
  {
    noteId: number;
    fields: {
      Front: {
        value: string;
        order: number;
      };
    };
  }[]
> {
  const data = await invokeAnkiApi("notesInfo", {
    notes: ids,
  });
  const json = await data.json();
  return json.result;
}

export async function retrieveTitlesFromAnki(deck: string) {
  const ankiIds = await findNotes(deck);
  const notes = await notesInfo(ankiIds);
  const titles = notes.map((note) => note.fields.Front.value);
  return new Set(titles);
}
