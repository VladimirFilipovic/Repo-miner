import fs from "fs/promises";
import { encode } from "gpt-3-encoder";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "",
});

// Function to count tokens
function countTokens(text: string) {
  return encode(text).length;
}

async function analyzeRepositoriesComments({
  inputFilePath,
  outputFilePath,
}: {
  inputFilePath: string;
  outputFilePath: string;
}) {
  try {
    const existingData = await fs.readFile(outputFilePath, "utf-8");
    const results: Record<string, string[]> = JSON.parse(existingData);

    // Read the JSON file content
    const data = await fs.readFile(inputFilePath, "utf-8");
    const repositories = JSON.parse(data);
    // Track successfully processed repositories
    const processedRepositories = [];

    // Initialize the results object

    // Iterate through each repository
    for (const [repoName, repoComments] of Object.entries(repositories)) {
      try {
        if (repoComments === "Unknown" || !repoComments) {
          processedRepositories.push(repoName);
          console.log("Empty comments skipping " + repoName);
          continue;
        }

        // Create user message content
        const userMessageContent = JSON.stringify({ [repoName]: repoComments });

        // Count tokens for user message
        const userMessageTokens = countTokens(userMessageContent);

        // Check if the total tokens exceed the limit
        if (userMessageTokens > 30000) {
          console.warn(
            `Skipping repository ${repoName} due to token limit exceedance.`
          );
          continue;
        }

        // Create the response from OpenAI
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Based on this source code comments of these repositories, can you tell me what were the top 5,6 challenges owners of each of these repositories faced while working on their project as string array. You can be less verbose, use summary or title of a challenge.
              Output should be array of string without formatting artifacts and without prior text. Just challenges as  array of strings
                `,
            },
            {
              role: "user",
              content: userMessageContent,
            },
          ],
          temperature: 1,
          max_tokens: 2000,
          frequency_penalty: 0.23,
          presence_penalty: 0,
        });

        console.log(`sent for ${repoName}`);

        // Extract the result content
        let result = response.choices[0].message.content as string;

        if (!result) {
          throw new Error("No results!");
        }

        console.log({ result });

        // Save the result for the current repository
        results[repoName] = JSON.parse(result);
        processedRepositories.push(repoName);
      } catch (error) {
        console.error(
          `Error analyzing comments for repository ${repoName}:`,
          error
        );
      }
    }

    // Remove successfully processed repositories from the original data
    processedRepositories.forEach((repoName) => {
      delete repositories[repoName];
    });

    if (!Object.keys(repositories)) {
      console.warn(`Input file ${inputFilePath} is empty. Deleting file.`);
      await fs.unlink(inputFilePath);
      return;
    } else {
      await fs.writeFile(
        inputFilePath,
        JSON.stringify(repositories, null, 2),
        "utf-8"
      );
    }

    // Save all results to a JSON file
    await fs.writeFile(
      outputFilePath,
      JSON.stringify(results, null, 2),
      "utf-8"
    );

    console.log(`Results saved to ${outputFilePath}`);
  } catch (error) {
    console.error(
      "Error reading the JSON file or processing repositories:",
      error
    );
  }
}

// const parts = [29, 30, 31, 32, 33, 34, 35];
// const parts = [36, 37, 38, 39, 40];
// const parts = [41, 42, 43, 44, 45];
// const parts = [46, 47, 48, 49, 50];
// const parts = [51, 52, 53, 54, 55];
// const parts = [56, 57, 58, 59, 60];
// const parts = [61, 62, 63, 64, 65];
// const parts = [66, 67, 68, 69, 70];
// const parts = [76, 77, 78, 79, 80];
const parts = [23];

for (const part of parts) {
  const inputFilePath = `../extracted-data/chatGPT/data_part_${part}.json`;
  const outputFilePath = `../extracted-data/chatGPT/data_part_1-results.json`;
  await analyzeRepositoriesComments({ inputFilePath, outputFilePath });
}
