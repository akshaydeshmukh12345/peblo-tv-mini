from collections import defaultdict

from app.models.show import Show
from app.models.season import Season
from app.models.episode import Episode


def validate_catalogue(db):
    errors = []
    warnings = []

    shows = db.query(Show).all()

    for show in shows:

        if show.status == "published":

            if not show.section:
                errors.append({
                    "type": "show_validation",
                    "message": "Published show must have a section",
                    "show_id": show.id,
                })

            if not show.poster_url:
                warnings.append({
                    "type": "show_warning",
                    "message": "Published show has no poster",
                    "show_id": show.id,
                })

        seasons = (
            db.query(Season)
            .filter(Season.show_id == show.id)
            .all()
        )

        for season in seasons:

            episodes = (
                db.query(Episode)
                .filter(Episode.season_id == season.id)
                .all()
            )

            for episode in episodes:

                if episode.status == "published":

                    if not episode.duration or episode.duration <= 0:
                        errors.append({
                            "type": "episode_validation",
                            "message": "Published episode must have a valid duration",
                            "show_id": show.id,
                            "season_id": season.id,
                            "episode_id": episode.id,
                        })

                    if not episode.thumbnail_url:
                        errors.append({
                            "type": "episode_validation",
                            "message": "Published episode must have a thumbnail",
                            "show_id": show.id,
                            "season_id": season.id,
                            "episode_id": episode.id,
                        })

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
    }


def build_catalogue(db):
    published_shows = (
        db.query(Show)
        .filter(Show.status == "published")
        .order_by(Show.id)
        .all()
    )

    sections = defaultdict(list)

    for show in published_shows:

        show_data = {
            "id": show.id,
            "title": show.title,
            "description": show.description,
            "category": show.category,
            "section": show.section,
            "is_featured": show.is_featured,
            "poster_url": show.poster_url,
            "banner_url": show.banner_url,
            "seasons": [],
        }

        seasons = (
            db.query(Season)
            .filter(Season.show_id == show.id)
            .order_by(Season.season_number)
            .all()
        )

        for season in seasons:

            episodes = (
                db.query(Episode)
                .filter(
                    Episode.season_id == season.id,
                    Episode.status == "published",
                )
                .order_by(Episode.episode_number, Episode.id)
                .all()
            )

            # Season 0 is treated as trailers/specials
            season_type = (
                "trailers"
                if season.season_number == 0
                else "season"
            )

            grouped_episodes = {}

            for episode in episodes:

                group_key = (
                    episode.content_group
                    or f"episode-{episode.id}"
                )

                if group_key not in grouped_episodes:
                    grouped_episodes[group_key] = {
                        "content_group": episode.content_group,
                        "episode_number": episode.episode_number,
                        "title": episode.title,
                        "description": episode.description,
                        "duration": episode.duration,
                        "thumbnail_url": episode.thumbnail_url,
                        "languages": [],
                        "video_urls": {},
                    }

                grouped_episodes[group_key]["languages"].append(
                    episode.language
                )

                grouped_episodes[group_key]["video_urls"][
                    episode.language
                ] = episode.video_url

            show_data["seasons"].append({
                "id": season.id,
                "season_number": season.season_number,
                "title": season.title,
                "type": season_type,
                "episodes": list(grouped_episodes.values()),
            })

        sections[show.section or "Uncategorized"].append(
            show_data
        )

    return {
        "sections": [
            {
                "name": section_name,
                "shows": shows,
            }
            for section_name, shows in sorted(
                sections.items(),
                key=lambda item: item[0].lower(),
            )
        ]
    }