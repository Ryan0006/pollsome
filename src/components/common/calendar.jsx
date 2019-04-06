import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({
  name,
  label,
  selected,
  onCalendarChange,
  onChangeRaw,
  ...rest
}) => {
  return (
    <div className="row">
      <div className="col-sm-6">
        <div className="form-group row" style={{ marginTop: 20 }}>
          <div className="col-12">
            <label htmlFor={name}>
              <strong>{label}</strong>
            </label>
          </div>
          <div className="col-12">
            <DatePicker
              {...rest}
              name={name}
              id={name}
              className="form-control"
              selected={selected}
              onChange={onCalendarChange}
              onChangeRaw={onChangeRaw}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
