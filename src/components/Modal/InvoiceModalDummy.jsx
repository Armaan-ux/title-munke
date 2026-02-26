import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { ArrowDownToLine } from "lucide-react";
import { convertFromTimestamp } from "@/utils";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import { useEffect, useRef } from "react";

export function InvoiceModalDummy({ open, onClose, invoice, isPrint = true }) {
  const { handleDownload, isDownloading } = usePdfDownload();
  const ref = useRef(null);
  useEffect(() => {
    if (onClose && isPrint) {
      setTimeout(() => handleDownload(ref), 300);
      setTimeout(onClose, 1000);
    }
  }, []);
  // if (!open) return null;
  const searchData = JSON.parse(invoice?.search_data?.searchData ?? "{}");

  const handleDownloadCSV = () => {
    const csvData = [];
    
    // Add header info
    csvData.push(['Invoice ID', invoice?.id]);
    csvData.push(['Bill Date', convertFromTimestamp(invoice?.created, "dateTime")]);
    csvData.push(['Customer', invoice?.customer_name]);
    csvData.push([]);
    
    // Add table header
    csvData.push(['Description', 'QTY', 'Price', 'Amount']);
    
    // Add line items
    if (invoice?.plans?.length > 0 && 
        (invoice?.description?.includes(`1 × Professional Plan (Broker) (at $10.00 / month)`) || 
         invoice?.description?.includes(`1 × Professional Plan (Organisation) (at $10.00 / month)`))) {
      invoice.plans.forEach(plan => {
        const priceName = plan.priceName === "Seat price in Professional Plan (Broker)" || 
                         plan.priceName === "Seat price in Professional Plan(Organisation)"
                         ? "Seat price"
                         : plan.priceName;
        csvData.push([priceName, plan.quantity, plan.price || "$10.00", `$${(plan.amount / 100).toFixed(2)}`]);
      });
    } else {
      csvData.push([invoice?.description, '1', `$${invoice?.subtotal / 100}`, `$${invoice?.subtotal / 100}`]);
    }
    
    csvData.push([]);
    csvData.push(['Subtotal', '', '', `$${invoice?.subtotal / 100}`]);
    csvData.push(['Tax', '', '', `$${invoice?.tax || 0}`]);
    csvData.push(['Total', '', '', `$${invoice?.total / 100 + (invoice?.tax > 0 ? invoice?.tax : 0)}`]);
    
    // Convert to CSV string
    const csvString = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Create blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoice-${invoice?.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // <Dialog open={open} onOpenChange={onClose}>
    //   <DialogContent  showCloseButton={false} className="!max-w-xl !w-full rounded-2xl bg-white p-6 shadow-lg">
    <div ref={ref} style={{ padding: isDownloading ? "24px" : "0px" }}>
      <div className="flex flex-row justify-between items-center">
        <img src="/Logo.svg" alt="Logo" className={`h-30 w-30 mb-1`} />
        <p className="text-3xl font-bold text-tertiary tracking-wide">
          INVOICE
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-4 p-5 rounded-md bg-[#fdf8f5]"
        style={{ padding: isDownloading ? "8px 15px" : "" }}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm text-tertiary font-medium">Invoice ID</p>
          <p className="text-sm text-secondary">{invoice?.id}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-tertiary font-medium">Bill Date</p>
          <p className="text-sm text-secondary">
            {convertFromTimestamp(invoice?.created, "dateTime")}
          </p>
        </div>
        <div
          className="flex justify-between items-center"
          style={{ paddingBottom: isDownloading ? "15px" : "" }}
        >
          <p className="text-sm text-tertiary font-medium">Payment Method</p>
          <p className="text-sm text-secondary uppercase">
            {invoice?.payment_method?.brand ?? ""}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-4 my-3"
        style={{ margin: isDownloading ? "15px 0px" : "" }}
      >
        <div
          className="border rounded-md p-3"
          style={{ padding: isDownloading ? "0px 20px 20px" : "" }}
        >
          <p className="font-semibold text-tertiary mb-1">Issued From</p>
          <p className="text-sm text-secondary">
            {invoice?.customer_support ?? "2041 Lawfer AvenueAllentown, PA US"}
          </p>
        </div>
        <div
          className="border rounded-md p-3"
          style={{ padding: isDownloading ? "0px 20px 20px" : "" }}
        >
          <p className="font-semibold text-tertiary mb-1">Billed To</p>
          <p className="text-sm text-secondary">
            {invoice?.customer_name ?? "--"}
          </p>
        </div>
      </div>

      <div className="border rounded-md mb-1">
        <table className="w-full border-collapse text-sm">
          {/* Header */}
          <thead>
            <tr
              className="bg-[#581b1b] text-white font-medium"
              style={{
                ...(isDownloading && { WebkitPrintColorAdjust: "exact" }),
              }}
            >
              <th
                colSpan={2}
                className="text-left px-3 py-2 !rounded-none"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                Description
              </th>
              <th
                className="text-center px-3 py-2"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                QTY
              </th>
              <th
                className="text-center px-3 py-2"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                Price
              </th>
              <th
                className="text-right px-3 py-2 !rounded-none"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                Amount
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-[#fdf8f5]">
            {invoice?.plans?.length > 0 &&
              (invoice?.description?.includes(
                `1 × Professional Plan (Broker) (at $10.00 / month)`
              ) || invoice?.description?.includes(
                `1 × Professional Plan (Organisation) (at $10.00 / month)`
              )) &&
              invoice.plans.map((plan, index) => (
                <tr key={plan.priceId || index}>
                  <td
                    colSpan={2}
                    className="px-3 py-2 font-medium text-[#581b1b] "
                    style={{
                      padding: isDownloading ? "0 15px 15px" : undefined,
                    }}
                  >
                    {plan.priceName ===
                    "Seat price in Professional Plan (Broker)" || plan.priceName ==="Seat price in Professional Plan(Organisation)"
                      ? "Seat price"
                      : plan.priceName}
                  </td>
                  <td
                    colSpan={1}
                    className="px-3 py-2 font-medium text-[#581b1b] text-end"
                    style={{
                      padding: isDownloading ? "0 15px 15px" : undefined,
                    }}
                  >
                    {plan.quantity}
                  </td>
                  <td
                    colSpan={1}
                    className="px-3 py-2 font-medium text-[#581b1b] text-end"
                    style={{
                      padding: isDownloading ? "0 15px 15px" : undefined,
                    }}
                  >
                    {plan.price || "$10.00"}
                  </td>
                  <td
                    colSpan={1}
                    className="px-3 py-2 font-medium text-[#581b1b] text-end"
                    style={{
                      padding: isDownloading ? "0 15px 15px" : undefined,
                    }}
                  >
                    ${(plan.amount / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            {!(invoice?.description?.includes(
              `1 × Professional Plan (Broker) (at $10.00 / month)`
            ) || invoice?.description?.includes(
              `1 × Professional Plan (Organisation) (at $10.00 / month)`
            )) && (
              <tr>
                <td
                  colSpan={2}
                  className="px-3 py-2 font-medium text-[#581b1b]"
                  style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
                >
                  {invoice?.description}
                </td>
                <td
                  className="text-center px-3 py-2"
                  style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
                >
                  1
                </td>
                <td
                  className="text-center px-3 py-2"
                  style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
                >
                  ${invoice?.subtotal / 100}
                </td>
                <td
                  className="text-right px-3 py-2"
                  style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
                >
                  ${invoice?.subtotal / 100}
                </td>
              </tr>
            )}
            <tr>
              <td
                colSpan={2}
                className="px-3 py-2 font-medium text-[#581b1b] border-t"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              ></td>
              <td
                className="text-right px-3 py-2 border-t"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              ></td>
              <td
                className="text-left px-3 py-2 border-t"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                <p>Subtotal</p>
              </td>
              <td
                className="text-right px-3 py-2 border-t"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                <p>${invoice?.subtotal / 100}</p>
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="px-3 py-2 font-medium text-[#581b1b]"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              ></td>
              <td
                className="text-right px-3 py-2 "
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              ></td>
              <td
                className="text-left px-3 py-2 "
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                <p>Tax</p>
              </td>
              <td
                className="text-right px-3 py-2 "
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                <p>${invoice?.tax ? `${invoice?.tax}` : 0}</p>
              </td>
            </tr>

            <tr>
              <td
                colSpan={2}
                className="px-3 py-2 font-medium text-[#581b1b]"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              ></td>
              <td
                className="text-right px-3 py-2 "
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              ></td>
              <td
                className="text-left px-3 py-2 border-t"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                <p>Total</p>
              </td>
              <td
                className="text-right px-3 py-2 border-t"
                style={{ padding: isDownloading ? "0 15px 15px" : undefined }}
              >
                <p>
                  $
                  {invoice?.total / 100 + (invoice?.tax > 0 ? invoice?.tax : 0)}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-center text-[#581b1b] font-medium mb-1">
        Thank you for your business!
      </p>
      {!isDownloading && (
        <>
          <Separator />

          <DialogFooter className="flex justify-center gap-2 *:flex-1 mb-3">
            <Button onClick={() => onClose()} variant="outline" size="lg">
              Close
            </Button>
            <Button variant="secondary" size="lg" onClick={handleDownloadCSV}>
              <ArrowDownToLine /> Download CSV
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleDownload(ref)}
              disabled={isDownloading}
            >
              <ArrowDownToLine /> Download PDF
            </Button>
          </DialogFooter>
        </>
      )}
    </div>
    //   </DialogContent>
    // </Dialog>
  );
}
