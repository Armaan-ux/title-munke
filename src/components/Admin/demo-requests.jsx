import { convertFromTimestamp, getFormattedDateTime, queryKeys } from "@/utils";
import { Repeat2, Download } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getListDemoReq, markDemoRequestContacted } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { AgGridReact } from "ag-grid-react";

const SrNoRenderer = (props) => {
  return <span>{props.node.rowIndex + 1}</span>;
};

// Helper to convert row data to CSV and trigger download
const exportToCSV = (rows, filename) => {
  if (!rows?.length) return;

  const headers = [
    "Sr. No.",
    "Name",
    "Email / Phone No.",
    "Country",
    "State",
    "Date",
    "Description",
  ];

  const csvRows = rows.map((row, index) => {
    const date = convertFromTimestamp(
      parseInt(new Date(row.createdAt).getTime() / 1000),
      "monthDateYear",
    );
    // Wrap each cell in quotes and escape inner quotes to handle commas/newlines
    const cells = [
      index + 1,
      row.name,
      row.email,
      row.country,
      row.state,
      date,
      row.additionalMessage,
    ].map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`);

    return cells.join(",");
  });

  const csvContent = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function DemoRequests() {
  const [activeTab, setActiveTab] = useState("pending");

  const demoReqQuery = useQuery({
    queryKey: ["getListDemoReq"],
    queryFn: getListDemoReq,
  });
  const demoReqContactedQuery = useQuery({
    queryKey: [queryKeys.getListDemoReqContacted],
    queryFn: () => getListDemoReq("CONTACTED"),
  });

  const markDemoRequestContactedMutation = useMutation({
    mutationFn: (id) => markDemoRequestContacted(id),
    onSuccess: () => {
      demoReqQuery.refetch();
      demoReqContactedQuery.refetch();
    },
  });

  const rowData = useMemo(() => {
    return activeTab === "pending"
      ? demoReqQuery?.data?.items || []
      : demoReqContactedQuery?.data?.items || [];
  }, [activeTab, demoReqQuery.data, demoReqContactedQuery.data]);

  const handleExport = useCallback(() => {
    const filename = `demo-requests-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(rowData, filename);
  }, [rowData, activeTab]);

  const columnDefs = useMemo(() => {
    const baseCols = [
      {
        headerName: "Sr. No.",
        field: "index",
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
        flex: 1,
        minWidth: 150,
        cellStyle: { fontWeight: "500", color: "black" },
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email / Phone No.",
        field: "email",
        flex: 1.5,
        minWidth: 200,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "County",
        field: "country",
        flex: 1,
        minWidth: 120,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "State",
        field: "state",
        flex: 1,
        minWidth: 120,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date",
        field: "createdAt",
        valueGetter: (params) =>
          convertFromTimestamp(
            parseInt(new Date(params.data?.createdAt).getTime() / 1000),
            "monthDateYear",
          ),
        flex: 1,
        minWidth: 150,
        wrapText: true,
        autoHeight: true,
        cellStyle: { lineHeight: "1.5", padding: "12px 24px" },
      },
      {
        headerName: "Description",
        field: "additionalMessage",
        flex: 2,
        minWidth: 250,
        wrapText: true,
        autoHeight: true,
        cellStyle: { lineHeight: "1.5", padding: "12px 24px" },
      },
    ];

    if (activeTab === "pending") {
      baseCols.push({
        headerName: "Action",
        field: "id",
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
        cellRenderer: (params) => (
          <div className="flex items-center justify-center h-full">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-coffee-bg-foreground"
              onClick={() =>
                markDemoRequestContactedMutation.mutate(params.data?.id)
              }
              disabled={markDemoRequestContactedMutation.isPending}
            >
              <Repeat2 className="mx-auto size-5 text-[#8B4513]" />
            </Button>
          </div>
        ),
      });
    }

    return baseCols;
  }, [activeTab, markDemoRequestContactedMutation.isPending]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      {/* Tabs + Export Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-x-3">
          <button
            onClick={() => setActiveTab("pending")}
            className={`${
              activeTab === "pending"
                ? "bg-tertiary text-white hover:bg-tertiary"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055]"
            } transition-all rounded-full px-10 py-3`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("contacted")}
            className={`${
              activeTab === "contacted"
                ? "bg-tertiary text-white hover:bg-tertiary"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055]"
            } transition-all rounded-full px-10 py-3`}
          >
            Contacted
          </button>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={!rowData.length}
          variant="secondary"
        >
          <Download className="size-4" />
          Export Request
        </Button>
      </div>

      <div className="bg-white !p-4 rounded-xl">
        {(activeTab === "pending"
          ? demoReqQuery?.isLoading
          : demoReqContactedQuery?.isLoading) && <CenterLoader />}
        {(activeTab === "pending"
          ? demoReqQuery?.isError
          : demoReqContactedQuery?.isError) && <ShowError />}

        {((activeTab === "pending" && demoReqQuery?.isSuccess) ||
          (activeTab === "contacted" && demoReqContactedQuery?.isSuccess)) && (
          <div
            className="ag-theme-quartz custom-ag-grid"
            style={{ width: "100%" }}
          >
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
                wrapHeaderText: true,
                autoHeaderHeight: true,
              }}
              headerHeight={48}
              domLayout="autoHeight"
              animateRows={true}
              overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
            />
          </div>
        )}
      </div>
    </div>
  );
}
