import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.publish_run import PublishRun
from app.services.catalogue import (
    validate_catalogue,
    build_catalogue,
)

router = APIRouter(
    prefix="/admin/catalog",
    tags=["Catalog"],
)


@router.post("/validate")
def validate_catalog(
    db: Session = Depends(get_db),
):
    return validate_catalogue(db)


@router.post("/publish")
def publish_catalog(
    db: Session = Depends(get_db),
):
    validation = validate_catalogue(db)

    if not validation["valid"]:

        publish_run = PublishRun(
            status="failed",
            validation_report=json.dumps(validation),
        )

        db.add(publish_run)
        db.commit()
        db.refresh(publish_run)

        raise HTTPException(
            status_code=400,
            detail={
                "message": "Catalogue validation failed",
                "publish_run_id": publish_run.id,
                "validation": validation,
            },
        )

    catalogue = build_catalogue(db)

    publish_run = PublishRun(
        status="success",
        validation_report=json.dumps(validation),
    )

    db.add(publish_run)
    db.commit()
    db.refresh(publish_run)

    return {
        "message": "Catalogue published successfully",
        "publish_run_id": publish_run.id,
        "catalogue": catalogue,
    }


@router.get("/latest")
def get_latest_catalogue(
    db: Session = Depends(get_db),
):
    validation = validate_catalogue(db)

    if not validation["valid"]:
        raise HTTPException(
            status_code=400,
            detail="Catalogue currently has validation errors",
        )

    return build_catalogue(db)


@router.get("/publish-runs")
def get_publish_runs(
    db: Session = Depends(get_db),
):
    return (
        db.query(PublishRun)
        .order_by(PublishRun.id.desc())
        .all()
    )