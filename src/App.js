import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Vote from "./components/vote";
import NavBar from "./components/navBar";
import Logout from "./components/common/logout";
import NotFound from "./components/notFound";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Poll from "./components/poll";
import AllPolls from "./components/allPolls";
import MyPolls from "./components/myPolls";
import PollForm from "./components/pollForm";
import auth from "./services/authService";
import "./App.css";
import ProtectedRoute from "./components/common/protectedRoute";
import ContactMe from "./components/contactMe";

class App extends Component {
  state = { user: null };

  async componentDidMount() {
    const user = await auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <ProtectedRoute
              path="/mypolls/:id"
              component={PollForm}
              user={user}
            />
            <ProtectedRoute path="/mypolls" component={MyPolls} user={user} />
            <ProtectedRoute path="/vote/:id" component={Vote} user={user} />
            <Route path="/poll/:id" component={Poll} />
            <Route path="/polls" component={AllPolls} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/contactme" component={ContactMe} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/polls" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
