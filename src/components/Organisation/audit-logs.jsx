import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/usercontext";
import { getFormattedDateTime } from "@/utils";
import { Button } from "@/components/ui/button";
import { listAuditLogsOrg } from "../service/userAdmin";
import { valueFromStringifyObject } from "@/lib/utils";
import { useUserIdType } from "@/hooks/useUserIdType";
import { AgGridReact } from "ag-grid-react";
import { CenterLoader } from "../common/Loader";

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const DetailRenderer = (props) => (
  <div className="flex items-center h-full break-all break-words whitespace-break-spaces max-w-sm min-w-[300px] py-2">
    {valueFromStringifyObject(props.data?.detail)}
  </div>
);

const DateRenderer = (props) => (
  <span>{getFormattedDateTime(props.data?.createdAt)}</span>
);

// ─── AuditLogs ────────────────────────────────────────────────────────────────

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [activeTab, setActiveTab] = useState("organisation");
  const { user } = useUser();
  const { userId } = useUserIdType();

  const fetchLogs = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await listAuditLogsOrg(activeTab, userId, nextToken, 10);
      const { items, nextToken: newNextToken } = response;

      setLogs((prev) => [...prev, ...items]);
      setNextToken(newNextToken);
      if (items.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(!!newNextToken);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    }
    setLoading(false);
  };

  const resetAndFetch = () => {
    setHasMore(true);
    setLoading(false);
    setNextToken(null);
    setLogs([]);
  };

  useEffect(() => {
    if (user?.attributes?.sub) {
      fetchLogs();
    }
  }, [user, activeTab]);

  // Re-fetch after reset (logs cleared)
  useEffect(() => {
    if (logs.length === 0 && hasMore && !loading && user?.attributes?.sub) {
      fetchLogs();
    }
  }, [logs]);

  const tabs = [
    { id: "organisation", label: "Organization" },
    { id: "broker", label: "Brokers" },
    { id: "agent", label: "Agents" },
  ];

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
        headerName: "Details",
        field: "detail",
        cellRenderer: DetailRenderer,
        flex: 2,
        minWidth: 300,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1,
        minWidth: 200,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date & Time",
        field: "createdAt",
        cellRenderer: DateRenderer,
        flex: 1,
        minWidth: 180,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
    ],
    [],
  );

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      <div className="space-x-3 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${
              activeTab === tab.id
                ? "bg-tertiary text-white"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055]"
            } transition-all rounded-full px-10 py-3`}
            onClick={() => {
              resetAndFetch();
              setActiveTab(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white !p-4 rounded-xl">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground font-medium">
            <CenterLoader />
          </div>
        ) : (
          <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
       
              <AgGridReact
                rowData={logs}
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

        <div className="text-center flex flex-col gap-4 my-4 text-muted-foreground">
          {loading && logs.length > 0 && <p>Loading...</p>}
          {!hasMore && logs.length !== 0 && <p>No more data to load.</p>}
          {logs.length > 0 && hasMore && !loading && (
            <Button size="sm" onClick={fetchLogs}>
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;