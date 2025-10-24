import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SubscriptionCanceledSuccessModal({ open, onClose }) {
   if (!open) return null;
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
      <DialogContent className="w-[420px] rounded-2xl p-8 text-center justify-center align-middle [&>button]:hidden">
        <DialogHeader>
          <div className="flex justify-center">
            <img src="/circle-check.svg" alt="checkIcon" className="h-14 w-14 mb-1" />
          </div>
          <DialogTitle className="text-xl font-semibold text-neutral-900 text-center !font-poppins">
            Subscription Canceled
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-600 mt-1">
          Your subscription has been successfully canceled.
          <br />
          Thank you for sharing your feedback — we hope to see you again soon!
        </p>

        <div className="flex justify-center mt-6">
          <Button
            className="w-1/2 bg-[#600000] hover:bg-[#7a0000] text-sm"
            onClick={onClose}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
      </div>
    </Dialog>
  );
}
