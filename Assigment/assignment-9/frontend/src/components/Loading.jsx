import React from "react";

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div style={{ textAlign: "center" }}>
        <div className="spinner"></div>
        <p style={{ color: "#fff", marginTop: "10px" }}>
          Processing...
        </p>
      </div>
    </div>
  );
};

export default Loading;