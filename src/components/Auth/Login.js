import React from "react";
import "../App.css";
import firebase from "../firebase";
import { Link } from "react-router-dom";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };

  displayErrors = (errors) =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {
          console.log(signedInUser);
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            errors: [...this.state.errors, err],
            loading: false,
          });
        });
    }
  };
  isFormValid = ({ email, password }) => {
    return email && password;
  };
  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };
  render() {
    const { email, password, loading, errors } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet"></Icon>
            <div style={{ margin: "2rem 0", fontSize: "2.5rem" }}>
              {" "}
              Register for MeChat
            </div>
          </Header>
          <Form onSubmit={this.handleSubmit} size="larger">
            <Segment>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                value={email}
                type="email"
                className={
                  email.length === 0 &&
                  errors.some((error) =>
                    error.message.toLowerCase().includes("fill")
                  )
                    ? "error"
                    : ""
                }
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                type="password"
                className={
                  (password.length === 0 && errors.length > 0) ||
                  errors.some((error) =>
                    error.message.toLowerCase().includes("password")
                  )
                    ? "error"
                    : ""
                }
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                color="violet"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(this.state.errors)}
            </Message>
          )}
          <Message>
            Don't have an account yet? <Link to="/register"> Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
export default Login;
