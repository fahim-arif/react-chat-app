import React from "react";
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"],
  };

  addFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };
  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        // send file
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };
  clearFile = () => {
    return this.setState({ file: null });
  };

  isAuthorized = (filename) =>
    this.state.authorized.includes(mime.lookup(filename));

  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addFile}
            type="file"
            name="file"
            fluid
            label="File type: jpg, png"
          ></Input>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.sendFile} color="green" inverted>
            <Icon name="checkmark"></Icon>
            Send
          </Button>
          <Button onClick={closeModal} color="red" inverted>
            <Icon name="remove"></Icon>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
