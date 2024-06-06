import { readFile, writeFile } from "fs/promises";

// get json from current dir
const languages = await Promise.all([
  readFile("./languages.json"),
  readFile("./languages2.json"),
  readFile("./languages3.json"),
  readFile("./languages4.json"),
]);

let results: Record<string, number> = {};

for (const lang of languages) {
  const data = JSON.parse(lang.toString());
  for (const [key, value] of Object.entries<number>(data)) {
    results[key] = (results[key] || 0) + value;
  }
}

results = Object.keys(results)
  .sort((l1, l2) => results[l2] - results[l1])
  .reduce((acc: Record<string, number>, key) => {
    acc[key] = results[key];
    return acc;
  }, {});

console.log(results);
await writeFile("./results.json", JSON.stringify(results, null, 2));
