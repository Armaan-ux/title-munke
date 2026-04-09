import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFormattedDateTime, queryKeys } from "@/utils";
import { getAgentlListing } from "../service/userAdmin";
import ShowError from "../common/ShowError";
import { CenterLoader } from "../common/Loader";
import { useEffect, useMemo } from "react";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { AgGridReact } from "ag-grid-react";

const SrNoRenderer = (props) => {
  return <span>{props.node.rowIndex + 1}</span>;
};

const ActionRenderer = (props) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-row h-full">
      <Link
        to={`/admin/dashboard/property-search-individual/${props.data?.id}`}
      >
        <Button size="icon" className="text-md" variant="ghost">
          <Eye />
        </Button>
      </Link>
    </div>
  );
};

export default function AgentBusinessTable({
  limit,
  isDownload,
  handleDownloadComplete,
  from,
  to,
}) {
  const individualListingQuery = useQuery({
    queryKey: [queryKeys.individualListingForAdmin, limit, from, to],
    queryFn: () => getAgentlListing(true, limit, from, to),
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
        Business: `$${item?.revenue}`,
      }));
      downloadCSV(data);
      setTimeout(handleDownloadComplete, 500);
    } else if (isDownload) {
      handleDownloadComplete?.();
    }
  }, [
    isDownload,
    individualListingQuery?.data?.items,
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
        headerName: "Name",
        field: "name",
        flex: 1.5,
        minWidth: 200,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Property Search",
        field: "totalSearches",
        flex: 1,
        minWidth: 160,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "Business",
        field: "revenue",
        valueGetter: (params) => `$${params.data?.revenue}`,
        flex: 1,
        minWidth: 140,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "Action",
        field: "id",
        cellRenderer: ActionRenderer,
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        flex: 0,
        sortable: false,
      },
    ],
    [],
  );

  const isLoading =
    individualListingQuery.isLoading || individualListingQuery.isFetching;

  return (
    <div className="relative min-h-[200px]">
      {isLoading && <CenterLoader />}
      {individualListingQuery?.isError && (
        <ShowError
          message={individualListingQuery?.error?.response?.data?.message}
        />
      )}
      {individualListingQuery?.isSuccess && !isLoading && (
        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
       
            <AgGridReact
              rowData={individualListingQuery?.data?.items || []}
              columnDefs={columnDefs}
              defaultColDef={{
                flex: 1,
                minWidth: 120,
                sortable: true,
                resizable: true,
                unSortIcon: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
              }}
              rowHeight={72}
              headerHeight={56}
              domLayout="autoHeight"
              animateRows={true}
              enableCellTextSelection={true}
              ensureDomOrder={true}
              suppressCellFocus={true}
              overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
            />
        </div>
      )}
    </div>
  );
}
