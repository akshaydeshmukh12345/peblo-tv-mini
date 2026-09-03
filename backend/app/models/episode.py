from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class Episode(Base):
    __tablename__ = "episodes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(String)

    episode_number = Column(Integer)

    video_url = Column(String)

    season_id = Column(
        Integer,
        ForeignKey("seasons.id"),
        nullable=False
    )

    season = relationship(
        "Season",
        back_populates="episodes"
    )