import { queryKeys } from "@/utils";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import DateFilter from "../common/date-filter";
import BackBtn from "../back-btn";
import AgentDetailHeader from "../common/AgentHeader";
import { useQuery } from "@tanstack/react-query";
import { getAgentSearches, getIndividualDetails } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { format } from "date-fns-tz";
import { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

const SrNoRenderer = (props) => {
  return <span>{props.node.rowIndex + 1}</span>;
};

const StatusRenderer = (props) => {
  const status = props.data?.status;
  return (
    <div className="flex items-center justify-center h-full">
      <Badge
        className={`${
          status === "SUCCESS"
            ? "bg-[#E9F3E9] text-[#1E8221]"
            : "bg-[#FFF3D9] text-[#A2781E]"
        } text-[13px] font-medium px-3 py-1 rounded-full`}
      >
        {status}
      </Badge>
    </div>
  );
};

function OrganisationPropertySearchAgent() {
  const [date, setDate] = useState({ from: null, to: null });
  const { id } = useParams();

  const individualSearchesQuery = useQuery({
    queryKey: [queryKeys.individualSearchesAdmin, id, date.from, date.to],
    queryFn: () => getAgentSearches(id, date.from, date.to),
    enabled: !!id,
  });

  const individualMetricsAdminQeurry = useQuery({
    queryKey: [queryKeys.agentMetricsAdmin, id],
    queryFn: () => getIndividualDetails(id),
    enabled: !!id,
  });

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
        headerName: "Address",
        field: "address",
        flex: 2,
        minWidth: 300,
        filter: false,
      },
      {
        headerName: "Searched Date",
        field: "createdAt",
        valueGetter: (params) =>
          format(params.data?.createdAt, "MMM d, yyyy, HH:mm:ss"),
        flex: 1,
        minWidth: 200,
        filter: false,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusRenderer,
        flex: 1,
        minWidth: 150,
        filter: false,
        cellStyle: { textAlign: "center" },
      },
    ],
    [],
  );

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
      </div>
      {individualMetricsAdminQeurry?.isLoading && (
        <div className="h-auto">
          <CenterLoader />
        </div>
      )}
      {individualMetricsAdminQeurry?.isError && (
        <ShowError
          message={
            individualMetricsAdminQeurry?.error?.response?.data?.message
          }
        />
      )}
      {individualMetricsAdminQeurry?.isSuccess && (
        <AgentDetailHeader data={individualMetricsAdminQeurry?.data} />
      )}
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-6">
              <p className="text-secondary font-medium text-xl">
                Properties Searches
              </p>
            </div>
            <DateFilter
              handleFilter={(from, to) =>
                setDate((pre) => ({ ...pre, from, to }))
              }
            />
          </div>
          {individualSearchesQuery?.isLoading && <CenterLoader />}
          {individualSearchesQuery?.isError && (
            <ShowError
              message={
                individualSearchesQuery?.error?.response?.data?.message
              }
            />
          )}
          {individualSearchesQuery?.isSuccess && (
            <div
              className="ag-theme-quartz custom-ag-grid"
              style={{ width: "100%" }}
            >
           
                <AgGridReact
                  rowData={individualSearchesQuery?.data || []}
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
    </>
  );
}

export default OrganisationPropertySearchAgent;