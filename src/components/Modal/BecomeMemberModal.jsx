import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, X } from "lucide-react";
import { useUser } from "@/context/usercontext";
import { useNavigate } from "react-router-dom";

const BecomeMemberModal = ({ open, onClose, setPaymentModal }) => {
  const navigate = useNavigate();
  const {setUser} = useUser();
   if (!open) return null;
  const subscribeHandler = () => {
    setPaymentModal(true);
    setUser(pre => ({...pre, isAddCard: false}))
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <DialogContent showCloseButton={false}
          className="relative w-[400px] rounded-2xl p-0 border-none overflow-visible bg-transparent z-50"
          style={{
            top: "50% !important",
            left: "50% !important",
            transform: "translate(-50%, -50%) !important",
            position: "fixed",
            margin: 0,
          }}
        > 
          <Button
           data-slot="dialog-close"
            onClick={onClose}
            className="absolute -top-3 -right-3 bg-white hover:bg-gray-100 rounded-full shadow-md p-1 z-50"
          >
            <X strokeWidth={3} className="w-8 h-8 text-[#2C1B13]" />
          </Button>

          <div className="overflow-hidden rounded-2xl">
            <div className="bg-[#3B1F15] py-6 flex flex-col items-center justify-center text-white relative">
              <img
                className="mx-auto w-20 h-20 mb-3"
                src="/diamond.svg"
                alt="diamond Icon"
              />
              <DialogTitle className="text-3xl font-semibold !font-poppins">
                Become a Member
              </DialogTitle>
              <p className="text-sm text-[#D7C4B6]">
                Unlock premium broker features
              </p>
            </div>

            <div className="p-6 space-y-6 bg-white rounded-b-2xl">
              <div className="bg-[#FFF9F6] text-center py-4">
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-4xl font-bold text-[#4B2E20]">$20</p>
                  <p className="text-sm text-[#3B1F15]">/month</p>
                </div>
                <p className="text-xs text-[#3B1F15] mt-1">Membership fee</p>
              </div>
{/* 
              <p className="font-medium text-sm text-[#4B2E20] text-center">
                Your one-stop platform for fast, reliable, and transparent
                property title searches
              </p> */}

              <div className="flex items-start gap-2 ml-6">
                <CircleCheck className="text-green-500 w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-[#4B2E20]">
                    Full Broker Access
                  </p>
                  <p className="text-xs text-[#3B1F15]/70">
                    Complete platform features
                  </p>
                </div>
              </div>

              <div className="border border-[#EAD6C8] rounded-md p-3 px-5 text-xs text-[#4B2E20] bg-[#FFF9F6]">
                <p>
                  <span className="font-medium">Pricing Example:</span> With 5
                  agents, your total would be <br />
                  $20 + (5 × $10) ={" "}
                  <span className="font-semibold">$70/month</span>
                </p>
              </div>

              <div className="text-center space-y-3 flex items-center justify-center flex-col">
                <button className="text-sm text-[#4B2E20] underline hover:text-[#3a2218]" onClick={() => navigate("/viewmore")}>
                  View more details
                </button>

                <Button
                  onClick={subscribeHandler}
                  // className="w-[50%] bg-[#4B2E20] hover:bg-[#3a2218] text-white rounded-md py-2"
                  className="text-sm max-w-[10rem] w-full"
                  variant="secondary"
                >
                  Subscribe Now
                </Button>

                <p className="text-xs text-[#3B1F15]/70">
                  Cancel anytime. No hidden fees.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default BecomeMemberModal;
