import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function Viewer() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const [activePage, setActivePage] = useState("Home");
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/shows/`);

      if (!response.ok) {
        throw new Error("Failed to fetch shows");
      }

      const data = await response.json();

      setShows(data);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setSelectedShow(null);

    if (page === "Home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setTimeout(() => {
        document
          .getElementById("shows-section")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    }
  };

  const toggleMyList = (show) => {
    const alreadyAdded = myList.some(
      (item) => item.id === show.id
    );

    if (alreadyAdded) {
      setMyList(
        myList.filter((item) => item.id !== show.id)
      );
    } else {
      setMyList([...myList, show]);
    }
  };

  const isInMyList = (showId) => {
    return myList.some(
      (item) => item.id === showId
    );
  };

  const handleWatchNow = () => {
    if (shows.length > 0) {
      setSelectedShow(shows[0]);
    }
  };

  const filteredShows = shows.filter((show) => {
    const genre = show.genre?.toLowerCase() || "";

    if (activePage === "Movies") {
      return (
        genre.includes("movie") ||
        genre.includes("film")
      );
    }

    if (activePage === "TV Shows") {
      return (
        !genre.includes("movie") &&
        !genre.includes("film")
      );
    }

    if (activePage === "My List") {
      return myList.some(
        (item) => item.id === show.id
      );
    }

    return true;
  });

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1
          className="logo"
          onClick={() => handleNavigation("Home")}
        >
          PEBLO
        </h1>

        <div className="nav-links">
          {["Home", "Movies", "TV Shows", "My List"].map(
            (page) => (
              <button
                key={page}
                className={
                  activePage === page
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleNavigation(page)
                }
              >
                {page}
              </button>
            )
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="hero">
        <div className="hero-content">
          <p className="tag">
            PEBLO ENTERTAINMENT
          </p>

          <h2>
            Discover Your Next
            <br />
            Favorite Show
          </h2>

          <p className="hero-description">
            Explore movies, TV shows and entertainment
            from the Peblo content library.
          </p>

          <button
            className="watch-button"
            onClick={handleWatchNow}
          >
            ▶ Explore Shows
          </button>
        </div>
      </main>

      {/* SHOWS SECTION */}
      <section
        className="shows"
        id="shows-section"
      >
        <div className="section-header">
          <h2>
            {activePage === "Home"
              ? "Popular Shows"
              : activePage}
          </h2>

          {activePage === "My List" && (
            <span className="list-count">
              {myList.length} saved
            </span>
          )}
        </div>

        {loading ? (
          <p className="status-message">
            Loading shows...
          </p>
        ) : filteredShows.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              🎬
            </div>

            <h3>
              {activePage === "My List"
                ? "Your list is empty"
                : "No shows available"}
            </h3>

            <p>
              {activePage === "My List"
                ? "Add shows to your list and access them here."
                : "No content available right now."}
            </p>
          </div>
        ) : (
          <div className="show-grid">
            {filteredShows.map((show) => (
              <div
                className="show-card"
                key={show.id}
                onClick={() =>
                  setSelectedShow(show)
                }
              >
                <div className="poster-container">

                  {show.poster_url ? (
                    <img
                      src={show.poster_url}
                      alt={show.title}
                      className="poster"
                    />
                  ) : (
                    <div className="poster-placeholder">
                      🎬
                    </div>
                  )}

                  {show.is_featured && (
                    <span className="featured-badge">
                      ★ Featured
                    </span>
                  )}

                  <button
                    className="list-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleMyList(show);
                    }}
                  >
                    {isInMyList(show.id)
                      ? "✓"
                      : "+"}
                  </button>
                </div>

                <div className="show-info">
                  <h3>
                    {show.title}
                  </h3>

                  <p className="genre">
                    {show.genre ||
                      "Entertainment"}
                  </p>

                  <p className="description">
                    {show.description ||
                      "No description available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SHOW DETAILS */}
      {selectedShow && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedShow(null)
          }
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="close-button"
              onClick={() =>
                setSelectedShow(null)
              }
            >
              ×
            </button>

            <div className="modal-image">
              {selectedShow.poster_url ? (
                <img
                  src={selectedShow.poster_url}
                  alt={selectedShow.title}
                  className="modal-poster"
                />
              ) : (
                <div className="modal-placeholder">
                  🎬
                </div>
              )}
            </div>

            <div className="modal-content">

              <p className="modal-genre">
                {selectedShow.genre ||
                  "Entertainment"}
              </p>

              <h2>
                {selectedShow.title}
              </h2>

              <p className="modal-description">
                {selectedShow.description ||
                  "No description available for this show."}
              </p>

              {selectedShow.is_featured && (
                <div className="featured-status">
                  ★ Featured Content
                </div>
              )}

              <div className="modal-actions">

                {selectedShow.video_url && (
                  <a
                    href={selectedShow.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="play-button"
                  >
                    ▶ Play
                  </a>
                )}

                <button
                  className="modal-list-button"
                  onClick={() =>
                    toggleMyList(selectedShow)
                  }
                >
                  {isInMyList(selectedShow.id)
                    ? "✓ Remove from My List"
                    : "+ Add to My List"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Viewer;