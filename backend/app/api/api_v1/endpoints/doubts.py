from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any

from app.api.api_v1.endpoints.auth import get_current_active_user
from app.db.repositories import doubt_repository, curriculum_repository
from app.models.doubt import Doubt, DoubtCreate, DoubtUpdate
from app.models.user import User
# from app.services.ai_service import answer_doubt, update_curriculum_based_on_doubt

router = APIRouter()

@router.get("/", response_model=List[Doubt])
async def read_doubts(current_user = Depends(get_current_active_user)):
    """Get all doubts for the current user."""
    db_doubts = await doubt_repository.get_doubts_by_user(str(current_user.id))
    
    # Convert to response model
    doubts = []
    for doubt in db_doubts:
        doubts.append(Doubt(
            id=str(doubt.id),
            question=doubt.question,
            topic_id=str(doubt.topic_id),
            curriculum_id=str(doubt.curriculum_id),
            user_id=str(doubt.user_id),
            answer=doubt.answer,
            is_resolved=doubt.is_resolved,
            created_at=doubt.created_at,
            updated_at=doubt.updated_at,
            curriculum_updates=[str(update) for update in doubt.curriculum_updates]
        ))
    
    return doubts

@router.get("/curriculum/{curriculum_id}", response_model=List[Doubt])
async def read_doubts_by_curriculum(curriculum_id: str, current_user = Depends(get_current_active_user)):
    """Get all doubts for a specific curriculum."""
    # Check if the curriculum belongs to the user
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    if str(curriculum.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this curriculum"
        )
    
    # Get doubts
    db_doubts = await doubt_repository.get_doubts_by_curriculum(curriculum_id)
    
    # Convert to response model
    doubts = []
    for doubt in db_doubts:
        doubts.append(Doubt(
            id=str(doubt.id),
            question=doubt.question,
            topic_id=str(doubt.topic_id),
            curriculum_id=str(doubt.curriculum_id),
            user_id=str(doubt.user_id),
            answer=doubt.answer,
            is_resolved=doubt.is_resolved,
            created_at=doubt.created_at,
            updated_at=doubt.updated_at,
            curriculum_updates=[str(update) for update in doubt.curriculum_updates]
        ))
    
    return doubts

@router.get("/{doubt_id}", response_model=Doubt)
async def read_doubt(doubt_id: str, current_user = Depends(get_current_active_user)):
    """Get a specific doubt."""
    doubt = await doubt_repository.get_doubt_by_id(doubt_id)
    if not doubt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doubt not found"
        )
    
    # Check if the doubt belongs to the current user
    if str(doubt.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this doubt"
        )
    
    return Doubt(
        id=str(doubt.id),
        question=doubt.question,
        topic_id=str(doubt.topic_id),
        curriculum_id=str(doubt.curriculum_id),
        user_id=str(doubt.user_id),
        answer=doubt.answer,
        is_resolved=doubt.is_resolved,
        created_at=doubt.created_at,
        updated_at=doubt.updated_at,
        curriculum_updates=[str(update) for update in doubt.curriculum_updates]
    )

@router.post("/", response_model=Doubt)
async def create_doubt(doubt_create: DoubtCreate, current_user = Depends(get_current_active_user)):
    """Create a new doubt."""
    # Check if the curriculum exists and belongs to the user
    curriculum = await curriculum_repository.get_curriculum_by_id(str(doubt_create.curriculum_id))
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    if str(curriculum.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this curriculum"
        )
    
    # Create the doubt
    db_doubt = await doubt_repository.create_doubt(str(current_user.id), doubt_create)
    
    # Find the topic context for AI
    topic_context = ""
    topic_id = str(doubt_create.topic_id)
    for topic in curriculum.topics:
        if str(topic.id) == topic_id:
            topic_context = f"Topic: {topic.title}\n\nDescription: {topic.description}\n\nContent: {topic.content}"
            break
    
    # Generate answer using AI
    answer = await answer_doubt(doubt_create.question, topic_context)
    
    # Update the doubt with the answer
    updated_doubt = await doubt_repository.resolve_doubt(str(db_doubt.id), answer)
    
    # Update the curriculum based on the doubt and answer
    doubt_dict = {
        "question": doubt_create.question,
        "topic_id": topic_id,
        "topic_context": topic_context
    }
    updated_curriculum = await update_curriculum_based_on_doubt(
        curriculum.dict(), 
        doubt_dict, 
        answer
    )
    
    # Save the updated curriculum
    curriculum_update = await curriculum_repository.update_curriculum(
        str(curriculum.id), 
        {
            "topics": updated_curriculum.get("topics", []),
            "change_description": f"Updated based on doubt: {doubt_create.question}"
        }
    )
    
    # Add reference to the curriculum update
    if curriculum_update:
        await doubt_repository.add_curriculum_update(str(updated_doubt.id), str(curriculum_update.id))
        updated_doubt = await doubt_repository.get_doubt_by_id(str(updated_doubt.id))
    
    return Doubt(
        id=str(updated_doubt.id),
        question=updated_doubt.question,
        topic_id=str(updated_doubt.topic_id),
        curriculum_id=str(updated_doubt.curriculum_id),
        user_id=str(updated_doubt.user_id),
        answer=updated_doubt.answer,
        is_resolved=updated_doubt.is_resolved,
        created_at=updated_doubt.created_at,
        updated_at=updated_doubt.updated_at,
        curriculum_updates=[str(update) for update in updated_doubt.curriculum_updates]
    )

@router.put("/{doubt_id}", response_model=Doubt)
async def update_doubt(
    doubt_id: str, 
    doubt_update: DoubtUpdate, 
    current_user = Depends(get_current_active_user)
):
    """Update a doubt."""
    # Check if the doubt exists and belongs to the user
    doubt = await doubt_repository.get_doubt_by_id(doubt_id)
    if not doubt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doubt not found"
        )
    
    if str(doubt.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this doubt"
        )
    
    # Update the doubt
    updated_doubt = await doubt_repository.update_doubt(doubt_id, doubt_update)
    
    return Doubt(
        id=str(updated_doubt.id),
        question=updated_doubt.question,
        topic_id=str(updated_doubt.topic_id),
        curriculum_id=str(updated_doubt.curriculum_id),
        user_id=str(updated_doubt.user_id),
        answer=updated_doubt.answer,
        is_resolved=updated_doubt.is_resolved,
        created_at=updated_doubt.created_at,
        updated_at=updated_doubt.updated_at,
        curriculum_updates=[str(update) for update in updated_doubt.curriculum_updates]
    ) 