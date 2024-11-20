import { config } from "./config";
import notifier from "node-notifier";
import { invokeAnkiApi } from "./lib/invokeAnkiApi";
import { unlinkSync } from "fs";
import { join } from "path";
import { ankiIdRecordFileName } from "./lib/constants";

(async () => {
  try {
    await invokeAnkiApi("deleteDecks", {
      decks: [config.deck],
      cardsToo: true,
    });
    unlinkSync(join(config.ankiIdRecordPath, ankiIdRecordFileName));
  } catch (e) {
    const error = e as Error;
    console.error(error);
    notifier.notify({
      title: "MarkdoAnki Error",
      message: error.message || "An error occurred",
      sound: true, // Only Notification Center or Windows Toasters
      wait: true, // Wait with callback until user action is taken on notification
    });
  }
})();
