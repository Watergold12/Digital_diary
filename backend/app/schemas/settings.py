from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any

class UserProfileSchema(BaseModel):
    displayName: str
    email: str
    avatarUrl: Optional[str] = None

class AppearanceSchema(BaseModel):
    theme: str

class DiaryPreferencesSchema(BaseModel):
    defaultEntryView: str
    confirmBeforeDelete: bool
    showEntryPreview: bool

class NotificationsSchema(BaseModel):
    entryReminders: bool
    tagNotifications: bool

class AppSettingsSchema(BaseModel):
    profile: UserProfileSchema
    appearance: AppearanceSchema
    diaryPreferences: DiaryPreferencesSchema
    notifications: NotificationsSchema

    model_config = ConfigDict(from_attributes=True)

class SettingsUpdateSchema(BaseModel):
    profile: Optional[UserProfileSchema] = None
    appearance: Optional[AppearanceSchema] = None
    diaryPreferences: Optional[DiaryPreferencesSchema] = None
    notifications: Optional[NotificationsSchema] = None
