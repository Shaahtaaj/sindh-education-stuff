import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const storageDirectory = path.join(process.cwd(), "storage");

export async function readLocalCollection<T>(name: string): Promise<T[]> {
  try {
    return JSON.parse(await readFile(path.join(storageDirectory, `${name}.json`), "utf8")) as T[];
  } catch {
    return [];
  }
}

export async function writeLocalCollection<T>(name: string, records: T[]) {
  await mkdir(storageDirectory, { recursive: true });
  await writeFile(path.join(storageDirectory, `${name}.json`), JSON.stringify(records, null, 2), "utf8");
}
