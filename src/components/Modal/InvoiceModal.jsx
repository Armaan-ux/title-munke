import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { ArrowDownToLine } from "lucide-react";

export function InvoiceModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-row justify-between items-center">
          <img src="/Logo.svg" alt="Logo" className="h-20 w-20 mb-1" />
          <h2 className="text-2xl font-bold text-secondary tracking-wide">
            INVOICE
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4  border p-5 rounded-md bg-[#fdf8f5]">
          <div className="flex justify-between items-center">
            <p className="text-sm text-secondary font-semibold">Invoice ID</p>
            <p className="text-sm font-medium text-secondary">#1584647</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-secondary font-semibold">Bill Date</p>
            <p className="text-sm font-medium text-secondary">Apr 01, 2025</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-secondary font-semibold">
              Payment Method
            </p>
            <p className="text-sm font-medium text-secondary">
              Visa Master Card
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-1">
          <div className="border rounded-md p-3">
            <p className="text-sm font-semibold text-[#581b1b] mb-1">
              Issued From
            </p>
            <p className="text-xs text-secondary">
              123 Main St.
              <br />
              Hometown, USA
              <br />
              Tax ID 12-345689
            </p>
          </div>
          <div className="border rounded-md p-3">
            <p className="text-sm font-semibold text-[#581b1b] mb-1">
              Billed To
            </p>
            <p className="text-xs text-secondary">
              John Marks
              <br />
              456 Oak Ave.
              <br />
              Street - 234, USA
            </p>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden mb-1">
          <div className="bg-[#581b1b] text-white text-sm font-medium grid grid-cols-5 px-3 py-2">
            <span className="col-span-2">Description</span>
            <span className="text-center">QTY</span>
            <span className="text-center">Price</span>
            <span className="text-right">Amount</span>
          </div>

          <div className="bg-[#fdf8f5] text-sm divide-y">
            <div className="grid grid-cols-5 px-3 py-2">
              <div className="col-span-2">
                <p className="font-medium text-[#581b1b]">Agent Seat Fees</p>
                <p className="text-xs text-muted-foreground">
                  Billing Cycle: Sep To Aug
                </p>
              </div>
              <p className="text-center">9</p>
              <p className="text-center">$25.00</p>
              <p className="text-right">$225.00</p>
            </div>
            <div className="grid grid-cols-5 px-3 py-2">
              <div className="col-span-2">
                <p className="font-medium text-[#581b1b]">Agent Seat Fees</p>
                <p className="text-xs text-muted-foreground">
                  Billing Cycle: Sep To Aug
                </p>
              </div>
              <p className="text-center">0</p>
              <p className="text-center">$0.00</p>
              <p className="text-right">$0.00</p>
            </div>
          </div>

          <div className="bg-[#fdf8f5] text-sm border-t px-3 py-3 space-y-1 flex flex-col items-end gap-2">
            <div></div>
            <div className="flex justify-between gap-10 w-48">
              <p>Subscription</p>
              <p>$25.00</p>
            </div>
            <div className="flex justify-between gap-10 w-48">
              <p>Subtotal</p>
              <p>$225.00</p>
            </div>
            <div className="flex justify-between gap-10 w-48">
              <p>Tax</p>
              <p>$5.00</p>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 gap-10 w-48">
              <p>Total</p>
              <p>$230.00</p>
            </div>
          </div>
        </div>

        <p className="text-center text-[#581b1b] font-medium mb-1">
          Thank you for your business!
        </p>
        <Separator />

        <DialogFooter className="flex justify-center gap-3">
          <Button variant="outline" className="w-28">
            Close
          </Button>
          <Button className="bg-[#581b1b] hover:bg-[#6b1e1e] w-36 text-xs">
            <ArrowDownToLine /> Download CSV
          </Button>
          <Button className="bg-[#581b1b] hover:bg-[#6b1e1e] w-36 text-xs">
            <ArrowDownToLine /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
