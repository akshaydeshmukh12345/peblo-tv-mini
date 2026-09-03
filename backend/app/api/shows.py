from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.show import Show
from app.schemas.show import ShowCreate, ShowUpdate


router = APIRouter(
    prefix="/shows",
    tags=["Shows"]
)


@router.get("/")
def get_shows(db: Session = Depends(get_db)):
    return db.query(Show).all()


@router.get("/{show_id}")
def get_show_by_id(
    show_id: int,
    db: Session = Depends(get_db)
):
    show = db.query(Show).filter(
        Show.id == show_id
    ).first()

    if not show:
        raise HTTPException(
            status_code=404,
            detail="Show not found"
        )

    return show


@router.post("/")
def create_show(
    show: ShowCreate,
    db: Session = Depends(get_db)
):
    new_show = Show(
        title=show.title,
        description=show.description,
        genre=show.genre,
        poster_url=show.poster_url,
        video_url=show.video_url,
        is_featured=show.is_featured
    )

    db.add(new_show)
    db.commit()
    db.refresh(new_show)

    return new_show


@router.put("/{show_id}")
def update_show(
    show_id: int,
    updated_show: ShowUpdate,
    db: Session = Depends(get_db)
):
    show = db.query(Show).filter(
        Show.id == show_id
    ).first()

    if not show:
        raise HTTPException(
            status_code=404,
            detail="Show not found"
        )

    update_data = updated_show.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(show, key, value)

    db.commit()
    db.refresh(show)

    return show


@router.delete("/{show_id}")
def delete_show(
    show_id: int,
    db: Session = Depends(get_db)
):
    show = db.query(Show).filter(
        Show.id == show_id
    ).first()

    if not show:
        raise HTTPException(
            status_code=404,
            detail="Show not found"
        )

    db.delete(show)
    db.commit()

    return {
        "message": "Show deleted successfully"
    }