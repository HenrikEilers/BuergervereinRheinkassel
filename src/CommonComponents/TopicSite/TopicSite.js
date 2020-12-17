import React from "react";
import { Grid, Typography, withStyles } from "@material-ui/core";
import { GetApp } from "@material-ui/icons";

import { Link } from "react-router-dom";

import { downloadDatenschutz } from "../../actions.js";

const styles = (theme) => ({
  footer: { position: "relative", height: "100%", border: "solid 2px red" }
});

class TopicSite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data1: "hi"
    };
  }

  downloadDatenschutz = () => {
    downloadDatenschutz(this.props.user);
  };

  render() {
    return (
      <footer>
        <Grid container alignItems="center" justify="space-evenly">
          <Grid item>
            <Link to="/impressum">
              <Typography>Impressum</Typography>
            </Link>
          </Grid>
          <Grid item>
            <Typography
              display="inline"
              paragraph
              onClick={() => {
                this.downloadDatenschutz();
              }}
            >
              <GetApp style={{ fontSize: "1rem" }} />
              <span style={{ marginBottom: "2px" }}>Datenschutzerklärung</span>
            </Typography>
          </Grid>
        </Grid>
      </footer>
    );
  }
}

export default withStyles(styles)(TopicSite);
