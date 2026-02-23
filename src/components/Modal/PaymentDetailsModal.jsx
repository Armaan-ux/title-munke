import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

export function PaymentDetailsModal({ open, onOpenChange, onCancel, price }) {
  const { planId } = useParams();
  if (!open) return null;
const numericPrice = Number(price.replace("$", ""));
const tax = 0;
const totalAmount = numericPrice + tax;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="relative z-50 w-[420px] rounded-2xl bg-white border-none p-6"
          style={{
            top: "50% !important",
            left: "50% !important",
            transform: "translate(-50%, -50%) !important",
            position: "fixed",
            margin: 0,
          }}
        >
          <h2 className="text-lg font-semibold text-[#2C1B13]">
            Payment Details
          </h2>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-[#F1E5D6]">
            <div className="grid grid-cols-4 bg-[#5A0A0A] text-white text-xs font-medium px-4 py-2">
              <span>Description</span>
              <span className="text-center">QTY</span>
              <span className="text-center">Price</span>
              <span className="text-right">Amount</span>
            </div>

            <div className="bg-[#FFF9F3] px-4 py-3 text-sm text-[#2C1B13] space-y-2">
              <div className="grid grid-cols-4">
                <span>
                  {planId === 'PROFESSIONAL_PLAN' ? 'Subscription' : '' || planId === 'PAY_AS_YOU_GO' ? 'Pay As You Go' : ''}</span>
                <span className="text-center">1</span>
                <span className="text-center">${numericPrice.toFixed(2)}</span>
                <span className="text-right">${numericPrice.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-4">
                <span>Tax</span>
                <span />
                <span className="text-center">${tax.toFixed(2)}</span>
                <span className="text-right">${tax.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-4 border-t pt-2 font-semibold">
                <span>Amount</span>
                <span />
                <span />
                <span className="text-right">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Cancel */}
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={onCancel}
              className="rounded-lg border-[#5A0A0A] px-8 text-[#5A0A0A] hover:bg-[#5A0A0A] hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
