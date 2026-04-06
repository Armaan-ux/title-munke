import { getFormattedDateTime, queryKeys } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { listBrokers } from "../service/userAdmin";
import { useQuery } from "@tanstack/react-query";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

const SrNoRenderer = (props) => {
  return <span>{props.node.rowIndex + 1}</span>;
};

const ActionRenderer = (props) => {
  return (
    <div className="flex items-center gap-2 flex-row h-full">
      <Link to={`/admin/dashboard/broker-details/${props.data?.id}`}>
        <Button size="icon" className="text-md" variant="ghost">
          <Eye />
        </Button>
      </Link>
    </div>
  );
};

export default function BrokerBusinessTable({
  limit,
  isDownload,
  handleDownloadComplete,
  from,
  to,
}) {
  const brokerListingQuery = useQuery({
    queryKey: [queryKeys.brokerListingForAdminDefault, limit, from, to],
    queryFn: () => listBrokers({ withSearchCount: true, limit, from, to }),
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
        Business: `$${item?.revenue}`,
        "Account Created": getFormattedDateTime(item?.createdAt),
      }));
      downloadCSV(data);
      setTimeout(() => handleDownloadComplete?.(), 500);
    } else if (isDownload) {
      handleDownloadComplete?.();
    }
  }, [
    isDownload,
    brokerListingQuery?.data?.items,
    downloadCSV,
    handleDownloadComplete,
  ]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "serial",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
      },
      {
        headerName: "Broker Name",
        field: "name",
        flex: 1.5,
        minWidth: 180,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Agent",
        field: "agentCount",
        flex: 1,
        minWidth: 100,
        cellStyle: { textAlign: "start" },
      },
      {
        headerName: "Search Count",
        field: "totalSearches",
        flex: 1,
        minWidth: 120,
        cellStyle: { textAlign: "start" },
      },
      {
        headerName: "Last Activity",
        field: "lastLogin",
        valueGetter: (params) => getFormattedDateTime(params.data?.lastLogin),
        flex: 1.5,
        minWidth: 160,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Business",
        field: "revenue",
        valueGetter: (params) => `$${params.data?.revenue}`,
        flex: 1,
        minWidth: 120,
        cellStyle: { textAlign: "start" },
      },
      {
        headerName: "Account Created",
        field: "createdAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.createdAt),
        flex: 1,
        minWidth: 150,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Action",
        field: "id",
        cellRenderer: ActionRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
      },
    ],
    [],
  );

  const isLoading =
    brokerListingQuery.isLoading || brokerListingQuery.isFetching;

  return (
    <div className="relative min-h-[200px]">
      {isLoading && <CenterLoader />}
      {brokerListingQuery?.isError && (
        <ShowError
          message={brokerListingQuery?.error?.response?.data?.message}
        />
      )}
      {brokerListingQuery?.isSuccess && !isLoading && (
        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
         
            <AgGridReact
              rowData={brokerListingQuery?.data?.items || []}
              columnDefs={columnDefs}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
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
