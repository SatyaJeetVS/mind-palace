from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any

from app.api.api_v1.endpoints.auth import get_current_active_user
from app.db.repositories import curriculum_repository
from app.models.curriculum import Curriculum, CurriculumCreate, CurriculumUpdate
from app.models.user import User
from app.services.ai_service import generate_curriculum

router = APIRouter()

@router.get("/", response_model=List[Curriculum])
async def read_curricula(current_user = Depends(get_current_active_user)):
    """Get all curricula for the current user."""
    db_curricula = await curriculum_repository.get_curricula_by_user(str(current_user.id))
    
    # Convert to response model
    curricula = []
    for curriculum in db_curricula:
        curricula.append(Curriculum(
            id=str(curriculum.id),
            title=curriculum.title,
            description=curriculum.description,
            main_topic=curriculum.main_topic,
            user_id=str(curriculum.user_id),
            topics=curriculum.topics,
            created_at=curriculum.created_at,
            updated_at=curriculum.updated_at,
            version=curriculum.version,
            change_history=curriculum.change_history,
            overall_progress=curriculum.overall_progress
        ))
    
    return curricula

@router.get("/{curriculum_id}", response_model=Curriculum)
async def read_curriculum(curriculum_id: str, current_user = Depends(get_current_active_user)):
    """Get a specific curriculum."""
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    # Check if the curriculum belongs to the current user
    if str(curriculum.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this curriculum"
        )
    
    return Curriculum(
        id=str(curriculum.id),
        title=curriculum.title,
        description=curriculum.description,
        main_topic=curriculum.main_topic,
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
    # Generate curriculum using AI
    curriculum_data = await generate_curriculum(topic)
    
    # Save to database
    db_curriculum = await curriculum_repository.create_curriculum(str(current_user.id), curriculum_data)
    
    return Curriculum(
        id=str(db_curriculum.id),
        title=db_curriculum.title,
        description=db_curriculum.description,
        main_topic=db_curriculum.main_topic,
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
    # Check if the curriculum exists and belongs to the user
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    if str(curriculum.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this curriculum"
        )
    
    # Update the curriculum
    updated_curriculum = await curriculum_repository.update_curriculum(curriculum_id, update_data)
    
    return Curriculum(
        id=str(updated_curriculum.id),
        title=updated_curriculum.title,
        description=updated_curriculum.description,
        main_topic=updated_curriculum.main_topic,
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
    # Check if the curriculum exists and belongs to the user
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    if str(curriculum.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this curriculum"
        )
    
    # Update the topic
    updated_curriculum = await curriculum_repository.update_topic(curriculum_id, topic_id, topic_data)
    if not updated_curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )
    
    return Curriculum(
        id=str(updated_curriculum.id),
        title=updated_curriculum.title,
        description=updated_curriculum.description,
        main_topic=updated_curriculum.main_topic,
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
    # Check if the curriculum exists and belongs to the user
    curriculum = await curriculum_repository.get_curriculum_by_id(curriculum_id)
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    if str(curriculum.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this curriculum"
        )
    
    # Validate progress value
    if progress < 0 or progress > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Progress must be between 0 and 100"
        )
    
    # Update the progress
    updated_curriculum = await curriculum_repository.update_progress(curriculum_id, topic_id, progress)
    if not updated_curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )
    
    return Curriculum(
        id=str(updated_curriculum.id),
        title=updated_curriculum.title,
        description=updated_curriculum.description,
        main_topic=updated_curriculum.main_topic,
        user_id=str(updated_curriculum.user_id),
        topics=updated_curriculum.topics,
        created_at=updated_curriculum.created_at,
        updated_at=updated_curriculum.updated_at,
        version=updated_curriculum.version,
        change_history=updated_curriculum.change_history,
        overall_progress=updated_curriculum.overall_progress
    ) 