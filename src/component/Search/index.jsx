import "./index.css";
function Search() {
  return (
    <div className="main-content">
      <div className="card">
        <h2 className="card-title">Search Address</h2>
        <div className="search-field-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">Search</button>
        </div>
      </div>
    </div>
  );
}

export default Search;
