export function getCurrentNoteTitle2AnkiId(
  currentNoteTitleSet: Set<string>,
  previousNoteTitle2AnkiId: Record<string, number>
) {
  return Array.from(currentNoteTitleSet).reduce((acc, title) => {
    if (title in previousNoteTitle2AnkiId) {
      acc[title] = previousNoteTitle2AnkiId[title];
    }
    return acc;
  }, {} as Record<string, number>);
}
