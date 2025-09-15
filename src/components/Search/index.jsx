import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Logo from "../../img/Logo.svg";
import { API, graphqlOperation } from "aws-amplify";
import { createSearchHistory } from "../../graphql/mutations";
import { useUser } from "../../context/usercontext";
import { handleCreateAuditLog } from "../../utils";
import { getAgent, getBroker, relationshipsByAgentId } from "../../graphql/queries";
import Loader from "../../img/loader.gif";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Download, FileSearch2, Logs, MapPin, SearchCheck, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// import History from "./History";

const Dashboard = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("Initializing title search... This process may take a few minutes.");
  const [percentage, setPercentage] = useState(null);
  const [zipUrl, setZipUrl] = useState(null);
  const [isAgent, setIsAgent] = useState(false);
  const { user } = useUser();

  const ONE_AND_HALF_HOURS = 1.5 * 60 * 60 * 1000; 

  const clearSearchState = () => {
    const searchKeys = [
      "searchAddress",
      "searchId",
      "isChecked",
      "searchStatus",
      "zipUrl",
      "searchTimestamp"
    ];
    searchKeys.forEach(key => localStorage.removeItem(key));
    setAddress("");
    setProgress("");
    setPercentage(null);
    setZipUrl(null);
    setMessage("Initializing title search... This process may take a few minutes.");
    setLoading(false);
  };

  const checkSearchStatus = useCallback(async (searchId, isRestoring = false) => {
    try {
      const response = await axios.post(
        "https://ffdldf2c4ozijgyvor26zr5qyu0ulsie.lambda-url.us-east-1.on.aws/",
        { mode: "CHECK_STATUS", search_id: searchId },
        { timeout: 10000 }
      );

      const { status, status_message, zip_url, percent_completion } = response.data;

      if (isRestoring && status === "IN_PROGRESS") setLoading(true);

      if (status === "SUCCESS") {
        setProgress("Search Completed");
        setPercentage(100);
        setMessage(status_message || "Search Complete Successfully");
        setZipUrl(zip_url);
        setLoading(false);
        localStorage.setItem("searchStatus", "SUCCESS");
        localStorage.setItem("searchTimestamp", Date.now().toString());
        if (zip_url) localStorage.setItem("zipUrl", zip_url);
      } else if (status === "IN_PROGRESS") {
        setProgress("Processing...");
        setPercentage(percent_completion || 0);
        setMessage(status_message || "Search in progress...");
        localStorage.setItem("searchStatus", "IN_PROGRESS");
        setTimeout(() => checkSearchStatus(searchId, false), 5000);
      } else if (["FAILED", "STOPPED"].includes(status)) {
        clearSearchState();
        toast.error("Search was stopped or failed. Please try again.");
      } else {
        clearSearchState();
        toast.error("Unexpected issue. Please try again.");
      }
    } catch (error) {
      console.error("Error checking status:", error.message);
      clearSearchState();
      toast.error("Network error or timeout. Please retry.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedStatus = localStorage.getItem("searchStatus");
    const storedTimestamp = localStorage.getItem("searchTimestamp");
    const storedZipUrl = localStorage.getItem("zipUrl");
    const now = Date.now();

    if (storedStatus === "SUCCESS" && storedTimestamp) {
      const timeElapsed = now - parseInt(storedTimestamp);
      if (timeElapsed > ONE_AND_HALF_HOURS) {
        clearSearchState();
      } else {
        setProgress("Search Completed");
        setPercentage(100);
        setZipUrl(storedZipUrl);
        setLoading(false);
      }
    }

    const storedAddress = localStorage.getItem("searchAddress");
    const storedChecked = localStorage.getItem("isChecked") === "true";
    if (storedAddress && user) {
      setAddress(storedAddress);
      setIsChecked(storedChecked);
    }

    const storedSearchId = localStorage.getItem("searchId");
    if (storedSearchId && storedStatus === "IN_PROGRESS") {
      checkSearchStatus(storedSearchId, true);
    }

    const loggedIn = localStorage.getItem("userLoggedIn");
    if (user && !loggedIn) {
      localStorage.setItem("userLoggedIn", "true");
    } else if (!user && loggedIn) {
      localStorage.removeItem("userLoggedIn");
      if (storedStatus !== "IN_PROGRESS") clearSearchState();
    }
  }, [user, checkSearchStatus]);

  useEffect(() => {
    if (user?.attributes?.sub) {
      const groups = user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
      setIsAgent(groups.includes("agent"));
    }
  }, [user]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (loading || !address.trim().length || !isChecked) return;

    setLoading(true);
    setProgress("");
    setZipUrl(null);
    setMessage("Initializing title search... This process may take a few minutes.");

    try {
      localStorage.setItem("searchAddress", address);
      localStorage.setItem("isChecked", isChecked);
      localStorage.setItem("searchStatus", "IN_PROGRESS");
      localStorage.setItem("searchTimestamp", Date.now().toString());

      handleCreateAuditLog("SEARCH", { address }, isAgent);

      const response = await axios.post(
        "https://iweevgyflmwhamvgraszfn2xp40wvqza.lambda-url.us-east-1.on.aws/",
        { address }
      );

      const { matched_address, pin_and_parnum, tax_assessment } = response.data;
      const [pin, parnum] = pin_and_parnum;

      const initiateResponse = await axios.post(
        "https://ffdldf2c4ozijgyvor26zr5qyu0ulsie.lambda-url.us-east-1.on.aws/",
        { mode: "INITIATE_SEARCH", pin, parnum, address: matched_address, tax_assessment }
      );

      const { search_id } = initiateResponse.data;
      localStorage.setItem("searchId", search_id);

      await addToDynamoDB(address, search_id, user?.attributes?.sub);
      checkSearchStatus(search_id);
    } catch (error) {
      console.error("Error during search:", error.message);
      toast.error(error?.response?.data?.message || error.message || "Search failed: Invalid address or server error.");
      setLoading(false);
      clearSearchState();
    }
  };

  const addToDynamoDB = async (address, searchId, userId) => {
    try {
      let brokerId = "none";
      let username = "";

      if (user?.signInUserSession?.idToken?.payload?.["cognito:groups"].includes("agent")) {
        const response = await API.graphql(graphqlOperation(relationshipsByAgentId, { agentId: userId }));
        const agentDetail = await API.graphql(graphqlOperation(getAgent, { id: userId }));
        username = agentDetail?.data?.getAgent?.name;
        brokerId = response.data?.relationshipsByAgentId?.items[0]?.brokerId || "";
      } else {
        const brokerDetail = await API.graphql(graphqlOperation(getBroker, { id: userId }));
        username = brokerDetail?.data?.getBroker?.name;
      }

      await API.graphql(graphqlOperation(createSearchHistory, {
        input: {
          userId,
          address,
          timestamp: new Date().toISOString(),
          downloadLink: "",
          status: "In Progress",
          searchId,
          brokerId,
          username,
        },
      }));
    } catch (err) {
      console.error("Error adding to DynamoDB:", err);
    }
  };


  return (
    <div className="my-4" >

        {/* cards */}
        <div className="flex *:basis-1/2 gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4" >
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Total Searches</p>
              <p className="text-4xl font-semibold text-tertiary" >23</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <FileSearch2 className="text-tertiary" />
            </div>
          </div>
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Audit Logs</p>
              <p className="text-4xl font-semibold text-tertiary" >23</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <Logs className="text-tertiary" />
            </div>
          </div>
        </div>


        {/* Search */}
        <form className="p-6 rounded-xl bg-[#F5F0EC] mb-4" onSubmit={handleSearch} >
          <div className="relative mb-6"  >
            <MapPin className="text-[#5D4135] absolute top-5 left-5" />

            <Input 
                className="border-none bg-white h-16 px-14 pr-56 py-8 !rounded-[20px] text-xl placeholder:text-primary text-tertiary " 
                placeholder="Enter Address here..." 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
                />
            <Button 
                variant="secondary" 
                type="submit"
                className="absolute top-2.5 right-3.5 max-w-[12rem] w-full rounded-lg" 
                size="lg" 
                disabled={loading || !address.trim().length || !isChecked}
            > Search <SearchIcon /> 
            </Button>
          </div>
          <div className="flex gap-3 items-center mb-6 pl-4" >
            <Checkbox 
                id="checkbox" 
                className="bg-white size-5 cursor-pointer" 
                checked={isChecked}
                onCheckedChange={(e) => setIsChecked(e)}
                disabled={loading}
            />
            <Label htmlFor="checkbox" className="mb-0 text-base font-normal" >Check this box to confirm the address is correct.</Label>
          </div >
          <div className="m-4 mt-8 space-y-4" >
            {progress && <p>{progress} {percentage ? percentage + "%" : "0%"}</p>}
            {loading && message && <p>{message}</p>}
            {zipUrl && (
                  <a href={zipUrl} download >
                    <Button  className="text-sm" size="sm"   >
                      Download Results <Download />
                    </Button>
                  </a>
            )}
          </div>
        </form>


        <div className="bg-[#F5F0EC] p-6 rounded-2xl " >
          <div className="flex justify-between items-center gap-4 mb-6" >
            <p className="text-secondary font-medium text-xl" >Search History</p>
            <Button variant="outline" > View More </Button>
          </div>

            {/* <History /> */}
          {/* <div className="bg-white !p-4 rounded-xl" >

            <Table className=""  >
              <TableHeader className="bg-[#F5F0EC]" >
                <TableRow>
                  <TableHead className="w-[100px]">Sr. No.</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Download Link</TableHead>
                  <TableHead className="text-right">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  dummyData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>{item.createdAt}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.downloadLink}</TableCell>
                      <TableCell className="text-right">
                        <a href={item.downloadLink} download>Download</a>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </div> */}



        </div>

    </div>
    // <div className="search-main-content">
    //   <ToastContainer
    //     position="top-center"
    //     autoClose={6000}
    //     closeOnClick
    //     pauseOnHover
    //     draggable
    //     hideProgressBar={false}
    //     theme="colored"
    //     limit={2}
    //     toastStyle={{
    //       borderRadius: "10px",
    //       fontSize: "1rem",
    //       padding: "12px 20px",
    //       maxWidth: "400px",
    //       marginTop: "20px",
    //       boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
    //     }}
    //   />
    //   <div className="search-card">
    //     <img src={Logo} className="card-title" alt="Title Munke Logo" />
    //     <form className="search-field-container" onSubmit={handleSearch}>
    //       {loading && <img src={Loader} className="search-field-loader" alt="loading" />}
    //       <input
    //         value={address}
    //         onChange={(e) => setAddress(e.target.value)}
    //         type="text"
    //         placeholder="Enter Address..."
    //         className="search-input"
    //         disabled={loading}
    //       />
    //       <div style={{ display: "flex", alignItems: "center" }}>
    //         <input
    //           type="checkbox"
    //           checked={isChecked}
    //           onChange={(e) => setIsChecked(e.target.checked)}
    //           style={{ width: "18px" }}
    //           disabled={loading}
    //         />
    //         <small> Check this box to confirm the address is correct.</small>
    //       </div>
    //       <button
    //         type="submit"
    //         className="search-button"
    //         disabled={loading || !address.trim().length || !isChecked}
    //       >
    //         Search
    //       </button>
    //     </form>
    //     {progress && <p>{progress} {percentage ? percentage + "%" : "0%"}</p>}
    //     {loading && message && <p>{message}</p>}
    //     {zipUrl && (
    //       <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
    //         <a href={zipUrl} download style={{ marginRight: "10px" }}>Download Results</a>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default Dashboard;
