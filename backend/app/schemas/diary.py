from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List
from .user import UserResponse
from .tag import TagResponse

class DiaryEntryBase(BaseModel):
    title: str
    content: str
    mood: Optional[str] = None

class DiaryEntryCreate(DiaryEntryBase):
    tag_ids: Optional[List[str]] = None

class DiaryEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    tag_ids: Optional[List[str]] = None

class DiaryEntryResponse(DiaryEntryBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    tags: List[TagResponse] = []

    model_config = ConfigDict(from_attributes=True)
