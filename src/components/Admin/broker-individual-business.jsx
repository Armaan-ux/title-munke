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
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Eye,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function BrokerIndividualBusiness({ activeTab, onRegisterReset }) {
  const navigate = useNavigate();
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  // const [activeTab, setActiveTab] = useState("history");
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
    if (
      !a.hasOwnProperty(sortConfig.key) ||
      !b.hasOwnProperty(sortConfig.key)
    ) {
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
    if (onRegisterReset) {
      onRegisterReset(resetStateOnTabChange);
    }
  }, [onRegisterReset]);
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

  const sortedIndividual = [
    { id: 1, name: "John Doe", searchProperty: "5", business: "$200" },
    { id: 2, name: "Jane Smith", searchProperty: "3", business: "$150" },
    { id: 3, name: "Mike Johnson", searchProperty: "8", business: "$300" },
  ];
  const sortedBrokers = [
    {
      id: 1,
      address: "Broker A",
      createdAt: "2024-06-10T14:30:00Z",
      status: "Active",
      name: "brokerA",
      downloadLink: "#",
      agent: "5",
      search: "11",
      business: "$2200",
      lastActivity: "2024-06-10 14:30",
    },
    {
      id: 2,
      address: "Broker B",
      createdAt: "2024-06-09T10:15:00Z",
      status: "Inactive",
      name: "brokerB",
      downloadLink: "#",
      agent: "6",
      search: "112",
      business: "$2500",
      lastActivity: "2024-06-10 14:30",
    },
    {
      id: 3,
      address: "Broker C",
      createdAt: "2024-06-08T09:00:00Z",
      status: "Active",
      name: "brokerC",
      downloadLink: "#",
      agent: "10",
      search: "121",
      business: "$200",
      lastActivity: "2024-06-10 14:30",
    },
  ];

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          {activeTab === "history" ? (
            <Table className="w-full">
              <TableHeader className="bg-[#F5F0EC] w-full">
                <TableRow className="w-full">
                  <TableHead >Sr. No.</TableHead>
                  <TableHead onClick={() => requestSort("address")}>
                    Broker Name
                    {/* <p className="flex items-center gap-2">
                      Broker Name<span>{getSortArrow("address")}</span>
                    </p> */}
                  </TableHead>
                  <TableHead className="text-center" onClick={() => requestSort("createdAt")}>
                    Agent
                    {/* <p className="flex items-center justify-center gap-2">
                      Agent <span>{getSortArrow("createdAt")}</span>
                    </p> */}
                  </TableHead>
                  <TableHead className="text-center" onClick={() => requestSort("status")}>
                    Search Count
                    {/* <p className="flex items-center justify-center gap-2">
                      Search Count <span>{getSortArrow("status")}</span>
                    </p> */}
                  </TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-center" >Business</TableHead>
                  <TableHead>Account Created</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBrokers?.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="font-medium text-center py-10"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedBrokers?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-center" >{item.agent}</TableCell>
                      <TableCell className="text-center" >{item.search}</TableCell>
                      <TableCell>
                        {getFormattedDateTime(item?.lastActivity)}
                      </TableCell>
                      <TableCell className="text-center" >{item.business}</TableCell>
                      <TableCell>
                        {getFormattedDateTime(item?.createdAt)}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <div className="flex items-center gap-2 flex-row">
                          <Button
                            size="icon"
                            className="text-md"
                            variant="ghost"
                          >
                            <Eye />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <Table className="">
              <TableHeader className="bg-[#F5F0EC]">
                <TableRow>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead onClick={() => requestSort("address")}>
                    Name
                    {/* <p className="flex items-center gap-2">
                      Name<span>{getSortArrow("address")}</span>
                    </p> */}
                  </TableHead>
                  <TableHead className="text-center" onClick={() => requestSort("createdAt")}>
                    Property Search
                    {/* <p className="flex items-center gap-2">
                      Property Search <span>{getSortArrow("createdAt")}</span>
                    </p> */}
                  </TableHead>

                  <TableHead className="text-center" >Business</TableHead>
                  <TableHead className="text-center" > Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedIndividual?.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="font-medium text-center py-10"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedIndividual?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.name || "John"}</TableCell>
                      <TableCell className="text-center" >{item.searchProperty || "2"}</TableCell>
                      <TableCell className="text-center" >{item.business || "$150"}</TableCell>
                      <TableCell>
                        {" "}
                        <div className="flex items-center justify-center gap-2 flex-row">
                          <Button
                            size="icon"
                            className="text-md"
                            variant="ghost"
                            onClick={() =>
                              navigate("/admin/property-search/123")
                            }
                          >
                            <Eye />
                          </Button>
                          <Button
                            size="icon"
                            className="text-md"
                            variant="ghost"
                          >
                            <FileDown />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* {searchHistories?.length === 0 && <p>No Records found.</p>} */}
          <div className="text-center space-y-2 my-4 text-muted-foreground">
            {loading && <p>Loading...</p>}
            {!hasMore && <p>No more data to load.</p>}

            {searchHistories?.length > 0 && hasMore && !loading && (
              <div className="flex justify-center">
                <Button
                  // className="loadmore"
                  size="sm"
                  onClick={
                    activeTab === "history"
                      ? fetchSearchHistories
                      : fetchAgentSearchHistories
                  }
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BrokerIndividualBusiness;
