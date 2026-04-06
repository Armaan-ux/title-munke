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
  <div className="whitespace-pre-wrap py-2 leading-snug">
    {valueFromStringifyObject(props.data?.detail)}
  </div>
);

function AuditLogsForBroker() {
  const { userId } = useUserIdType();

  const auditLogBrokerQuery = useQuery({
    queryKey: [queryKeys.auditLogBroker, userId],
    queryFn: () => getAuditLogsForBroker(userId, false),
  });

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        cellRenderer: SrNoRenderer,
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Details",
        field: "detail",
        cellRenderer: DetailsRenderer,
        flex: 3,
        minWidth: 300,
        filter: false,
        autoHeight: true,
      },
      {
        headerName: "Date & Time",
        field: "createdAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.createdAt),
        flex: 1,
        minWidth: 180,
        filter: false,
        cellStyle: { textAlign: "right" },
        headerClass: "ag-header-cell-right",
      },
    ],
    [],
  );

  return (
    <div className="bg-[#F5F0EC] rounded-lg text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {auditLogBrokerQuery?.isLoading && <CenterLoader />}
        {auditLogBrokerQuery?.isError && (
          <ShowError
            message={auditLogBrokerQuery?.error?.response?.data?.message}
          />
        )}
        {auditLogBrokerQuery?.isSuccess && (
          <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
       
              <AgGridReact
                rowData={auditLogBrokerQuery?.data?.items || []}
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
    </div>
  );
}

export default AuditLogsForBroker;