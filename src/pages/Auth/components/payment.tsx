import React from "react";
import { useNavigate } from "react-router-dom";
import Upgrade from "../../Dashboard/Upgrade";

const Payment = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/dashboard/home");
  };

  return (
    <div className="px-4">
      <Upgrade />

      <button onClick={handleRedirect}>Pay Later</button>
    </div>
  );
};

export default Payment;
