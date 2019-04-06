import http from "./httpService";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";

const accessTokenKey = "accessToken";
const refreshTokenKey = "refreshToken";

const accessTokenEndpoint = apiUrl + "/account/token/";
const signupEndpoint = apiUrl + "/signup/";
const userEndpoint = apiUrl + "/user/";

async function register(user) {
  await http.post(signupEndpoint, {
    username: user.username,
    password: user.password,
    name: user.name
  });
  await login(user.username, user.password);
}

async function login(username, password) {
  const { data } = await http.post(accessTokenEndpoint, {
    username,
    password
  });
  localStorage.setItem(accessTokenKey, data.access);
  localStorage.setItem(refreshTokenKey, data.refresh);
}

function loginWithJwt(jwt) {
  localStorage.setItem(accessTokenKey, jwt);
}

function logout() {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
}

async function getCurrentUser() {
  const jwt = localStorage.getItem(accessTokenKey);
  if (!jwt) return;
  const jwtDecoded = jwtDecode(jwt);
  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem(accessTokenKey)
    }
  };
  let response = null;
  try {
    response = await http.get(userEndpoint + jwtDecoded.user_id, config);
    return response.data;
  } catch (ex) {
    if (ex.response && ex.response.status === 401) {
      return;
    }
  }
}

function getCurrentUserId() {
  const jwt = localStorage.getItem(accessTokenKey);
  if (!jwt) return;
  const jwtDecoded = jwtDecode(jwt);
  return jwtDecoded.user_id;
}

export default {
  register,
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getCurrentUserId
};
