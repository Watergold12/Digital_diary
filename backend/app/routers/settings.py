from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.settings import UserSettings
from app.models.user import User
from app.schemas.settings import AppSettingsSchema, SettingsUpdateSchema
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/api/settings",
    tags=["Settings"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_default_settings(user: User):
    return {
        "profile": {
            "displayName": user.name,
            "email": user.email,
        },
        "appearance": {"theme": "system"},
        "diaryPreferences": {
            "defaultEntryView": "list",
            "confirmBeforeDelete": True,
            "showEntryPreview": True
        },
        "notifications": {
            "entryReminders": True,
            "tagNotifications": False
        }
    }

@router.get("", response_model=AppSettingsSchema)
def get_settings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    default = get_default_settings(current_user)
    
    if not settings:
        return default
        
    return {
        "profile": default["profile"], # User table is truth for profile
        "appearance": settings.appearance or default["appearance"],
        "diaryPreferences": settings.diary_preferences or default["diaryPreferences"],
        "notifications": settings.notifications or default["notifications"]
    }

@router.put("", response_model=AppSettingsSchema)
def update_settings(settings_update: SettingsUpdateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Update profile in User model
    if settings_update.profile:
        db_user = db.query(User).filter(User.id == current_user.id).first()
        db_user.name = settings_update.profile.displayName
        if settings_update.profile.email != db_user.email:
            existing = db.query(User).filter(User.email == settings_update.profile.email).first()
            if existing and existing.id != db_user.id:
                raise HTTPException(status_code=400, detail="Email already taken")
            db_user.email = settings_update.profile.email

    # Update UserSettings
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)

    if settings_update.appearance:
        settings.appearance = settings_update.appearance.model_dump()
    if settings_update.diaryPreferences:
        settings.diary_preferences = settings_update.diaryPreferences.model_dump()
    if settings_update.notifications:
        settings.notifications = settings_update.notifications.model_dump()

    db.commit()
    
    # Return fresh state
    default = get_default_settings(current_user)
    return {
        "profile": default["profile"],
        "appearance": settings.appearance or default["appearance"],
        "diaryPreferences": settings.diary_preferences or default["diaryPreferences"],
        "notifications": settings.notifications or default["notifications"]
    }
