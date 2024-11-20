# MarkdoAnki
MarkdoAnki is a tool that integrates Markdown notes from your Obsidian vault with Anki flashcards. It enables bulk-generating Anki cards from your Markdown notes in your Obsidian Vault, update them, and manage them efficiently.

## Features
- Convert Markdown to HTML.
- Insert Obsidian URI into Anki Cards.
- Handles YAML front matter for Anki metadata
- Tracks updates and syncs only modified notes (Generate and delete Anki cards based on your notes.)
- Supports custom Anki card templates and decks

## Usage

1. Clone this repo and install dependencies:
    ```sh
    npm install
    ```

2. Configure your settings in the `config.ts` file.

3. Run the main script:
    ```sh
    npm run create
    ```



This Software creates tracking log file on ankiIdRecordPath (you can configure).
You can also delete decks and log file by:
```
    npm run delete
```

## Configuration

Edit the `config.ts` file to set your desired configuration:

```typescript
export const config = {
  createAllCards: false,
  vaultPath: 'path/to/your/vault',
  notesPath: 'path/to/your/vault/notes',
  deck: 'Your Anki Deck Name',
  modelName: 'Your Anki Model Name',
  cardTemplates: [/* your card templates */],
};
```

## Requirements
- Node.js
- Anki with AnkiConnect plugin
- Obsidian (for note management)

## License
MIT License
