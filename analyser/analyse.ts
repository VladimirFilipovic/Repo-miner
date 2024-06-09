import cluster from "cluster";
import { readdir, writeFile } from "fs/promises";
import linguistAnalyse from "linguist-js";
import { Language, Options, Results } from "linguist-js/dist/types";
import { inspect } from "util";

// Take directory from command line arguments
const defaultDirectory = "../data/repos/1-part";
const directory = process.argv[2] || defaultDirectory;

// Read directory and make array of folders
const repoFolders = await readdir(directory);
const repoPaths = repoFolders
  .filter((repoFolder) => repoFolder.toLocaleLowerCase() !== ".ds_store")
  .map((folder) => `${directory}/${folder}`);

// Analyse each folder
const options: Options = {
  keepVendored: false,
  quick: false,
  ignoredFiles: [
    "**/*/assets",
    "**/*/data",
    "**/*/Data",
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
  ],
  ignoredLanguages: [
    "INI",
    "SVG",
    "CMake",
    "Markdown",
    "MiniYAML",
    "XML",
    "reStructuredText",
    "TeX",
    "HTML",
    "Nix",
    "CSS",
    "Text",
    "GCC Machine Description",
    "JSON",
    "Makefile",
    "Vim Snippet",
    "YAML",
    "PlantUML",
    "CSV",
    "Adblock Filter List",
    "RMarkdown",
    "Vim Help File",
    "Org",
    "Gerber Image",
    "OpenAPI Specification v2",
    "Unity3D Asset",
  ],
};

const results: string[] = [];

const repoLanguages: Record<string, string> = {};

const batches = 600;

const batchedRepoPaths = Array.from({ length: batches }, (_, i) => {
  return repoPaths.slice(
    i * Math.ceil(repoPaths.length / batches),
    (i + 1) * Math.ceil(repoPaths.length / batches)
  );
});

for (const batch of batchedRepoPaths) {
  if (!batchedRepoPaths?.length) {
    continue;
  }
  const batchResults = await Promise.all(
    batch.map(async (path) => {
      const repoName = path.split("/").pop() || "";
      console.log("Analysing batch ", batch);
      let result: Results;
      try {
        result = await linguistAnalyse(path, options);
      } catch (error) {
        console.error(error);
        console.error("Error on " + path);
        repoLanguages[repoName] = "Unknown";
        return "Unknown";
      }
      const dominantLanguage = Object.keys(result.languages.results).sort(
        (a, b) =>
          result.languages.results[b].bytes - result.languages.results[a].bytes
      )[0];
      if (dominantLanguage === "undefined" || dominantLanguage === undefined) {
        repoLanguages[repoName] = "Unknown";
        return "Unknown";
      }
      repoLanguages[repoName] = dominantLanguage;
      return dominantLanguage;
    })
  );
  console.log(`Batch results: ${batchResults}`);
  results.push(...batchResults);
}

const languagesCount = results
  .filter((lang) => !!lang)
  .reduce((acc: Record<Language, number>, language) => {
    acc[language] = acc[language] ? acc[language] + 1 : 1;
    return acc;
  }, {});

// Save json file
writeFile("languages.json", JSON.stringify(languagesCount, null, 2));

// Save repo and its language into repo-languages.json
writeFile("repo-languages1.json", JSON.stringify(repoLanguages, null, 2));
