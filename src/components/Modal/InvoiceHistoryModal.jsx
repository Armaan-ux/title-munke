import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Download } from "lucide-react";
import { InvoiceModal } from "./InvoiceModal";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useQuery } from "@tanstack/react-query";
import { getBrokerTotalSearches } from "../service/userAdmin";
import { useEffect } from "react";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { convertFromTimestamp } from "@/utils";

export function InvoiceHistoryModal({ open, onClose, invoice }) {
  
  const showAgentIvoiceListing = invoice?.plans?.find((inv) => inv?.priceName === "Agent Seat Price")?.quantity > 0;
  const today = new Date();
  const startDateUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
  const endDateUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999));
  const fromDatetime = startDateUTC.toISOString();
  const toDatetime = endDateUTC.toISOString();

  const {userId} = useUserIdType();
  const agentSearchesQuery = useQuery({
    queryKey: ["agentSearchesListing"],
    queryFn: () => getBrokerTotalSearches(userId, fromDatetime, toDatetime),
    enabled: !!userId && showAgentIvoiceListing
  })

  const rows = [
    {
      id: 1,
      agent: "James Anderson",
      address: "123 Main St, Hometown, USA",
      date: "Oct 12, 2025 - 05:30 PM",
    },
    {
      id: 2,
      agent: "Michael Smith",
      address: "456 Oak Ave, Street - 234, USA",
      date: "Oct 12, 2025 - 05:30 PM",
    },
    {
      id: 3,
      agent: "Daniel Wilson",
      address: "456 Oak Ave, Street - 234, USA",
      date: "Oct 12, 2025 - 05:30 PM",
    },
    {
      id: 4,
      agent: "Daniel Wilson",
      address: "456 Oak Ave, Street - 234, USA",
      date: "Oct 12, 2025 - 05:30 PM",
    },
    {
      id: 5,
      agent: "Daniel Wilson",
      address: "456 Oak Ave, Street - 234, USA",
      date: "Oct 12, 2025 - 05:30 PM",
    },
    {
      id: 6,
      agent: "Thomas Clark",
      address: "123 Main St, Hometown, USA",
      date: "Oct 12, 2025 - 05:30 PM",
    },
    {
      id: 7,
      agent: "Thomas Clark",
      address: "123 Main St, Hometown, USA",
      date: "Oct 12, 2025 - 05:30 PM",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent  showCloseButton={false} className="w-[1000px] max-w-[100vw] sm:w-[900px] sm:max-w-[170vw] rounded-2xl p-6 max-h-screen overflow-y-auto">
        <InvoiceModal invoice={invoice} />
        {showAgentIvoiceListing && 
          <>
            {agentSearchesQuery?.isLoading && <CenterLoader />}
            {agentSearchesQuery?.isError && <ShowError message={agentSearchesQuery?.error?.response?.data?.message} />}
            {agentSearchesQuery?.data?.Items?.length === 0 &&  <div>No Searches found.</div>}
            {agentSearchesQuery?.data?.Items?.length > 0 &&
              <div>
                {/* <DialogHeader className="flex flex-row justify-between items-center">
                  <img src="/Logo.svg" alt="Logo" className="h-18 w-18 mb-1" />
                  <div>
                    <DialogTitle className="text-[32px] font-bold text-[#600000] tracking-wide !font-poppins">
                      INVOICE
                    </DialogTitle>
                    <div className="text-[#550000] font-medium !text-center">
                      #INV-2025-001
                    </div>
                  </div>
                </DialogHeader> */}

                <div className="mt-4 overflow-x-auto">
                  <Table className="w-full min-w-[600px] text-left border-collapse text-sm">
                    <TableHeader className="bg-[#F5F0EC]">
                      <TableRow>
                        <TableHead className="w-[100px]">Sr. No.</TableHead>
                        <TableHead>Agents</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentSearchesQuery?.data?.Items?.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{String(i + 1).padStart(2, "0")}.</TableCell>
                          <TableCell className="font-medium" >{row?.userId}</TableCell>
                          <TableCell>{row?.address}</TableCell>
                          <TableCell>{convertFromTimestamp(parseInt(new Date(row?.createdAt)?.getTime() / 1000), "dateTime")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* <div className="mt-6 flex justify-center space-x-2 *:w-full max-w-[11rem] mx-auto">
                  <Button variant="outline" onClick={() => onClose()}>
                    Close
                  </Button>
                  <Button variant="secondary" size="lg" >
                    <Download />
                    Download CSV 
                  </Button>
                  <Button variant="secondary" size="lg" >
                    <Download />
                    Download PDF
                  </Button>
                </div> */}
              </div>
            }
          </>
        }
      </DialogContent>
    </Dialog>
  );
}
