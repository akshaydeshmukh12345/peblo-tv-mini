from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class Season(Base):
    __tablename__ = "seasons"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    show_id = Column(
        Integer,
        ForeignKey("shows.id"),
        nullable=False
    )

    show = relationship(
        "Show",
        back_populates="seasons"
    )

    episodes = relationship(
        "Episode",
        back_populates="season",
        cascade="all, delete-orphan"
    )