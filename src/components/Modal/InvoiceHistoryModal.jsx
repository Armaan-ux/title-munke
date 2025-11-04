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

export function InvoiceHistoryModal({ open, onClose }) {
  const rows = [
    {
      id: 1,
      agent: "James Anderson",
      address: "123 Main St, Hometown, USA",
      date: "Oct 12, 2025 - 05:30 PM",
      price: "$25",
    },
    {
      id: 2,
      agent: "Michael Smith",
      address: "456 Oak Ave, Street - 234, USA",
      date: "Oct 12, 2025 - 05:30 PM",
      price: "$25",
    },
    {
      id: 3,
      agent: "Daniel Wilson",
      address: "456 Oak Ave, Street - 234, USA",
      date: "Oct 12, 2025 - 05:30 PM",
      price: "$25",
    },
    {
      id: 4,
      agent: "Daniel Wilson",
      address: "456 Oak Ave, Street - 234, USA",
      date: "Oct 12, 2025 - 05:30 PM",
      price: "$25",
    },
    {
      id: 5,
      agent: "Daniel Wilson",
      address: "456 Oak Ave, Street - 234, USA",
      date: "Oct 12, 2025 - 05:30 PM",
      price: "$25",
    },
    {
      id: 6,
      agent: "Thomas Clark",
      address: "123 Main St, Hometown, USA",
      date: "Oct 12, 2025 - 05:30 PM",
      price: "$25",
    },
    {
      id: 7,
      agent: "Thomas Clark",
      address: "123 Main St, Hometown, USA",
      date: "Oct 12, 2025 - 05:30 PM",
      price: "$25",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent  showCloseButton={false} className="w-[1000px] max-w-[100vw] sm:w-[900px] sm:max-w-[170vw] rounded-2xl p-6">
        <DialogHeader className="flex flex-row justify-between items-center">
          <img src="/Logo.svg" alt="Logo" className="h-18 w-18 mb-1" />
          <div>
            <DialogTitle className="text-xl font-bold text-[#600000] tracking-wide !font-poppins">
              INVOICE
            </DialogTitle>
            <span className="text-sm text-neutral-500 font-medium">
              #INV-2025-001
            </span>
          </div>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto">
          <Table className="w-full min-w-[600px] text-left border-collapse text-sm">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead className="w-[100px]">Sr. No.</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{String(i + 1).padStart(2, "0")}.</TableCell>
                  <TableCell className="font-medium" >{row.agent}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end font-semibold mt-3 text-neutral-900 bg-[#F5F0EC] py-2 px-4 rounded-md w-full">
            <span className=" text-tertiary font-bold mr-2" > Total </span> <span className="ml-2">$230.00</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-2 *:w-full max-w-[11rem] mx-auto">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
