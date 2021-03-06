import React from "react";
import PropTypes from "prop-types";

import { postRequest } from "../../actions.js";

import { withStyles, withTheme, Button } from "@material-ui/core";

const styles = theme => ({});

class Poll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sendTest = () => {
    const callback = response => {
      console.log(response);
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/test.php",
      this.props.user,
      {},
      callback
    );
  };

  //render methode
  render() {
    const { classes, user } = this.props;
    return (
      <React.Fragment>
        <a
          href="https://www.buergerverein-rheindoerfer.de/phpTest/test.php"
          download
        >
          test
        </a>
        <Button onClick={this.sendTest}>Test</Button>
      </React.Fragment>
    );
  }
}

Poll.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTheme(withStyles(styles)(Poll));
