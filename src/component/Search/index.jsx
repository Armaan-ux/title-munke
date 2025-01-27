import React, { useEffect, useState } from "react";
import axios from "axios";
import { API, graphqlOperation } from "aws-amplify";
import { createSearchHistory } from "../../graphql/mutations";
import "./index.css";
import { useUser } from "../../context/usercontext";
import { handleCreateAuditLog } from "../../utils";
import {
  getAgent,
  getBroker,
  relationshipsByAgentId,
} from "../../graphql/queries";

const Search = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [percentage, setPercentage] = useState(null);
  const [zipUrl, setZipUrl] = useState(null);
  const { user } = useUser();

  const handleSearch = async () => {
    setLoading(true);

    try {
      handleCreateAuditLog("SEARCH", {
        address,
      });
      const response = await axios.post(
        "https://qwwdyrp4y5gtw2on3t5jd67g5i0leuga.lambda-url.us-east-1.on.aws/",
        {
          address: address,
        }
      );

      const { matched_address, pin_and_parnum, tax_assessment } = response.data;
      const pin = pin_and_parnum[0];
      const parnum = pin_and_parnum[1];

      const initiateResponse = await axios.post(
        "https://hwk77cjbdtmopznce6tneqknvi0rqvta.lambda-url.us-east-1.on.aws/",
        {
          mode: "INITIATE_SEARCH",
          pin,
          parnum,
          address: matched_address,
          tax_assessment,
        }
      );

      const { search_id } = initiateResponse.data;

      await addToDynamoDB(address, search_id, user?.attributes?.sub);

      checkSearchStatus(search_id);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const checkSearchStatus = async (searchId) => {
    try {
      const response = await axios.post(
        "https://hwk77cjbdtmopznce6tneqknvi0rqvta.lambda-url.us-east-1.on.aws/",
        {
          mode: "CHECK_STATUS",
          search_id: searchId,
        }
      );

      const { status, status_message, zip_url, percent_completion } =
        response.data;

      setProgress(status === "SUCCESS" ? "Search Completed" : "Processing...");
      setZipUrl(zip_url);
      setPercentage(percent_completion);
      setMessage(status_message);

      if (status === "SUCCESS") {
        setLoading(false);
      } else {
        // If not completed, check again after a delay
        setTimeout(() => checkSearchStatus(searchId), 5000); // Check again in 5 seconds
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  const addToDynamoDB = async (address, searchId, userId) => {
    try {
      let brokerId = "";
      let username = "";

      if (
        user?.signInUserSession?.idToken?.payload?.["cognito:groups"].includes(
          "agent"
        )
      ) {
        const response = await API.graphql(
          graphqlOperation(relationshipsByAgentId, { agentId: userId })
        );
        const agentDetail = await API.graphql(
          graphqlOperation(getAgent, { id: userId })
        );
        username = agentDetail?.data?.getAgent?.name;
        brokerId =
          response.data?.relationshipsByAgentId?.items[0]?.brokerId || "";
      } else {
        const agentDetail = await API.graphql(
          graphqlOperation(getBroker, { id: userId })
        );
        username = agentDetail?.data?.getAgent?.name;
      }

      const newEntry = {
        userId,
        address,
        timestamp: new Date().toISOString(),
        downloadLink: "",
        status: "In Progress",
        searchId,
        brokerId,
        username,
      };

      await API.graphql(
        graphqlOperation(createSearchHistory, { input: newEntry })
      );
      console.log("Search entry added to DynamoDB");
    } catch (err) {
      console.error("Error adding to DynamoDB:", err);
    }
  };

  return (
    <div className="main-content">
      <div className="card">
        <h2 className="card-title">Search Address</h2>
        <div className="search-field-container">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={loading || !address.trim().length}
          >
            {loading ? "Processing..." : "Search"}
          </button>
        </div>
        {progress && (
          <p style={{ marginTop: "10px" }}>
            {progress}{" "}
            <span style={{ marginLeft: "10px" }}>
              {percentage ? percentage + "%" : "0%"}
            </span>
          </p>
        )}
        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        {zipUrl && (
          <div className="downloadbtn">
            <a
              href={zipUrl}
              download
              onClick={() =>
                handleCreateAuditLog("DOWNLOAD", {
                  zipUrl,
                })
              }
            >
              Download Results
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
