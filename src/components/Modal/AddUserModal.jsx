import { useState } from "react";
import { useUser } from "../../context/usercontext";
import { createAgentForBroker } from "../service/agent";
// import "./AddUserModal.css";
import { toast } from "react-toastify";
import { createBrokerLogin } from "../service/broker";
import { createAdminAccount } from "../service/admin";
import { handleCreateAuditLog } from "../../utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddUserModal({ isOpen, setIsOpen, userType, setUser }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      e.preventDefault();
      const { name, email } = formData;
      if (userType === "agent") {
        const response = await createAgentForBroker(
          user?.attributes?.sub,
          name,
          email
        );
        toast.success("Agent Created Successfully.");
        console.log("response", response);
        const newAgent = response.user;
        console.log("newAgent", newAgent);
        setUser((prev) => [...prev,
            { ...newAgent, totalSearches: 0, agentName: name }
            ]);
        toast.success("Agent Created Successfully.");
        const userGroups =
          user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
        if (userGroups.includes("broker")) {
          handleCreateAuditLog("AGENT_CREATE", {
            detail: `Broker ${user?.attributes?.sub} has created the agent ${newAgent.id}`,
          });
        }
      } else if (userType === "broker") {
        const response = await createBrokerLogin(name, email);
        toast.success("Broker Created Successfully.");
        console.log("response", response);
        const newBroker = response.user;
        console.log("newBroker", newBroker);
        setUser((prev) => [...prev, { ...newBroker }]);
      } else if (userType === "admin") {
        const response = await createAdminAccount(name, email);
        toast.success("Admin Created Successfully.");
        console.log("response", response);
        const newAdmin = response.user;
        console.log("newAdmin", newAdmin);
        setUser((prev) => [...prev, { ...newAdmin }]);
        toast.success("Admin Created Successfully.", newAdmin);
      }
      console.log(formData);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || err);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold capitalize !font-poppins"  >
              {userType} Registration
          </DialogTitle>
        </DialogHeader>
      <div >
          <form onSubmit={handleSubmit} className="space-y-6" >
            <div >
              <Label className="text-base " >Name</Label>
              <Input
                type="text"
                name="name"
                className="bg-transparent"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="text-base " >Email</Label>
              <Input
                type="email"
                name="email"
                className="bg-transparent"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {/* <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div> */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-secondary"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.email || !formData.name}
                // className="submit-btn"
                variant="secondary"
              >
                {loading ? "Processing..." : "Submit"}
              </Button>
            </div>
          </form>

      </div>

      </DialogContent>

    </Dialog>
  );
}

export default AddUserModal;
