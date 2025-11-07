import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export default function AddAgentByBrokerModal({ open, onOpenChange }) {
   if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent  showCloseButton={false}
        className="max-w-[420px] rounded-2xl py-5  px-8 bg-white shadow-xl border-none"
        overlayClass="bg-black/40 backdrop-blur-[1px]"
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-[26px] text-secondary font-semibold !font-poppins">
            Add Agent
          </DialogTitle>
          <DialogClose className="text-secondary hover:bg-transparent focus:outline-none">
            <X className="h-5 w-5 text-bold" />
          </DialogClose>
        </DialogHeader>

        <div className="mt-5 space-y-4">
          <div className="space-y-1">
            <label className="text-[14px] font-medium text-secondary">
              Full Name
            </label>
            <Input
              placeholder="John Marks"
              className="h-[38px] bg-white border border-[#E6DFDB] text-secondary placeholder:text-[#B6AAA5] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[14px] font-medium text-secondary">
              Email Address
            </label>
            <Input
              placeholder="john@emailaddress.com"
              className="h-[38px] bg-white border border-[#E6DFDB] text-secondary placeholder:text-[#B6AAA5] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[14px] font-medium text-secondary">
              Monthly Search Limit
            </label>
            <Select>
              <SelectTrigger className="h-[38px] w-full border border-[#E6DFDB] text-secondary focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="text-secondary">
                {[10, 20, 30, 50, 100].map((limit) => (
                  <SelectItem key={limit} value={limit.toString()}>
                    {limit}
                  </SelectItem>
                ))}
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="flex items-center space-x-2 pt-1">
            <Checkbox id="activate" />
            <label
              htmlFor="activate"
              className="text-[13px] text-secondary font-medium leading-none cursor-pointer"
            >
              Activate this agent immediately
            </label>
          </div> */}

          <div className="flex justify-end gap-3 pt-3 ">
            <Button
              variant="outline"
              className="h-[38px] w-[50%] px-5 border border-[#4C0D0D] text-[#4C0D0D] text-[14px] font-medium rounded-md hover:bg-[#4C0D0D]/5"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button className="h-[38px] w-[50%] px-5 bg-[#4C0D0D] hover:bg-[#4C0D0D]/90 text-white text-[14px] font-medium rounded-md">
              Invite Agent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
