import os
import requests
import json
from pathlib import Path

# Load your JSON file with repository details
with open('repositories.json') as f:
    repositories = json.load(f)

# GitHub API setup
GITHUB_API_URL = "https://api.github.com"
GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"  # Replace with your token
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}

# Function to download file content
def download_file(url, local_path):
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        with open(local_path, 'wb') as f:
            f.write(response.content)

# Function to fetch repository contents recursively
def fetch_contents(owner, repo, path=''):
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        contents = response.json()
        for content in contents:
            if content['type'] == 'file':
                local_path = os.path.join(repo, content['path'])
                os.makedirs(os.path.dirname(local_path), exist_ok=True)
                download_file(content['download_url'], local_path)
            elif content['type'] == 'dir':
                fetch_contents(owner, repo, content['path'])

# Downloading all repositories
for repo in repositories:
    owner, repo_name = repo['full_name'].split('/')
    fetch_contents(owner, repo_name)

print("Download completed!")
