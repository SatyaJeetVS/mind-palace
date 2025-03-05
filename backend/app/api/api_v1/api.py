from fastapi import APIRouter
from app.api.api_v1.endpoints import users, auth, curriculum, doubts

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(curriculum.router, prefix="/curriculum", tags=["curriculum"])
api_router.include_router(doubts.router, prefix="/doubts", tags=["doubts"]) 