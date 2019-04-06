import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: { username: "", password: "", repeatpass: "", name: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .email()
      .label("Username"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password"),
    repeatpass: Joi.any()
      .valid(Joi.ref("password"))
      .label("Passwords")
      .options({
        language: {
          any: {
            allowOnly: "do not match"
          }
        }
      }),
    name: Joi.string()
      .required()
      .max(15)
      .label("Name")
  };

  getRegisterButtonDisabled = () => {
    return this.validate();
  };

  doSubmit = async () => {
    try {
      await auth.register(this.state.data);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data.message;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div className="page-wrap d-flex flex-row align-items-center">
        <div className="col-8 mx-auto" style={{ marginTop: 50 }}>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("username", "Username")}
            {this.renderInput("password", "Password", "password")}
            {this.renderInput("repeatpass", "Confirm password", "password")}
            {this.renderInput("name", "Name")}
            {this.renderButton("Signup", this.getRegisterButtonDisabled())}
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
