import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Broker() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/broker/search");
  }, []);
  return null;
}

export default Broker;
