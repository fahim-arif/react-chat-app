import React from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import firebase from "../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

class DirectMessages extends React.Component {
  state = {
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
  };
  componentDidMount() {
    if (this.state.user) {
      this.addListenders(this.state.user.uid);
    }
  }

  addListenders = (currentUserUid) => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        console.log(user, "fahim");
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          console.error(err);
        });
      }
    });

    this.state.presenceRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        //   add status to user
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };
  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  isUserOnline = (user) => user.status;

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
  };

  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };
  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail"></Icon>
            DIRECT MESSAGES
          </span>
          ({users.length})
        </Menu.Item>
        {/* Users to Send Direct Messages */}
        {users.map((user) => {
          return (
            <Menu.Item
              key={user.uid}
              onClick={() => this.changeChannel(user)}
              style={{ opacity: 0.7, fontStyle: "italic" }}
            >
              <Icon
                name="circle"
                color={this.isUserOnline(user) ? "green" : "red"}
              ></Icon>
              @ {user.name}
            </Menu.Item>
          );
        })}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
);
