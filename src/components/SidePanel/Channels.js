import React from "react";
import firebase from "../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import { Icon, Menu, Modal, Form, Input, Button } from "semantic-ui-react";

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true,
    activeChannel: "",
  };
  componentDidMount() {
    this.addListeners();
  }
  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", (snap) => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };
  removeListeners = () => {
    this.state.channelsRef.off();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
        console.log("Channel was added to database");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      console.log("Channel added");
      this.addChannel();
    }
  };

  isFormValid = ({ channelName, channelDetails }) => {
    if (channelName && channelDetails) {
      return true;
    } else {
      return false;
    }
  };

  closeModal = () => {
    this.setState({ modal: false });
  };
  openModal = () => {
    this.setState({ modal: true });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  displayChannels = (channels) => {
    return (
      channels.length > 0 &&
      channels.map((channel) => {
        console.log(channel);
        return (
          <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7, color: "white" }}
            active={channel.id === this.state.activeChannel}
          >
            # {channel.name}
          </Menu.Item>
        );
      })
    );
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  render() {
    const { channels, modal } = this.state;
    return (
      <>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange"></Icon>CHANNELS
            </span>
            {"  "}({channels.length}){" "}
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {/* Channels list */}
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/* //add channel modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  name="channelName"
                  fluid
                  label="Name of Channel"
                  onChange={this.handleChange}
                ></Input>
              </Form.Field>
              <Form.Field>
                <Input
                  name="channelDetails"
                  fluid
                  label="Channel Details"
                  onChange={this.handleChange}
                ></Input>
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleSubmit} color="green" inverted>
              <Icon name="checkmark"></Icon>
              Add
            </Button>
            <Button onClick={this.closeModal} color="red" inverted>
              <Icon name="remove"></Icon>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}
export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Channels
);
