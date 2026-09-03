from pydantic import BaseModel, ConfigDict
from typing import Optional


class SeasonBase(BaseModel):
    season_number: int
    title: Optional[str] = None


class SeasonCreate(SeasonBase):
    pass


class SeasonUpdate(BaseModel):
    season_number: Optional[int] = None
    title: Optional[str] = None


class SeasonResponse(SeasonBase):
    id: int
    show_id: int

    model_config = ConfigDict(from_attributes=True)