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
import { Link, useNavigate } from "react-router-dom";
import BrokerBusinessTable from "./broker-business-table";
import AgentBusinessTable from "./agent-business-table";
import OrganisationBusinessTable from "./organisation-business-table";

function BrokerIndividualBusiness({
  activeTab,
  onRegisterReset,
  isDownload,
  handleDownloadComplete,
}) {


  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          {activeTab === "broker" ? (
            <BrokerBusinessTable
              limit={5}
              handleDownloadComplete={handleDownloadComplete}
              isDownload={isDownload}
            />
          ) : activeTab === "organisation" ? (
            <OrganisationBusinessTable
              limit={5}
              handleDownloadComplete={handleDownloadComplete}
              isDownload={isDownload}
            />
          ) : (
            <AgentBusinessTable
              limit={5}
              handleDownloadComplete={handleDownloadComplete}
              isDownload={isDownload}
            />
          )}

          {/* {searchHistories?.length === 0 && <p>No Records found.</p>} */}
          {/* <div className="text-center space-y-2 my-4 text-muted-foreground">
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
          </div> */}
        </div>
      </div>
    </>
  );
}

export default BrokerIndividualBusiness;
