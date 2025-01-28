import { useEffect, useState } from "react";
import { getFormattedDateTime } from "../../../utils";
import AddUserModal from "../../Modal/AddUserModal";
import {
  activeBroker,
  fetchBrokersWithSearchCount,
  fetchTotalActiveBrokers,
  fetchTotalBrokers,
  fetchTotalBrokerSearchesThisMonth,
  inActiveBroker,
} from "../../service/broker";
import "./index.css";
function BorkerList() {
  const [isOpen, setIsOpen] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [totalBrokerCount, setTotalBrokerCount] = useState(0);
  const [totalActiveBrokerCount, setTotalActiveBrokerCount] = useState(0);
  const [totalBrokerSearchThisMonthCount, setTotalBrokerSearchThisMonthCount] =
    useState(0);

  useEffect(() => {
    const getBroker = async () => {
      const totalBroker = await fetchTotalBrokers();
      const totalActiveBroker = await fetchTotalActiveBrokers();
      const response = await fetchBrokersWithSearchCount();
      setTotalBrokerSearchThisMonthCount(
        await fetchTotalBrokerSearchesThisMonth()
      );
      setBrokers(response);
      setTotalBrokerCount(totalBroker?.length);
      setTotalActiveBrokerCount(totalActiveBroker?.length);
    };

    getBroker();
  }, []);

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

  useEffect(() => {
    console.log(brokers);
  }, [brokers]);
  return (
    <>
      {isOpen && <AddUserModal setIsOpen={setIsOpen} userType="broker" />}
      <div class="main-content">
        <div class="page-title">
          <h1>Broker Performance Overview</h1>
          <div className="action-buttons">
            <button
              onClick={() => setIsOpen(true)}
              className="btn add-user-btn"
            >
              <i className="fas fa-user-plus"></i> Add Broker
            </button>
          </div>
        </div>

        <div class="grid-container">
          <div class="stat-card">
            <h3>Total Brokers</h3>
            <p class="stat-number">{totalBrokerCount}</p>
          </div>
          <div class="stat-card">
            <h3>Active Brokers</h3>
            <p class="stat-number">{totalActiveBrokerCount}</p>
          </div>
          <div class="stat-card">
            <h3>Total Searches This Month</h3>
            <p class="stat-number">{totalBrokerSearchThisMonthCount}</p>
          </div>
        </div>

        <div class="card">
          <h3>Brokers Performance</h3>
          <table class="styled-table">
            <thead>
              <tr>
                <th>Broker Name</th>
                <th>Monthly Searches</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Action</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default BorkerList;
