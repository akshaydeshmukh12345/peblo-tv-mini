from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class ValidationIssue(BaseModel):
    type: str
    message: str
    show_id: Optional[int] = None
    season_id: Optional[int] = None
    episode_id: Optional[int] = None


class ValidationReport(BaseModel):
    valid: bool
    errors: list[ValidationIssue] = []
    warnings: list[ValidationIssue] = []


class PublishRunResponse(BaseModel):
    id: int
    status: str
    validation_report: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublishResponse(BaseModel):
    message: str
    publish_run_id: int
    catalogue: dict[str, Any]