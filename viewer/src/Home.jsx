import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Home({ onWatchNow }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/shows/`);

        if (!response.ok) {
          throw new Error("Failed to fetch shows");
        }

        const data = await response.json();

        setShows(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Could not load shows from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const featuredShow =
    shows.find((show) => show.is_featured) || shows[0];

  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-content">
          <p className="hero-label">
            PEBLO ORIGINAL
          </p>

          <h1>
            {featuredShow
              ? featuredShow.title
              : "Unlimited Entertainment"}
          </h1>

          <p className="hero-description">
            {featuredShow
              ? featuredShow.description ||
                "Discover amazing movies, TV shows and entertainment all in one place."
              : "Discover amazing movies, TV shows and entertainment all in one place."}
          </p>

          {featuredShow && (
            <button
              className="watch-btn"
              onClick={() => onWatchNow(featuredShow)}
            >
              ▶ Watch Now
            </button>
          )}
        </div>

      </section>


      {/* SHOWS SECTION */}
      <section className="shows-section">

        <h2>Popular Shows</h2>

        {loading && (
          <p className="loading-text">
            Loading shows...
          </p>
        )}

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        {!loading && !error && shows.length === 0 && (
          <p className="loading-text">
            No shows available yet.
          </p>
        )}

        <div className="shows-grid">

          {shows.map((show) => (

            <div
              className="show-card"
              key={show.id}
              onClick={() => onWatchNow(show)}
            >

              <div className="poster-container">

                {show.poster_url ? (
                  <img
                    src={show.poster_url}
                    alt={show.title}
                    className="show-poster"
                  />
                ) : (
                  <div className="no-poster">
                    🎬
                  </div>
                )}

                {show.is_featured && (
                  <span className="featured-badge">
                    ★ Featured
                  </span>
                )}

              </div>

              <div className="show-details">

                <h3>
                  {show.title}
                </h3>

                <p className="show-genre">
                  {show.genre || "Entertainment"}
                </p>

                <p className="show-description">
                  {show.description ||
                    "No description available."}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Home;