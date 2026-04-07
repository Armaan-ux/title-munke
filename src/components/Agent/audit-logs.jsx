import { getFormattedDateTime, queryKeys } from "@/utils";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useQuery } from "@tanstack/react-query";
import { listAuditLogsByUserId } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import { valueFromStringifyObject } from "@/lib/utils";
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const DetailsRenderer = (props) => (
  <div className="whitespace-pre-wrap py-2 leading-snug">
    {valueFromStringifyObject(props.data?.detail)}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuditLogs() {
  const { userId } = useUserIdType();

  const { data: auditLogs, isPending: isLogsPending } = useQuery({
    queryKey: [queryKeys.listAuditLogsByUserId],
    queryFn: () => listAuditLogsByUserId(userId),
    skip: !userId,
  });

  const logs = auditLogs?.data?.items || [];

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        cellRenderer: SrNoRenderer,
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        flex: 1,
        sortable: false,
      },
      {
        headerName: "Details",
        field: "detail",
        cellRenderer: DetailsRenderer,
        flex: 2,
        minWidth: 300,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date & Time",
        field: "createdAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.createdAt),
        flex: 1,
        minWidth: 180,
         wrapText: true,
        autoHeight: true,
      },
    ],
    [],
  );

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {isLogsPending ? (
          <CenterLoader />
        ) : (
          <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
         
              <AgGridReact
                rowData={logs}
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
                overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
              />
            
          </div>
        )}
      </div>
    </div>
  );
}