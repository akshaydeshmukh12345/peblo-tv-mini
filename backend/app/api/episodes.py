from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.show import Show
from app.models.season import Season
from app.models.episode import Episode
from app.schemas.episode import (
    EpisodeCreate,
    EpisodeUpdate,
    EpisodeResponse,
)

router = APIRouter(
    prefix="/shows/{show_id}/seasons/{season_id}/episodes",
    tags=["Episodes"],
)


def get_valid_season(
    show_id: int,
    season_id: int,
    db: Session,
):
    show = (
        db.query(Show)
        .filter(Show.id == show_id)
        .first()
    )

    if not show:
        raise HTTPException(
            status_code=404,
            detail="Show not found",
        )

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


def validate_episode_data(
    episode_data,
    season_id: int,
    db: Session,
    episode_id: int | None = None,
):
    """
    Validate episode before create/update.
    """

    # Published episode requirements
    if episode_data.status == "published":

        if not episode_data.duration:
            raise HTTPException(
                status_code=400,
                detail="Published episode must have a duration",
            )

        if episode_data.duration <= 0:
            raise HTTPException(
                status_code=400,
                detail="Episode duration must be greater than 0",
            )

        if not episode_data.thumbnail_url:
            raise HTTPException(
                status_code=400,
                detail="Published episode must have a thumbnail",
            )

    # Duplicate content_group + language validation
    if episode_data.content_group:

        query = (
            db.query(Episode)
            .filter(
                Episode.season_id == season_id,
                Episode.content_group == episode_data.content_group,
                Episode.language == episode_data.language,
            )
        )

        # Ignore current episode during update
        if episode_id is not None:
            query = query.filter(
                Episode.id != episode_id
            )

        existing_episode = query.first()

        if existing_episode:
            raise HTTPException(
                status_code=400,
                detail=(
                    "An episode with the same content_group "
                    "and language already exists in this season"
                ),
            )


@router.get("/", response_model=list[EpisodeResponse])
def get_episodes(
    show_id: int,
    season_id: int,
    db: Session = Depends(get_db),
):
    get_valid_season(
        show_id,
        season_id,
        db,
    )

    return (
        db.query(Episode)
        .filter(Episode.season_id == season_id)
        .order_by(Episode.episode_number)
        .all()
    )


@router.post("/", response_model=EpisodeResponse)
def create_episode(
    show_id: int,
    season_id: int,
    episode: EpisodeCreate,
    db: Session = Depends(get_db),
):
    get_valid_season(
        show_id,
        season_id,
        db,
    )

    validate_episode_data(
        episode,
        season_id,
        db,
    )

    new_episode = Episode(
        season_id=season_id,
        **episode.model_dump(),
    )

    db.add(new_episode)
    db.commit()
    db.refresh(new_episode)

    return new_episode


@router.get("/{episode_id}", response_model=EpisodeResponse)
def get_episode(
    show_id: int,
    season_id: int,
    episode_id: int,
    db: Session = Depends(get_db),
):
    get_valid_season(
        show_id,
        season_id,
        db,
    )

    episode = (
        db.query(Episode)
        .filter(
            Episode.id == episode_id,
            Episode.season_id == season_id,
        )
        .first()
    )

    if not episode:
        raise HTTPException(
            status_code=404,
            detail="Episode not found",
        )

    return episode


@router.put("/{episode_id}", response_model=EpisodeResponse)
def update_episode(
    show_id: int,
    season_id: int,
    episode_id: int,
    episode_data: EpisodeUpdate,
    db: Session = Depends(get_db),
):
    get_valid_season(
        show_id,
        season_id,
        db,
    )

    episode = (
        db.query(Episode)
        .filter(
            Episode.id == episode_id,
            Episode.season_id == season_id,
        )
        .first()
    )

    if not episode:
        raise HTTPException(
            status_code=404,
            detail="Episode not found",
        )

    # Merge existing data with update data
    updated_values = episode_data.model_dump(
        exclude_unset=True
    )

    merged_data = {
        "episode_number": updated_values.get(
            "episode_number",
            episode.episode_number,
        ),
        "title": updated_values.get(
            "title",
            episode.title,
        ),
        "description": updated_values.get(
            "description",
            episode.description,
        ),
        "duration": updated_values.get(
            "duration",
            episode.duration,
        ),
        "language": updated_values.get(
            "language",
            episode.language,
        ),
        "content_group": updated_values.get(
            "content_group",
            episode.content_group,
        ),
        "video_url": updated_values.get(
            "video_url",
            episode.video_url,
        ),
        "thumbnail_url": updated_values.get(
            "thumbnail_url",
            episode.thumbnail_url,
        ),
        "status": updated_values.get(
            "status",
            episode.status,
        ),
    }

    # Temporary object for validation
    class EpisodeData:
        pass

    validation_data = EpisodeData()

    for key, value in merged_data.items():
        setattr(validation_data, key, value)

    validate_episode_data(
        validation_data,
        season_id,
        db,
        episode_id,
    )

    # Apply update
    for key, value in updated_values.items():
        setattr(episode, key, value)

    db.commit()
    db.refresh(episode)

    return episode


@router.delete("/{episode_id}")
def delete_episode(
    show_id: int,
    season_id: int,
    episode_id: int,
    db: Session = Depends(get_db),
):
    get_valid_season(
        show_id,
        season_id,
        db,
    )

    episode = (
        db.query(Episode)
        .filter(
            Episode.id == episode_id,
            Episode.season_id == season_id,
        )
        .first()
    )

    if not episode:
        raise HTTPException(
            status_code=404,
            detail="Episode not found",
        )

    db.delete(episode)
    db.commit()

    return {
        "message": "Episode deleted successfully"
    }