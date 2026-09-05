import { useState } from "react";
import Viewer from "./Viewer.jsx";
import Admin from "./Admin.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("viewer");

  return (
    <>
      <div className="top-switch">
        <button
          className={
            currentPage === "viewer"
              ? "switch-active"
              : ""
          }
          onClick={() => setCurrentPage("viewer")}
        >
          Viewer
        </button>

        <button
          className={
            currentPage === "admin"
              ? "switch-active"
              : ""
          }
          onClick={() => setCurrentPage("admin")}
        >
          Admin
        </button>
      </div>

      {currentPage === "viewer" ? <Viewer /> : <Admin />}
    </>
  );
}

export default App;