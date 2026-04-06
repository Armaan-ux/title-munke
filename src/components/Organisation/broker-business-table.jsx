import { getFormattedDateTime, queryKeys } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { getOrgBrokersList } from "../service/userAdmin";
import { useQuery } from "@tanstack/react-query";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const LastActivityRenderer = (props) => (
  <span>{getFormattedDateTime(props.data?.lastLogin)}</span>
);

const AccountCreatedRenderer = (props) => (
  <span>{getFormattedDateTime(props.data?.createdAt)}</span>
);

const ActionRenderer = (props) => (
  <div className="flex items-center gap-2 h-full">
    <Link to={`/organisation/search/broker-property-search/${props.data?.id}`}>
      <Button size="icon" className="text-md" variant="ghost">
        <Eye />
      </Button>
    </Link>
  </div>
);

// ─── BrokerBusinessTable ──────────────────────────────────────────────────────

export default function BrokerBusinessTable({
  limit,
  isDownload,
  handleDownloadComplete,
  from,
  to,
}) {
  const brokerListingQuery = useQuery({
    queryKey: [queryKeys.brokerListingForAdminDefault, limit, from, to],
    queryFn: () => getOrgBrokersList({ withSearchCount: true, limit, from, to }),
  });

  const { downloadCSV } = useDownloadCsv();

  useEffect(() => {
    if (
      isDownload &&
      brokerListingQuery?.data?.items?.length > 0 &&
      handleDownloadComplete
    ) {
      const data = brokerListingQuery?.data?.items?.map((item, idx) => ({
        "Sr. No.": idx + 1,
        "Broker Name": item?.name,
        Agent: item?.agentCount,
        "Search Count": item?.totalSearches,
        "Last Activity": getFormattedDateTime(item?.lastLogin),
        "Account Created": getFormattedDateTime(item?.createdAt),
      }));
      downloadCSV(data);
      setTimeout(() => handleDownloadComplete?.(), 500);
    } else handleDownloadComplete?.();
  }, [isDownload, brokerListingQuery?.data?.items, downloadCSV, handleDownloadComplete]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Broker Name",
        field: "name",
        flex: 1,
        minWidth: 160,
        filter: false,
        cellStyle: { fontWeight: 500, color: "black" },
      },
      {
        headerName: "Agents",
        field: "agentCount",
        flex: 0.8,
        minWidth: 100,
        filter: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
      {
        headerName: "Search Count",
        field: "totalSearches",
        flex: 1,
        minWidth: 100,
        filter: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
      {
        headerName: "Last Activity",
        field: "lastLogin",
        cellRenderer: LastActivityRenderer,
        flex: 1,
        minWidth: 180,
        filter: false,
      },
      {
        headerName: "Account Created",
        field: "createdAt",
        cellRenderer: AccountCreatedRenderer,
        flex: 1,
        minWidth: 180,
        filter: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: ActionRenderer,
        flex: 1,
        minWidth: 100,
        filter: false,
        sortable: false,
      },
    ],
    [],
  );

  const rowData = brokerListingQuery?.data?.items ?? [];

  return (
    <div>
      {brokerListingQuery?.isLoading && <CenterLoader />}
      {brokerListingQuery?.isError && (
        <ShowError message={brokerListingQuery?.error?.response?.data?.message} />
      )}
      {brokerListingQuery?.isSuccess && (
        <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
       
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{
                flex: 1,
                minWidth: 120,
                filter: true,
                sortable: true,
                resizable: true,
                unSortIcon: true,
              }}
              rowHeight={72}
              headerHeight={48}
              domLayout="autoHeight"
              animateRows={true}
              overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
            />
        </div>
      )}
    </div>
  );
}