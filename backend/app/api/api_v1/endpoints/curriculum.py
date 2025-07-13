
from fastapi import APIRouter, Body, Depends, HTTPException, status
from typing import List, Dict, Any
import logging

from app.api.api_v1.endpoints.auth import get_current_active_user
from app.db.repositories import curriculum_repository
from app.models.curriculum import Curriculum, CurriculumCreate, CurriculumUpdate
from app.models.user import User
from app.services.ai_service import generate_curriculum

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[Curriculum])
async def read_curricula(current_user = Depends(get_current_active_user)):
    """Get all curricula for the current user."""
    logger.info(f"Fetching curricula for user: {current_user.id}")
    db_curricula = await curriculum_repository.get_curricula_by_user(str(current_user.id))
    # logger.info
    # Convert to response model
    curricula = []
    logger.info(f"{current_user.id}")
    for curriculum in db_curricula:
        curricula.append(Curriculum(
            id=str(curriculum.id),
            title=curriculum.title,
            content=curriculum.content,
            # main_topic=curriculum.main_topic,
            user_id=str(curriculum.user_id),
            topics=curriculum.topics,
            created_at=curriculum.created_at,
            updated_at=curriculum.updated_at,
            version=curriculum.version,
            change_history=curriculum.change_history,
            overall_progress=curriculum.overall_progress
        ))
    
    logger.info(f"Returning {len(curricula)} curricula for user: {current_user.id}")
    return curricula

@router.get("/list-names", response_model=List[Dict[str, str]])
async def list_curriculum_names(current_user = Depends(get_current_active_user)):
    """List all curriculum names and ids for the current user."""
    logger.info(f"Listing curriculum names for user: {current_user.id}")
    curricula = await curriculum_repository.list_curriculum_names_by_user(str(current_user.id))
    logger.info(f"Returning {len(curricula)} curriculum names for user: {current_user.id}")
    return curricula

