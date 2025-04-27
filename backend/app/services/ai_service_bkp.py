import openai
from typing import Dict, List, Any, Optional
from app.core.config import settings
from app.models.curriculum import Topic, SubTopic, Resource, Assessment

# Configure OpenAI API
openai.api_key = settings.OPENAI_API_KEY

async def generate_curriculum(topic: str) -> Dict[str, Any]:
    """
    Generate a comprehensive curriculum for a given topic using OpenAI.
    
    Args:
        topic: The main topic for curriculum generation
        
    Returns:
        A dictionary containing the curriculum structure
    """
    try:
        # Create the prompt for curriculum generation
        prompt = f"""
        Create a comprehensive learning curriculum for mastering {topic}.
        
        The curriculum should include:
        1. A main topic title and description
        2. 5-8 major topics, each with:
           - Title and description
           - Learning objectives (3-5 bullet points)
           - Difficulty level (beginner, intermediate, advanced)
           - Estimated time to complete (in minutes)
           - Prerequisites (if any)
           - 2-3 subtopics for each topic, with similar structure
        3. For each topic and subtopic:
           - 2-3 learning resources (articles, videos, books)
           - A brief assessment with 2-3 practice questions
        
        Format the response as a structured JSON object.
        """
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert curriculum designer with deep knowledge across many domains."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        # Process and structure the response
        curriculum_data = response.choices[0].message.content
        
        # In a real application, you would parse the JSON response
        # For now, we'll return a simplified structure
        
        # Create a sample curriculum structure (in production, parse the actual response)
        curriculum = {
            "title": f"Mastering {topic}",
            "description": f"A comprehensive curriculum to help you master {topic} from basics to advanced concepts.",
            "main_topic": topic,
            "topics": []
        }
        
        # Add sample topics (in production, these would come from the AI response)
        for i in range(5):
            topic = {
                "title": f"Topic {i+1}",
                "description": f"Description for Topic {i+1}",
                "learning_objectives": [f"Objective {j+1}" for j in range(3)],
                "difficulty_level": "beginner" if i < 2 else "intermediate" if i < 4 else "advanced",
                "estimated_time_minutes": 60 * (i+1),
                "prerequisites": [],
                "resources": [
                    {"title": f"Resource {j+1}", "url": f"https://example.com/resource{j+1}", "type": "article"}
                    for j in range(2)
                ],
                "assessments": [
                    {"title": "Assessment", "description": "Test your knowledge", "questions": [
                        {"question": f"Question {j+1}?", "answer": f"Answer {j+1}"} for j in range(2)
                    ]}
                ],
                "subtopics": [
                    {
                        "title": f"Subtopic {j+1}",
                        "description": f"Description for Subtopic {j+1}",
                        "learning_objectives": [f"Objective {k+1}" for k in range(2)],
                        "difficulty_level": "beginner",
                        "estimated_time_minutes": 30,
                        "prerequisites": [],
                        "resources": [
                            {"title": f"Resource {k+1}", "url": f"https://example.com/subresource{k+1}", "type": "article"}
                            for k in range(2)
                        ],
                        "assessments": [
                            {"title": "Assessment", "description": "Test your knowledge", "questions": [
                                {"question": f"Question {k+1}?", "answer": f"Answer {k+1}"} for k in range(2)
                            ]}
                        ]
                    }
                    for j in range(3)
                ]
            }
            curriculum["topics"].append(topic)
        
        return curriculum
    
    except Exception as e:
        print(f"Error generating curriculum: {str(e)}")
        raise

async def answer_doubt(question: str, topic_context: str) -> str:
    """
    Generate an answer to a user's doubt using OpenAI.
    
    Args:
        question: The user's question
        topic_context: Context about the topic the question relates to
        
    Returns:
        A string containing the answer
    """
    try:
        # Create the prompt for answering the doubt
        prompt = f"""
        Context: {topic_context}
        
        Question: {question}
        
        Please provide a comprehensive and accurate answer to this question.
        """
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert tutor with deep knowledge across many domains."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # Return the answer
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error answering doubt: {str(e)}")
        raise

async def update_curriculum_based_on_doubt(curriculum: Dict[str, Any], doubt: Dict[str, Any], answer: str) -> Dict[str, Any]:
    """
    Update the curriculum based on a user's doubt and the answer provided.
    
    Args:
        curriculum: The current curriculum
        doubt: The user's doubt
        answer: The answer to the doubt
        
    Returns:
        An updated curriculum
    """
    try:
        # Create the prompt for curriculum update
        prompt = f"""
        Current curriculum section: {doubt.get('topic_context', '')}
        
        User's doubt: {doubt.get('question', '')}
        
        Answer provided: {answer}
        
        Based on this doubt and answer, suggest how the curriculum should be updated to make it more comprehensive and clear.
        Provide specific additions or modifications to the curriculum.
        """
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert curriculum designer with deep knowledge across many domains."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        # In a real application, you would parse the response and update the curriculum
        # For now, we'll return the original curriculum with a minor modification
        
        # Find the topic that needs to be updated
        topic_id = doubt.get('topic_id')
        for topic in curriculum.get('topics', []):
            if str(topic.get('id')) == str(topic_id):
                # Add the doubt and answer to the topic content
                if 'content' not in topic:
                    topic['content'] = ""
                topic['content'] += f"\n\nQuestion: {doubt.get('question')}\n\nAnswer: {answer}"
                
                # Add a new resource
                topic['resources'].append({
                    "title": f"Additional resource based on your question",
                    "url": "",
                    "description": "This resource was added to address your specific question.",
                    "type": "article"
                })
                
                break
        
        return curriculum
    
    except Exception as e:
        print(f"Error updating curriculum: {str(e)}")
        raise  