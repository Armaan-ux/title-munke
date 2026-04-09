import { API } from "aws-amplify";
import { useState, useEffect, useMemo } from "react";
// import "./index.css";
import { useUser } from "@/context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "@/utils";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { listAuditLogs } from "../service/userAdmin";
import { valueFromStringifyObject } from "@/lib/utils";

const SrNoRenderer = (props) => {
  return <span>{props.node.rowIndex + 1}</span>;
};

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [activeTab, setActiveTab] = useState("organisation");
  const { user } = useUser();

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "index",
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
        valueGetter: (params) => valueFromStringifyObject(params.data.detail),
        flex: 2,
        minWidth: 300,
        filter: false,
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1,
        minWidth: 200,
        filter: false,
      },
      {
        headerName: "Date & Time",
        field: "createdAt",
        valueGetter: (params) => getFormattedDateTime(params.data.createdAt),
        flex: 1,
        minWidth: 180,
        filter: false,
      },
    ],
    [],
  );

  const fetchLogs = async (isInitial = false) => {
    if ((loading || !hasMore) && !isInitial) return;

    setLoading(true);
    try {
      const response = await listAuditLogs(
        activeTab,
        null,
        isInitial ? null : nextToken,
      );
      const { items, nextToken: newNextToken } = response;

      setLogs((prev) => {
        const logMap = new Map();
        if (!isInitial) {
          prev.forEach((item) => logMap.set(item.id, item));
        }
        items.forEach((item) => logMap.set(item.id, item));
        return Array.from(logMap.values());
      });

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

  const resetStateOnTabChange = () => {
    setHasMore(true);
    setLoading(false);
    setNextToken(null);
    setLogs([]);
  };

  useEffect(() => {
    if (user?.attributes?.sub) {
      fetchLogs(true);
    }
  }, [user, activeTab]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      <div className="space-x-3 mb-4">
        <button
          className={` ${activeTab === "organisation" ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "} transition-all  rounded-full px-10 py-3 `}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("organisation");
          }}
        >
          Organization
        </button>
        <button
          className={` ${activeTab === "broker" ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "} transition-all  rounded-full px-10 py-3 `}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("broker");
          }}
        >
          Brokers
        </button>
        <button
          className={` ${activeTab === "agent" ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "} transition-all  rounded-full px-10 py-3 `}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("agent");
          }}
        >
          Agents
        </button>
      </div>

      <div className="bg-white !p-4 rounded-xl">
        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
          <AgGridReact
            rowData={logs || []}
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
            enableCellTextSelection={true}
            ensureDomOrder={true}
            suppressCellFocus={true}
            overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
          />
        </div>

        <div className="text-center space-y-2 my-4 text-muted-foreground">
          {loading && <p>Loading...</p>}
          {!hasMore && !loading && <p>No more data to load.</p>}

          {logs?.length > 0 && hasMore && !loading && (
            <div className="flex justify-center my-4">
              <Button className="mx-auto" onClick={() => fetchLogs(false)}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    // <div className="history-main-content">
    //   <div className="setting-page-title">
    //     <h1>Agent Audit Logs</h1>
    //   </div>
    //   <div className="history-card">
    //     <table className="history-styled-table table-container">
    //       <thead>
    //         <tr>
    //           <th>Action</th>
    //           <th>Detail</th>
    //           <th>Time</th>
    //           <th>Email</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {logs?.map((elem) => (
    //           <tr key={elem.id} id="broker-row-1">
    //             <td>{elem?.action}</td>
    //             <td> {elem?.detail?.replace(/[{}"]/g, "")}</td>
    //             <td>{getFormattedDateTime(elem?.createdAt)}</td>
    //             <td>{elem?.email}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>

    //     {logs?.length === 0 && <p>No Records found.</p>}
    //     {loading && <p>Loading...</p>}
    //     {!hasMore && <p>No more data to load.</p>}

    //     {logs?.length > 0 && hasMore && !loading && (
    //       <button className="loadmore" onClick={fetchLogs}>
    //         Load More
    //       </button>
    //     )}
    //   </div>
    // </div>
  );
}

export default AuditLogs;
