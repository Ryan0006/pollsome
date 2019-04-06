import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";

const VotedButton = () => {
  return (
    <React.Fragment>
      <button
        className="btn btn-success disabled"
        disabled
        style={{ marginRight: 5 }}
      >
        Voted
      </button>
      <FontAwesomeIcon
        icon={faCheckCircle}
        size="2x"
        style={{ marginRight: 20, color: "darkseagreen" }}
      />
    </React.Fragment>
  );
};

export default VotedButton;
