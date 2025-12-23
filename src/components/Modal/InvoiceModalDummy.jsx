import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { ArrowDownToLine } from "lucide-react";
import { convertFromTimestamp } from "@/utils";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import { useEffect, useRef } from "react";

export function InvoiceModalDummy({ open, onClose, invoice, isPrint=true }) {

  const {handleDownload, isDownloading} = usePdfDownload();
  const ref = useRef(null);
  useEffect(() => {
      if(onClose && isPrint) {
        setTimeout(() => handleDownload(ref), 300);
        setTimeout(onClose, 1000);
      }
    }, [])
  // if (!open) return null;
  const searchData = JSON.parse(invoice?.search_data?.searchData ?? "{}");
  return (
    // <Dialog open={open} onOpenChange={onClose}>
    //   <DialogContent  showCloseButton={false} className="!max-w-xl !w-full rounded-2xl bg-white p-6 shadow-lg">
        <div ref={ref} className={isDownloading ? "p-4 flex flex-col gap-4" : ""}>
          <div className="flex flex-row justify-between items-center">
            <img src="/Logo.svg" alt="Logo" className={`h-30 w-30 mb-1`} />
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

          <div className="grid grid-cols-2 gap-4 my-3">
            <div className="border rounded-md p-3">
              <p className="font-semibold text-tertiary mb-1">
                Issued From
              </p>
              <p className="text-sm text-secondary">
                {invoice?.customer_support ?? "2041 Lawfer AvenueAllentown, PA US"}
                {/* <br />
                Hometown, USA
                <br />
                Tax ID 12-345689 */}
              </p>
            </div>
            <div className="border rounded-md p-3">
              <p className="font-semibold text-tertiary mb-1">
                Billed To
              </p>
              <p className="text-sm text-secondary">
                {invoice?.customer_name ?? "--"}
                {/* <br />
                456 Oak Ave.
                <br />
                Street - 234, USA */}
              </p>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden mb-1">
            <div className={`bg-[#581b1b] text-white text-sm font-medium grid grid-cols-5 px-3 py-2 ${isDownloading ? "pb-6" : "py-2"}`}>
              <span className="col-span-2">Description</span>
              <span className="text-center">QTY</span>
              <span className="text-center">Price</span>
              <span className="text-right">Amount</span>
            </div>

            <div className="bg-[#fdf8f5] text-sm divide-y">
              <div className="grid grid-cols-5 items-center px-3 py-2">
                <div className="col-span-2">
                  <p className="font-medium text-[#581b1b]">{searchData?.address}</p>
                  {/* <p className="text-xs text-muted-foreground">
                    Billing Cycle: Sep To Aug
                  </p> */}
                </div>
                <p className="text-center">1</p>
                <p className="text-center">${invoice?.subtotal / 100}</p>
                <p className="text-right">${invoice?.subtotal / 100}</p>
              </div>
              {/* <div className="grid grid-cols-5 items-center px-3 py-2">
                <div className="col-span-2">
                  <p className="font-medium text-[#581b1b]">Agent Seat Fees</p>
                  <p className="text-xs text-muted-foreground">
                    Billing Cycle: Sep To Aug
                  </p>
                </div>
                <p className="text-center">0</p>
                <p className="text-center">$0.00</p>
                <p className="text-right">$0.00</p>
              </div> */}
            </div>

            <div className="bg-[#fdf8f5] text-sm border-t px-3 py-3 space-y-1 flex flex-col items-end gap-2">
              {/* <div></div>
              <div className="flex justify-between gap-10 w-48">
                <p>Subscription</p>
                <p>$25.00</p>
              </div> */}
              <div className="flex justify-between gap-10 w-48">
                <p>Subtotal</p>
                <p>${invoice?.subtotal / 100}</p>
              </div>
              <div className="flex justify-between gap-10 w-48">
                <p>Tax</p>
                <p>${invoice?.tax ? `${invoice?.tax}` : 0}</p>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 gap-10 w-48">
                <p className="text-tertiary">Total</p>
                <p className="text-secendary">${(invoice?.total / 100) + (invoice?.tax > 0 ? invoice?.tax : 0)}</p>
              </div>
            </div>
          </div>

          <p className="text-center text-[#581b1b] font-medium mb-1">
            Thank you for your business!
          </p>
          {!isDownloading && 
            <>
            <Separator />

            <DialogFooter className="flex justify-center gap-2 *:flex-1 mb-3">
              <Button onClick={() => onClose()} variant="outline" size="lg" >
                Close
              </Button>
              <Button variant="secondary" size="lg" >
                <ArrowDownToLine /> Download CSV
              </Button>
              <Button variant="secondary" size="lg" onClick={() => handleDownload(ref)} disabled={isDownloading}>
                <ArrowDownToLine /> Download PDF
              </Button>
            </DialogFooter>
            </>
          }
        </div>
    //   </DialogContent>
    // </Dialog>
  );
}
