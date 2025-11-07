import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { TEAMS } from "@/utils/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

export default function AddAdminModal({ open, onClose,title }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [teamStrength, setTeamStrength] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ fullName, email, message });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white border-none shadow-xl px-10">

          <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-left text-secondary !font-poppins">
                {`Add ${title}`}
              </DialogTitle>
            </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block">Full Name</label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Marks"
              className="bg-white"
            />
          </div>

          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@emailaddress.com"
              className=" bg-white"
            />
          </div>
          <div>
              <Label htmlFor="role" className="text-sm text-[#6B5E55] mb-1 block">
                Team Strength
              </Label>
              <Select
                onValueChange={(val) =>
                  setTeamStrength(val)
                }
                value={teamStrength}
              >
                <SelectTrigger className="mt-1 w-full !h-11">
                  <SelectValue
                    placeholder="Select strength"
                    className="text-[#2c150f]"
                  />
                </SelectTrigger>
                <SelectContent>
                  {TEAMS.map((item, index) => (
                    <SelectItem key={index} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block">Message (Optional)</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder=""
              rows={10}
              className=""
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 *:flex-1">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="lg"
              // className="border border-[#550000] bg-transparent text-[#550000] hover:bg-[#F5F0EC] w-[50%]"
              // className="w-full"
              >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              // className="bg-[#550000] hover:bg-[#3D0000] text-white w-[50%]"
            >
              Invite Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
