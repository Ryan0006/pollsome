import axios from "axios";
import logger from "./logService";
import { toast } from "react-toastify";
import { apiUrl } from "../config.json";

const refreshTokenEndpoint = apiUrl + "/account/token/refresh/";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(null, error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return axios(originalRequest);
        })
        .catch(err => {
          return err;
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = window.localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
      axios
        .post(refreshTokenEndpoint, { refresh: refreshToken })
        .then(({ data }) => {
          window.localStorage.setItem("accessToken", data.access);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.access;
          originalRequest.headers["Authorization"] = "Bearer " + data.access;
          processQueue(null, data.access);
          resolve(axios(originalRequest));
        })
        .catch(err => {
          processQueue(err, null);
          reject(err);
        })
        .then(() => {
          isRefreshing = false;
        });
    });
  } else if (
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500
  )
    return Promise.reject(error);
  else {
    logger.log(error);
    toast.error("An unexpected error occurred.");
  }

  return Promise.reject(error);
});

function getAccessJwt() {
  return localStorage.getItem("accessToken");
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  getAccessJwt
};
