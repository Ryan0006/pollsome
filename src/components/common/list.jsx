import React from "react";

const isDisabled = (entry, deletedEntries) => {
  return deletedEntries.find(m => {
    return m.id === entry.id;
  });
};

const renderButtonText = (entry, deletedEntries) => {
  if (isDisabled(entry, deletedEntries)) return "Undo";
  return "Delete";
};

const getEntryError = (entryErrors, entryUniqueErrors, entry) => {
  if (entryErrors) {
    const entryError = entryErrors.find(m => {
      return m.entryId === entry.id;
    });
    if (entryError)
      return <div className="alert alert-danger">{entryError.message}</div>;
  }
  if (entryUniqueErrors) {
    const entryError = entryUniqueErrors.find(m => {
      return m.entryId === entry.id;
    });
    if (entryError)
      return <div className="alert alert-danger">{entryError.message}</div>;
  }
};

const List = ({
  name,
  label,
  value,
  deletedEntries,
  inputValue,
  addDisabled,
  onInputChange,
  onListChange,
  onAdd,
  onDelete,
  addError,
  entryErrors,
  entryUniqueErrors,
  ...rest
}) => {
  return (
    <div className="form-group" style={{ marginTop: 20 }}>
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
      <div
        style={{
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "lightgrey"
        }}
      >
        <ul className="list-group" {...rest} name={name} id={name}>
          <li className="list-group-item" style={{ border: 0, marginTop: 10 }}>
            <div className="row">
              <div className="col-5">
                <input
                  className="form-control"
                  placeholder="New option..."
                  onChange={onInputChange}
                  value={inputValue}
                />
                {addError && (
                  <div className="alert alert-danger">{addError}</div>
                )}
              </div>
              <div className="col-7">
                <button
                  className="btn btn-danger"
                  onClick={onAdd}
                  disabled={addDisabled}
                  style={{ color: "white" }}
                >
                  Add
                </button>
              </div>
            </div>
          </li>
          {value.map(entry => (
            <li
              className="list-group-item"
              style={{ border: 0 }}
              key={entry.id}
            >
              <div className="row">
                <div className="col-5">
                  <input
                    className="form-control"
                    name="entry"
                    value={entry.name}
                    disabled={isDisabled(entry, deletedEntries)}
                    onChange={e => onListChange(e, entry)}
                  />
                  {getEntryError(entryErrors, entryUniqueErrors, entry)}
                </div>
                <div className="col-7">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onDelete(entry)}
                    style={{ color: "white" }}
                  >
                    {renderButtonText(entry, deletedEntries)}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default List;
