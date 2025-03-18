import React from "react";
import "./spinner.css";

function Spinner() {
  return (
    <div className="spinner-container">
      <span className="spinner-child spinner" />
      <span className="spinner-child spinner-delayed" />
    </div>
  );
}

export default Spinner;
