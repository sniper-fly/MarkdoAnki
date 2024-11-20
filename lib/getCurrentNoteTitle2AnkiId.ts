export function getCurrentNoteTitle2AnkiId(
  currentNoteTitleSet: Set<string>,
  previousNoteTitle2AnkiId: Record<string, number>,
  deletedCards: [string, number][]
) {
  const deletedCardMap = new Map(deletedCards);
  return Array.from(currentNoteTitleSet).reduce((acc, title) => {
    if (title in previousNoteTitle2AnkiId && !deletedCardMap.has(title)) {
      acc[title] = previousNoteTitle2AnkiId[title];
    }
    return acc;
  }, {} as Record<string, number>);
}
