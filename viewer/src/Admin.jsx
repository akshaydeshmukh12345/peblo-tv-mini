import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function Admin() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingShow, setEditingShow] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    poster_url: "",
    video_url: "",
    is_featured: false,
  });

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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      genre: "",
      description: "",
      poster_url: "",
      video_url: "",
      is_featured: false,
    });

    setEditingShow(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = editingShow
        ? `${API_URL}/shows/${editingShow.id}`
        : `${API_URL}/shows/`;

      const method = editingShow
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        console.error(
          "Backend error:",
          errorData
        );

        throw new Error(
          "Failed to save show"
        );
      }

      await fetchShows();

      resetForm();

      alert(
        editingShow
          ? "Show updated successfully!"
          : "Show added successfully!"
      );
    } catch (error) {
      console.error(
        "Error saving show:",
        error
      );

      alert(
        "Error saving show. Check backend."
      );
    }
  };

  const handleEdit = (show) => {
    setEditingShow(show);

    setFormData({
      title: show.title || "",
      genre: show.genre || "",
      description:
        show.description || "",
      poster_url:
        show.poster_url || "",
      video_url:
        show.video_url || "",
      is_featured:
        show.is_featured || false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (show) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${show.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/shows/${show.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete show"
        );
      }

      await fetchShows();

      if (
        editingShow &&
        editingShow.id === show.id
      ) {
        resetForm();
      }

      alert(
        "Show deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Error deleting show:",
        error
      );

      alert(
        "Error deleting show."
      );
    }
  };

  const handleFeaturedToggle = async (
    show
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/shows/${show.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            is_featured:
              !show.is_featured,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update featured status"
        );
      }

      await fetchShows();
    } catch (error) {
      console.error(
        "Error updating featured status:",
        error
      );

      alert(
        "Could not update featured status."
      );
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">

        <div>
          <p className="admin-tag">
            PEBLO CMS
          </p>

          <h1>
            Content Management
          </h1>

          <p>
            Manage movies and TV shows from
            one place.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchShows}
        >
          ↻ Refresh
        </button>

      </div>

      <div className="admin-layout">

        {/* FORM */}
        <div className="admin-form-card">

          <h2>
            {editingShow
              ? "Edit Show"
              : "Add New Show"}
          </h2>

          <form
            onSubmit={handleSubmit}
          >

            <label>
              Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter show title"
              required
            />

            <label>
              Genre
            </label>

            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Movie, Drama, Thriller..."
            />

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter show description"
              rows="5"
            />

            <label>
              Poster Image URL
            </label>

            <input
              type="text"
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
              placeholder="https://example.com/poster.jpg"
            />

            <label>
              Video URL
            </label>

            <input
              type="text"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="https://example.com/video"
            />

            <label className="featured-checkbox">

              <input
                type="checkbox"
                name="is_featured"
                checked={
                  formData.is_featured
                }
                onChange={handleChange}
              />

              <span>
                Mark as Featured
              </span>

            </label>

            <div className="form-actions">

              <button
                type="submit"
                className="add-show-button"
              >
                {editingShow
                  ? "Update Show"
                  : "Add Show"}
              </button>

              {editingShow && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* SHOW LIBRARY */}
        <div className="admin-library">

          <div className="library-header">

            <div>
              <p className="admin-tag">
                LIBRARY
              </p>

              <h2>
                Manage Shows
              </h2>
            </div>

            <span className="show-count">
              {shows.length} Shows
            </span>

          </div>

          {loading ? (

            <p className="status-message">
              Loading shows...
            </p>

          ) : shows.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🎬
              </div>

              <h3>
                No shows yet
              </h3>

              <p>
                Add your first show using
                the form.
              </p>

            </div>

          ) : (

            <div className="admin-show-list">

              {shows.map((show) => (

                <div
                  className="admin-show-card"
                  key={show.id}
                >

                  <div className="admin-poster">

                    {show.poster_url ? (

                      <img
                        src={show.poster_url}
                        alt={show.title}
                      />

                    ) : (

                      <div className="poster-placeholder">
                        🎬
                      </div>

                    )}

                  </div>

                  <div className="admin-show-info">

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

                    <p className="genre">
                      {show.genre ||
                        "Entertainment"}
                    </p>

                    <p className="description">
                      {show.description ||
                        "No description available."}
                    </p>

                  </div>

                  <div className="admin-actions">

                    <button
                      className="featured-toggle"
                      onClick={() =>
                        handleFeaturedToggle(
                          show
                        )
                      }
                    >
                      {show.is_featured
                        ? "★ Unfeature"
                        : "☆ Feature"}
                    </button>

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(show)
                      }
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(show)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Admin;