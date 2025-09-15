import { useEffect, useState } from "react";
import AddUserModal from "../../Modal/AddUserModal";
import "./index.css";
// import { resendOTP } from "../../service/auth";
import { listAdmins } from "../../../graphql/queries";
import { API } from "aws-amplify";

const ManageAdmins = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const getAdmins = async () => {
      const response = await API.graphql({
        query: listAdmins,
      });
      const { items } = response.data.listAdmins;
      setAdmins(items);
    };
    getAdmins();
  }, []);
  return (
    <>
      {isOpen && (
        <AddUserModal
          setIsOpen={setIsOpen}
          userType="admin"
          setUser={setAdmins}
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
          <h1 style={{ marginLeft: "20px" }}>Admin Management</h1>
          <div className="action-buttons">
            <button
              onClick={() => setIsOpen(true)}
              className="btn add-user-btn"
            >
              <i className="fas fa-user-plus"></i> Add Admin
            </button>
          </div>
        </div>

        <div className="card" style={{ width: "100%" }}>
          <h3>Admins</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((elem) => (
                <>
                  <tr id="broker-row-1">
                    <td>{elem.name}</td>
                    <td>
                      <span className="status active">{elem.status}</span>
                    </td>
                    <td>{elem.email}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageAdmins;
