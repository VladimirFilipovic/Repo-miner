import cluster from "cluster";
import { readdir, writeFile } from "fs/promises";
import linguistAnalyse from "linguist-js";
import { Language, Options } from "linguist-js/dist/types";
import { inspect } from "util";

// Take directory from command line arguments
const defaultDirectory = "../data/repos";
const directory = process.argv[2] || defaultDirectory;

// Read directory and make array of folders
const repoFolders = await readdir(directory);
const repoPaths = repoFolders.map((folder) => `${directory}/${folder}`);

// Analyse each folder
const options: Options = {
  keepVendored: false,
  quick: false,
};

const results: string[] = [];

const batches = 50;

const batchedRepoPaths = Array.from({ length: batches }, (_, i) => {
  return repoPaths.slice(
    i * Math.ceil(repoPaths.length / batches),
    (i + 1) * Math.ceil(repoPaths.length / batches)
  );
});

for (const batch of batchedRepoPaths) {
  const batchResults = await Promise.all(
    batch.map(async (path) => {
      console.log(`Analyzing ${path}`);
      const result = await linguistAnalyse(path, options);
      const dominantLanguage = Object.keys(result.languages.results).sort(
        (a, b) =>
          result.languages.results[b].bytes - result.languages.results[a].bytes
      )[0];
      return dominantLanguage;
    })
  );
  console.log(`Batch results: ${batchResults}`);
  results.push(...batchResults);
}

const languagesCount = results.reduce(
  (acc: Record<Language, number>, language) => {
    acc[language] = acc[language] ? acc[language] + 1 : 1;
    return acc;
  },
  {}
);

// Save json file
writeFile("languages.json", JSON.stringify(languagesCount, null, 2));
