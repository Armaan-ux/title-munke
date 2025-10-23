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

export function HelpUsImproveModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("Too expensive");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[420px] rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-secondary !font-poppins">
            Help Us Improve
          </DialogTitle>
        </DialogHeader>
        <Separator className="bg-[#e0c9c9]" />
        <p className="text-center text-sm text-coffee-light mt-1">
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

        <DialogFooter className="flex justify-between mt-6">
          <Button
            variant="outline"
            className="w-1/2 mr-2 text-sm"
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
      </DialogContent>
    </Dialog>
  );
}
