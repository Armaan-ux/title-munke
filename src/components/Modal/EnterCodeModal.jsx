import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { useState } from "react";

export function EnterCodeModal({
  open,
  onOpenChange,
  onVerify,
  onResend,
  confirmCodeMutation,
  email
}) {
  const [code, setCode] = useState("");
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={() => { }} >
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
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
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
            Please enter the code sent to your email
          </p>
          <p className="text-center text-sm text-[#6B4F3F] ">
            {email}
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
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="XXXXXX"
            className="w-full rounded-lg border border-[#E8D9CC] px-4 py-2 text-center text-lg tracking-widest outline-none focus:ring-2 focus:ring-[#5A0A0A]"
          />

          {/* Button */}
          <Button
            onClick={() => onVerify(code)}
            disabled={!open || confirmCodeMutation.isPending}
            className="mt-5 w-full rounded-lg bg-gradient-to-r from-[#5A0A0A] to-[#2C0A0A] py-3 text-white text-sm hover:opacity-90"
          >
            {confirmCodeMutation.isPending ? (
              <>
                Verifying <Loader className="animate-spin ml-2" size={18} />
              </>
            ) : (
              <>
                Verify <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
          {confirmCodeMutation.isError && (
            <p className="text-red-500 text-center text-sm font-medium mt-4">
              {confirmCodeMutation.error.response?.data?.message ||
                "Something went wrong. Please try again."}
            </p>
          )}
          <p className="text-gray-500 text-center text-sm font-medium mt-4">
            <span className="font-bold">Note:</span> <span className="font-bold">OTP</span> valid for 24 hours
          </p>
        </DialogContent>
      </div>
    </Dialog>
  );
}
