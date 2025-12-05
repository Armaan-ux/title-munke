import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertFromTimestamp, getFormattedDateTime, queryKeys } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns-tz";
import { listBrokers } from "../service/userAdmin";
import { useQuery } from "@tanstack/react-query";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";

export default function BrokerBusinessTable(){
  const brokerListingQuery = useQuery({
    queryKey: [queryKeys.brokerListingForAdminDefault],
    queryFn: () => listBrokers({withSearchCount: true, limit: 5})
  })
    return(
        <div>
            {brokerListingQuery?.isLoading && <CenterLoader />}
            {brokerListingQuery?.isError && <ShowError message={brokerListingQuery?.error?.response?.data?.message} />}
            {brokerListingQuery?.isSuccess &&
              <Table className="w-full">
                <TableHeader className="bg-[#F5F0EC] w-full">
                  <TableRow className="w-full">
                    <TableHead >Sr. No.</TableHead>
                    <TableHead>
                      Broker Name
                      {/* <p className="flex items-center gap-2">
                        Broker Name<span>{getSortArrow("address")}</span>
                      </p> */}
                    </TableHead>
                    <TableHead className="text-center">
                      Agent
                      {/* <p className="flex items-center justify-center gap-2">
                        Agent <span>{getSortArrow("createdAt")}</span>
                      </p> */}
                    </TableHead>
                    <TableHead className="text-center">
                      Search Count
                      {/* <p className="flex items-center justify-center gap-2">
                        Search Count <span>{getSortArrow("status")}</span>
                      </p> */}
                    </TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-center" >Business</TableHead>
                    <TableHead className="text-center" >Account Created</TableHead>
                    <TableHead>Action</TableHead>
                    {/* <TableHead></TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brokerListingQuery?.data?.items?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="font-medium text-center py-10"
                      >
                        No Records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    brokerListingQuery?.data?.items?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center" >{item?.agentCount}</TableCell>
                        <TableCell className="text-center" >{item?.totalSearches}</TableCell>
                        <TableCell>
                          {getFormattedDateTime(item?.lastLogin)}
                          {/* {convertFromTimestamp(item?.lastLogin)} */}
                        </TableCell>
                        <TableCell className="text-center" >{item?.revenue}</TableCell>
                        <TableCell className="text-center" >
                          {getFormattedDateTime(item?.createdAt)}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <div className="flex items-center gap-2 flex-row">
                            <Link to={`/admin/broker-details/${item?.id}`} >
                            <Button
                              size="icon"
                              className="text-md"
                              variant="ghost"
                              >
                              <Eye />
                            </Button>
                              </Link>
                          </div>
                        </TableCell>
                        {/* <TableCell className="text-right"></TableCell> */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            }
        </div>
    )
}