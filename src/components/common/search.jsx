import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API, graphqlOperation } from "aws-amplify";
import { createSearchHistory } from "@/graphql/mutations";
import { useUser } from "@/context/usercontext";
import { handleCreateAuditLog } from "@/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download, MapPin, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  getAgentBrokerDetails,
  getSearchedStatus,
  iniitateSearch,
} from "../service/userAdmin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserIdType } from "@/hooks/useUserIdType";

export default function Search({ isIndivisual = false }) {
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState(
    "Initializing title search... This process may take a few minutes.",
  );
  const [percentage, setPercentage] = useState(null);
  const [zipUrl, setZipUrl] = useState(null);
  const [isAgent, setIsAgent] = useState(false);
  const { user, setPaymentModal, setInvalidateSearchHistory, agentDetail, brokerDetail,
    organisationDetail } =
    useUser();

  const PLAN_LIMITS = {
    EXPLORE_PLAN: 1,
    PROFESSIONAL_PLAN: Infinity,
    PAY_AS_YOU_GO: Infinity,
  };

  const isSearchDisabled = (detail) => {
    if (!detail) return false;

    return (
      detail?.searchCount >=
      (PLAN_LIMITS[detail?.planType] ?? 0)
    );
  };
  const {
    userId: agentId,
    userType,
    status: brokerStatus,
    agentBrokerStatus,
  } = useUserIdType();
  const ONE_AND_HALF_HOURS = 1.5 * 60 * 60 * 1000;

  const agentBrokerDetailQuery = useQuery({
    queryKey: ["agentBrokerDetail"],
    queryFn: () => getAgentBrokerDetails(agentId),
    enabled: userType === "agent",
  });
  // const brokerDetailQuery = useQuery({
  //   queryKey: ["brokerDetail"],
  //   queryFn: () => getBrokerDetails(agentId),
  //   enabled: userType === "broker",
  // });

  const clearSearchState = useCallback(() => {
    const searchKeys = [
      "searchAddress",
      "searchId",
      "isChecked",
      "searchStatus",
      "zipUrl",
      "searchTimestamp",
    ];
    searchKeys.forEach((key) => localStorage.removeItem(key));
    setAddress("");
    setProgress("");
    setPercentage(null);
    setZipUrl(null);
    setIsChecked(false)
    setMessage(
      "Initializing title search... This process may take a few minutes.",
    );
    setLoading(false);
  }, []);
  const organisationDisabled = isSearchDisabled(organisationDetail);
  const brokerDisabled = isSearchDisabled(brokerDetail);
  const agentDisabled = isSearchDisabled(agentDetail);
  const checkSearchStatus = useCallback(
    async (searchId, isRestoring = false) => {
      try {
        const response = await getSearchedStatus(searchId);
        const { status, status_message, zip_url, percent_completion } =
          response;

        if (isRestoring && status === "IN_PROGRESS") setLoading(true);

        if (status === "SUCCESS") {
          if (userType === "agent")
            queryClient.invalidateQueries({
              queryKey: ["subcription-details"],
            });
          setProgress("Search Completed");
          setPercentage(100);
          setMessage(status_message || "Search Complete Successfully");
          setZipUrl(zip_url);
          setLoading(false);

          const searchAddress = address || localStorage.getItem("searchAddress");
          handleCreateAuditLog("SEARCH", { address: searchAddress }, isAgent);

          localStorage.setItem("searchStatus", "SUCCESS");
          localStorage.setItem("searchTimestamp", Date.now().toString());
          if (zip_url) localStorage.setItem("zipUrl", zip_url);
          setInvalidateSearchHistory(true);
          clearSearchState();
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
    },
    [address, isAgent, userType, queryClient, setInvalidateSearchHistory, clearSearchState],
  );

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
    if (storedSearchId && (storedStatus === "IN_PROGRESS")) {
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
      const groups =
        user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
      setIsAgent(groups.includes("agent"));
    }
  }, [user]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    // setInvalidateSearchHistory(true);
    // if (userType === "broker" && brokerStatus !== "active") {
    //   toast.error("Subscription required to access this feature.");
    //   return;
    // } else if (
    //   userType === "agent" &&
    //   agentDetail &&
    //   agentDetail.planType &&
    //   !excludedPlans.includes(agentDetail?.planType)
    // ) {
    //   toast.error("Subscription required to access this feature.");
    //   return;
    // }

    // else if (userType === "agent" && agentBrokerStatus !== "active") {
    //   toast.error("Subscription required to access this feature.");
    //   return;
    // }

    if (isIndivisual && !user?.isIndividualCardAdded) {
      setPaymentModal(true);
      return;
    }

    if (loading || !address.trim().length || !isChecked) return;

    setLoading(true);
    setProgress("");
    setZipUrl(null);
    setMessage(
      "Initializing title search... This process may take a few minutes.",
    );

    try {
      localStorage.setItem("searchAddress", address);
      localStorage.setItem("isChecked", isChecked);
      localStorage.setItem("searchStatus", "IN_PROGRESS");
      localStorage.setItem("searchTimestamp", Date.now().toString());



      const response = await axios.post(
        "https://iweevgyflmwhamvgraszfn2xp40wvqza.lambda-url.us-east-1.on.aws/",
        { address },
      );

      const { matched_address, pin_and_parnum, tax_assessment } = response.data;
      const [pin, parnum] = pin_and_parnum;

      const data = "";

      // const initiateResponse = await axios.post(
      //   "https://jdk8dyza99.execute-api.us-east-1.amazonaws.com/initiate-search",

      //   {
      //     // mode: "INITIATE_SEARCH", 
      //     pin,
      //     parnum,
      //     address: matched_address,
      //     tax_assessment,
      //   },{
      //     headers: {

      //     }
      //   }
      // );

      const initiateResponse = await iniitateSearch({ pin, parnum, address: matched_address, tax_assessment })

      const { search_id } = initiateResponse || {};
      localStorage.setItem("searchId", search_id);

      await addToDynamoDB(address, search_id, user?.attributes?.sub);
      checkSearchStatus(search_id);
    } catch (error) {
      console.error("Error during search:", error.message);
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Search failed: Invalid address or server error.",
      );
      setLoading(false);
      clearSearchState();
    }
  };

  const addToDynamoDB = async (address, searchId, userId) => {
    try {
      let brokerId = "none";
      let username = "";

      if (
        user?.signInUserSession?.idToken?.payload?.["cognito:groups"].includes(
          "agent",
        )
      ) {
        // const response = await API.graphql(
        //   graphqlOperation(relationshipsByAgentId, { agentId: userId })
        // );
        // const agentDetail = await API.graphql(
        //   graphqlOperation(getAgent, { id: userId })
        // );
        username = agentBrokerDetailQuery.data?.name;
        brokerId = agentBrokerDetailQuery.data?.relationship?.brokerId;
      } else {
        // const brokerDetail = await API.graphql(
        //   graphqlOperation(getBroker, { id: userId })
        // );
        username = brokerDetail?.name;
      }

      await API.graphql(
        graphqlOperation(createSearchHistory, {
          input: {
            userId,
            address,
            timestamp: new Date().toISOString(),
            downloadLink: "",
            status: "IN_PROGRESS",
            searchId,
            brokerId,
            username,
            userType,
          },
        }),
      );
      setInvalidateSearchHistory(true);
    } catch (err) {
      console.error("Error adding to DynamoDB:", err);
    }
  };

  return (
    <form
      className="p-4 md:px-10 md:py-5  rounded-xl bg-[#F5F0EC]  mb-4 flex flex-col items-center"
      onSubmit={handleSearch}
    >
      <img
        src="/Logo.svg"
        className="w-36 md:w-48 mb-8"
        alt="Title Munke Logo"
      />
      <div className="relative mb-10 max-w-[60rem] w-full">
        <MapPin size={28} className="text-[#5D4135] absolute top-6 left-5" />

        <Input
          className="border-none w-full bg-white h-[75px] px-12 md:px-16 pr-12 md:pr-56 py-8 !rounded-[20px] !text-xl placeholder:text-primary text-tertiary shadow-lg"
          placeholder="Enter Address here..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading || organisationDisabled || brokerDisabled || agentDisabled}
        />
        <div className="!mt-3 text-gray-500">Format: 123 Hill St</div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-4xl mb-6 ">
        <div className="flex items-center gap-3">
          <Checkbox
            id="checkbox"
            className="bg-white size-5 cursor-pointer"
            checked={isChecked}
            onCheckedChange={(e) => setIsChecked(e)}
            disabled={loading || organisationDisabled || brokerDisabled || agentDisabled}
          />
          <Label htmlFor="checkbox" className="text-base font-normal pt-3">
            Check this box to confirm the address is correct.
          </Label>
        </div>

        <Button
          variant="secondary"
          type="submit"
          className="h-[54px] w-full max-w-[20rem] rounded-lg  bg-gradient-to-b from-[#550000] to-[#3D2014] !opacity-80 "
          size="lg"
          disabled={loading || !address.trim().length || !isChecked || organisationDisabled || brokerDisabled || agentDisabled}
        >
          Search <SearchIcon className="size-6 ml-2" />
        </Button>
      </div>
      <div className="m-4 mt-8 space-y-4">
        {progress && (
          <p>
            {progress} {percentage ? percentage + "%" : "0%"}
          </p>
        )}
        {loading && message && <p>{message}</p>}
        {zipUrl && (
          <a href={zipUrl} download>
            <Button className="text-sm" size="sm" type="button">
              Download Results <Download />
            </Button>
          </a>
        )}
      </div>
    </form>
  );
}
