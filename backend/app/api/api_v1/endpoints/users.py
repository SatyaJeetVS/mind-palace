from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.api.api_v1.endpoints.auth import get_current_active_user
from app.db.repositories import user_repository
from app.models.user import User, UserUpdate

router = APIRouter()

@router.get("/", response_model=List[User])
async def read_users(skip: int = 0, limit: int = 100, current_user = Depends(get_current_active_user)):
    """Get list of users (admin only)."""
    # In a real app, you would check if the current user is an admin
    # For now, we'll just return a list with the current user
    return [User(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
        bookmarks=[str(b) for b in current_user.bookmarks]
    )]

@router.put("/me", response_model=User)
async def update_user_me(user_update: UserUpdate, current_user = Depends(get_current_active_user)):
    """Update current user."""
    updated_user = await user_repository.update_user(str(current_user.id), user_update)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return User(
        id=str(updated_user.id),
        email=updated_user.email,
        username=updated_user.username,
        full_name=updated_user.full_name,
        is_active=updated_user.is_active,
        created_at=updated_user.created_at,
        updated_at=updated_user.updated_at,
        bookmarks=[str(b) for b in updated_user.bookmarks]
    )

@router.post("/bookmarks/{curriculum_id}", response_model=User)
async def add_bookmark(curriculum_id: str, current_user = Depends(get_current_active_user)):
    """Add a bookmark."""
    updated_user = await user_repository.add_bookmark(str(current_user.id), curriculum_id)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return User(
        id=str(updated_user.id),
        email=updated_user.email,
        username=updated_user.username,
        full_name=updated_user.full_name,
        is_active=updated_user.is_active,
        created_at=updated_user.created_at,
        updated_at=updated_user.updated_at,
        bookmarks=[str(b) for b in updated_user.bookmarks]
    )

@router.delete("/bookmarks/{curriculum_id}", response_model=User)
async def remove_bookmark(curriculum_id: str, current_user = Depends(get_current_active_user)):
    """Remove a bookmark."""
    updated_user = await user_repository.remove_bookmark(str(current_user.id), curriculum_id)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return User(
        id=str(updated_user.id),
        email=updated_user.email,
        username=updated_user.username,
        full_name=updated_user.full_name,
        is_active=updated_user.is_active,
        created_at=updated_user.created_at,
        updated_at=updated_user.updated_at,
        bookmarks=[str(b) for b in updated_user.bookmarks]
    ) 