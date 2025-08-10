import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import { listSearchHistories } from "../../../graphql/queries";
import "./index.css";
import { useUser } from "../../../context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "../../../utils";

function AllSearchHistory() {
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [sortAsc, setSortAsc] = useState(false);
  const { user } = useUser();

  const toggleSort = () => setSortAsc((prev) => !prev);

  const sortedHistories = [...searchHistories].sort((a, b) => {
   const aTime = new Date(a.createdAt).getTime();
   const bTime = new Date(b.createdAt).getTime();
   return sortAsc ? aTime - bTime : bTime - aTime;
  });


  const fetchSearchHistories = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await API.graphql({
        query: listSearchHistories,
        variables: {
          filter: { brokerId: { eq: "none" } },
          limit: FETCH_LIMIT,
          nextToken,
        },
      });
      const { items, nextToken: newNextToken } =
        response.data.listSearchHistories;

      setSearchHistories((prev) => [...prev, ...items]);
      setNextToken(newNextToken);
      if (items.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(!!newNextToken);
      }
    } catch (error) {
      console.error("Error fetching search histories:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAgentSearchHistories = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await API.graphql({
        query: listSearchHistories,
        variables: {
          filter: { brokerId: { ne: "none" } },
          limit: FETCH_LIMIT,
          nextToken,
        },
      });
      const { items, nextToken: newNextToken } =
        response.data.listSearchHistories;
      if (items.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(!!newNextToken);
      }
      setSearchHistories((prev) => [...prev, ...items]);
      setNextToken(newNextToken);
    } catch (error) {
      console.error("Error fetching search histories:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetStateOnTabChange = () => {
    setHasMore(true);
    setLoading(false);
    setNextToken(null);
    setSearchHistories([]);
  };

  useEffect(() => {
    if (user?.attributes?.sub) {
      if (activeTab === "history") fetchSearchHistories();
      else fetchAgentSearchHistories();
    }
  }, [user, activeTab]);

  return (
    <div className="history-main-content">
      <div class="setting-page-title">
        <h1>Search History</h1>
      </div>
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("history");
          }}
        >
          Brokers
        </button>
        <button
          className={`tab-button ${activeTab === "agents" ? "active" : ""}`}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("agents");
          }}
        >
          Agents
        </button>
      </div>
      <div className="history-card">
        <table className="history-styled-table table-container">
          <thead>
            <tr>
              <th onClick={toggleSort} className="sortable-header">
                  Address <span className="sort-arrow">{sortAsc ? "▲" : "▼"}</span>
                  </th>
              <th onClick={toggleSort} className="sortable-header">
                  Status <span className="sort-arrow">{sortAsc ? "▲" : "▼"}</span>
              </th>
              <th onClick={toggleSort} className="sortableHeader">
                Time <span className="sort-arrow">{sortAsc ? "▲" : "▼"}</span>
              </th>
              <th>Name</th>
              <th>Download Link</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistories?.map((elem) => (
              <tr key={elem.id} id="broker-row-1">
                <td>{elem?.address}</td>
                <td> {elem?.status}</td>
                <td>{getFormattedDateTime(elem?.createdAt)}</td>
                <td>{elem.username}</td>
                <td>
                  {elem?.downloadLink ? (
                    <a href={elem.downloadLink} download>
                      Click to Download
                    </a>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {searchHistories?.length === 0 && <p>No Records found.</p>}
        {loading && <p>Loading...</p>}
        {!hasMore && <p>No more data to load.</p>}

        {searchHistories?.length > 0 && hasMore && !loading && (
          <button className="loadmore" onClick={fetchSearchHistories}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default AllSearchHistory;
