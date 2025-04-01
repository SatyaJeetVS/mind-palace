from langchain.tools import Tool
import wikipedia
import requests
import json
import os

def search_web(query: str) -> str:
    """Search the web for information about a query."""
    try:
        # Mock search functionality - in a real app, use a search API
        return f"Found information about {query}. Here are some useful results..."
    except Exception as e:
        return f"Error searching for {query}: {str(e)}"

def search_wikipedia(query: str) -> str:
    """Search Wikipedia for information about a query."""
    try:
        # Get wikipedia results
        results = wikipedia.summary(query, sentences=3)
        return results
    except Exception as e:
        return f"Error searching Wikipedia for {query}: {str(e)}"

def save_to_file(content: str, filename: str = "research_output.txt") -> str:
    """Save content to a file."""
    try:
        with open(filename, 'w') as f:
            f.write(content)
        return f"Successfully saved content to {filename}"
    except Exception as e:
        return f"Error saving to file: {str(e)}"

search_tool = Tool(
    name="search",
    func=search_web,
    description="Search the web for current information on a topic."
)

wiki_tool = Tool(
    name="wikipedia",
    func=search_wikipedia,
    description="Search Wikipedia for information about a topic."
)

save_tool = Tool(
    name="save",
    func=save_to_file,
    description="Save research results to a file."
)
