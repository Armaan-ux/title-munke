import { useEffect, useState } from "react";
import { getFormattedDateTime } from "../../../utils";
import AddAgentByAdminModal from "../../Modal/AddAgentByAdminModal";
import AddUserModal from "../../Modal/AddUserModal";
import AgentList from "../../Modal/AgentList";
import {
  activeBroker,
  fetchAgentsWithSearchCount,
  fetchBrokersWithSearchCount,
  fetchTotalActiveBrokers,
  fetchTotalBrokers,
  fetchTotalBrokerSearchesThisMonth,
  inActiveBroker,
} from "../../service/broker";
import "./index.css";
function BorkerList() {
  const [isBrokerListLoading, setIsBrokerListLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAgentCreationModalOpen, setIsAgentCreationModalOpen] =
    useState(false);
  const [isAgentListOpen, setIsAgentListOpen] = useState(false);
  const [isAgentListLoading, setIsAgentListLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [brokers, setBrokers] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [totalBrokerCount, setTotalBrokerCount] = useState(0);
  const [totalActiveBrokerCount, setTotalActiveBrokerCount] = useState(0);
  const [totalBrokerSearchThisMonthCount, setTotalBrokerSearchThisMonthCount] =
    useState(0);

  useEffect(() => {
    const getBroker = async () => {
      try {
        setLoading(true);
        const totalBroker = await fetchTotalBrokers();
        const totalActiveBroker = await fetchTotalActiveBrokers();
        setTotalBrokerSearchThisMonthCount(
          await fetchTotalBrokerSearchesThisMonth()
        );
        setTotalBrokerCount(totalBroker?.length);
        setTotalActiveBrokerCount(totalActiveBroker?.length);
      } catch (err) {
        console.error("Error", err);
      } finally {
        setLoading(false);
      }
    };

    getBroker();
  }, []);

  useEffect(() => {
    handleFetchBrokersWithSearchCount();
  }, []);

  const handleFetchBrokersWithSearchCount = async () => {
    if (isBrokerListLoading || !hasMore) return;

    setIsBrokerListLoading(true);
    try {
      const response = await fetchBrokersWithSearchCount(nextToken);
      const { updatedBrokers, nextToken: newNextToken } = response;

      setBrokers((prev) => [...prev, ...updatedBrokers]);
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {
      console.error("Error fetching search histories:", error);
    }
    setIsBrokerListLoading(false);
  };

  const handleBrokerStatus = async (elem) => {
    if (elem.status === "ACTIVE") {
      await inActiveBroker(elem.id);
      const temp = brokers;
      const indx = temp.findIndex((e) => e.id === elem.id);
      temp[indx].status = "INACTIVE";
      setBrokers(temp.map((elem) => elem));
    } else if (elem.status === "INACTIVE") {
      await activeBroker(elem.id);
      const temp = brokers;
      const indx = temp.findIndex((e) => e.id === elem.id);
      temp[indx].status = "ACTIVE";
      setBrokers(temp.map((elem) => elem));
    }
  };

  const handleFetchAgentListForBroker = async (brokerId) => {
    try {
      setIsAgentListLoading(true);
      setIsAgentListOpen(true);
      const response = await fetchAgentsWithSearchCount(brokerId);
      setAgentList(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAgentListLoading(false);
    }
  };

  return (
    <>
      {isAgentListOpen && (
        <AgentList
          data={agentList}
          setIsOpen={setIsAgentListOpen}
          isAgentListLoading={isAgentListLoading}
        />
      )}
      {isOpen && <AddUserModal setIsOpen={setIsOpen} userType={"broker"} />}
      {isAgentCreationModalOpen && (
        <AddAgentByAdminModal setIsOpen={setIsAgentCreationModalOpen} />
      )}
      <div class="main-content">
        <div class="page-title">
          <h1>Broker Performance Overview</h1>
          <div className="action-buttons">
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="btn add-user-btn"
            >
              <i className="fas fa-user-plus"></i> Add Broker
            </button>
            <button
              onClick={() => {
                setIsAgentCreationModalOpen(true);
              }}
              className="btn add-user-btn"
            >
              <i className="fas fa-user-plus"></i> Add Agent
            </button>
          </div>
        </div>

        <div class="grid-container">
          <div class="stat-card">
            <h3>Total Brokers</h3>
            <p class="stat-number">
              {loading ? "loading..." : totalBrokerCount}
            </p>
          </div>
          <div class="stat-card">
            <h3>Active Brokers</h3>
            <p class="stat-number">
              {loading ? "loading..." : totalActiveBrokerCount}
            </p>
          </div>
          <div class="stat-card">
            <h3>Total Searches This Month</h3>
            <p class="stat-number">
              {loading ? "loading..." : totalBrokerSearchThisMonthCount}
            </p>
          </div>
        </div>

        <div class="broker-list-card">
          <h3>Brokers Performance</h3>
          <table class="broker-list-styled-table table-container">
            <thead>
              <tr>
                <th>Broker Name</th>
                <th>Monthly Searches</th>
                <th>Last Login</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
                <th>Agent List</th>
              </tr>
            </thead>
            <tbody>
              {brokers.map((elem) => (
                <tr key={elem.id} class="dropdown-btn">
                  <td>{elem.name}</td>
                  <td>{elem.totalSearches}</td>
                  <td>{getFormattedDateTime(elem.lastLogin)}</td>

                  <td>
                    <span class="status active">{elem.status}</span>
                  </td>
                  <td style={{ marginRight: "5px" }}>{elem.email}</td>
                  <td>
                    <div className="dropdown">
                      <button className="btn action-btn">
                        Actions <i className="fas fa-caret-down"></i>
                      </button>
                      {elem.status === "UNCONFIRMED" ? (
                        <div className="dropdown-content">
                          <span onClick={() => {}}>Resend OTP</span>
                        </div>
                      ) : (
                        <div className="dropdown-content">
                          <span
                            onClick={() => {
                              handleBrokerStatus(elem);
                            }}
                          >
                            {elem.status === "ACTIVE" ? "InActive" : "Active"}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className=" action-btn"
                      onClick={() => handleFetchAgentListForBroker(elem.id)}
                    >
                      Click to see list
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {brokers?.length === 0 && !isBrokerListLoading && (
            <p>No Records found.</p>
          )}
          {isBrokerListLoading && <p>Loading...</p>}
          {!hasMore && <p>No more data to load.</p>}
          {brokers?.length > 0 && hasMore && !isBrokerListLoading && (
            <button
              className="loadmore"
              onClick={handleFetchBrokersWithSearchCount}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default BorkerList;
