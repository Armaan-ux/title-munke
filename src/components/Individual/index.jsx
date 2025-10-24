import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Individual() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/individual/dashboard");
  }, []);
  return null;
}

export default Individual;
