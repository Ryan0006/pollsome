import Raven from "raven-js";

function init() {
  Raven.config("https://5dd32db4288c446abc6bcb0bb657ccb4@sentry.io/1414990", {
    release: "1-0-0",
    environment: "development-test"
  }).install();
}

function log(error) {
  Raven.captureException(error);
}

export default {
  init,
  log
};
