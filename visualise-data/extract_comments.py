import os
import json
import re
import nltk
import enchant
from collections import Counter
from pygments import lex
from pygments.lexers import get_lexer_by_name, find_lexer_class
from pygments.token import Token
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('words')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
english_dict = enchant.Dict("en_US")


def extract_comments_from_file(file_path, language):
    comments = []
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        code = file.read()
        if language == "Jupyter Notebook":
            language = "Python"
        lexer = get_lexer_by_name(language)
        tokens = lex(code, lexer)
        for token_type, token_value in tokens:
            if token_type in Token.Comment:
                comments.append(token_value.strip())
    return comments

def preprocess_text(text):
    text = re.sub(r'\W+', ' ', text)
    tokens = word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words and english_dict.check(token)]
    return tokens

def get_extensions(language):
    # Define extensions for supported languages
    extensions = {
        "Python": [".py"],
        "JavaScript": [".js"],
        "Java": [".java"],
        "Jupyter Notebook": [".ipynb"],
        "C++": [".cpp", ".h"],
        "R": [".r"],
        "LiveScript": [".ls"],
        "Fortran": [".f", ".f90"],
        "C": [".c", ".h"],
        "C#": [".cs"],
        "Go": [".go"],
        "Ruby": [".rb"],
        "Rust": [".rs"],
        "Swift": [".swift"],
        "Kotlin": [".kt"],
        "Scala": [".scala"],
        "PHP": [".php"],
        "TypeScript": [".ts"],
        "Mathematica": [".nb"],
        "R": [".r"],
        "Perl": [".pl"],
        "Haskell": [".hs"],
        "Lua": [".lua"],
        "Julia": [".jl"],
        "Shell": [".sh"],
        "Objective-C": [".m"],

        # Add more languages and their extensions here
    }
    return extensions.get(language, [])

def process_repository(directory, language, repo_name):
    if not get_extensions(language):
        return {repo_name: "Can't process"}

    all_comments = []
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in get_extensions(language)):
                file_path = os.path.join(root, file)
                comments = extract_comments_from_file(file_path, language)
                all_comments.extend(comments)
    
    token_counts = Counter()
    for comment in all_comments:
        tokens = preprocess_text(comment)
        token_counts.update(tokens)
    
    return {repo_name: dict(token_counts)}

def analyze_repositories(base_directory, repo_languages):
    results = {}
    for repo in os.listdir(base_directory):
        repo_path = os.path.join(base_directory, repo)
        if os.path.isdir(repo_path):
            #log
            print(f"Processing {repo}")
            language = repo_languages.get(repo, "UnsupportedLanguage")
            is_supported =  get_extensions(language) != []
            print(f"Language: {language}")
            print(f"Supported: {is_supported}")
            if not is_supported:
                print(f"Can't process {repo} has not a supported language")
                results[repo] = "Can't process"
            else:
                repo_results = process_repository(repo_path, language, repo)
                results.update(repo_results)
    return results

base_directory = '../data/repos/2-prt'

# Load repository languages from JSON file
with open('repo-languages.json', 'r') as f:
    repo_languages = json.load(f)

results = analyze_repositories(base_directory, repo_languages)

with open('results2.json', 'w', encoding='utf-8') as outfile:
    json.dump(results, outfile, ensure_ascii=False, indent=4)

print("Analysis complete. Results saved to results.json")
