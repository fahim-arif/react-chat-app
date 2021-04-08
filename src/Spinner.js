import React from "react";
import { Header,Loader, Icon, Dimmer } from "semantic-ui-react";

const Spinner = () => (
  <Dimmer active>
    <Icon loading size="huge" name="spinner"  />
    <Header size="large" inverted>Preparing Chat....</Header>

    {/* <Loader size="huge" content={"Preparing Chat...."} /> */}
  </Dimmer>
);

export default Spinner;
