import { API } from "aws-amplify";
import { useState, useEffect, useCallback } from "react";
import { listSearchHistories } from "@/graphql/queries";
// import "./index.css";
import { useUser } from "@/context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "@/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";


function AllSearchHistory() {
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });
  const { user } = useUser();

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedHistories = [...searchHistories].sort((a, b) => {
    if (!a.hasOwnProperty(sortConfig.key) || !b.hasOwnProperty(sortConfig.key)) {
      return 0;
    }

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === "createdAt") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });


  const fetchSearchHistories = useCallback(async () => {
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
  }, [loading, hasMore, nextToken]);

  const fetchAgentSearchHistories = useCallback(async () => {
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
  }, [loading, hasMore, nextToken]);

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
  }, [user, activeTab, fetchSearchHistories, fetchAgentSearchHistories]);


const getSortArrow = (key) => {
  if (sortConfig.key !== key) {
    // Not the active column → show neutral icon
    return <ChevronsUpDown className="text-muted-tertiary" size={18} />;
  }

  // Active column → show up or down depending on direction
  return sortConfig.direction === "ascending" ? (
    <ChevronUp className="text-tertiary" size={18} />
  ) : (
    <ChevronDown className="text-tertiary" size={18} />
  );
};

  

  return (
    <>
    <div className="bg-[#F5F0EC] rounded-lg text-secondary" >


              <div className="space-x-3 mb-4" >
                <button 
                    className={` ${activeTab === "history" ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] " } transition-all  rounded-full px-10 py-3 `}
                        onClick={() => {
                            resetStateOnTabChange();
                            setActiveTab("history");
                        }}
                 >Brokers
                </button>
                <button
                   className={` ${activeTab === "agents" ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] " } transition-all  rounded-full px-10 py-3 `}
                      onClick={() => {
                            resetStateOnTabChange();
                            setActiveTab("agents");
                        }}
                >Agents
                </button>
            </div>


            <div className="bg-white !p-4 rounded-xl" >

            <Table className=""  >
              <TableHeader className="bg-[#F5F0EC]" >
                <TableRow>
                  <TableHead className="w-[100px]">Sr. No.</TableHead>
                  <TableHead onClick={() => requestSort("address")} > 
                    <p className="flex items-center gap-2" >
                      Address <span>{getSortArrow("address")}</span>
                    </p>
                  </TableHead>
                  <TableHead onClick={() => requestSort("createdAt")} >
                     <p className="flex items-center gap-2" >
                      Date / Time <span>{getSortArrow("createdAt")}</span>
                    </p>
                  </TableHead>
                  <TableHead onClick={() => requestSort("status")} >
                    <p className="flex items-center gap-2" >
                      Status <span>{getSortArrow("status")}</span>
                    </p>
                    </TableHead>
                  <TableHead>Name </TableHead>
                  <TableHead>Download Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  (sortedHistories?.length === 0 && !loading) ?
                  <TableRow >
                    <TableCell colSpan={6} className="font-medium text-center py-10">No Records found.</TableCell>
                  </TableRow>
                  :
                  sortedHistories?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>{getFormattedDateTime(item?.createdAt)}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell className="text-right">
                           {item?.downloadLink ? (
                              <a href={item.downloadLink} download>
                                Click to Download
                              </a>
                            ) : (
                              ""
                            )}
                      </TableCell>
                    </TableRow>
                  ))
                }

              </TableBody>
            </Table>

            {/* {searchHistories?.length === 0 && <p>No Records found.</p>} */}
            <div className="text-center space-y-2 my-4" >

              {loading && <p>Loading...</p>}
              {!hasMore && <p>No more data to load.</p>}

              {searchHistories?.length > 0 && hasMore && !loading && (
                <div className="flex justify-center" >
                <Button
                  // className="loadmore"
                  size="sm"
                  onClick={
                    activeTab === "history" ? fetchSearchHistories : fetchAgentSearchHistories
                  }
                >
                  Load More
                </Button>
                </div>
              )}
            </div>
          </div>

    </div>



    {/* <div className="history-main-content">
      <div className="setting-page-title">
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
              <th onClick={() => requestSort("address")} className="sortable-header">
                  Address <span className="sort-arrow">{getSortArrow("address")}</span>
                  </th>
              <th onClick={() => requestSort("status")} className="sortable-header">
                  Status <span className="sort-arrow">{getSortArrow("status")}</span>
              </th>
              <th onClick={() => requestSort("createdAt")} className="sortable-header">
                Time <span className="sort-arrow">{getSortArrow("createdAt")}</span>
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
          <button
            className="loadmore"
            onClick={
              activeTab === "history" ? fetchSearchHistories : fetchAgentSearchHistories
            }
          >
            Load More
          </button>
        )}
      </div>
    </div> */}

    </>
  );
}

export default AllSearchHistory;
