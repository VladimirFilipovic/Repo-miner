import glob, { Glob } from "glob";
import fs from "fs-extra";
import path from "path";
import { inspect } from "util";

const patterns = [
  "**/*/assets",
  "**/*/*data",
  "**/*/*Data",
  "**/*/results",
  "**/*/temp",
  "**/*/Build",
  "**/*/build",
  "**/*/libs",
  "**/*/lib",
  "**/*/libraries",
  "**/*/Libraries",
  "**/*/docs",
  "**/*/example",
  "**/*/examples",
  "**/*/test",
  "**/*/tests",
  "results/**/*",
  "lib/**/*",
  "lib/**/*",
  "example/**/*",
  "test/**/*",
  "**/*.tgz",
  "**/*.lhe",
  "**/*.csv",
  "**/*.png",
  "**/*.svg",
  "**/*.txt",
  "**/*.pdf",
  "**/*.ddl",
  "**/*.ttf",
  "**/*.nupkg",
  "**/*.css",
  "**/*.ico",
  "**/*.wav",
  "**/*.tdf",
  "**/*.html",
  "**/*.HTML",
  "**/*.xlsx",
  "**/*.node_modules",
];

//TODO: get input
const directory = "../data/3rd-part/Sitefinity";

const directoryPatterns = patterns.map((pattern) => `${directory}/${pattern}`);

const globObj = new Glob(directoryPatterns, {});

for await (const results of globObj.stream()) {
  console.log(inspect(results, { depth: 2 }));
  console.log(inspect(results.length, { depth: 2 }));
  await fs.remove(results);
}
