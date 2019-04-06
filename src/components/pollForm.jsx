import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import _ from "lodash";
import { getPoll, savePoll } from "../services/pollService";

class PollForm extends Form {
  state = {
    originalData: {
      title: "",
      description: "",
      closedate: "",
      allowedVotes: 0,
      entries: []
    },
    data: {
      title: "",
      description: "",
      closedate: "",
      allowedVotes: 0,
      entries: []
    },
    newPoll: false,
    deletedEntries: [],
    newEntryName: "",
    newEntryError: "",
    errors: {}
  };

  schema = {
    id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    description: Joi.string()
      .required()
      .label("Description"),
    closedate: Joi.string()
      .required()
      .label("Close date"),
    allowedVotes: Joi.number()
      .integer()
      .required()
      .min(0)
      .label("Number of votes"),
    entry: Joi.string()
      .required()
      .max(50)
      .label("Option")
  };

  newEntrySchema = {
    newEntryName: Joi.string()
      .required()
      .max(50)
      .label("Option")
  };

  uniqueSchema = Joi.array().unique(
    (a, b) => a.name.toLowerCase() === b.name.toLowerCase()
  );

  async componentDidMount() {
    await this.populatePoll();
  }

  async populatePoll() {
    try {
      const pollId = this.props.match.params.id;
      if (pollId === "new") {
        const data = { ...this.state.data };
        data["id"] = Math.random()
          .toString()
          .replace("0.", "");
        data.closedate = Date.now();
        const dateFormat = require("dateformat");
        data.closedate = dateFormat(data.closedate, "mm/dd/yyyy");
        this.setState({ data, newPoll: true });
        return;
      }
      const response = await getPoll(pollId);
      const poll = response.data;
      const originalData = this.mapToViewModel(poll);
      const data = _.cloneDeep(originalData);
      this.setState({ data, originalData });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(poll) {
    return {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      closedate: poll.closedate,
      allowedVotes: poll.allowed_votes,
      entries: poll.entries
    };
  }

  handleInputChange = ({ currentTarget: input }) => {
    this.setState({ newEntryName: input.value });
    const error = this.validateInputEntry(input.value);
    let newEntryError = "";
    if (error) newEntryError = error.details[0].message;
    this.setState({ newEntryError });
  };

  handleListChange = (e, entry) => {
    const input = e.currentTarget;
    const errors = { ...this.state.errors };
    const data = { ...this.state.data };
    let entries = data.entries;
    const errorMessage = this.validateProperty(input);
    const index = entries.indexOf(entry);
    entries[index] = { ...entries[index] };
    entries[index].name = input.value;
    this.setState({ data });
    const { error } = Joi.validate(entries, this.uniqueSchema);

    if (errorMessage) {
      if (!errors["entries"]) errors["entries"] = [];
      if (
        !errors["entries"].find(m => {
          return m.entryId === entry.id && m.message === errorMessage;
        })
      )
        errors["entries"].push({ entryId: entry.id, message: errorMessage });
    } else {
      const entryErrors = errors["entries"];
      if (entryErrors) {
        const errorEntry = errors["entries"].find(m => {
          return m.entryId === entry.id;
        });
        if (errorEntry)
          errors["entries"].splice(errors["entries"].indexOf(errorEntry), 1);
        if (errors["entries"].length === 0) delete errors["entries"];
      }
    }

    if (error) {
      const uniqueErrorMessage = '"Option" is not allowed to be repeated';
      if (!errors["uniqueEntry"]) errors["uniqueEntry"] = [];
      if (
        !errors["uniqueEntry"].find(m => {
          return m.entryId === entry.id && m.message === uniqueErrorMessage;
        })
      )
        errors["uniqueEntry"].push({
          entryId: entry.id,
          message: uniqueErrorMessage
        });
    } else {
      const entryErrors = errors["uniqueEntry"];
      if (entryErrors) {
        const errorEntry = errors["uniqueEntry"].find(m => {
          return m.entryId === entry.id;
        });
        if (errorEntry)
          errors["uniqueEntry"].splice(
            errors["uniqueEntry"].indexOf(errorEntry),
            1
          );
        if (errors["uniqueEntry"].length === 0) delete errors["uniqueEntry"];
      }
    }

    this.setState({ errors, newEntryError: "" });
  };

  handleAdd = () => {
    const { newEntryName } = this.state;
    let data = { ...this.state.data };
    const newEntry = {
      id: Math.random()
        .toString()
        .replace("0.", ""),
      name: newEntryName,
      poll: data.id,
      new: true
    };
    data.entries.push(newEntry);
    this.setState({ data, newEntryName: "" });
  };

  handleDelete = entry => {
    let deletedEntries = [...this.state.deletedEntries];
    let undoEntry = deletedEntries.find(m => {
      return m.id === entry.id;
    });
    let errors = { ...this.state.errors };
    let entryErrors = errors["entries"];
    if (entryErrors) {
      const entryError = entryErrors.find(m => {
        return m.entryId === entry.id;
      });
      if (entryError) entryErrors.splice(entryErrors.indexOf(entryError), 1);
    }
    if (undoEntry) {
      const originalEntries = [...this.state.originalData.entries];
      const originalEntry = originalEntries.find(m => {
        return m.id === entry.id;
      });
      let modifiedData = { ...this.state.data };
      let modifiedEntries = modifiedData.entries;
      let modifiedEntry = modifiedEntries.find(m => {
        return m.id === entry.id;
      });
      if (!originalEntry)
        modifiedEntries.splice(modifiedEntries.indexOf(modifiedEntry), 1);
      else
        modifiedEntries[modifiedEntries.indexOf(modifiedEntry)] = originalEntry;
      deletedEntries.splice(deletedEntries.indexOf(undoEntry), 1);
      this.setState({ data: modifiedData });
    } else deletedEntries.push(entry);
    this.setState({ deletedEntries });
  };

  validateInputEntry = inputValue => {
    let entries = [...this.state.data.entries];
    entries.push({ name: inputValue });
    const options = { abortEarly: false };
    const { error } = Joi.validate(
      { newEntryName: inputValue },
      this.newEntrySchema,
      options
    );
    const { error: uniqueError } = Joi.validate(entries, this.uniqueSchema);
    if (!error && !uniqueError) return null;
    if (uniqueError)
      uniqueError.details[0].message = '"Option" is not allowed to be repeated';
    return error || uniqueError;
  };

  getSaveButtonDisabled = () => {
    const { errors, data, deletedEntries } = this.state;
    return (
      data.title === "" ||
      data.description === "" ||
      (!(
        _.isEmpty(errors) ||
        (Object.keys(errors).length === 1 &&
          errors["entries"] &&
          errors["entries"].length === 0)
      ) &&
        data.entries.length - deletedEntries.length > 1)
    );
  };

  doSubmit = async () => {
    const { deletedEntries, newPoll } = this.state;
    let { data } = { ...this.state };
    let entries = data.entries;
    entries = entries.filter(m => {
      return !deletedEntries.find(n => {
        return n.id === m.id;
      });
    });
    data.entries = entries;
    const { user } = this.props;
    await savePoll(data, newPoll, user.id);
    window.location = "/mypolls";
  };

  render() {
    const { newEntryName } = this.state;

    return (
      <div style={{ marginTop: 40 }}>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderTextArea("description", "Description", 5)}
          {this.renderList("entries", "Candidate options", newEntryName)}
          <div className="row">
            <div className="col-4">
              {this.renderInput(
                "allowedVotes",
                "Number of votes for each person"
              )}
            </div>
          </div>

          {this.renderDatetime("datetime", "Closing date")}
          {this.renderButton("Save", this.getSaveButtonDisabled())}
        </form>
      </div>
    );
  }
}

export default PollForm;
