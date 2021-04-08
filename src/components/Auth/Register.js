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

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    errors: [],
    loading: false,
    userRef: firebase.database().ref("users"),
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all the fields" };
      this.setState({ errors: [...errors, error] });
      return false;
      //throw error
    } else if (!this.isPasswordValid(this.state)) {
      //throw error
      //   error = { message: "Password is invalid" };
      //   this.setState({ errors: [...errors, error] });
      return false;
    } else {
      return true;
    }
  };

  isPasswordValid = ({ password, confirmPassword }) => {
    let errors = [];
    let error;
    if (password.length < 6 || confirmPassword.length < 6) {
      error = { message: "Password must be 6 character long" };
      this.setState({ errors: [...errors, error] });
      return false;
    } else if (password !== confirmPassword) {
      error = { message: "Both password must match" };
      this.setState({ errors: [...errors, error] });
      return false;
    } else {
      return true;
    }
  };
  displayErrors = (errors) =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);

  isFormEmpty = ({ username, email, password, confirmPassword }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !confirmPassword.length
    );
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createUser) => {
          console.log(createUser);
          //   this.setState({ loading: false });
          createUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `https://ui-avatars.com/api/?name=${this.state.username}`,
            })
            .then(() => {
              this.saveUser(createUser).then(() => {
                console.log("user saved");
              });
            })
            .catch((err) => {
              console.log(err);
              this.setState({ errors: [...this.state.errors, err] });
            });
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
  saveUser = (createUser) => {
    return this.state.userRef.child(createUser.user.uid).set({
      name: createUser.user.displayName,
      avatar: createUser.user.photoURL,
    });
  };
  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };
  render() {
    const {
      username,
      email,
      password,
      confirmPassword,
      loading,
      errors,
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="grey" textAlign="center">
            <Icon name="puzzle piece" color="blue"></Icon>
            <div style={{ margin: "2rem 0", fontSize: "2.5rem" }}>
              {" "}
              Register for MeChat
            </div>
          </Header>
          <Form onSubmit={this.handleSubmit} size="larger">
            <Segment>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                type="text"
                className={
                  username.length === 0 &&
                  errors.some((error) =>
                    error.message.toLowerCase().includes("fill")
                  )
                    ? "error"
                    : ""
                }
              />
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
              <Form.Input
                fluid
                name="confirmPassword"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                value={confirmPassword}
                type="password"
                className={
                  (confirmPassword.length === 0 && errors.length > 0) ||
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
                color="blue"
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
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
export default Register;
