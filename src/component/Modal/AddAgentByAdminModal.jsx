import { useEffect, useState } from "react";
import "./AddUserModal.css";
import { toast } from "react-toastify";
import { fetchActiveBrokers } from "../service/broker";
import { createAgentForBroker } from "../service/agent";

function AddAgentByAdminModal({ setIsOpen }) {
  const [brokers, setBrokers] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      await createAgentForBroker(selectedBroker, name, email, password);
      toast.success("Agent Created Successfully.");
      console.log(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchActiveBrokers()
      .then((item) => setBrokers(item))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);
  console.log(
    !formData.email || !formData.name || !formData.password || !selectedBroker
  );
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
            <div className="form-group">
              <label>Broker list</label>
              {isLoading ? (
                <p>Loading brokers...</p>
              ) : (
                <select
                  name="role"
                  value={formData.role}
                  onChange={(e) => setSelectedBroker(e.target.value)}
                  required
                >
                  <option value="">None</option>
                  {brokers?.map((elem) => (
                    <option value={elem.id}>{elem.email}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                disabled={
                  !formData.email ||
                  !formData.name ||
                  !formData.password ||
                  !selectedBroker
                }
                type="submit"
                className="submit-btn"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAgentByAdminModal;
