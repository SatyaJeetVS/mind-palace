from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import db
from app.models.curriculum import CurriculumCreate, CurriculumInDB, CurriculumUpdate, Topic

async def get_curriculum_by_id(curriculum_id: str) -> Optional[CurriculumInDB]:
    """Get a curriculum by ID."""
    curriculum = await db.db.curricula.find_one({"_id": ObjectId(curriculum_id)})
    if curriculum:
        return CurriculumInDB(**curriculum)
    return None

async def get_curricula_by_user(user_id: str) -> List[CurriculumInDB]:
    """Get all curricula for a user."""
    cursor = db.db.curricula.find({"user_id": user_id})
    curricula = await cursor.to_list(length=100)  # Limit to 100 curricula
    return [CurriculumInDB(**curriculum) for curriculum in curricula]

async def create_curriculum(user_id: str, curriculum_data: Dict[str, Any]) -> CurriculumInDB:
    """Create a new curriculum."""
    # Prepare curriculum data
    curriculum_in_db = CurriculumInDB(
        title=curriculum_data["topic"],
        content=curriculum_data["content"],
        user_id=ObjectId(user_id),
        topics=curriculum_data.get("subtopics", []),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        version=1,
        change_history=[{
            "timestamp": datetime.utcnow(),
            "description": "Initial curriculum creation",
            "version": 1
        }],
        overall_progress=0
    )
    
    # Insert into database
    result = await db.db.curricula.insert_one(curriculum_in_db.dict(by_alias=True))
    curriculum_in_db.id = result.inserted_id
    
    return curriculum_in_db

async def update_curriculum(curriculum_id: str, update_data: Dict[str, Any]) -> Optional[CurriculumInDB]:
    """Update a curriculum."""
    curriculum = await get_curriculum_by_id(curriculum_id)
    if not curriculum:
        return None
    
    # Prepare update data
    update_dict = {}
    for key, value in update_data.items():
        if key != "id" and value is not None:
            update_dict[key] = value
    
    # Update version and timestamp
    current_version = curriculum.version
    new_version = current_version + 1
    update_dict["version"] = new_version
    update_dict["updated_at"] = datetime.utcnow()
    
    # Add to change history
    change_entry = {
        "timestamp": datetime.utcnow(),
        "content": update_data.get("change_description", "Curriculum updated"),
        "version": new_version
    }
    
    # Update in database
    await db.db.curricula.update_one(
        {"_id": ObjectId(curriculum_id)},
        {
            "$set": update_dict,
            "$push": {"change_history": change_entry}
        }
    )
    
    return await get_curriculum_by_id(curriculum_id)

async def update_topic(curriculum_id: str, topic_id: str, topic_data: Dict[str, Any]) -> Optional[CurriculumInDB]:
    """Update a specific topic in a curriculum."""
    curriculum = await get_curriculum_by_id(curriculum_id)
    if not curriculum:
        return None
    
    # Find the topic to update
    topic_found = False
    for i, topic in enumerate(curriculum.topics):
        if str(topic.id) == topic_id:
            # Update the topic
            for key, value in topic_data.items():
                if key != "id" and value is not None:
                    setattr(curriculum.topics[i], key, value)
            topic_found = True
            break
    
    if not topic_found:
        return None
    
    # Update version and timestamp
    current_version = curriculum.version
    new_version = current_version + 1
    
    # Add to change history
    change_entry = {
        "timestamp": datetime.utcnow(),
        "content": f"Updated topic: {topic_data.get('title', 'Unknown')}",
        "version": new_version
    }
    
    # Update in database
    await db.db.curricula.update_one(
        {"_id": ObjectId(curriculum_id)},
        {
            "$set": {
                "topics": [t.dict(by_alias=True) for t in curriculum.topics],
                "version": new_version,
                "updated_at": datetime.utcnow()
            },
            "$push": {"change_history": change_entry}
        }
    )
    
    return await get_curriculum_by_id(curriculum_id)

async def update_progress(curriculum_id: str, topic_id: str, progress: int) -> Optional[CurriculumInDB]:
    """Update progress for a specific topic and recalculate overall progress."""
    curriculum = await get_curriculum_by_id(curriculum_id)
    if not curriculum:
        return None
    
    # Find the topic to update
    topic_found = False
    for i, topic in enumerate(curriculum.topics):
        if str(topic.id) == topic_id:
            # Update the topic progress
            curriculum.topics[i].progress_percentage = progress
            topic_found = True
            break
    
    if not topic_found:
        return None
    
    # Calculate overall progress
    total_topics = len(curriculum.topics)
    if total_topics > 0:
        overall_progress = sum(topic.progress_percentage for topic in curriculum.topics) // total_topics
    else:
        overall_progress = 0
    
    # Update in database
    await db.db.curricula.update_one(
        {"_id": ObjectId(curriculum_id)},
        {
            "$set": {
                "topics": [t.dict(by_alias=True) for t in curriculum.topics],
                "overall_progress": overall_progress,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return await get_curriculum_by_id(curriculum_id) 