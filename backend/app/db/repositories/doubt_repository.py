from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import db
from app.models.doubt import DoubtCreate, DoubtInDB, DoubtUpdate

async def get_doubt_by_id(doubt_id: str) -> Optional[DoubtInDB]:
    """Get a doubt by ID."""
    doubt = await db.db.doubts.find_one({"_id": ObjectId(doubt_id)})
    if doubt:
        return DoubtInDB(**doubt)
    return None

async def get_doubts_by_user(user_id: str) -> List[DoubtInDB]:
    """Get all doubts for a user."""
    cursor = db.db.doubts.find({"user_id": ObjectId(user_id)})
    doubts = await cursor.to_list(length=100)  # Limit to 100 doubts
    return [DoubtInDB(**doubt) for doubt in doubts]

async def get_doubts_by_curriculum(curriculum_id: str) -> List[DoubtInDB]:
    """Get all doubts for a curriculum."""
    cursor = db.db.doubts.find({"curriculum_id": ObjectId(curriculum_id)})
    doubts = await cursor.to_list(length=100)  # Limit to 100 doubts
    return [DoubtInDB(**doubt) for doubt in doubts]

async def get_doubts_by_topic(topic_id: str) -> List[DoubtInDB]:
    """Get all doubts for a topic."""
    cursor = db.db.doubts.find({"topic_id": ObjectId(topic_id)})
    doubts = await cursor.to_list(length=100)  # Limit to 100 doubts
    return [DoubtInDB(**doubt) for doubt in doubts]

async def create_doubt(user_id: str, doubt_data: DoubtCreate) -> DoubtInDB:
    """Create a new doubt."""
    # Prepare doubt data
    doubt_in_db = DoubtInDB(
        question=doubt_data.question,
        topic_id=doubt_data.topic_id,
        curriculum_id=doubt_data.curriculum_id,
        user_id=ObjectId(user_id),
        answer=None,
        is_resolved=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        curriculum_updates=[]
    )
    
    # Insert into database
    result = await db.db.doubts.insert_one(doubt_in_db.dict(by_alias=True))
    doubt_in_db.id = result.inserted_id
    
    return doubt_in_db

async def update_doubt(doubt_id: str, doubt_update: DoubtUpdate) -> Optional[DoubtInDB]:
    """Update a doubt."""
    doubt = await get_doubt_by_id(doubt_id)
    if not doubt:
        return None
    
    # Prepare update data
    update_data = doubt_update.dict(exclude_unset=True)
    
    # Update timestamp
    update_data["updated_at"] = datetime.utcnow()
    
    # Update in database
    await db.db.doubts.update_one(
        {"_id": ObjectId(doubt_id)},
        {"$set": update_data}
    )
    
    return await get_doubt_by_id(doubt_id)

async def add_curriculum_update(doubt_id: str, curriculum_update_id: str) -> Optional[DoubtInDB]:
    """Add a curriculum update reference to a doubt."""
    await db.db.doubts.update_one(
        {"_id": ObjectId(doubt_id)},
        {
            "$addToSet": {"curriculum_updates": ObjectId(curriculum_update_id)},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    return await get_doubt_by_id(doubt_id)

async def resolve_doubt(doubt_id: str, answer: str) -> Optional[DoubtInDB]:
    """Resolve a doubt by providing an answer."""
    await db.db.doubts.update_one(
        {"_id": ObjectId(doubt_id)},
        {
            "$set": {
                "answer": answer,
                "is_resolved": True,
                "updated_at": datetime.utcnow()
            }
        }
    )
    return await get_doubt_by_id(doubt_id) 