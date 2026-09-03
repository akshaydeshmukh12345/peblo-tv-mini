from pydantic import BaseModel, ConfigDict
from typing import Optional


class EpisodeBase(BaseModel):
    episode_number: int
    title: str
    description: Optional[str] = None
    duration: Optional[int] = None
    language: str = "English"
    content_group: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str = "draft"


class EpisodeCreate(EpisodeBase):
    pass


class EpisodeUpdate(BaseModel):
    episode_number: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    language: Optional[str] = None
    content_group: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: Optional[str] = None


class EpisodeResponse(EpisodeBase):
    id: int
    season_id: int

    model_config = ConfigDict(from_attributes=True)