import { convertFromTimestamp, getFormattedDateTime, queryKeys } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repeat2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getListDemoReq, markDemoRequestContacted } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";

export default function DemoRequests() {
  const [activeTab, setActiveTab] = useState("pending");
  const demoReqQuery = useQuery({
    queryKey: ['getListDemoReq'],
    queryFn: getListDemoReq
  })
  const demoReqContactedQuery = useQuery({
    queryKey: [queryKeys.getListDemoReqContacted],
    queryFn: () => getListDemoReq("CONTACTED")
  })

  const markDemoRequestContactedMutation = useMutation({
    mutationFn: (id) => markDemoRequestContacted(id),
    onSuccess: () => {demoReqQuery.refetch(); demoReqContactedQuery.refetch()}
  })

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      <div className="space-x-3 mb-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={` ${
            activeTab === "pending"
              ? "bg-tertiary text-white hover:bg-tertiary"
              : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
          } transition-all  rounded-full px-10 py-3 `}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("contacted")}
          className={` ${
            activeTab === "contacted"
              ? "bg-tertiary text-white hover:bg-tertiary"
              : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
          } transition-all  rounded-full px-10 py-3 `}
        >
          Contacted
        </button>
      </div>

      <div className="bg-white !p-4 rounded-xl">
        {activeTab === "pending" ? (
          <>
            {demoReqQuery?.isLoading && <CenterLoader />}
            {demoReqQuery?.isError && <ShowError />}
            {demoReqQuery?.isSuccess && 
              <Table className="">
                <TableHeader className="bg-[#F5F0EC]">
                  <TableRow>
                    <TableHead className="text-center">Sr. No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email / Phone No.</TableHead>
                    <TableHead>County</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Date (Received)</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoReqQuery?.data?.items?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="font-medium text-center py-10"
                      >
                        No Records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    demoReqQuery?.data?.items?.map((item, index) => (
                      <TableRow key={item.id} >
                        <TableCell className="font-medium text-center">{index + 1}</TableCell>
                        <TableCell className="text-black font-medium" >{item?.name}</TableCell>
                        <TableCell>{item?.email}</TableCell>
                        <TableCell>{item?.country}</TableCell>
                        <TableCell>{item?.state}</TableCell>
                        <TableCell>
                          {/* {new Date(item.createdAt).toLocaleDateString()} */}
                          {convertFromTimestamp(parseInt(new Date(item?.createdAt).getTime() / 1000), "monthDateYear")}
                        </TableCell>
                        <TableCell>{item?.additionalMessage}</TableCell>
                        <TableCell className="text-center" >
                          <Button variant="ghost" size="icon" onClick={() => markDemoRequestContactedMutation.mutate(item?.id)} disabled={markDemoRequestContactedMutation.isPending}>
                            <Repeat2 className="mx-auto size-5"  />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            }
          </>
        ) : (
          <>
            {demoReqContactedQuery?.isLoading && <CenterLoader />}
            {demoReqContactedQuery?.isError && <ShowError />}
            {demoReqContactedQuery?.isSuccess &&
              <Table className="">
                <TableHeader className="bg-[#F5F0EC]">
                  <TableRow>
                    <TableHead className="text-center">Sr. No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email / Phone No.</TableHead>
                    <TableHead>County</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Date (Received)</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoReqContactedQuery?.data?.items?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="font-medium text-center py-10"
                      >
                        No Records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    demoReqContactedQuery?.data?.items?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-center">{index + 1}</TableCell>
                        <TableCell className="text-black font-medium" >{item?.name}</TableCell>
                        <TableCell>{item?.email}</TableCell>
                        <TableCell>{item?.country}</TableCell>
                        <TableCell>{item?.state}</TableCell>
                        <TableCell>
                          {/* {new Date(item.createdAt).toLocaleDateString()} */}
                          {convertFromTimestamp(parseInt(new Date(item?.createdAt).getTime() / 1000), "monthDateYear")}
                        </TableCell>
                        <TableCell>{item?.additionalMessage}</TableCell>
                    
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            }
          </>
        )}
      </div>
    </div>
  );
}
