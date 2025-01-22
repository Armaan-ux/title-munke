import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import { listSearchHistories } from "../../../graphql/queries";
import "./index.css";
import axios from "axios";
import { updateSearchHistory } from "../../../graphql/mutations";
import { useUser } from "../../../context/usercontext";

function History() {
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [inProgressSearches, setInProgressSearches] = useState([]);
  const user = useUser();

  const fetchSearchHistories = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await API.graphql({
        query: listSearchHistories,
        variables: {
          filter: { userId: { eq: user?.attributes?.sub } },
          limit: 10,
          nextToken,
        },
      });
      const { items, nextToken: newNextToken } =
        response.data.listSearchHistories;

      setSearchHistories((prev) => [...prev, ...items]);
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);

      const inProgress = items.filter((item) => item.status === "In Progress");
      setInProgressSearches((prev) => [...prev, ...inProgress]);
    } catch (error) {
      console.error("Error fetching search histories:", error);
    }
    setLoading(false);
  };

  const checkSearchStatus = async (searchId, id) => {
    try {
      const response = await axios.post(
        "https://hwk77cjbdtmopznce6tneqknvi0rqvta.lambda-url.us-east-1.on.aws/",
        {
          mode: "CHECK_STATUS",
          search_id: searchId,
        }
      );

      const { status, zip_url } = response.data;

      if (status === "SUCCESS") {
        await API.graphql({
          query: updateSearchHistory,
          variables: {
            input: {
              id,
              searchId,
              status: "SUCCESS",
              downloadLink: zip_url,
            },
          },
        });

        setSearchHistories((prev) =>
          prev.map((record) =>
            record.searchId === searchId
              ? { ...record, status: "SUCCESS", downloadLink: zip_url }
              : record
          )
        );

        setInProgressSearches((prev) =>
          prev.filter((record) => record.searchId !== searchId)
        );
      }
    } catch (error) {
      console.error(`Error checking status for ${searchId}:`, error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      inProgressSearches.forEach((search) => {
        checkSearchStatus(search.searchId, search.id);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [inProgressSearches]);

  useEffect(() => {
    if (user) fetchSearchHistories();
  }, [user]);

  return (
    <div className="history-main-content">
      <div class="setting-page-title">
        <h1>Search History</h1>
      </div>
      <div className="history-card">
        <table className="history-styled-table table-container">
          <thead>
            <tr>
              <th>Search ID</th>
              <th>Status</th>
              <th>Time</th>
              <th>Download Link</th>
            </tr>
          </thead>
          <tbody>
            {searchHistories?.map((elem) => (
              <tr key={elem.id} id="broker-row-1">
                <td>{elem?.searchId}</td>
                <td> {elem?.status}</td>
                <td>{elem?.createdAt}</td>
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

        {loading && <p>Loading...</p>}
        {!hasMore && <p>No more data to load.</p>}

        {hasMore && !loading && (
          <button className="loadmore" onClick={fetchSearchHistories}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default History;
