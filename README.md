# MarkdoAnki
MarkdoAnki is a tool that integrates Markdown notes from your Obsidian vault with Anki flashcards. It enables bulk-generating Anki cards from your Markdown notes in your Obsidian Vault, update them, and manage them efficiently.

https://github.com/user-attachments/assets/c0d9749b-9fef-427b-86f2-1ea8ebd16c49

## Features
- Convert Markdown Notes to HTML Anki Cards. (Front is note title, Back is note content)
- Insert Obsidian URI into Anki Cards.
- Handles YAML front matter for Anki metadata
- Tracks updates and syncs only modified notes (Generate and delete Anki cards based on your notes.)
- Supports custom Anki card templates and decks
- File tracking can be set to disabled by adding property: "Anki: false" to the front matter.

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

If you have some notes you do not want to creates Anki card from it,
add property like this
```
Anki: "false"
```
![Screenshot from 2024-11-22 09-49-38](https://github.com/user-attachments/assets/c960f3de-a437-4757-986d-862cf06acf90)

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
