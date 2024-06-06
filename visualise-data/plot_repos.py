import json
import matplotlib.pyplot as plt

# Load data from results.json
with open('results.json', 'r') as file:
    data = json.load(file)

# Extract keys and values
languages = list(data.keys())
counts = list(data.values())

# Create bar chart
plt.figure(figsize=(12, 8))
plt.barh(languages, counts, color='skyblue')
plt.xlabel('Number of Repositories')
plt.title('Number of Repositories by Programming Language')
plt.gca().invert_yaxis()  # Invert y-axis for better readability
plt.tight_layout()

# Save the bar chart as a file
plt.savefig('repos_by_language_bar.png')
plt.show()

# Create pie chart with all languages
plt.figure(figsize=(12, 8))
plt.pie(counts, labels=languages, autopct='%1.1f%%', startangle=140)
plt.title('Distribution of Repositories by Programming Language')
plt.axis('equal')  # Equal aspect ratio ensures the pie chart is circular.

# Save the pie chart as a file
plt.savefig('repos_by_language_pie.png')
plt.show()

# Create a second pie chart where languages with less than 1% are grouped into "Other"
threshold = 2  # 1 percent threshold
total_count = sum(counts)
other_count = 0
filtered_labels = []
filtered_counts = []

for lang, count in zip(languages, counts):
    if (count / total_count) * 100 < threshold:
        other_count += count
    elif lang == 'Unknown':
        other_count += count
    else:
        filtered_labels.append(lang)
        filtered_counts.append(count)

if other_count > 0:
    filtered_labels.append('Other')
    filtered_counts.append(other_count)

# Create the second pie chart
plt.figure(figsize=(12, 8))
plt.pie(filtered_counts, labels=filtered_labels, autopct='%1.1f%%', startangle=140)
plt.title('Distribution of Repositories by Programming Language (with "Other" category)')
plt.axis('equal')

# Save the second pie chart as a file
plt.savefig('repos_by_language_pie_filtered.png')
plt.show()
