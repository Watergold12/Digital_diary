from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    
    appearance = Column(JSON, default={"theme": "system"})
    diary_preferences = Column(JSON, default={"defaultEntryView": "list", "confirmBeforeDelete": True, "showEntryPreview": True})
    notifications = Column(JSON, default={"entryReminders": True, "tagNotifications": False})

    # Relationship
    user = relationship("User", back_populates="settings")
