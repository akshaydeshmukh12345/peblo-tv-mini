from pydantic import BaseModel
from typing import Optional


class ShowCreate(BaseModel):
    title: str
    genre: Optional[str] = None
    description: Optional[str] = None
    poster_url: Optional[str] = None
    video_url: Optional[str] = None
    is_featured: bool = False


class ShowUpdate(BaseModel):
    title: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    poster_url: Optional[str] = None
    video_url: Optional[str] = None
    is_featured: Optional[bool] = None


class ShowResponse(BaseModel):
    id: int
    title: str
    genre: Optional[str] = None
    description: Optional[str] = None
    poster_url: Optional[str] = None
    video_url: Optional[str] = None
    is_featured: bool

    class Config:
        from_attributes = True