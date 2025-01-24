import { useState } from "react";
import { useUser } from "../../context/usercontext";
import { createAgentForBroker } from "../service/agent";
import "./AddUserModal.css";

function AddAgentModal({ setIsOpen }) {
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
      await createAgentForBroker(user?.attributes?.sub, name, email, password);
      console.log(formData);
    } catch (err) {
      console.error(err);
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
          <h2>Agent Registration</h2>
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

export default AddAgentModal;
