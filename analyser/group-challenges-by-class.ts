import * as fs from "fs";
import * as path from "path";

interface RepoClassification {
  [key: string]: [string, { [key: string]: number }];
}

interface RepoChallenges {
  [key: string]: string[];
}

interface ClassChallenges {
  [mainClass: string]: Array<{ [key: string]: string[] }>;
}

// Function to read JSON files
function readJSON(filePath: string): any {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Function to save JSON files
function saveJSON(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf-8");
}

// Main function to group challenges by class
function groupChallengesByClass({
  repoClassificationFile,
  repoChallengesFile,
}: {
  repoClassificationFile: string;
  repoChallengesFile: string;
}): void {
  const repoClassification: RepoClassification = readJSON(
    repoClassificationFile
  );
  let repoChallenges: RepoChallenges = readJSON(repoChallengesFile);

  const classChallenges: ClassChallenges = {};

  // Group challenges by class
  for (const repo in repoChallenges) {
    if (repo in repoClassification) {
      const mainClass = repoClassification[repo][0];

      const repoChallenge = repoChallenges[repo];

      if (!(mainClass in classChallenges)) {
        classChallenges[mainClass] = [{ [repo]: repoChallenge }];
      } else if (repoChallenges[repo]?.length > 0) {
        classChallenges[mainClass].push({ [repo]: repoChallenge });
      } else {
        console.log("wtf", repoChallenges[repo]);
      }
    }
  }

  for (const mainClass in classChallenges) {
    if (mainClass === "Quantum Approximate Optimization Algorithm (QAOA)") {
      console.log({ mainClass });
      console.log(classChallenges[mainClass]);
    }
    console.log(`Grouped challenges saved for ${mainClass}`);
    saveJSON(
      `../extracted-data/${mainClass}_repo_challenges.json`,
      classChallenges[mainClass]
    );
  }
}

// File paths
const repoClassificationFile =
  "../extracted-data/repository_classifications.json";
const repoChallengesFile =
  "../extracted-data/chat_GPT/repository_challenges.json";

// Group challenges by class and save the result
groupChallengesByClass({ repoClassificationFile, repoChallengesFile });
