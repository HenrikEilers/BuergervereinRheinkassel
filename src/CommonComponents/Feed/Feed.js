import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles, CircularProgress } from "@material-ui/core";
import Box from "./Box";

import axios from "axios";

import { postRequest } from "../../actions.js";

const styles = theme => ({
  App: {
    "font-family": "sans-serif",
    "text-align": "center"
  },

  wrapper: {
    [theme.breakpoints.up("xs")]: {
      width: "95vw",
      margin: "auto"
    },
    [theme.breakpoints.up("sm")]: {
      width: "90vw",
      margin: "auto"
    },
    [theme.breakpoints.up("md")]: {
      width: "810px"
    },
    [theme.breakpoints.up("lg")]: {
      width: "1080px"
    }
  },

  /*marker1: {
    "border-color": "red",
    "border-style": "solid"
  },
  marker2: {
    "border-color": "yellow",
    "border-style": "solid"
  },
  marker3: {
    "border-color": "pink",
    "border-style": "solid"
  },*/

  box: {
    width: "100 %",
    height: "100 %"
  },
  gridbox1: {
    border: "solid 0px blue",
    padding: "2px",
    [theme.breakpoints.up("xs")]: {
      height: "47.5vw"
    },
    [theme.breakpoints.up("sm")]: {
      height: "30vw"
    },
    [theme.breakpoints.up("md")]: {
      height: "270px"
    },
    [theme.breakpoints.up("lg")]: {
      height: "270px"
    }
    //"border-color": "yellow",
    //"border-style": "solid"
  },
  gridbox2: {
    padding: "2px",
    [theme.breakpoints.up("xs")]: {
      height: "95vw"
    },
    [theme.breakpoints.up("sm")]: {
      height: "60vw"
    },
    [theme.breakpoints.up("md")]: {
      height: "540px"
    },
    [theme.breakpoints.up("lg")]: {
      height: "540px"
    }
  },
  progress: {
    margin: theme.spacing(2)
  }
});

class Feed extends React.Component {
  handleBoxOnClick = FeedID => {
    const tmpContentHead = this.props.offlineData.find(value => {
      return value.FeedID === FeedID;
    });
    this.props.feedAction(tmpContentHead);
  };

  restOfContent = () => {
    const { classes } = this.props;
    return this.props.offlineData.map((current, index) => {
      if (index > 4) {
        return (
          <Grid
            key={current.FeedID}
            item
            xs={6}
            sm={4}
            md={4}
            lg={3}
            className={classes.gridbox1}
          >
            <Box
              data={current}
              onClick={tmpContentHead => this.props.feedAction(tmpContentHead)}
            />
          </Grid>
        );
      } else {
        return null;
      }
    });
  };

  render() {
    const { classes } = this.props;
    if (!this.props.offlineData) {
      return (
        <div className={classes.wrapper}>
          <CircularProgress className={classes.progress} />
        </div>
      );
    }
    return (
      <div className={classes.wrapper}>
        <Grid container className={classes.marker1}>
          {/*erste Zeile
          <Grid item xs={12} sm={12} md={12} className={classes.gridbox1}>
            <Box />
          </Grid>

          zweite Zeile*/}
          {this.props.offlineData[0] ? (
            <Grid item container xs={12} sm={8} md={8} lg={6}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={classes.gridbox2}
              >
                <Box
                  first
                  data={this.props.offlineData[0]}
                  onClick={tmpContentHead =>
                    this.props.feedAction(tmpContentHead)
                  }
                />
              </Grid>
            </Grid>
          ) : null}
          {this.props.offlineData[1] ? (
            <Grid item container xs={12} sm={4} md={4} lg={3}>
              <Grid
                item
                xs={6}
                sm={12}
                md={12}
                lg={12}
                className={classes.gridbox1}
              >
                <Box
                  data={this.props.offlineData[1]}
                  onClick={tmpContentHead =>
                    this.props.feedAction(tmpContentHead)
                  }
                />
              </Grid>
              {this.props.offlineData[2] ? (
                <Grid
                  item
                  xs={6}
                  sm={12}
                  md={12}
                  lg={12}
                  className={classes.gridbox1}
                >
                  <Box
                    data={this.props.offlineData[2]}
                    onClick={tmpContentHead =>
                      this.props.feedAction(tmpContentHead)
                    }
                  />
                </Grid>
              ) : null}
            </Grid>
          ) : null}
          {this.props.offlineData[3] ? (
            <Grid item container xs={12} sm={8} md={8} lg={3}>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={12}
                className={classes.gridbox1}
              >
                <Box
                  data={this.props.offlineData[3]}
                  onClick={tmpContentHead =>
                    this.props.feedAction(tmpContentHead)
                  }
                />
              </Grid>
              {this.props.offlineData[4] ? (
                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  lg={12}
                  className={classes.gridbox1}
                >
                  <Box
                    data={this.props.offlineData[4]}
                    onClick={tmpContentHead =>
                      this.props.feedAction(tmpContentHead)
                    }
                  />
                </Grid>
              ) : null}
            </Grid>
          ) : null}
          {this.restOfContent()}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Feed);
