import { useState, useMemo } from "react";
import { getFormattedDateTime, queryKeys } from "@/utils";
import { Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DateFilter from "../common/date-filter";
import BackBtn from "../back-btn";
import UserDetailHeader from "../user-detail-header";
import { useQuery } from "@tanstack/react-query";
import { getBrokerAgentsDetails } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { AgGridReact } from "ag-grid-react";

const SrNoRenderer = (props) => {
  return <span>{props.node.rowIndex + 1}</span>;
};

const ActionRenderer = (props) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-full">
      <Button
        size="icon"
        className="text-md"
        variant="ghost"
        onClick={() =>
          navigate(`/admin/dashboard/property-search/${props.data?.agentId}`)
        }
      >
        <Eye />
      </Button>
    </div>
  );
};

function OrganisationBrokerDetails() {
  const navigate = useNavigate();
  const [date, setDate] = useState({ from: null, to: null });
  const { id } = useParams();

  const brokersAgentListingAdminQuery = useQuery({
    queryKey: [queryKeys.brokersAgentListingAdmin, id, date?.from, date?.to],
    queryFn: () => getBrokerAgentsDetails(id, true, date?.from, date?.to),
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
        headerName: "Name",
        field: "agentName",
        flex: 2,
        minWidth: 200,
        filter: false,
      },
      {
        headerName: "Last Activity",
        field: "lastLogin",
        valueGetter: (params) => getFormattedDateTime(params.data?.lastLogin),
        flex: 1,
        minWidth: 200,
        filter: false,
      },
      {
        headerName: "Searches",
        field: "totalSearches",
        flex: 1,
        minWidth: 120,
        filter: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: ActionRenderer,
        flex: 1,
        minWidth: 120,
        filter: false,
        sortable: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
    ],
    [],
  );

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
      </div>
      <UserDetailHeader />

      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-6">
              <p className="text-secondary font-medium text-xl">All Agents</p>
            </div>
            <DateFilter
              handleFilter={(from, to) =>
                setDate((pre) => ({ ...pre, from, to }))
              }
            />
          </div>
          {brokersAgentListingAdminQuery?.isLoading && <CenterLoader />}
          {brokersAgentListingAdminQuery?.isError && (
            <ShowError
              message={
                brokersAgentListingAdminQuery?.error?.response?.data?.message
              }
            />
          )}
          {brokersAgentListingAdminQuery?.isSuccess && (
            <div
              className="ag-theme-quartz custom-ag-grid"
              style={{ width: "100%" }}
            >
          
                <AgGridReact
                  rowData={brokersAgentListingAdminQuery?.data || []}
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
      </div>
    </>
  );
}

export default OrganisationBrokerDetails;