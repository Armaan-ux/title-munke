import { listSearchHistories } from "@/graphql/queries";
import { API } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
// import "./index.css";
import { useUser } from "@/context/usercontext";
import { FETCH_LIMIT } from "@/utils";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrokerBusinessTable from "./broker-business-table";
import IndividualBusinessTable from "./individual-business-table";

function BrokerIndividualBusiness({ activeTab, onRegisterReset, isDownload, handleDownloadComplete }) {
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
      if (activeTab === "broker") fetchSearchHistories();
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
      <div className="bg-[#F5F0EC] rounded-lg text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          {activeTab === "broker" ? (
           <BrokerBusinessTable limit={5} handleDownloadComplete={handleDownloadComplete} isDownload={isDownload}/>
          ) : (
            <IndividualBusinessTable limit={5} handleDownloadComplete={handleDownloadComplete} isDownload={isDownload} />
          )}
        </div>
      </div>
    </>
  );
}

export default BrokerIndividualBusiness;
