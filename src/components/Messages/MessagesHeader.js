import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";
class MessagesHeader extends React.Component {
  render() {
    const { channelName, numUniqueUsers, handleSearchChange, searchLoading } = this.props;
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>{channelName}</span>
          <Header.Subheader>{numUniqueUsers}</Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
          loading={searchLoading}
            onChange={handleSearchChange}
            name="searchTerm"
            placeholder="Search Messages"
            size="mini"
            icon="search"
          ></Input>
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
