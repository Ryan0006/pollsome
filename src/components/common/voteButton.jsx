import React from "react";

const VoteButton = ({ voted, disabled, onClick }) => {
  if (voted)
    return (
      <a
        className="btn btn-danger"
        style={{
          cursor: "pointer",
          marginRight: 20,
          color: "white",
          width: 70
        }}
        onClick={onClick}
      >
        Voted
      </a>
    );
  if (disabled)
    return (
      <a
        className="btn btn-outline-secondary"
        style={{
          cursor: "pointer",
          marginRight: 20,
          color: "black",
          width: 70
        }}
        onClick={onClick}
      >
        Vote
      </a>
    );
  if (!disabled) {
    return (
      <a
        className="btn btn-outline-danger"
        style={{ cursor: "pointer", marginRight: 20, color: "red", width: 70 }}
        onClick={onClick}
      >
        Vote
      </a>
    );
  }
};

export default VoteButton;
