import http from "./httpService";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";
import auth from "./authService";

const allPollsEndpoint = apiUrl + "/allpolls/";
const myPollsEndpoint = apiUrl + "/mypolls/";
const pollEndpoint = apiUrl + "/poll/";
const voteEndpoint = apiUrl + "/vote/";
const pollCommentsEndpoint = apiUrl + "/pollcomments/";
const commentEndpoint = apiUrl + "/comment/";
const likedEndpoint = apiUrl + "/like/";

const accessToken = http.getAccessJwt();

export function getAllPolls(userId) {
  return http.get(allPollsEndpoint + userId);
}

export function getMyPolls() {
  const jwtDecoded = jwtDecode(accessToken);
  const config = {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  };
  return http.get(myPollsEndpoint + jwtDecoded.user_id, config);
}

export function getPoll(pollId) {
  const userId = auth.getCurrentUserId();
  if (userId) return http.get(pollEndpoint + pollId + "/" + userId);
  return http.get(pollEndpoint + pollId + "/visitor");
}

export function savePoll(poll, newPoll, userId) {
  const config = {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  };
  if (newPoll) {
    const body = { ...poll };
    delete body.id;
    body.entries.forEach(m => {
      delete m.id;
    });
    body.userId = userId;
    return http.post(pollEndpoint, body, config);
  }
  poll.entries.forEach(m => {
    if (m["new"]) delete m.id;
  });
  poll.userId = userId;
  return http.post(pollEndpoint, poll, config);
}

export function saveVotes(votes) {
  const jwtDecoded = jwtDecode(accessToken);
  const config = {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  };
  let body = { userId: jwtDecoded.user_id, ts: Date.now(), votes: [] };
  votes.forEach(vote => {
    body.votes.push({ entryId: vote.id });
  });
  return http.post(voteEndpoint, body, config);
}

export function getComments(pollId) {
  const url = pollCommentsEndpoint + pollId;
  return http.get(url);
}

export function saveComments(comments) {
  const config = {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  };
  return http.post(commentEndpoint, comments, config);
}

export function saveLiked(comment, liked) {
  const body = { commentId: comment.id, liked: liked };
  return http.post(likedEndpoint, body);
}
