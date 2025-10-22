import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { CircleCheck, X } from "lucide-react";

const BecomeMemberModal = ({ open, onClose, setPaymentModal }) => {
  const subscribeHandler = () => {
    setPaymentModal(true);
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div
        className="fixed inset-0"
        style={{
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
        }}
      />
      <DialogContent className="w-[400px] rounded-2xl p-0 overflow-hidden border-none">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-black hover:text-black-200 z-20 bg-white rounded-full p-2 "
        >
          <X className="w-5 h-5" />
        </button>
        <div className="bg-secondary  py-6 flex flex-col items-center justify-center text-white">
          <div className="w-30 h-30 flex items-center justify-center">
            <img
              className="mx-auto w-20 h-20 md:w-40 md:h-40 mb-3"
              src="/diamond.svg"
              alt="diamond Icon"
            />
          </div>
          <DialogTitle className="text-3xl font-semibold">
            Become a Member
          </DialogTitle>
          <p className="text-sm opacity-80 font-regular">Unlock premium broker features</p>
        </div>

        <div className="p-6 space-y-6 bg-white rounded-b-2xl">
          <div className="bg-[#FFF9F6] text-center py-4">
            <div className="flex items-baseline justify-center gap-2">
              <p className="text-4xl font-bold text-[#4B2E20]">$20</p>
              <p className="text-sm text-secondary text-500">/month</p>
            </div>
            <p className="text-xs text-secondary text-400 mt-1">
              Membership fee
            </p>
          </div>

          <div className="flex items-start gap-2">
            <div>
              <p className="font-medium text-sm text-[#4B2E20] text-center">
                Your one-stop platform for fast, reliable, and transparent
                property title searches
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CircleCheck className="text-green-500 w-5 h-5 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-[#4B2E20]">
                Full Broker Access
              </p>
              <p className="text-xs text-secondary text-500">
                Complete platform features
              </p>
            </div>
          </div>

          <div className="border border-[#EAD6C8] rounded-md p-3 text-xs text-[#4B2E20] bg-[#FFF9F6]">
            <p>
              <span className="font-medium">Pricing Example:</span> With 5
              agents, your total would be <br />
              $20 + (5 × $10) = <span className="font-semibold">$70/month</span>
            </p>
          </div>

          <div className="text-center space-y-3 flex items-center justify-center flex-col">
            <button className="text-sm text-[#4B2E20] underline hover:text-[#3a2218]">
              View more details
            </button>

            <Button
              onClick={subscribeHandler}
              className="w-[50%] bg-[#4B2E20] hover:bg-[#3a2218] text-white rounded-md py-2"
            >
              Subscribe Now
            </Button>

            <p className="text-xs text-secondary text-400">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BecomeMemberModal;
