"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function SubscriptionFailedModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[360px] p-0 overflow-hidden rounded-2xl shadow-xl bg-white  border-none">
        <div className="relative flex flex-col items-center justify-center pt-4">
          <img src="/failed.svg" alt="failed" className="py-4" />
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold text-coffee-light !font-poppins">
              Payment Failed
            </DialogTitle>
          </DialogHeader>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 bg-white text-coffee-light rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center px-6 pb-6 text-center">
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            Your last payment attempt failed. Please update your payment method
            to continue using Title Munke.
          </p>
          <p className="text-sm text-red-500 italic mb-5">
            *No payment method on file
          </p>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-50 text-white rounded-lg py-2 text-sm bg-gradient-to-b from-[#550000] to-[#3D2014] hover:from-[#660000] hover:to-[#4D1F14]"
          >
            Retry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
