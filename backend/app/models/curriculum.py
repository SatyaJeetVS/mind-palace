from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class Resource(BaseModel):
    title: str
    url: Optional[str] = None
    content: Optional[str] = None
    type: str = "article"  # article, video, book, etc.

class Assessment(BaseModel):
    title: str
    content: str
    questions: List[Dict[str, Any]] = []

class TopicBase(BaseModel):
    title: str
    content: str
    learning_objectives: List[str] = []
    content: str = ""
    difficulty_level: str = "beginner"  # beginner, intermediate, advanced
    estimated_time_minutes: int = 60
    prerequisites: List[str] = []
    resources: List[Resource] = []
    assessments: List[Assessment] = []
    is_completed: bool = False
    progress_percentage: int = 0

class SubTopic(TopicBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    parent_id: Optional[PyObjectId] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Topic(TopicBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    subtopics: List["SubTopic"] = []  # Use string reference for forward ref
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CurriculumBase(BaseModel):
    title: str
    content: str
    
class CurriculumCreate(CurriculumBase):
    pass

class CurriculumInDB(CurriculumBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    topics: List[Topic] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = 1
    change_history: List[Dict[str, Any]] = []
    overall_progress: int = 0
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Curriculum(CurriculumBase):
    id: str
    user_id: str
    topics: List[Topic] = []
    created_at: datetime
    updated_at: datetime
    version: int
    change_history: List[Dict[str, Any]] = []
    overall_progress: int = 0
    
    class Config:
        from_attributes = True


class CurriculumUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    topics: Optional[List[Topic]] = None

# --- Fix for Pydantic v2 forward refs ---
Topic.model_rebuild()
SubTopic.model_rebuild()