import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { ArrowDownToLine } from "lucide-react";
import { convertFromTimestamp } from "@/utils";
import { usePdfDownload } from "@/hooks/usePdfDownload";

export function InvoiceModal({ open, onClose, invoice }) {
  const {handleDownload} = usePdfDownload()
  if (!open) return null;
  if(!invoice) return null
  const subPrice = invoice?.plans?.find((plan) => plan?.priceName === "Monthly Subscription Price")?.amount / 100;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent  showCloseButton={false} className="!max-w-xl !w-full rounded-2xl bg-white p-6 shadow-lg" id="invoice">
        <div className="flex flex-row justify-between items-center">
          <img src="/Logo.svg" alt="Logo" className="h-20 w-20 mb-1" />
          <p className="text-3xl font-bold text-tertiary tracking-wide">
            INVOICE
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4   p-5 rounded-md bg-[#fdf8f5]">
          <div className="flex justify-between items-center">
            <p className="text-sm text-tertiary font-medium">Invoice ID</p>
            <p className="text-sm text-secondary">{invoice?.id}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-tertiary font-medium">Bill Date</p>
            <p className="text-sm text-secondary">{convertFromTimestamp(invoice?.created, "dateTime")}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-tertiary font-medium">
              Payment Method
            </p>
            <p className="text-sm text-secondary uppercase">
              {invoice?.payment_method?.brand ?? ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-1">
          <div className="border rounded-md p-3">
            <p className="font-semibold text-tertiary mb-1">
              Issued From
            </p>
            <p className="text-sm text-secondary">
              123 Main St.
              <br />
              Hometown, USA
              <br />
              Tax ID 12-345689
            </p>
          </div>
          <div className="border rounded-md p-3">
            <p className="font-semibold text-tertiary mb-1">
              Billed To
            </p>
            <p className="text-sm text-secondary">
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
            {invoice?.plans?.map(plan => {
              if(plan?.priceName === "Monthly Subscription Price") return null;
              return <div className="grid grid-cols-5 items-center px-3 py-2" key={plan?.priceId}>
                <div className="col-span-2">
                  <p className="font-medium text-[#581b1b]">{plan?.priceName}</p>
                  <p className="text-xs text-muted-foreground">
                    Billing Cycle: {convertFromTimestamp(plan?.start, "monthYear")?.split(",")?.[0]} To {convertFromTimestamp(plan?.end, "monthYear")}
                  </p>
                </div>
                <p className="text-center">{plan?.quantity}</p>
                <p className="text-center">${plan?.amount / 100}</p>
                <p className="text-right">${(plan?.amount / 100) * plan?.quantity}</p>
              </div>
              })}
          </div>

          <div className="bg-[#fdf8f5] text-sm border-t px-3 py-3 space-y-1 flex flex-col items-end gap-2">
            <div></div>
            <div className="flex justify-between gap-10 w-48">
              <p>Subscription</p>
              <p>${subPrice}</p>
            </div>
            <div className="flex justify-between gap-10 w-48">
              <p  >Subtotal</p>
              <p>${invoice?.subtotal / 100}</p>
            </div>
            <div className="flex justify-between gap-10 w-48">
              <p>Tax</p>
              <p>${invoice?.tax ? `${invoice?.tax}` : 0}</p>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 gap-10 w-48">
              <p className="text-tertiary">Total</p>
              <p className="text-secendary">${(invoice?.total / 100) + (invoice?.tax ? invoice?.tax : 0)}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-[#581b1b] font-medium mb-1">
          Thank you for your business!
        </p>
        <Separator />

        <DialogFooter className="flex justify-center gap-2 *:flex-1">
          <Button onClick={() => onClose()} variant="outline" size="lg" >
            Close
          </Button>
          <Button variant="secondary" size="lg" >
            <ArrowDownToLine /> Download CSV
          </Button>
          <Button variant="secondary" size="lg">
            <ArrowDownToLine /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
