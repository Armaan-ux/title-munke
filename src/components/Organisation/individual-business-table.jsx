import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { getOrgAgentsList } from "../service/userAdmin";
import ShowError from "../common/ShowError";
import { CenterLoader } from "../common/Loader";
import { useEffect, useMemo } from "react";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { AgGridReact } from "ag-grid-react";

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const ActionRenderer = (props) => (
  <div className="flex items-center justify-center h-full">
    <Link to={`/organisation/search/property-search/${props.data?.id}`}>
      <Button size="icon" className="text-md" variant="ghost">
        <Eye />
      </Button>
    </Link>
  </div>
);

// ─── IndividualBusinessTable ──────────────────────────────────────────────────

export default function IndividualBusinessTable({
  limit,
  isDownload,
  handleDownloadComplete,
  from,
  to,
}) {
  const individualListingQuery = useQuery({
    queryKey: [queryKeys.individualListingForAdmin, limit, from, to],
    queryFn: () => getOrgAgentsList({ withSearchCount: true, limit, from, to }),
  });

  const { downloadCSV } = useDownloadCsv();

  useEffect(() => {
    if (
      isDownload &&
      individualListingQuery?.data?.items?.length > 0 &&
      handleDownloadComplete
    ) {
      const data = individualListingQuery?.data?.items?.map((item, idx) => ({
        "Sr. No.": idx + 1,
        Name: item?.name,
        "Property Search": item?.totalSearches,
      }));
      downloadCSV(data);
      setTimeout(handleDownloadComplete, 500);
    } else handleDownloadComplete?.();
  }, [isDownload, individualListingQuery?.data?.items, downloadCSV, handleDownloadComplete]);

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
        headerName: "Name",
        field: "name",
        flex: 1,
        minWidth: 160,
        filter: false,
        cellStyle: { fontWeight: 500, color: "black" },
      },
      {
        headerName: "Property Searches",
        field: "totalSearches",
        flex: 1,
        minWidth: 160,
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
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
    ],
    [],
  );

  const rowData = individualListingQuery?.data?.items ?? [];

  return (
    <div>
      {individualListingQuery?.isLoading && <CenterLoader />}
      {individualListingQuery?.isError && (
        <ShowError message={individualListingQuery?.error?.response?.data?.message} />
      )}
      {individualListingQuery?.isSuccess && (
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
                wrapHeaderText: true,
                autoHeaderHeight: true,
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