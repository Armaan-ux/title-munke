import { getFormattedDateTime, queryKeys } from "@/utils";
import { getAuditLogsForBroker } from "../service/userAdmin";
import { useQuery } from "@tanstack/react-query";
import { useUserIdType } from "@/hooks/useUserIdType";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { valueFromStringifyObject } from "@/lib/utils";
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const DetailsRenderer = (props) => (
  <div className="py-2 leading-snug">
    {valueFromStringifyObject(props.data?.detail)}
  </div>
);

function AuditLogsAgent() {
  const { userId } = useUserIdType();

  const auditLogAgentQuery = useQuery({
    queryKey: [queryKeys.auditLogAgent, userId],
    queryFn: () => getAuditLogsForBroker(userId, true),
  });

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
        headerName: "Details",
        field: "detail",
        cellRenderer: DetailsRenderer,
        flex: 1.5,
        minWidth: 280,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1,
        minWidth: 200,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date & Time",
        field: "createdAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.createdAt),
        flex: 1,
        minWidth: 180,
      },
    ],
    [],
  );

  return (
    <div className="bg-[#F5F0EC] rounded-lg text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {auditLogAgentQuery?.isLoading && <CenterLoader />}
        {auditLogAgentQuery?.isError && (
          <ShowError
            message={auditLogAgentQuery?.error?.response?.data?.message}
          />
        )}
        {auditLogAgentQuery?.isSuccess && (
          <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
       
              <AgGridReact
                rowData={auditLogAgentQuery?.data?.items || []}
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

export default AuditLogsAgent;