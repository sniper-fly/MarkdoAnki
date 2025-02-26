import { MarkdoAnki } from "./lib/MarkdoAnki";
import { config } from "./config";
import notifier from "node-notifier";

(async () => {
  try {
    await MarkdoAnki(config);
    notifier.notify({
      title: "MarkdoAnki",
      message: "Anki cards have been created",
      sound: true, // Only Notification Center or Windows Toasters
      wait: true, // Wait with callback until user action is taken on notification
    });
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
