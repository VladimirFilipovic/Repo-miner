graph TD
A([Start]) --> B[Find Repositories]
B --> C[Identify Repository Languages]
C --> D[Extract Comments from Repositories]
D --> E[Classify Repositories]
E --> G[Split Large File into Chunks]
G --> H[Process Each Chunk Using OpenAI]
H --> I[Extract Challenges for Each Repository]
I --> J[Group Challenges by Repository Class]
J --> K[Save Results to JSON]
K --> L([End])
