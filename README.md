# MarkdoAnki
MarkdoAnki is a tool that integrates Markdown notes with Anki, a powerful flashcard application. It allows you to bulk-generate Anki cards from your Markdown notes in your Obsidian Vault, update them, and manage them efficiently.

## Features
- Convert Markdown to HTML with Obsidian links.
- Insert Obsidian URI into Anki Cards.
- Extract tags and Anki IDs from Markdown front matter.
- Insert Anki IDs into Markdown front matter.
- Generate and delete Anki cards based on your notes.

## Usage

1. Install dependencies:
    ```sh
    npm install
    ```

2. Configure your settings in the `config.ts` file.

3. Run the main script:
    ```sh
    npm run create
    ```

## Configuration

Edit the `config.ts` file to set your desired configuration:

```typescript
export const config = {
  createAllCards: false,
  vaultPath: 'path/to/your/vault',
  notesPath: 'path/to/your/notes',
  htmlGenPath: 'path/to/html/output',
  deck: 'Your Anki Deck Name',
  modelName: 'Your Anki Model Name',
  cardTemplates: [/* your card templates */],
};
