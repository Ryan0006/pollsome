import React, { Component } from "react";
import _ from "lodash";
import { faVoteYea } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comment from "./common/comment";
import {
  getPoll,
  getComments,
  saveComments,
  saveLiked
} from "../services/pollService";
import { getCloseDate } from "../utils/timeCalculate";
import auth from "../services/authService";

class Poll extends Component {
  state = {
    poll: {},
    title: "",
    description: "",
    closedate: "",
    voters: [],
    reply: "",
    entries: [],
    comments: [],
    expandedComments: [],
    likedComments: [],
    replyComments: [],
    selectedEntry: null
  };

  async componentDidMount() {
    try {
      const pollId = this.props.match.params.id;
      const pollResponse = await getPoll(pollId);
      const poll = pollResponse.data;
      const commentsResponse = await getComments(pollId);
      const originalComments = commentsResponse.data;
      let comments = [];
      originalComments.forEach(comment => {
        if (!comment["replyto_id"])
          comments.push(this.commentMapToViewModel(comment));
      });
      originalComments.forEach(comment => {
        if (comment["replyto_id"]) {
          const replyto = comments.find(m => m.id === comment.replyto_id);
          replyto["replies"].push(this.commentMapToViewModel(comment));
        }
      });
      this.setState({
        title: poll.title,
        description: poll.description,
        closedate: poll.closedate,
        voters: poll.voters,
        entries: poll.entries,
        comments: comments
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  commentMapToViewModel = comment => {
    return {
      id: comment.id,
      ts: comment.ts,
      user: comment.user,
      content: comment.content,
      entryId: comment.entry_id,
      likes: comment.likes,
      replyto: comment.replyto_id,
      replies: []
    };
  };

  handleEntrySelect = entry => {
    this.setState({ selectedEntry: entry });
  };

  handleExpandClick = (e, comment) => {
    e.stopPropagation();
    const expandedComments = [...this.state.expandedComments];
    const commentInExpanded = expandedComments.find(m => m.id === comment.id);
    if (commentInExpanded)
      expandedComments.splice(expandedComments.indexOf(commentInExpanded), 1);
    else expandedComments.push(comment);
    this.setState({ expandedComments });
  };

  handleReplyClick = (e, comment) => {
    e.stopPropagation();
    let replyComments = [...this.state.replyComments];
    const commentInReply = replyComments.find(m => m.id === comment.id);
    if (commentInReply)
      replyComments.splice(replyComments.indexOf(commentInReply), 1);
    else replyComments = [comment];
    this.setState({ replyComments });
  };

  handleLikedClick = async (e, comment) => {
    e.stopPropagation();
    const comments = [...this.state.comments];
    const index = comments.indexOf(comment);
    comments[index] = { ...comments[index] };
    let likedComments = [...this.state.likedComments];
    let targetComment = likedComments.find(m => {
      return m.id === comment.id;
    });
    if (targetComment) {
      await saveLiked(comment, false);
      comments[index].likes = comments[index].likes - 1;
      _.remove(likedComments, targetComment);
    } else {
      await saveLiked(comment, true);
      comments[index].likes = comments[index].likes + 1;
      comment.likes = comment.likes + 1;
      likedComments.push(comment);
    }
    this.setState({ comments, likedComments });
  };

  handleReplySubmit = async (e, comment) => {
    e.stopPropagation();
    let comments = [...this.state.comments];
    const reply = {
      ts: Date.now(),
      userId: auth.getCurrentUserId(),
      content: this.state.reply,
      entryId: comment.entryId,
      replyto: comment.id
    };
    let response = null;
    try {
      response = await saveComments([reply]);
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        this.props.history.push({
          pathname: "/login",
          state: { from: this.props.location }
        });
        return;
      }
    }

    console.log(response.data);

    let replyto = comments.find(m => m.id === reply.replyto);
    replyto.replies.push(response.data[0]);

    const replyComments = [...this.state.replyComments];
    const commentInReply = replyComments.find(m => m.id === comment.id);
    if (commentInReply)
      replyComments.splice(replyComments.indexOf(commentInReply), 1);
    this.setState({ replyComments });
  };

  handleReplyChange = ({ currentTarget: input }) => {
    this.setState({ reply: input.value });
  };

  handleAllcomments = e => {
    e.stopPropagation();
    this.setState({ selectedEntry: null });
  };

  getExpanded = comment => {
    const expandedComments = [...this.state.expandedComments];
    return expandedComments.find(m => {
      return m.id === comment.id;
    });
  };

  getLiked = comment => {
    const likedComments = [...this.state.likedComments];
    return likedComments.find(m => {
      return m.id === comment.id;
    });
  };

  getReply = comment => {
    const replyComments = [...this.state.replyComments];
    return replyComments.find(m => {
      return m.id === comment.id;
    });
  };

  getSelectedListClass = entry => {
    const { selectedEntry } = this.state;
    if (selectedEntry && selectedEntry.id === entry.id)
      return "list-group-item list-group-item-action list-group-item-secondary";
    return "list-group-item list-group-item-action";
  };

  getProgressValue = entry => {
    const { entries } = this.state;
    const { votes: max } = _.maxBy(entries, m => {
      return m.votes;
    });
    return (entry.votes / max) * 100;
  };

  getPollCloseDate = date => {
    const closeDate = getCloseDate(date);
    if (closeDate === "Closed") return "Closed";
    return `Close: ${closeDate}`;
  };

  getParticipation = () => {
    const { voters } = this.state;
    if (voters.length > 5)
      return `${voters[0].name}, ${voters[1].name}, ${voters[2].name}... ${
        voters.length
      } people have participated.`;
    if (voters.length === 1) return `${voters[0].name} has participated.`;
    if (voters.length === 0) return `No one has participated yet.`;
    let message = "";
    voters.forEach(voter => {
      message = message + voter.name + ", ";
    });
    message = message.slice(0, -2);
    return `${message} have participated.`;
  };

  renderComments = comments => {
    if (comments.length === 0) return <span>No comments</span>;
    return comments.map(comment => (
      <li className="list-group-item" key={comment.id}>
        <Comment
          comment={comment}
          liked={this.getLiked(comment)}
          expanded={this.getExpanded(comment)}
          reply={this.getReply(comment)}
          onLikedClick={e => this.handleLikedClick(e, comment)}
          onReplyClick={e => this.handleReplyClick(e, comment)}
          onExpandClick={e => this.handleExpandClick(e, comment)}
          onReplySubmit={e => this.handleReplySubmit(e, comment)}
          onReplyChange={e => this.handleReplyChange(e)}
        />
      </li>
    ));
  };

  render() {
    const {
      title,
      description,
      closedate,
      entries,
      comments,
      selectedEntry
    } = this.state;
    const orderdEntries = _.orderBy(entries, ["votes"], "desc");
    const allComments = this.renderComments(comments);
    let entryComments = null;
    if (selectedEntry) {
      const filteredComments = comments.filter(m => {
        return _.get(m, "entryId") === selectedEntry.id;
      });
      entryComments = this.renderComments(filteredComments);
    }
    return (
      <div>
        <div style={{ marginTop: 30, marginBottom: 30 }}>
          <h1>{title}</h1>
          <p>{description}</p>
          <p>{this.getPollCloseDate(closedate)}</p>
        </div>
        <div className="row" style={{ marginTop: 5 }}>
          <div className="col-6">
            <span>{this.getParticipation()}</span>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn btn-outline-secondary float-right"
              onClick={e => this.handleAllcomments(e)}
            >
              All comments
            </button>
          </div>
        </div>

        <div className="row" style={{ marginTop: 5 }}>
          <ul className="list-group col-12">
            {orderdEntries.map(entry => (
              <li
                className={this.getSelectedListClass(entry)}
                onClick={() => this.handleEntrySelect(entry)}
                key={entry.id}
                style={{ cursor: "pointer" }}
              >
                <div className="row">
                  <div className="col-2">{entry.name}</div>
                  <div className="col-1">
                    <span className="float-right">
                      {entry.votes}
                      <FontAwesomeIcon
                        icon={faVoteYea}
                        size="1x"
                        style={{ marginLeft: 5 }}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="col-8">
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped bg-danger"
                        role="progressbar"
                        style={{ width: `${this.getProgressValue(entry)}%` }}
                      />
                    </div>
                  </div>
                  <div className="col-1" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {!selectedEntry && (
          <div className="row" style={{ marginTop: 40 }}>
            <ul className="list-group col-12">{allComments}</ul>
          </div>
        )}

        {selectedEntry && (
          <div className="row" style={{ marginTop: 40 }}>
            <ul className="list-group col-12">{entryComments}</ul>
          </div>
        )}
      </div>
    );
  }
}

export default Poll;
