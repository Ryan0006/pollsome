import React from "react";

const TextArea = ({ name, label, rows, error, ...rest }) => {
  return (
    <div className="form-group" style={{ marginTop: 20 }}>
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
      <textarea
        {...rest}
        name={name}
        id={name}
        className="form-control"
        rows={rows.toString()}
        style={{ resize: "none" }}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default TextArea;