@router.get("/{curriculum_id}", response_model=Curriculum)
async def read_curriculum(curriculum_id: str, current_user = Depends(get_current_active_user)):
    """Get a specific curriculum."""
    logger.info(f"Fetching curriculum {curriculum_id} for user: {current_user.id}")
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        logger.warning(f"Curriculum {curriculum_id} not found for user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    # Check if the curriculum belongs to the current user
    if str(curriculum.user_id) != str(current_user.id):
        logger.warning(f"User {current_user.id} not authorized to access curriculum {curriculum_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this curriculum"
        )
    
    logger.info(f"Returning curriculum {curriculum_id} for user: {current_user.id}")
    return Curriculum(
        id=str(curriculum.id),
        title=curriculum.title,
        content=curriculum.content,
        # main_topic=curriculum.main_topic,
        user_id=str(curriculum.user_id),
        topics=curriculum.topics,
        created_at=curriculum.created_at,
        updated_at=curriculum.updated_at,
        version=curriculum.version,
        change_history=curriculum.change_history,
        overall_progress=curriculum.overall_progress
    )

@router.post("/", response_model=Curriculum)
async def create_curriculum(topic: str = Body(..., embed=True), current_user = Depends(get_current_active_user)):
    """Create a new curriculum for a topic."""
    logger.info(f"Creating curriculum for user: {current_user.id} with topic: {topic}")
    curriculum_data = await generate_curriculum(topic)
    
    # Save to database
    db_curriculum = await curriculum_repository.create_curriculum(str(current_user.id), curriculum_data)
    logger.info(f"Created curriculum {db_curriculum.id} for user: {current_user.id}")
    return Curriculum(
        id=str(db_curriculum.id),
        title=db_curriculum.title,
        content=db_curriculum.content,
        # main_topic=db_curriculum.main_topic,
        user_id=str(db_curriculum.user_id),
        topics=db_curriculum.topics,
        created_at=db_curriculum.created_at,
        updated_at=db_curriculum.updated_at,
        version=db_curriculum.version,
        change_history=db_curriculum.change_history,
        overall_progress=db_curriculum.overall_progress
    )

@router.put("/{curriculum_id}", response_model=Curriculum)
async def update_curriculum(
    curriculum_id: str, 
    update_data: Dict[str, Any] = Body(...), 
    current_user = Depends(get_current_active_user)
):
    """Update a curriculum."""
    logger.info(f"Updating curriculum {curriculum_id} for user: {current_user.id}")
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        logger.warning(f"Curriculum {curriculum_id} not found for update by user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    if str(curriculum.user_id) != str(current_user.id):
        logger.warning(f"User {current_user.id} not authorized to update curriculum {curriculum_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this curriculum"
        )
    
    # Update the curriculum
    updated_curriculum = await curriculum_repository.update_curriculum(curriculum_id, update_data)
    logger.info(f"Updated curriculum {curriculum_id} for user: {current_user.id}")
    return Curriculum(
        id=str(updated_curriculum.id),
        title=updated_curriculum.title,
        content=updated_curriculum.content,
        # main_topic=updated_curriculum.main_topic,
        user_id=str(updated_curriculum.user_id),
        topics=updated_curriculum.topics,
        created_at=updated_curriculum.created_at,
        updated_at=updated_curriculum.updated_at,
        version=updated_curriculum.version,
        change_history=updated_curriculum.change_history,
        overall_progress=updated_curriculum.overall_progress
    )

@router.put("/{curriculum_id}/topics/{topic_id}", response_model=Curriculum)
async def update_topic(
    curriculum_id: str,
    topic_id: str,
    topic_data: Dict[str, Any] = Body(...),
    current_user = Depends(get_current_active_user)
):
    """Update a specific topic in a curriculum."""
    logger.info(f"Updating topic {topic_id} in curriculum {curriculum_id} for user: {current_user.id}")
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        logger.warning(f"Curriculum {curriculum_id} not found for topic update by user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    if str(curriculum.user_id) != str(current_user.id):
        logger.warning(f"User {current_user.id} not authorized to update topic {topic_id} in curriculum {curriculum_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this curriculum"
        )
    
    # Update the topic
    updated_curriculum = await curriculum_repository.update_topic(curriculum_id, topic_id, topic_data)
    if not updated_curriculum:
        logger.warning(f"Topic {topic_id} not found in curriculum {curriculum_id} for user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )
    
    logger.info(f"Updated topic {topic_id} in curriculum {curriculum_id} for user: {current_user.id}")
    return Curriculum(
        id=str(updated_curriculum.id),
        title=updated_curriculum.title,
        content=updated_curriculum.content,
        # main_topic=updated_curriculum.main_topic,
        user_id=str(updated_curriculum.user_id),
        topics=updated_curriculum.topics,
        created_at=updated_curriculum.created_at,
        updated_at=updated_curriculum.updated_at,
        version=updated_curriculum.version,
        change_history=updated_curriculum.change_history,
        overall_progress=updated_curriculum.overall_progress
    )

@router.put("/{curriculum_id}/topics/{topic_id}/progress", response_model=Curriculum)
async def update_topic_progress(
    curriculum_id: str,
    topic_id: str,
    progress: int = Body(..., embed=True),
    current_user = Depends(get_current_active_user)
):
    """Update progress for a specific topic."""
    logger.info(f"Updating progress for topic {topic_id} in curriculum {curriculum_id} for user: {current_user.id}")
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        logger.warning(f"Curriculum {curriculum_id} not found for progress update by user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    if str(curriculum.user_id) != str(current_user.id):
        logger.warning(f"User {current_user.id} not authorized to update progress for topic {topic_id} in curriculum {curriculum_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this curriculum"
        )
    
    # Validate progress value
    if progress < 0 or progress > 100:
        logger.warning(f"Invalid progress value {progress} for topic {topic_id} in curriculum {curriculum_id} by user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Progress must be between 0 and 100"
        )
    
    # Update the progress
    updated_curriculum = await curriculum_repository.update_progress(curriculum_id, topic_id, progress)
    if not updated_curriculum:
        logger.warning(f"Topic {topic_id} not found in curriculum {curriculum_id} for progress update by user: {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )
    
    logger.info(f"Updated progress for topic {topic_id} in curriculum {curriculum_id} for user: {current_user.id}")
    return Curriculum(
        id=str(updated_curriculum.id),
        title=updated_curriculum.title,
        content=updated_curriculum.content,
        # main_topic=updated_curriculum.main_topic,
        user_id=str(updated_curriculum.user_id),
        topics=updated_curriculum.topics,
        created_at=updated_curriculum.created_at,
        updated_at=updated_curriculum.updated_at,
        version=updated_curriculum.version,
        change_history=updated_curriculum.change_history,
        overall_progress=updated_curriculum.overall_progress
    )