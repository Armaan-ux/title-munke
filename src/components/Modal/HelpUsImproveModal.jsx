import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "../ui/separator";
import { X } from "lucide-react";

export function HelpUsImproveModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("Too expensive");
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
      <DialogContent className="w-[420px] rounded-2xl p-8 border-none overflow-visible  z-50"
           style={{
            top: "50% !important",
            left: "50% !important",
            transform: "translate(-50%, -50%) !important",
            position: "fixed",
            margin: 0,
          }}
      >

   <Button
            data-custom-close
            onClick={onClose}
            className="absolute -top-1.5 -right-1.5 bg-white hover:bg-gray-100 rounded-full shadow-md p-1 z-50"
          >
            <X strokeWidth={3} stock className="w-8 h-8 text-[#2C1B13]" />
          </Button>

         <div className="overflow-hidden w-full">

       <div className="relative">

        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-secondary !font-poppins mb-6">
            Help Us Improve
          </DialogTitle>
        </DialogHeader>
        <Separator className="bg-[#e0c9c9]" />
       </div>



        <p className="text-center text-sm text-coffee-light my-4">
          We're sorry to see you go. Could you tell us why you're canceling your
          subscription?
        </p>

        <RadioGroup
          value={reason}
          onValueChange={setReason}
          className="mt-2 space-y-1"
        >
          {[
            "Too expensive",
            "Not using it enough",
            "Found a better alternative",
            "Technical issues",
            "Temporary break",
            "Other (please specify)",
          ].map((r) => (
            <div key={r} className="flex items-center space-x-2">
              <RadioGroupItem
                value={r}
                id={r}
                className="border-neutral-400 mb-1"
              />
              <Label htmlFor={r} className="text-sm text-coffee-light">
                {r}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <DialogFooter className="flex justify-between mt-6 ml-2">
          <Button
            variant="outline"
            className="w-1/2  text-sm"
            onClick={onClose}
          >
            Back
          </Button>
          <Button
            className="w-1/2 bg-[#600000] hover:bg-[#7a0000] text-sm"
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Submit Reason
          </Button>
        </DialogFooter>
          </div>
      </DialogContent>
      </div>
    </Dialog>
  );
}
