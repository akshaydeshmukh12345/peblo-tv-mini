from app.db.database import Base, engine

# Import all models so SQLAlchemy knows about all tables
from app.models.show import Show
from app.models.season import Season
from app.models.episode import Episode
from app.models.publish_run import PublishRun

print("Deleting old tables...")
Base.metadata.drop_all(bind=engine)

print("Creating new tables...")
Base.metadata.create_all(bind=engine)

print("Database reset successfully!")