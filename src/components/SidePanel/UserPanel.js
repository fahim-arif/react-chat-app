import React from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../firebase";
import { connect } from "react-redux";

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
  };
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignOut}>Sign out</span>,
    },
  ];
  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("User is signed out");
      });
  };

  render() {
    const { user } = this.state;
    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
            <Header as="h2" inverted floated="left">
              <Icon name="code"></Icon>
              <Header.Content>MeChat</Header.Content>
            </Header>
          </Grid.Row>

          {/* User DropDown */}
          <Header style={{ padding: ".5rem" }} as="h3" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced="right" avatar></Image>
                  {user.displayName}
                </span>
              }
              options={this.dropdownOptions()}
            ></Dropdown>
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
