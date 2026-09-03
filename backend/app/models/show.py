from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.db.database import Base


class Show(Base):
    __tablename__ = "shows"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(String)
    genre = Column(String)

    poster_url = Column(String)
    video_url = Column(String)

    is_featured = Column(Boolean, default=False)

    seasons = relationship(
        "Season",
        back_populates="show",
        cascade="all, delete-orphan"
    )