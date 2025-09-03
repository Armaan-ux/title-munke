import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Agent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/agent/dashboard");
  }, []);
  return null;
}

export default Agent;
