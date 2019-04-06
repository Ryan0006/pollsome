import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";
import TextArea from "./textArea";
import List from "./list";
import Calendar from "./calendar";

class Form extends Component {
  state = {};

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    let obj = { [name]: value };
    let schema = { [name]: this.schema[name] };
    if (name === "repeatpass") {
      const { password } = { ...this.state.data };
      obj["password"] = password;
      schema = {
        password: Joi,
        repeatpass: this.schema["repeatpass"]
      };
    }
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    // const errors = this.validate();
    // console.log(errors);
    // this.setState({ errors: errors || {} });
    // if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleCalendarChange = date => {
    let data = { ...this.state.data };
    const dateFormat = require("dateformat");
    data.closedate = dateFormat(date, "mm/dd/yyyy");
    this.setState({ data });
  };

  handleDateChangeRaw = e => {
    e.preventDefault();
  };

  renderButton(label, disabled = false) {
    return (
      <button
        disabled={disabled}
        className="btn btn-primary"
        style={{ marginTop: 20 }}
      >
        {label}
      </button>
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderTextArea(name, label, rows) {
    const { data, errors } = this.state;

    return (
      <TextArea
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        rows={rows}
      />
    );
  }

  renderList(name, label, inputValue) {
    const {
      data,
      newEntryName,
      newEntryError,
      deletedEntries,
      errors
    } = this.state;

    return (
      <List
        name={name}
        value={data[name]}
        deletedEntries={deletedEntries}
        label={label}
        inputValue={inputValue}
        addDisabled={this.validateInputEntry(newEntryName) ? true : false}
        onInputChange={this.handleInputChange}
        onListChange={this.handleListChange}
        onAdd={this.handleAdd}
        onDelete={this.handleDelete}
        addError={newEntryError}
        entryErrors={errors[name]}
        entryUniqueErrors={errors["uniqueEntry"]}
      />
    );
  }

  renderDatetime(name, label) {
    return (
      <Calendar
        name={name}
        label={label}
        selected={new Date(this.state.data.closedate)}
        onCalendarChange={this.handleCalendarChange}
        onChangeRaw={this.handleDateChangeRaw}
      />
    );
  }
}

export default Form;
