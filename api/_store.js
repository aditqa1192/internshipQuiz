import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE_PATH = join(__dirname, "..", "data", "adminStore.json");

async function readStore() {
  const content = await fs.readFile(STORE_PATH, "utf-8");
  return JSON.parse(content);
}

async function writeStore(data) {
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

export { readStore, writeStore };
