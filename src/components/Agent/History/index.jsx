import { API } from "aws-amplify";
import { useState, useEffect, useCallback } from "react";
import { listSearchHistories } from "../../../graphql/queries";
import "./index.css";
import axios from "axios";
import { updateSearchHistory } from "../../../graphql/mutations";
import { useUser } from "../../../context/usercontext";
import {
  FETCH_LIMIT,
  getFormattedDateTime,
  handleCreateAuditLog,
  INTERVALTIME,
} from "../../../utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function History() {
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [inProgressSearches, setInProgressSearches] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });
  const { user } = useUser();

  const fetchSearchHistories = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await API.graphql({
        query: listSearchHistories,
        variables: {
          filter: { brokerId: { eq: user?.attributes?.sub } },
          limit: FETCH_LIMIT,
          nextToken,
        },
      });

      const { items, nextToken: newNextToken } = response.data.listSearchHistories;

      setSearchHistories((prev) => [...prev, ...items]);
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);

      const inProgress = items.filter((item) => item.status === "In Progress");
      setInProgressSearches((prev) => [...prev, ...inProgress]);
    } catch (error) {
      console.error("Error fetching agent search histories:", error);
    }
    setLoading(false);
  }, [loading, hasMore, nextToken, user]);

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
    inProgressSearches.forEach((search) => {
      checkSearchStatus(search.searchId, search.id);
    });
    const interval = setInterval(() => {
      inProgressSearches.forEach((search) => {
        checkSearchStatus(search.searchId, search.id);
      });
    }, INTERVALTIME);

    return () => clearInterval(interval);
  }, [inProgressSearches]);

  useEffect(() => {
    if (user?.attributes?.sub) fetchSearchHistories();
  }, [user, fetchSearchHistories]);

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

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) {
      return "";
    }
    return sortConfig.direction === "ascending" ? "▲" : "▼";
  };

  return (


      
        <div className="bg-white !p-4 rounded-xl" >

            <Table className=""  >
              <TableHeader className="bg-[#F5F0EC]" >
                <TableRow>
                  <TableHead className="w-[100px]">Sr. No.</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Download Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  sortedHistories?.length === 0 ?
                  <TableRow >
                    <TableCell colSpan={5} className="font-medium text-center py-10">No Records found.</TableCell>
                  </TableRow>
                  :
                  sortedHistories?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>{getFormattedDateTime(item?.createdAt)}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{}</TableCell>
                      <TableCell className="text-right">
                        {/* <a href={item.downloadLink} download>Download</a> */}
                          {item?.downloadLink ? (
                          <a
                            href={item.downloadLink}
                              download
                                onClick={() =>
                                  handleCreateAuditLog(
                                    "DOWNLOAD",
                                    { zipUrl: item.downloadLink },
                                    true
                                  )
                                }
                            >
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
          </div>
     
    // <div className="history-main-content">
    //   <div className="setting-page-title">
    //     <h1>Search History</h1>
    //   </div>
    //   <div className="history-card">
    //     <table className="history-styled-table table-container">
    //       <thead>
    //         <tr>
    //           <th onClick={() => requestSort("address")} className="sortable-header">
    //               Address <span className="sort-arrow">{getSortArrow("address")}</span>
    //               </th>
    //           <th onClick={() => requestSort("status")} className="sortable-header">
    //               Status <span className="sort-arrow">{getSortArrow("status")}</span>
    //           </th>
    //           <th onClick={() => requestSort("createdAt")} className="sortable-header">
    //             Time <span className="sort-arrow">{getSortArrow("createdAt")}</span>
    //           </th>
    //           <th>Download Link</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {sortedHistories.map((elem) => (
    //           <tr key={elem.id}>
    //             <td>{elem?.address}</td>
    //             <td>{elem?.status}</td>
    //             <td>{getFormattedDateTime(elem?.createdAt)}</td>
    //             <td>
    //               {elem?.downloadLink ? (
    //                 <a
    //                   href={elem.downloadLink}
    //                   download
    //                   onClick={() =>
    //                     handleCreateAuditLog(
    //                       "DOWNLOAD",
    //                       { zipUrl: elem.downloadLink },
    //                       true
    //                     )
    //                   }
    //                 >
    //                   Click to Download
    //                 </a>
    //               ) : (
    //                 ""
    //               )}
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>

    //     {searchHistories.length === 0 && <p>No Records found.</p>}
    //     {loading && <p>Loading...</p>}
    //     {!hasMore && <p>No more data to load.</p>}

    //     {searchHistories.length > 0 && hasMore && !loading && (
    //       <button className="loadmore" onClick={fetchSearchHistories}>
    //         Load More
    //       </button>
    //     )}
    //   </div>
    // </div>
  );
}

export default History;
