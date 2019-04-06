import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.username, data.password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        if (
          ex.response.data.non_field_errors[0] ===
          "No active account found with the given credentials"
        )
          errors.username = "Invalid username or password";
        this.setState({ errors });
      }
    }
  };

  getLoginButtonDisabled = () => {
    return this.validate();
  };

  render() {
    if (auth.getCurrentUserId()) return <Redirect to="/" />;

    return (
      <div className="page-wrap d-flex flex-row align-items-center">
        <div className="col-8 mx-auto">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("username", "Username")}
            {this.renderInput("password", "Password", "password")}
            {this.renderButton("Login", this.getLoginButtonDisabled())}
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
