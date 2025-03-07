from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class DoubtBase(BaseModel):
    question: str
    topic_id: PyObjectId
    curriculum_id: PyObjectId

class DoubtCreate(DoubtBase):
    pass

class DoubtInDB(DoubtBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    answer: Optional[str] = None
    is_resolved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    curriculum_updates: List[PyObjectId] = []  # References to curriculum changes made due to this doubt
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Doubt(DoubtBase):
    id: str
    user_id: str
    answer: Optional[str] = None
    is_resolved: bool
    created_at: datetime
    updated_at: datetime
    curriculum_updates: List[str] = []
    
    class Config:
        from_attributes = True

class DoubtUpdate(BaseModel):
    answer: Optional[str] = None
    is_resolved: Optional[bool] = None
    curriculum_updates: Optional[List[PyObjectId]] = None 