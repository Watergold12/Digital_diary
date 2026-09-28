from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import SessionLocal
from ..models.diary import DiaryEntry
from ..models.tag import Tag
from ..schemas.diary import DiaryEntryCreate, DiaryEntryUpdate, DiaryEntryResponse
from ..dependencies.auth import get_current_user
from ..models.user import User

router = APIRouter(
    prefix="/api/entries",
    tags=["Entries"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=List[DiaryEntryResponse])
def get_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entries = db.query(DiaryEntry).filter(DiaryEntry.user_id == current_user.id).order_by(DiaryEntry.created_at.desc()).all()
    return entries

@router.post("", response_model=DiaryEntryResponse, status_code=status.HTTP_201_CREATED)
def create_entry(entry: DiaryEntryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry_dict = entry.model_dump(exclude={"tag_ids"})
    db_entry = DiaryEntry(**entry_dict, user_id=current_user.id)
    
    if entry.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(entry.tag_ids), Tag.user_id == current_user.id).all()
        db_entry.tags = tags
        
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/{entry_id}", response_model=DiaryEntryResponse)
def get_entry(entry_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(DiaryEntry).filter(DiaryEntry.id == entry_id, DiaryEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@router.put("/{entry_id}", response_model=DiaryEntryResponse)
def update_entry(entry_id: str, entry_update: DiaryEntryUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_entry = db.query(DiaryEntry).filter(DiaryEntry.id == entry_id, DiaryEntry.user_id == current_user.id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    update_data = entry_update.model_dump(exclude_unset=True, exclude={"tag_ids"})
    for key, value in update_data.items():
        setattr(db_entry, key, value)
        
    if entry_update.tag_ids is not None:
        tags = db.query(Tag).filter(Tag.id.in_(entry_update.tag_ids), Tag.user_id == current_user.id).all()
        db_entry.tags = tags
        
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_entry = db.query(DiaryEntry).filter(DiaryEntry.id == entry_id, DiaryEntry.user_id == current_user.id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db.delete(db_entry)
    db.commit()
    return None
