import { API } from "aws-amplify";
import { useState, useEffect, useCallback, useMemo } from "react";
import { updateSearchHistory } from "@/graphql/mutations";
import { useUser } from "@/context/usercontext";
import {
  getFormattedDateTime,
  handleCreateAuditLog,
  INTERVALTIME,
} from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAgentSearches, getSearchedStatus } from "../service/userAdmin";
import { useUserIdType } from "@/hooks/useUserIdType";
import { CenterLoader } from "./Loader";
import ShowError from "./ShowError";
import { useNavigate } from "react-router-dom";
import { Eye, Link } from "lucide-react";
import { Button } from "../ui/button";
import { AgGridReact } from "ag-grid-react";

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const StatusRenderer = (props) => {
  const status = props.data?.status;
  const styles =
    status === "SUCCESS"
      ? "bg-[#E9F3E9] text-[#1E8221]"
      : status === "Unconfirmed"
        ? "bg-[#FFF3D9] text-[#A2781E]"
        : status === "IN_PROGRESS"
          ? "bg-[#fff6e2] text-[#ffa200]"
          : "bg-[#FFE3E2] text-[#FF5F59]";

  return (
    <div className="flex items-center h-full">
      <span className={`${styles} text-[13px] font-medium px-3 py-1 rounded-md`}>
        {status === "IN_PROGRESS" ? "In Progress" : status}
      </span>
    </div>
  );
};

const DownloadRenderer = (props) => {
  if (!props.data?.downloadLink) return null;
  return (
    <div className="flex items-center h-full">
      <a
        href={props.data.downloadLink}
        download
        onClick={() =>
          handleCreateAuditLog("DOWNLOAD", { zipUrl: props.data.downloadLink }, true)
        }
      >
        <Link className="w-4 h-4" />
      </a>
    </div>
  );
};

const ActionRenderer = (props) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          navigate(`/agent/dashboard/property-details/${props.data?.searchId}`)
        }
      >
        <Eye />
      </Button>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

function History({ isAll = false }) {
  const queryClient = useQueryClient();
  const [searchHistories, setSearchHistories] = useState([]);
  const { user, invalidateSearchHistory, setInvalidateSearchHistory } = useUser();
  const { userId } = useUserIdType();

  const agentHistoryQuery = useQuery({
    queryKey: ["agentSearchHistory", userId],
    queryFn: () => getAgentSearches(userId),
    staleTime: Infinity,
    gcTimeout: Infinity,
  });

  useEffect(() => {
    if (invalidateSearchHistory) {
      agentHistoryQuery.refetch();
    }
  }, [invalidateSearchHistory, agentHistoryQuery]);

  useEffect(() => {
    if (agentHistoryQuery?.data && agentHistoryQuery?.isSuccess) {
      setSearchHistories(agentHistoryQuery?.data);
      setInvalidateSearchHistory(false);
    }
  }, [
    agentHistoryQuery?.data,
    agentHistoryQuery?.isSuccess,
    setInvalidateSearchHistory,
    agentHistoryQuery.dataUpdatedAt,
  ]);

  const checkSearchStatus = useCallback(
    async (searchId, id) => {
      try {
        const response = await getSearchedStatus(searchId);
        const { status, zip_url } = response;

        if (status === "SUCCESS") {
          await API.graphql({
            query: updateSearchHistory,
            variables: {
              input: { id, searchId, status: "SUCCESS", downloadLink: zip_url },
            },
          });
          queryClient.invalidateQueries({
            queryKey: ["agentSearchHistory"],
            exact: true,
          });
          setSearchHistories((prev) =>
            prev.map((record) =>
              record.searchId === searchId
                ? { ...record, status: "SUCCESS", downloadLink: zip_url }
                : record,
            ),
          );
        }
      } catch (error) {
        console.error(`Error checking status for ${searchId}:`, error);
      }
    },
    [queryClient],
  );

  useEffect(() => {
    if (!agentHistoryQuery?.data?.length) return;
    const inProgress = agentHistoryQuery.data.filter(
      ({ status }) => status === "In Progress",
    );
    inProgress.forEach((search) => checkSearchStatus(search.searchId, search.id));

    const interval = setInterval(() => {
      inProgress.forEach((search) =>
        checkSearchStatus(search.searchId, search.id),
      );
    }, INTERVALTIME);

    return () => clearInterval(interval);
  }, [agentHistoryQuery.data, agentHistoryQuery.dataUpdatedAt, checkSearchStatus]);

  // Pre-sort and slice before passing to AG Grid
  const rowData = useMemo(() => {
    const sorted = [...searchHistories].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    return isAll ? sorted : sorted.slice(0, 5);
  }, [searchHistories, isAll]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
      },
      {
        headerName: "Address",
        field: "address",
        flex: 2,
        minWidth: 260,
      },
      {
        headerName: "Date / Time",
        field: "createdAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.createdAt),
        flex: 1,
        minWidth: 180,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusRenderer,
        flex: 1,
        minWidth: 140,
      },
      {
        headerName: "Download Link",
        field: "downloadLink",
        cellRenderer: DownloadRenderer,
        flex: 1,
        minWidth: 140,
        sortable: false,
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: ActionRenderer,
        flex: 1,
        minWidth: 100,
        sortable: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
    ],
    [],
  );

  return (
    <div className="bg-white !p-4 rounded-xl">
      {agentHistoryQuery?.isLoading && <CenterLoader />}
      {agentHistoryQuery?.isError && (
        <ShowError
          message={agentHistoryQuery?.error?.response?.data?.message}
        />
      )}
      {agentHistoryQuery?.isSuccess && (
        <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
          {rowData.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground font-medium text-lg border rounded-xl bg-gray-50/50">
              No Records found.
            </div>
          ) : (
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{
                flex: 1,
                minWidth: 120,
                filter: false,
                sortable: true,
                resizable: true,
                unSortIcon: true,
              }}
              rowHeight={72}
              headerHeight={48}
              domLayout="autoHeight"
              animateRows={true}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default History;