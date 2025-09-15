import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./index.css";

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/users");
  }, []);
  return null;
}

export default Admin;
