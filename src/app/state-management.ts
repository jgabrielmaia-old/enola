import fs from "fs";

export function dirname() {
  return process.cwd();
}

export function save(content: string, path: string) {
  const contentString = JSON.stringify(content, null, " ");
  return fs.writeFileSync(path, contentString);
}

export function load(path: string) {
  const fileBuffer = fs.readFileSync(path, "utf-8");
  const contentJson = JSON.parse(fileBuffer);
  return contentJson;
}
