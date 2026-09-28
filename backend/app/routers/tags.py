from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import SessionLocal
from ..models.tag import Tag
from ..schemas.tag import TagCreate, TagUpdate, TagResponse
from ..dependencies.auth import get_current_user
from ..models.user import User

router = APIRouter(
    prefix="/api/tags",
    tags=["Tags"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=List[TagResponse])
def get_tags(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tags = db.query(Tag).filter(Tag.user_id == current_user.id).order_by(Tag.created_at.desc()).all()
    return tags

@router.post("", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def create_tag(tag: TagCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_tag = db.query(Tag).filter(Tag.user_id == current_user.id, Tag.name == tag.name).first()
    if existing_tag:
        raise HTTPException(status_code=400, detail="Tag with this name already exists")

    db_tag = Tag(**tag.model_dump(), user_id=current_user.id)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

@router.put("/{tag_id}", response_model=TagResponse)
def update_tag(tag_id: str, tag_update: TagUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_tag = db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == current_user.id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    if tag_update.name is not None and tag_update.name != db_tag.name:
        existing_tag = db.query(Tag).filter(Tag.user_id == current_user.id, Tag.name == tag_update.name).first()
        if existing_tag:
            raise HTTPException(status_code=400, detail="Tag with this name already exists")

    update_data = tag_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tag, key, value)
        
    db.commit()
    db.refresh(db_tag)
    return db_tag

@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_tag = db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == current_user.id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    db.delete(db_tag)
    db.commit()
    return None
