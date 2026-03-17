import { useState } from "react";
// import "./index.css";
import { getFormattedDateTime, queryKeys } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Link,
  Share2,
  Printer,
  Eye,
  ChevronLeft,
  ArrowDownToLine,
  Pencil,
  Trash2,
  PencilLine,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateFilter from "../common/date-filter";
import BackBtn from "../back-btn";
import UserDetailHeader from "../user-detail-header";
import { useQuery } from "@tanstack/react-query";
import {
  getBrokerAgentsDetails,
  getOrganisationAgentDetails,
  getOrganisationBrokerDetails,
} from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import OrgDetailHeader from "../org-detail-header";

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

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
      </div>
      <OrgDetailHeader />

      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="space-x-3 mb-4">
            {tabTypes.map((item, index) => (
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
            <Table className="">
              <TableHeader className="bg-[#F5F0EC]">
                <TableRow>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-center">Searches</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-black">
                {brokersAgentListingAdminQuery?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="font-medium text-center py-10"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  brokersAgentListingAdminQuery?.data?.map((item, index) => (
                    <TableRow key={item.id} className="text-black">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item?.agentName}</TableCell>
                      <TableCell>
                        {getFormattedDateTime(item?.lastLogin)}
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.totalSearches}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="icon"
                          className="text-md"
                          variant="ghost"
                          onClick={() =>
                            navigate(
                              activeTab.id === "broker"
                                ? `/admin/dashboard/broker-details/${item?.brokerId}`
                                : `/admin/dashboard/property-search/${item?.agentId}`,
                            )
                          }
                        >
                          <Eye />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* {!hasMore && <p>No more data to load.</p>}
          {logs?.length > 0 && hasMore && !loading && (
            <div className="flex justify-center" >
              <button className=" mt-4">Load More</button>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}

export default OrganisationDetails;
