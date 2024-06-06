import glob, { Glob } from "glob";
import fs from "fs-extra";
import path from "path";
import { inspect } from "util";
import fastFolderSize from "fast-folder-size";

const patterns = [
  "**/*/*bin",
  "**/*/*man",
  "**/*/*config",
  "**/*/*plugins",
  "**/*/*assets",
  "**/*/*node_modules",
  "**/*/*data",
  "**/*/*Data",
  // "**/*/*Dataset",
  // "**/*/*dataset",
  // "**/*/*Data_set",
  // "**/*/*data_set",
  "**/*/*images",
  "**/*/*image",
  "**/*/*Images",
  "**/*/*Image",
  "**/*/*Picture",
  "**/*/*Pictures",
  "**/*/*picture",
  "**/*/*pictures",
  "**/*/*idea",
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
  "**/*.plantuml",
  "**/*.xml",
  "**/*.csv",
  "**/*.png",
  "**/*.jpeg",
  "**/*.jpg",
  "**/*.svg",
  "**/*.txt",
  "**/*.pdf",
  "**/*.ddl",
  "**/*.ttf",
  "**/*.nupkg",
  "**/*.asset",
  "**/*.css",
  "**/*.ico",
  "**/*.wav",
  "**/*.tdf",
  "**/*.html",
  "**/*.HTML",
  "**/*.xlsx",
  "**/*.cfg",
  "**/*.json",
  "**/*.pdb",
  "**/*.itp",
  "**/*.doc",
  "**/*.toml",
  "**/*.atp",
  "**/*.yml",
  "**/*.tar",
  "**/*.tar.gz",
  "**/*.input",
  "**/*.node_modules",
  "**/*.node_modules",
  "**/*.rar",
  "**/*.psd",
  "**/*.mli",
  "**/*.zip",
];

//TODO: get input
const directory = "../data/repos/2-prt";

async function findLargestFolder(directory: string) {
  const folders = await fs.readdirSync(directory);
  let biggestFolder = "";
  let biggestSize = 0;
  for (const folder of folders) {
    console.log({ folder });
    await new Promise((resolve, reject) => {
      fastFolderSize(path.join(directory, folder), (err, bytes) => {
        console.log({ folder, megabytes: bytes! / 1024 / 1024 });
        if (err) {
          console.error(err);
          reject(err);
        } else {
          if (bytes! > biggestSize) {
            biggestSize = bytes!;
            biggestFolder = folder;
          }
          resolve(bytes);
        }
      });
    });
  }
  return { biggestFolder, biggestSize: biggestSize / 1024 / 1024 };
}

console.log("searh");
console.log({ res: await findLargestFolder(directory) });

const directoryPatterns = patterns.map((pattern) => `${directory}/${pattern}`);

const globObj = new Glob(directoryPatterns, {});

for await (const results of globObj.stream()) {
  console.log(inspect(results, { depth: 2 }));
  console.log(inspect(results.length, { depth: 2 }));
  try {
    await fs.rm(results, { recursive: true, force: true });
  } catch (error) {
    console.error(error);
  }
}
