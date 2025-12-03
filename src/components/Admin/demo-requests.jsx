import { convertFromTimestamp, getFormattedDateTime } from "@/utils";
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
import { useQuery } from "@tanstack/react-query";
import { getListDemoReq } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";

const dummyData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    county: "Kandy",
    state: "Central",
    createdAt: "2023-03-01",
    description: "Interested in demo"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    county: "Colombo",
    state: "Western",
    createdAt: "2023-03-05",
    description: "Requested pricing details"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michaelb@example.com",
    county: "Galle",
    state: "Southern",
    createdAt: "2023-03-10",
    description: "Needs callback for demo"
  },
  {
    id: 4,
    name: "Emily Johnson",
    email: "emilyj@example.com",
    county: "Jaffna",
    state: "Northern",
    createdAt: "2023-03-12",
    description: "Looking for enterprise package"
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robertw@example.com",
    county: "Matara",
    state: "Southern",
    createdAt: "2023-03-18",
    description: "Interested in long-term contract"
  },
  {
    id: 6,
    name: "Sophia Davis",
    email: "sophiad@example.com",
    county: "Negombo",
    state: "Western",
    createdAt: "2023-03-20",
    description: "Follow-up required next week"
  },
  {
    id: 7,
    name: "David Miller",
    email: "davidm@example.com",
    county: "Kegalle",
    state: "Sabaragamuwa",
    createdAt: "2023-03-25",
    description: "Interested in integration options"
  },
  {
    id: 8,
    name: "Olivia Garcia",
    email: "oliviag@example.com",
    county: "Badulla",
    state: "Uva",
    createdAt: "2023-03-28",
    description: "Asked for technical documentation"
  },
  {
    id: 9,
    name: "Daniel Martinez",
    email: "danielm@example.com",
    county: "Trincomalee",
    state: "Eastern",
    createdAt: "2023-04-02",
    description: "Confirmed demo schedule"
  },
  {
    id: 10,
    name: "Ava Anderson",
    email: "avaa@example.com",
    county: "Kurunegala",
    state: "North Western",
    createdAt: "2023-04-06",
    description: "Needs proposal by next week"
  }
];


export default function DemoRequests() {
  const [activeTab, setActiveTab] = useState("pending");
  const demoReqQuery = useQuery({
    queryKey: ['getListDemoReq'],
    queryFn: getListDemoReq
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
                          <Button variant="ghost" size="icon" >
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
              {dummyData?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="font-medium text-center py-10"
                  >
                    No Records found.
                  </TableCell>
                </TableRow>
              ) : (
                dummyData?.slice(5).map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                    <TableCell className="text-black font-medium" >{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.county}</TableCell>
                    <TableCell>{item.state}</TableCell>
                    <TableCell>
                      {/* {new Date(item.createdAt).toLocaleDateString()} */}
                      {item.createdAt}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
