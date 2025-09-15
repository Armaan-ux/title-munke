import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { fetchActiveBrokers } from "../service/broker";
import { createAgentForBroker } from "../service/agent";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function AddAgentByAdminModal({ isOpen, setIsOpen, brokers }) {
  const [selectedBroker, setSelectedBroker] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      setIsCreating(true);
      e.preventDefault();
      const { name, email } = formData;
      await createAgentForBroker(selectedBroker, name, email);
      toast.success("Agent Created Successfully.");
      console.log(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOpen(false);
      setIsCreating(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <button onClick={() => setIsOpen(true)} className="open-modal-btn">
        Open Modal
      </button> */}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold capitalize !font-poppins"  >
              Agent Registration
          </DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit} className="space-y-6" >
            <div >
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                className="bg-transparent"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div >
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                className="bg-transparent"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Broker list</Label>
 
              <Select 
                value={formData.role} 
                onValueChange={(value) => setSelectedBroker(value)}  
                required
              >
              <SelectTrigger className="w-full !h-12 border-[#BEA999] rounded-lg">
                <SelectValue placeholder="Select Broker" />
              </SelectTrigger>
              <SelectContent>
                {
                  brokers.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.email}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                className="text-secondary"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !formData.email ||
                  !formData.name ||
                  !selectedBroker ||
                  isCreating
                }
                variant="secondary"
                type="submit"
              >
                {isCreating ? "Processing..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddAgentByAdminModal;
