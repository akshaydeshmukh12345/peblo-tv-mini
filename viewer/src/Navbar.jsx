function Navbar({ activePage, onNavigate }) {
  const navItems = ["Home", "Movies", "TV Shows", "My List"];

  return (
    <nav className="navbar">
      <h1 className="logo">PEBLO</h1>

      <div className="nav-links">
        {navItems.map((item) => (
          <button
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => onNavigate(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
