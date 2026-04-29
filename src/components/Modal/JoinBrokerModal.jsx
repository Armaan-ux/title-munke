import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import { Loader } from "lucide-react";

export function JoinBrokerModal({
  dropdownOptions,
  open,
  onClose,
  userType,
  onDropdownChange,
  onSendRequest,
  brokerName,
  brokerEmail,
  activeAgents,
  selectedId,
  isPending,
  isUnderBroker,
  isUnderOrganisation,
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setMessage("");
    }
  }, [open]);
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
        <DialogContent className="w-[520px] rounded-2xl bg-white p-6 shadow-lg">
          {/* Header */}
          <DialogHeader>
            <h2 className="text-lg font-semibold text-secondary mb-4 text-start !font-poppins">
              {isUnderBroker
                ? "Leave Broker"
                : isUnderOrganisation
                  ? "Leave Organization"
                  : userType === "broker" && !isUnderOrganisation
                    ? "Join Organization"
                    : "Join Broker"}
            </h2>
            <Separator className="bg-coffee-bg-billing-foreground" />
          </DialogHeader>

          {/* Broker Selection */}
          <div className="mt-4 mb-2">
            <Label className="text-sm text-secondary mb-1 block">Name</Label>
            <select
              disabled={isUnderBroker || isUnderOrganisation}
              className="w-full rounded-md border border-gray-200 p-3 text-sm text-secondary "
              value={selectedId}
              onChange={(e) => onDropdownChange(e.target.value)}
            >
              {/* <option value="">Select </option> */}

              {dropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-coffee-bg-billing-foreground px-3 rounded-md py-2 mb-2">
            {/* Broker Card */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between my-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e0c9c9] rounded-full flex items-center justify-center text-white font-semibold">
                  {brokerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">{brokerName}</p>
                  <p className="text-sm text-gray-500">{brokerEmail}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-5">
                {activeAgents} Active Agents
              </div>
            </div>

            {/* Optional Message */}
            <div className="mb-4">
              <Label className="text-sm text-secondary mb-1 block">
                Add a message (Optional)
              </Label>
              <Input
                type="text"
                placeholder="Add a note"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-md border border-gray-200 p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-coffee-bg-billing-foreground text-[#5e4c3b] text-sm rounded-md p-3 mb-4">
            <span>
              ⚠️ Your request will be reviewed by the broker. You will be
              notified once approved.
            </span>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex justify-between gap-2">
            <Button
              className="w-1/2 bg-[#581b1b] text-white hover:bg-[#6b1e1e] text-sm"
              onClick={onClose}
            >
              Cancel Request
            </Button>
            <Button
              className="w-1/2 bg-[#FF645E1A] border border-[#e0b4b4] text-[#c63c3c] hover:bg-[#fff1f1] text-sm"
              onClick={() => {
                onSendRequest(message);
              }}
              disabled={isPending}
            >
              {isPending ? "Sending Request..." : "Send Request"}
              {isPending && <Loader className="animate-spin ml-2" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}
