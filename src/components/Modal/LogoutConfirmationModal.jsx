import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from "lucide-react";

const LogoutConfirmationModal = ({ open, onOpenChange, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#fffaf3] border-none shadow-2xl rounded-2xl p-8">
        <DialogHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf3e7] mb-2">
            <LogOut className="h-8 w-8 text-[#3b1f12]" />
          </div>
          <p className="text-2xl font-semibold text-[#3b1f12]">Ready to leave?</p>
          <p className="text-sm text-[#7a5a49]">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </p>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8 sm:justify-center">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto border-2 border-[#e6d6c3] text-[#7a5a49] hover:bg-[#fdf3e7] py-6 px-10 rounded-xl transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-[#3b1f12] hover:bg-[#5c2f1b] text-white py-6 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Yes, Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmationModal;
