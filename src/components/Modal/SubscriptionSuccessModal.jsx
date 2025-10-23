import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function SubscriptionSuccessModal({
  open,
  onOpenChange,
  onFailed,
}) {
  const subscribeHandler = () => {
    onFailed();
    onOpenChange();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[360px] p-0 overflow-hidden rounded-2xl shadow-xl bg-white border-none">
        <div className="relative bg-secondary text-white flex flex-col items-center justify-center py-5">
          <img src="/success.svg" alt="success" />
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-semibold pt-4 !font-poppins">
              <div className="flex flex-col items-center">
                <p>Subscription</p>
                <p>Successful!</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 bg-white text-[#5A0A0A] rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
          <h3 className="text-xl font-semibold text-coffee-light mb-1">
            Thank you for becoming a member.
          </h3>
          <p className="text-sm text-coffee-light text-600 mb-5 leading-relaxed">
            Your subscription is now active, and you have full access to all
            brokers features.
          </p>

          <Button
            onClick={subscribeHandler}
            className="w-32 bg-[#5A0A0A] hover:bg-[#460707] text-white rounded-lg py-2 text-sm"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
