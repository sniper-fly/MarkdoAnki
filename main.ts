import { MarkdoAnki } from "./MarkdoAnki";
import { config } from "./config";

(async () => {
  await MarkdoAnki(config);
})();
