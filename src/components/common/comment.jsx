import React from "react";
import Like from "./like";
import { getPastTimeDifference } from "../../utils/timeCalculate";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getReplyLabel = length => {
  return length === 1 ? "1 reply" : `${length} replies`;
};

const Comment = ({
  comment,
  liked,
  expanded,
  reply,
  onLikedClick,
  onReplyClick,
  onExpandClick,
  onReplyChange,
  onReplySubmit
}) => {
  return (
    <div className="row">
      <div className="col-12">
        <strong>{comment.user.name}</strong> {getPastTimeDifference(comment.ts)}
      </div>
      <div className="col-12">{comment.content}</div>
      <div className="row col-12" style={{ marginTop: 10 }}>
        <div className="col-1">
          <Like liked={liked} onClick={onLikedClick} />
          {comment.likes}
        </div>
        <div
          className="col-2"
          onClick={onReplyClick}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon
            icon={faCommentDots}
            size="1x"
            style={{ marginRight: 5 }}
            aria-hidden="true"
          />
          {reply ? "Cancel" : "Reply"}
        </div>
      </div>

      {reply && (
        <div className="row col-12" style={{ marginTop: 10 }}>
          <div className="col-11">
            <input
              type="text"
              className="form-control"
              onChange={onReplyChange}
              placeholder={`Reply to ${comment.user.name}...`}
            />
          </div>
          <div className="col-1">
            <button
              className="btn btn-outline-secondary"
              onClick={onReplySubmit}
            >
              REPLY
            </button>
          </div>
        </div>
      )}

      <div className="row col-12" style={{ marginTop: 10 }}>
        <div
          className="col-2"
          style={{ cursor: "pointer" }}
          onClick={onExpandClick}
        >
          {comment.replies.length !== 0 &&
            `${getReplyLabel(comment.replies.length)}`}
          {comment.replies.length !== 0 && (
            <FontAwesomeIcon
              icon={expanded ? faChevronUp : faChevronDown}
              size="1x"
              style={{ marginLeft: 7 }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {comment.replies && expanded && (
        <div className="col-12" style={{ marginTop: 10 }}>
          <ul className="list-group">
            {comment.replies.map(reply => (
              <li className="list-group-item" key={reply.id}>
                <div className="row">
                  <div className="col-12">
                    <strong>{reply.user.name}</strong>{" "}
                    {getPastTimeDifference(reply.ts)}
                  </div>
                  <div className="col-12">{reply.content}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Comment;
