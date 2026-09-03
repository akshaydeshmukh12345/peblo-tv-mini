import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const [activePage, setActivePage] = useState("Home");

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

  const handleWatchNow = () => {
    if (shows.length > 0) {
      setSelectedShow(shows[0]);

      setTimeout(() => {
        document
          .getElementById("shows-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleNavigation = (page) => {
    setActivePage(page);

    if (page === "Home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      document
        .getElementById("shows-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredShows = shows.filter((show) => {
    if (activePage === "Movies") {
      return show.genre?.toLowerCase().includes("movie");
    }

    if (activePage === "TV Shows") {
      return !show.genre?.toLowerCase().includes("movie");
    }

    if (activePage === "My List") {
      return show.is_featured;
    }

    return true;
  });

  return (
    <div className="app">
      {/* NAVBAR */}

      <nav className="navbar">
        <h1 className="logo">PEBLO</h1>

        <div className="nav-links">
          <button
            className={activePage === "Home" ? "active" : ""}
            onClick={() => handleNavigation("Home")}
          >
            Home
          </button>

          <button
            className={activePage === "Movies" ? "active" : ""}
            onClick={() => handleNavigation("Movies")}
          >
            Movies
          </button>

          <button
            className={activePage === "TV Shows" ? "active" : ""}
            onClick={() => handleNavigation("TV Shows")}
          >
            TV Shows
          </button>

          <button
            className={activePage === "My List" ? "active" : ""}
            onClick={() => handleNavigation("My List")}
          >
            My List
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}

      <main className="hero">
        <div className="hero-content">
          <p className="tag">PEBLO ORIGINAL</p>

          <h2>Unlimited Entertainment</h2>

          <p className="hero-description">
            Discover amazing movies, TV shows and entertainment
            <br />
            all in one place.
          </p>

          <button className="watch-button" onClick={handleWatchNow}>
            ▶ Watch Now
          </button>
        </div>
      </main>

      {/* SHOWS SECTION */}

      <section className="shows" id="shows-section">
        <h2>
          {activePage === "Home"
            ? "Popular Shows"
            : activePage}
        </h2>

        {loading ? (
          <p className="status-message">
            Loading shows...
          </p>
        ) : filteredShows.length === 0 ? (
          <p className="status-message">
            No shows available in this category.
          </p>
        ) : (
          <div className="show-grid">
            {filteredShows.map((show) => (
              <div
                className="show-card"
                key={show.id}
                onClick={() => setSelectedShow(show)}
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
                </div>

                <div className="show-info">
                  <h3>{show.title}</h3>

                  <p className="genre">
                    {show.genre || "Entertainment"}
                  </p>

                  <p className="description">
                    {show.description ||
                      "No description available."}
                  </p>

                  {show.is_featured && (
                    <span className="featured">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SHOW DETAILS MODAL */}

      {selectedShow && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedShow(null)}
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="close-button"
              onClick={() => setSelectedShow(null)}
            >
              ×
            </button>

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

            <div className="modal-content">
              <h2>{selectedShow.title}</h2>

              <p className="modal-genre">
                {selectedShow.genre}
              </p>

              <p>
                {selectedShow.description}
              </p>

              {selectedShow.video_url && (
                <a
                  href={selectedShow.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="play-button"
                >
                  ▶ Play Now
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;