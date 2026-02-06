import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function EnterCodeModal({ open, onOpenChange, onVerify, onResend }) {
  if (!open) return null;

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
          className="relative z-50 w-[340px] rounded-2xl bg-white border-none p-6"
          style={{
            top: "50% !important",
            left: "50% !important",
            transform: "translate(-50%, -50%) !important",
            position: "fixed",
            margin: 0,
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/Logo.svg" alt="Title Munke" className="h-35 w-35" />
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-semibold text-[#2C1B13]">
            Enter Code
          </h2>

          <p className="text-center text-sm text-[#6B4F3F] ">
            Please enter the code sent to your email.
          </p>

          <p className="text-center text-xs text-[#6B4F3F]">
            Didn’t receive code?{" "}
            <span
              onClick={onResend}
              className="cursor-pointer font-medium underline"
            >
              Resend
            </span>
          </p>

          {/* Input */}
          <input
            type="text"
            maxLength={4}
            placeholder="XXXX"
            className="w-full rounded-lg border border-[#E8D9CC] px-4 py-2 text-center text-lg tracking-widest outline-none focus:ring-2 focus:ring-[#5A0A0A]"
          />

          {/* Button */}
          <Button
            onClick={onVerify}
            className="mt-5 w-full rounded-lg bg-gradient-to-r from-[#5A0A0A] to-[#2C0A0A] py-3 text-white text-sm hover:opacity-90"
          >
            Verify →
          </Button>
        </DialogContent>
      </div>
    </Dialog>
  );
}
