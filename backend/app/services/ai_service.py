from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import search_tool, wiki_tool, save_tool
import json
import wikipedia
import openai
from typing import Dict, List, Any, Optional
from app.core.config import settings
from app.models.curriculum import Topic, SubTopic, Resource, Assessment

load_dotenv()

class Subtopic(BaseModel):
    title: str
    content: str
    subtopics: list["Subtopic"] = []

# This is needed for self-referencing models
Subtopic.model_rebuild()

class ResearchResponse(BaseModel):
    topic: str
    summary: str
    subtopics: list[Subtopic] = []
    sources: list[str] = []
    tools_used: list[str] = []
    

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp")
parser = PydanticOutputParser(pydantic_object=ResearchResponse)
async def generate_curriculum(topic: str) -> Dict[str, Any]:
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
                You are an expert tutor with deep knowledge across many domains.
                If the query topic is regarding a skill give practical information about the topic useful for skill building and use neccessary tools. First create several sub-topics on the query topics 
                and the total output should have atleast 100 words. There should be atleast 2 layers of sub-topics. Output should not have any special characters that can make it difficult to JSON parse.
                Each sub-topic should have a title and content. The content should be a summary of the topic and the sub-topics.
                Search on the internet and wikipedia for information and summarize the information in a research paper format.
                Output exactly this JSON, no wrapper or code fences.\n{format_instructions}
                """,
            ),
            ("placeholder", "{chat_history}"),
            ("human", "{query}"),
            ("placeholder", "{agent_scratchpad}"),
        ]
    ).partial(format_instructions=parser.get_format_instructions())
    print("parse output here: ",parser.get_format_instructions()," ////end")
    tools = [search_tool, wiki_tool, save_tool]
    agent = create_tool_calling_agent(
        llm=llm,
        prompt=prompt,
        tools=tools
    )

    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    raw_response = agent_executor.invoke({"query": topic})
    try:
        structured_response = parser.parse(raw_response.get("output"))
        print(structured_response.model_dump())
    except Exception as e:
        print("Error parsing response", e, "Raw Response - ", raw_response)
