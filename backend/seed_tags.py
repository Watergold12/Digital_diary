import sys
from app.core.database import SessionLocal
from app.models.user import User
from app.models.tag import Tag
from app.models.diary import DiaryEntry

def seed_default_tags():
    db = SessionLocal()
    users = db.query(User).all()
    default_tags = [
        {"name": "Personal", "color": "lavender"},
        {"name": "Work", "color": "blue"},
        {"name": "Health", "color": "green"},
        {"name": "Ideas", "color": "yellow"}
    ]
    
    count = 0
    for user in users:
        existing_tags = db.query(Tag).filter(Tag.user_id == user.id).count()
        if existing_tags == 0:
            for tag_data in default_tags:
                new_tag = Tag(user_id=user.id, name=tag_data["name"], color=tag_data["color"])
                db.add(new_tag)
            count += len(default_tags)
    
    db.commit()
    db.close()
    print(f"Seeded {count} default tags across users.")

if __name__ == "__main__":
    seed_default_tags()
