import * as fs from "fs";
import * as path from "path";

const inputFilePath = "../extracted-data/chatGPT/repository_comments.json";

const outputDir = "../extracted-data/chatGPT/";

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Read the input JSON file and create output files
fs.readFile(inputFilePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading the input file:", err);
    return;
  }

  try {
    const jsonData: Record<string, string> = JSON.parse(data);
    const entries = Object.entries(jsonData);
    const totalItems = entries.length;
    const chunkSize = Math.ceil(totalItems / 80);

    for (let i = 0; i < 80; i++) {
      const chunk = entries.slice(i * chunkSize, (i + 1) * chunkSize);
      const chunkObject = Object.fromEntries(chunk);
      const outputFilePath = path.join(outputDir, `data_part_${i + 1}.json`);

      fs.writeFile(
        outputFilePath,
        JSON.stringify(chunkObject, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing output file:", err);
          } else {
            console.log(`Successfully written to ${outputFilePath}`);
          }
        }
      );
    }
  } catch (err) {
    console.error("Error parsing JSON data:", err);
  }
});
