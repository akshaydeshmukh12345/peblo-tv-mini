import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function Admin() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
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

      const response = await fetch(
        `${API_URL}/shows/`
      );

      const data = await response.json();

      setShows(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/shows/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create show"
        );
      }

      setFormData({
        title: "",
        description: "",
        genre: "",
        poster_url: "",
        video_url: "",
        is_featured: false,
      });

      fetchShows();

    } catch (error) {
      console.error(error);
      alert("Could not add show");
    }
  };

  const deleteShow = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this show?"
    );

    if (!confirmed) return;

    try {
      await fetch(
        `${API_URL}/shows/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchShows();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-container">

        <h1>
          PEBLO Admin Panel
        </h1>

        <form
          className="show-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="title"
            placeholder="Show title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="poster_url"
            placeholder="Poster URL"
            value={formData.poster_url}
            onChange={handleChange}
          />

          <input
            type="text"
            name="video_url"
            placeholder="Video URL"
            value={formData.video_url}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label className="checkbox-label">

            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />

            Featured Show

          </label>

          <button type="submit">
            Add Show
          </button>

        </form>

        <h2 className="admin-title">
          Manage Shows
        </h2>

        {loading ? (

          <p>
            Loading...
          </p>

        ) : (

          <div className="admin-show-list">

            {shows.map((show) => (

              <div
                className="admin-show-card"
                key={show.id}
              >

                <div>

                  <h3>
                    {show.title}
                  </h3>

                  <p>
                    {show.genre}
                  </p>

                </div>

                <button
                  onClick={() =>
                    deleteShow(show.id)
                  }
                  className="delete-button"
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Admin;