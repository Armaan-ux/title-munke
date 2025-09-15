import { useEffect, useState } from "react";
import AddUserModal from "../../Modal/AddUserModal";
import { useUser } from "../../../context/usercontext";
import { listAgents } from "../../../graphql/queries";
import { API } from "aws-amplify";
import { assignAgent } from "../../service/agent";
import { toast } from "react-toastify";
import { handleCreateAuditLog } from "../../../utils";

const NotAssignedAgents = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState([]);

  const handleAssignAgent = async (id, name) => {
    const result = await assignAgent(id, name, user?.attributes?.sub);
    if (result) {
      setAgents(agents.filter((elem) => elem.id !== id));
      toast.success("Agent Assigned Successfully.");
      handleCreateAuditLog("ASSIGN", {
        detial: `Assigned Agent ${id}`,
      });
    }
  };

  useEffect(() => {
    const fetchNotAssignedAgents = async () => {
      try {
        setIsLoading(true);
        const response = await API.graphql({
          query: listAgents,
          variables: {
            filter: { assigned: { eq: false } },
          },
        });
        const { items } = response.data.listAgents;
        setAgents(items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotAssignedAgents();
  }, []);

  return (
    <>
      {isOpen && (
        <AddUserModal
          setIsOpen={setIsOpen}
          userType="agent"
          setUser={setAgents}
        />
      )}
      <div className="main-content" style={{ display: "block" }}>
        <div
          className="page-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignIitems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ marginLeft: "20px" }}>Not Assigned Agents</h1>
        </div>

        <div className="card" style={{ width: "98%" }}>
          <h3>Agents</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <p key={"loading"} style={{ display: "flex" }}>
                  Loading.....
                </p>
              ) : agents?.length === 0 ? (
                <p key={"No-records"} style={{ display: "flex" }}>
                  No Records Found.
                </p>
              ) : (
                agents?.map((elem) => (
                  <tr key={elem.id}>
                    <td>{elem.name}</td>
                    <td>{elem.email}</td>
                    <td>
                      <span className="status active">{elem.status}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAssignAgent(elem.id, elem.name)}
                        className="btn action-btn"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default NotAssignedAgents;
