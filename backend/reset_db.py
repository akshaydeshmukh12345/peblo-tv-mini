from app.db.database import Base, engine, SessionLocal

# Import all models
from app.models.show import Show
from app.models.season import Season
from app.models.episode import Episode
from app.models.publish_run import PublishRun


print("Deleting old tables...")

Base.metadata.drop_all(bind=engine)


print("Creating new tables...")

Base.metadata.create_all(bind=engine)


print("Adding sample shows...")

db = SessionLocal()

try:
    shows = [
        Show(
            title="Breaking Bad",
            description="A chemistry teacher turns to a life of crime after receiving a life-changing diagnosis.",
            genre="Drama",
            poster_url="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
            is_featured=True,
        ),
        Show(
            title="Stranger Things",
            description="A group of friends discover mysterious events and supernatural forces in their town.",
            genre="Science Fiction",
            poster_url="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
            is_featured=False,
        ),
        Show(
            title="The Last Journey",
            description="An unforgettable adventure that takes a group of strangers across the world.",
            genre="Adventure",
            poster_url="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            is_featured=False,
        ),
        Show(
            title="Midnight Stories",
            description="Dark secrets and unexpected mysteries unfold after midnight.",
            genre="Thriller",
            poster_url="https://images.unsplash.com/photo-1485846234645-a62644f84728",
            is_featured=False,
        ),
        Show(
            title="Future City",
            description="A futuristic world where technology controls almost every part of human life.",
            genre="Science Fiction",
            poster_url="https://images.unsplash.com/photo-1519608487953-e999c86e7455",
            is_featured=True,
        ),
    ]

    db.add_all(shows)
    db.commit()

    print("Sample shows added successfully!")

finally:
    db.close()


print("Database reset successfully!")