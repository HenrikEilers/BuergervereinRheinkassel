import React from "react";
import {
  withStyles,
  CircularProgress,
  Typography,
  Paper
} from "@material-ui/core";

import ContentDisplayer from "../../CommonComponents/ContentDisplayer/ContentDisplayer";

import { withRouter } from "react-router-dom";

import { postRequest } from "../../actions.js";

const styles = (theme) => ({});

class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentHead: null,
      contentBody: null,
      error: false
    };
  }
  //Läd Content
  loadContent = () => {
    const callback = (response) => {
      if (response.data.success) {
        this.setState({
          contentHead: response.data.ContentHead,
          contentBody: response.data.ContentBody
        });
      } else {
        this.setState({
          error: true,
          errorText: response.data.errortext
        });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/getTopic/getTopic.php",
      this.props.user,
      { name: this.props.history.location.pathname.split("/")[2] },
      callback
    );
  };

  render() {
    //Im falle Eines Error wird eine Nachricht Angezeigt
    if (this.state.error) {
      return (
        <Paper style={{ padding: 10, backgroundColor: "red" }}>
          <Typography style={{ color: "white" }}>
            {this.state.errorText}
          </Typography>
        </Paper>
      );
    }
    //Läd Content und zeigt dabei Ladesymbol
    if (this.state.contentHead === null || this.state.contentBody == null) {
      this.loadContent();
      return (
        <div style={{ textAlign: "center", padding: 20 }}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <ContentDisplayer
        user={this.props.user}
        contentHead={this.state.contentHead}
        contentBody={this.state.contentBody}
        //errorText={errorText}
      />
    );
  }
}

export default withRouter(withStyles(styles)(Topic));
