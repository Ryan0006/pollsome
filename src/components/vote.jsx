import React from "react";
import Form from "./common/form";
import VoteButton from "./common/voteButton";
import _ from "lodash";
import { getPoll, saveVotes, saveComments } from "../services/pollService";
import auth from "../services/authService";

class Vote extends Form {
  state = {
    data: {
      id: "",
      title: "",
      allowedVotes: 1,
      entries: [],
      comments: []
    },
    votes: [],
    disabled: [],
    selectedEntry: null,
    errors: {}
  };

  schema = {};

  async componentDidMount() {
    try {
      const pollId = this.props.match.params.id;
      const response = await getPoll(pollId);
      const poll = response.data;
      if (poll["can_vote"] === false) {
        this.props.history.replace("/");
        return;
      }
      this.setState({
        data: {
          id: poll.id,
          title: poll.title,
          allowedVotes: poll.allowed_votes,
          entries: poll.entries,
          comments: []
        }
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  handleEntrySelect = entry => {
    this.setState({ selectedEntry: entry });
  };

  handleVote = (e, entry) => {
    e.stopPropagation();
    const { data } = this.state;
    let votes = [...this.state.votes];
    let disabled = [...this.state.disabled];
    const entryInVotes = votes.find(m => {
      return _.isEqual(m, entry);
    });
    if (entryInVotes) {
      _.remove(votes, entryInVotes);
      disabled = [];
    } else {
      let votedCount = votes.length;
      if (votedCount < data.allowedVotes) votes.push(entry);
      if (votedCount === data.allowedVotes - 1) {
        disabled = data.entries.filter(m => {
          return !votes.find(n => {
            return _.isEqual(m, n);
          });
        });
      }
    }
    this.setState({ votes, disabled, selectedEntry: entry });
  };

  handleTextareaChange = ({ currentTarget: input }, entry) => {
    let data = { ...this.state.data };
    let comments = data.comments;
    const comment = comments.find(m => {
      return m.entryId === entry.id;
    });
    if (comment) comment.content = input.value;
    else
      comments.push({
        ts: Date.now(),
        userId: auth.getCurrentUserId(),
        entryId: entry.id,
        content: input.value
      });
    this.setState({ data });
  };

  isVoted = entry => {
    return this.state.votes.find(m => {
      return _.isEqual(m, entry);
    });
  };

  isDisabled = entry => {
    return this.state.disabled.find(m => {
      return _.isEqual(m, entry);
    });
  };

  getEntryListClass = entry => {
    const { selectedEntry } = this.state;
    if (selectedEntry && entry.id === selectedEntry.id)
      return "list-inline-item list-group-item-action list-group-item-secondary col-3";
    return "list-inline-item list-group-item-action col-3";
  };

  getTextListClass = entry => {
    const { selectedEntry } = this.state;
    if (selectedEntry && entry.id === selectedEntry.id)
      return "list-group-item";
    return "hide";
  };

  doSubmit = async () => {
    const { votes, data } = this.state;
    try {
      await saveVotes(votes);
    } catch (ex) {
      if (
        ex.response &&
        ex.response.status === 400 &&
        ex.response.data.error === "User has already voted."
      ) {
        this.props.history.push("/");
        return;
      }
    }
    await saveComments(data.comments, data.id);
    this.props.history.push("/poll/" + data.id);
  };

  render() {
    const { data, selectedEntry, votes } = this.state;

    return (
      <div style={{ marginTop: 40 }}>
        <h1>{data.title}</h1>
        <div className="row" style={{ marginTop: 20, marginBottom: 10 }}>
          <div className="col-3">
            <span>
              You have {data.allowedVotes - votes.length} vote(s) left.
            </span>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-12">
              <ul className="list-inline">
                {data.entries.map(entry => (
                  <li
                    onClick={() => this.handleEntrySelect(entry)}
                    key={entry.id}
                    className={this.getEntryListClass(entry)}
                    style={{
                      padding: 10,
                      margin: 0,
                      cursor: "pointer",
                      borderStyle: "solid",
                      borderWidth: 1,
                      borderColor: "lightgrey"
                    }}
                  >
                    <div className="row">
                      <div className="col-4 d-flex align-items-center">
                        <VoteButton
                          voted={this.isVoted(entry)}
                          disabled={this.isDisabled(entry)}
                          onClick={e => this.handleVote(e, entry)}
                        />
                      </div>
                      <div className="col-8">{entry.name}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-12">
              {!selectedEntry && `Select an option and share opinions.`}
              <ul className="list-group">
                {data.entries.map(entry => (
                  <li key={entry.id} className={this.getTextListClass(entry)}>
                    <textarea
                      className="form-control"
                      style={{ resize: "none", border: "none" }}
                      rows="10"
                      onChange={e => this.handleTextareaChange(e, entry)}
                      placeholder={`Comments for ${entry.name}...`}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-12">{this.renderButton("Submit")}</div>
          </div>
        </form>
      </div>
    );
  }
}

export default Vote;
