from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.db.mongodb import db
from app.models.user import UserCreate, UserInDB, UserUpdate
from app.services.auth import get_password_hash

async def get_user_by_email(email: str) -> Optional[UserInDB]:
    """Get a user by email."""
    user = await db.db.users.find_one({"email": email})
    if user:
        return UserInDB(**user)
    return None

async def get_user_by_id(user_id: str) -> Optional[UserInDB]:
    """Get a user by ID."""
    user = await db.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        return UserInDB(**user)
    return None

async def create_user(user: UserCreate) -> UserInDB:
    """Create a new user."""
    # Check if user already exists
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise ValueError("User with this email already exists")
    
    # Create new user
    user_in_db = UserInDB(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password),
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        bookmarks=[]
    )
    
    # Insert into database
    result = await db.db.users.insert_one(user_in_db.dict(by_alias=True))
    user_in_db.id = result.inserted_id
    
    return user_in_db

async def update_user(user_id: str, user_update: UserUpdate) -> Optional[UserInDB]:
    """Update a user."""
    user = await get_user_by_id(user_id)
    if not user:
        return None
    
    # Prepare update data
    update_data = user_update.dict(exclude_unset=True)
    
    # Hash password if provided
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    # Update timestamp
    update_data["updated_at"] = datetime.utcnow()
    
    # Update in database
    await db.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    return await get_user_by_id(user_id)

async def add_bookmark(user_id: str, curriculum_id: str) -> Optional[UserInDB]:
    """Add a bookmark to a user."""
    await db.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"bookmarks": ObjectId(curriculum_id)}}
    )
    return await get_user_by_id(user_id)

async def remove_bookmark(user_id: str, curriculum_id: str) -> Optional[UserInDB]:
    """Remove a bookmark from a user."""
    await db.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"bookmarks": ObjectId(curriculum_id)}}
    )
    return await get_user_by_id(user_id) 