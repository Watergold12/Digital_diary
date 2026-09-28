from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)

engine = create_engine('sqlite:///:memory:')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

user1 = User(id=1, name="Old Name")
session.add(user1)
session.commit()

# Pretend this is get_current_user
current_user = session.query(User).filter(User.id == 1).first()

# Pretend this is update_settings
db_user = session.query(User).filter(User.id == current_user.id).first()
db_user.name = "New Name"
session.commit()

print(f"current_user.name: {current_user.name}")
print(f"db_user.name: {db_user.name}")
print(f"Are they the same object? {current_user is db_user}")
