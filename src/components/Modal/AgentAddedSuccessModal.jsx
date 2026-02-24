import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CirclePlus, X } from "lucide-react";

export default function AgentAddedSuccessModal({
  open,
  onOpenChange,
  onAddAgent,
  onContinue,
  agentName,
}) {
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="relative w-[360px] p-0 rounded-2xl bg-white border-none overflow-visible z-50"
          style={{
            top: "50% !important",
            left: "50% !important",
            transform: "translate(-50%, -50%) !important",
            position: "fixed",
            margin: 0,
          }}
        >
          <Button
            onClick={() => onOpenChange(false)}
            className="absolute -top-3 -right-3 bg-white hover:bg-gray-100 rounded-full shadow-md p-1 z-50"
          >
            <X strokeWidth={3} className="w-4 h-4 text-[#2C1B13]" />
          </Button>

          <div className="overflow-hidden rounded-2xl">
            <div className="relative bg-secondary text-white flex flex-col items-center justify-center py-5">
              <img src="/add-Card-Success.png" alt="success" />
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl font-semibold pt-4 !font-poppins">
                  <div className="flex flex-col items-center">
                    <p>Agent Added</p>
                    <p>Successfully!</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
              <p className="text-sm text-coffee-light text-600 mb-5 leading-relaxed">
                {`${agentName}`} has been <br />
                successfully added.
              </p>
              <div className="flex gap-4 justify-center flex-col ">
                <Button
                  onClick={onAddAgent}
                  className="w-32 bg-[#5A0A0A] hover:bg-[#460707] text-white rounded-lg py-2 text-sm"
                >
                  <CirclePlus /> Add Another
                </Button>
                <Button
                  onClick={onContinue}
                  className="w-32 bg-[#5A0A0A] hover:bg-[#460707] text-white rounded-lg py-2 text-sm"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
