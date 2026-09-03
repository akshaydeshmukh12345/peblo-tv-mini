from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class PublishRun(Base):
    __tablename__ = "publish_runs"

    id = Column(Integer, primary_key=True, index=True)

    status = Column(String, default="pending")

    show_id = Column(
        Integer,
        ForeignKey("shows.id"),
        nullable=False
    )

    show = relationship("Show")