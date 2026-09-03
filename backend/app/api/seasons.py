from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.show import Show
from app.models.season import Season
from app.schemas.season import (
    SeasonCreate,
    SeasonUpdate,
    SeasonResponse,
)

router = APIRouter(
    prefix="/shows/{show_id}/seasons",
    tags=["Seasons"],
)


@router.get("/", response_model=list[SeasonResponse])
def get_seasons(
    show_id: int,
    db: Session = Depends(get_db),
):
    show = db.query(Show).filter(Show.id == show_id).first()

    if not show:
        raise HTTPException(
            status_code=404,
            detail="Show not found",
        )

    return (
        db.query(Season)
        .filter(Season.show_id == show_id)
        .order_by(Season.season_number)
        .all()
    )


@router.post("/", response_model=SeasonResponse)
def create_season(
    show_id: int,
    season: SeasonCreate,
    db: Session = Depends(get_db),
):
    show = db.query(Show).filter(Show.id == show_id).first()

    if not show:
        raise HTTPException(
            status_code=404,
            detail="Show not found",
        )

    existing_season = (
        db.query(Season)
        .filter(
            Season.show_id == show_id,
            Season.season_number == season.season_number,
        )
        .first()
    )

    if existing_season:
        raise HTTPException(
            status_code=400,
            detail="Season number already exists for this show",
        )

    new_season = Season(
        show_id=show_id,
        **season.model_dump(),
    )

    db.add(new_season)
    db.commit()
    db.refresh(new_season)

    return new_season


@router.get("/{season_id}", response_model=SeasonResponse)
def get_season(
    show_id: int,
    season_id: int,
    db: Session = Depends(get_db),
):
    season = (
        db.query(Season)
        .filter(
            Season.id == season_id,
            Season.show_id == show_id,
        )
        .first()
    )

    if not season:
        raise HTTPException(
            status_code=404,
            detail="Season not found",
        )

    return season


@router.put("/{season_id}", response_model=SeasonResponse)
def update_season(
    show_id: int,
    season_id: int,
    season_data: SeasonUpdate,
    db: Session = Depends(get_db),
):
    season = (
        db.query(Season)
        .filter(
            Season.id == season_id,
            Season.show_id == show_id,
        )
        .first()
    )

    if not season:
        raise HTTPException(
            status_code=404,
            detail="Season not found",
        )

    update_data = season_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(season, key, value)

    db.commit()
    db.refresh(season)

    return season


@router.delete("/{season_id}")
def delete_season(
    show_id: int,
    season_id: int,
    db: Session = Depends(get_db),
):
    season = (
        db.query(Season)
        .filter(
            Season.id == season_id,
            Season.show_id == show_id,
        )
        .first()
    )

    if not season:
        raise HTTPException(
            status_code=404,
            detail="Season not found",
        )

    db.delete(season)
    db.commit()

    return {
        "message": "Season deleted successfully"
    }