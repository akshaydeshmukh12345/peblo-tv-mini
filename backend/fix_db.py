from sqlalchemy import text
from app.db.database import engine

with engine.connect() as connection:
    connection.execute(
        text("""
            ALTER TABLE shows
            ADD COLUMN IF NOT EXISTS genre VARCHAR,
            ADD COLUMN IF NOT EXISTS poster_url VARCHAR,
            ADD COLUMN IF NOT EXISTS video_url VARCHAR,
            ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
        """)
    )
    connection.commit()

print("All missing columns added successfully!")