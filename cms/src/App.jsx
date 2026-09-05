import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [message, setMessage] = useState("");

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
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Title is required.");
      return;
    }

    try {
      setMessage("Adding show...");

      const newShow = {
        title: title,
        genre: genre,
        description: description,
        poster_url: posterUrl || null,
        video_url: videoUrl || null,
        is_featured: isFeatured,
      };

      const response = await fetch(`${API_URL}/shows/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newShow),
      });

      if (!response.ok) {
        throw new Error("Failed to add show");
      }

      setTitle("");
      setGenre("");
      setDescription("");
      setPosterUrl("");
      setVideoUrl("");
      setIsFeatured(false);

      setMessage("Show added successfully!");

      fetchShows();
    } catch (error) {
      console.error(error);
      setMessage("Error adding show. Check backend.");
    }
  };

  const deleteShow = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this show?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/shows/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete show");
      }

      setMessage("Show deleted successfully!");

      fetchShows();
    } catch (error) {
      console.error(error);
      setMessage("Error deleting show.");
    }
  };

  return (
    <div className="app">
      <header className="cms-header">
        <div>
          <p className="eyebrow">PEBLO CMS</p>

          <h1>Content Management</h1>

          <p>
            Manage movies and TV shows from one place.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchShows}
        >
          ↻ Refresh
        </button>
      </header>

      <main className="cms-container">

        <section className="form-card">
          <h2>Add New Show</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Title *</label>

              <input
                type="text"
                placeholder="Enter show title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Genre</label>

              <input
                type="text"
                placeholder="Drama, Movie, Action..."
                value={genre}
                onChange={(event) =>
                  setGenre(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                placeholder="Enter show description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Poster Image URL</label>

              <input
                type="text"
                placeholder="https://example.com/poster.jpg"
                value={posterUrl}
                onChange={(event) =>
                  setPosterUrl(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Video URL</label>

              <input
                type="text"
                placeholder="https://example.com/video"
                value={videoUrl}
                onChange={(event) =>
                  setVideoUrl(event.target.value)
                }
              />
            </div>

            <label className="checkbox-group">

              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) =>
                  setIsFeatured(event.target.checked)
                }
              />

              <span>Mark as Featured</span>

            </label>

            <button
              type="submit"
              className="add-button"
            >
              Add Show
            </button>

          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}

        </section>

        <section className="shows-card">

          <div className="shows-header">

            <div>
              <p className="eyebrow">
                LIBRARY
              </p>

              <h2>Manage Shows</h2>
            </div>

            <span className="count">
              {shows.length} Shows
            </span>

          </div>

          {loading ? (

            <p className="status">
              Loading shows...
            </p>

          ) : shows.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🎬
              </div>

              <h3>No shows yet</h3>

              <p>
                Add your first show using the form.
              </p>

            </div>

          ) : (

            <div className="show-list">

              {shows.map((show) => (

                <div
                  className="show-item"
                  key={show.id}
                >

                  {show.poster_url ? (

                    <img
                      src={show.poster_url}
                      alt={show.title}
                      className="show-poster"
                    />

                  ) : (

                    <div className="poster-placeholder">
                      🎬
                    </div>

                  )}

                  <div className="show-details">

                    <div className="show-title-row">

                      <h3>
                        {show.title}
                      </h3>

                      {show.is_featured && (
                        <span className="featured-badge">
                          ★ Featured
                        </span>
                      )}

                    </div>

                    <p className="show-genre">
                      {show.genre || "Entertainment"}
                    </p>

                    <p className="show-description">
                      {show.description ||
                        "No description available."}
                    </p>

                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteShow(show.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>
    </div>
  );
}

export default App;