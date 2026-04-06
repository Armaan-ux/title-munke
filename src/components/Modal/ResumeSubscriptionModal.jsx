import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

const ResumeSubscriptionModal = ({ open, onResume, onStartFresh, isLoading }) => {
  return (
    <Dialog open={open}>
      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md bg-[#fffaf3] border-none shadow-2xl rounded-2xl p-8 [&>button]:hidden"
      >
        <DialogHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf3e7] mb-2">
            <svg
              className="h-8 w-8 text-[#3b1f12]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <DialogTitle className="text-2xl font-bold text-[#3b1f12]">Resume Application?</DialogTitle>
          <DialogDescription className="text-sm text-[#7a5a49]">
            We found an incomplete subscription process. Would you like to resume from where you left off or start a fresh application?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Button
            onClick={onResume}
            disabled={isLoading}
            className="w-full bg-[#3b1f12] hover:bg-[#5c2f1b] text-white py-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            Resume Application
          </Button>
          <Button
            onClick={onStartFresh}
            variant="outline"
            disabled={isLoading}
            className="w-full border-2 border-[#e6d6c3] text-[#7a5a49] hover:bg-[#fdf3e7] py-6 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            Start Fresh
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeSubscriptionModal;
