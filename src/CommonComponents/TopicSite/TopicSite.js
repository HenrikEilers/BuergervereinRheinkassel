import "react-app-polyfill/ie9";
import React from "react";
import { withStyles } from "@material-ui/core";
import axios from "axios";

const styles = theme => ({
  wrapper: {
    [theme.breakpoints.up("xs")]: {
      width: "306px",
      margin: "64px auto"
    },
    [theme.breakpoints.up("sm")]: {
      width: "575px",
      margin: "70px auto"
    },
    [theme.breakpoints.up("md")]: {
      width: "810px"
    },
    [theme.breakpoints.up("lg")]: {
      width: "1080px"
    }
  }
});

class TopicSite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data1: "hi"
    };
  }

  render() {
    const { classes } = this.props;

    return <div className={classes.wrapper}>1</div>;
  }
}

export default withStyles(styles)(TopicSite);
