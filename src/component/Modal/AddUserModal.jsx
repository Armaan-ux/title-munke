import { useState } from "react";
import { useUser } from "../../context/usercontext";
import { createAgentForBroker } from "../service/agent";
import "./AddUserModal.css";
import { toast } from "react-toastify";
import { createBrokerLogin } from "../service/broker";
import { createAdminAccount } from "../service/admin";

function AddUserModal({ setIsOpen, userType, setUser }) {
  const { user } = useUser();
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
      const { name, email, password } = formData;
      if (userType === "agent") {
        const { newAgent } = await createAgentForBroker(
          user?.attributes?.sub,
          name,
          email,
          password
        );

        setUser((prev) => [
          ...prev,
          { ...newAgent, totalSearches: 0, agentName: name },
        ]);
        toast.success("Agent Created Successfully.");
      } else if (userType === "broker") {
        const { newBroker } = await createBrokerLogin(name, email, password);
        toast.success("Broker Created Successfully.", newBroker);
      } else if (userType === "admin") {
        const { newAdmin } = await createAdminAccount(name, email, password);
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
    <div>
      <button onClick={() => setIsOpen(true)} className="open-modal-btn">
        Open Modal
      </button>

      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{userType} Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;
