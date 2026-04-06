import { getFormattedDateTime, queryKeys } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { listOrganisations } from "../service/userAdmin";
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
      <Link to={`/admin/dashboard/org-details/${props.data?.id}`}>
        <Button size="icon" className="text-md" variant="ghost">
          <Eye />
        </Button>
      </Link>
    </div>
  );
};

export default function OrganisationBusinessTable({
  limit,
  isDownload,
  handleDownloadComplete,
  from,
  to,
}) {
  const orgListingQuery = useQuery({
    queryKey: [queryKeys.orgListingForAdminDefault, limit, from, to],
    queryFn: () =>
      listOrganisations({ withSearchCount: true, limit, from, to }),
  });

  const { downloadCSV } = useDownloadCsv();

  useEffect(() => {
    if (
      isDownload &&
      orgListingQuery?.data?.updatedOrganisations?.length > 0 &&
      handleDownloadComplete
    ) {
      const data = orgListingQuery?.data?.updatedOrganisations?.map(
        (item, idx) => ({
          "Sr. No.": idx + 1,
          "Organization Name": item?.name,
          Agent: item?.agentCount,
          "Search Count": item?.totalSearches,
          "Last Activity": getFormattedDateTime(item?.lastLogin),
          Business: `$${item?.revenue}`,
          "Account Created": getFormattedDateTime(item?.createdAt),
        }),
      );
      downloadCSV(data);
      setTimeout(() => handleDownloadComplete?.(), 500);
    } else if (isDownload) {
      handleDownloadComplete?.();
    }
  }, [
    isDownload,
    orgListingQuery?.data?.updatedOrganisations,
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
        headerName: "Team Strength",
        field: "teamStrength",
        flex: 1,
        minWidth: 140,
        cellStyle: { textAlign: "start" },
      },
      {
        headerName: "Property Search",
        field: "totalSearches",
        flex: 1,
        minWidth: 160,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "Last Activity",
        field: "lastLogin",
        valueGetter: (params) => getFormattedDateTime(params.data?.lastLogin),
        flex: 1,
        minWidth: 120,
        wrapText: true,
        autoHeight: true,
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
        headerName: "Account Created",
        field: "createdAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.createdAt),
        flex: 1,
        minWidth: 100,
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

  const isLoading = orgListingQuery.isLoading || orgListingQuery.isFetching;

  return (
    <div className="relative min-h-[200px]">
      {isLoading && <CenterLoader />}
      {orgListingQuery?.isError && (
        <ShowError message={orgListingQuery?.error?.response?.data?.message} />
      )}
      {orgListingQuery?.isSuccess && !isLoading && (
        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
       
            <AgGridReact
              rowData={orgListingQuery?.data?.updatedOrganisations || []}
              columnDefs={columnDefs}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                sortable: true,
                resizable: true,
                unSortIcon: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
              }}
              rowHeight={60}
              headerHeight={56}
              domLayout="autoHeight"
              animateRows={true}
              overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
            />
          
        </div>
      )}
    </div>
  );
}
