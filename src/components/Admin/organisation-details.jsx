import { useState, useMemo } from "react";
import { getFormattedDateTime, queryKeys } from "@/utils";
import { Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DateFilter from "../common/date-filter";
import BackBtn from "../back-btn";
import { useQuery } from "@tanstack/react-query";
import {
  getOrganisationAgentDetails,
  getOrganisationBrokerDetails,
} from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import OrgDetailHeader from "../org-detail-header";
import { AgGridReact } from "ag-grid-react";

const SrNoRenderer = (props) => {
  return <span>{props.node.rowIndex + 1}</span>;
};

function OrganisationDetails() {
  const navigate = useNavigate();
  const tabTypes = [
    {
      name: "Broker",
      id: "broker",
    },
    {
      name: "Agent",
      id: "agent",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabTypes[0]);

  const [date, setDate] = useState({ from: null, to: null });
  const { id } = useParams();
  const brokersAgentListingAdminQuery = useQuery({
    queryKey: [
      queryKeys.brokersAgentListingAdmin,
      activeTab.id,
      id,
      date?.from,
      date?.to,
    ],
    queryFn: () =>
      activeTab.id === "broker"
        ? getOrganisationBrokerDetails(id, true, date?.from, date?.to)
        : getOrganisationAgentDetails(id, true, date?.from, date?.to),
    enabled: !!id,
  });

  const ActionRenderer = (props) => {
    return (
      <div className="flex items-center justify-center gap-2 flex-row h-full">
        <Button
          size="icon"
          className="text-md"
          variant="ghost"
          onClick={() =>
            navigate(
              activeTab.id === "broker"
                ? `/admin/dashboard/broker-details/${props.data?.brokerId}`
                : `/admin/dashboard/property-search/${props.data?.agentId}`,
            )
          }
        >
          <Eye />
        </Button>
      </div>
    );
  };

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
        flex: 1.5,
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
        minWidth: 150,
        filter: false,
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
        filter: false,
      },
    ],
    [activeTab],
  );

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
      </div>
      <OrgDetailHeader />

      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="space-x-3 mb-4">
            {tabTypes.map((item) => (
              <button
                key={item.id}
                className={` ${
                  activeTab.id === item.id
                    ? "bg-tertiary text-white"
                    : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
                } transition-all  rounded-full px-10 py-3 `}
                onClick={() => setActiveTab(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-6">
              <p className="text-secondary font-medium text-xl">
                {activeTab.id === "broker" ? "All Broker" : "All Agents"}{" "}
              </p>
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
                  enableCellTextSelection={true}
                  ensureDomOrder={true}
                  suppressCellFocus={true}
                  overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
                />
            
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OrganisationDetails;
