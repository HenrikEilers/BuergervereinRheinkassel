import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Card, ButtonBase, Collapse } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/AddOutlined";

import { Route, Link, withRouter } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import React from "react";

import Feed from "../../../CommonComponents/Feed/Feed";
import ContentCard from "../../../CommonComponents/ContentCard/ContentCard";

const styles = theme => ({
  wrapper: {
    //border:"solid 2px red",
    [theme.breakpoints.up("xs")]: {
      width: "306px",
      margin: "auto"
    },
    [theme.breakpoints.up("sm")]: {
      width: "525px",
      margin: "auto"
    },
    [theme.breakpoints.up("md")]: {
      width: "810px"
    },
    [theme.breakpoints.up("lg")]: {
      width: "1080px"
    }
  },
  paper: {
    marginBottom: "7px"
  },

  progress: {
    margin: theme.spacing(2)
  }
});

class Feedmanagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      designView: false,
      memberView: false
    };
  }

  displayContent = () => {
    if (this.props.offlineFeed) {
      return this.props.offlineFeed.map((value, index) => {
        return (
          <ContentCard
            user={this.props.user}
            groups={this.props.groups}
            checked={this.state.memberView}
            content={value}
            changeFeedContent={this.props.changeFeedContent}
            offlineContent={this.props.offlineContent}
            addToTMPFeed={() => this.props.addToTMPFeed(value.FeedID)}
            deleteFromTMPFeed={() => this.props.deleteFromTMPFeed(value.FeedID)}
            key={index}
          />
        );
      });
    }
  };

  FeedReady = () => {
    const tmp = this.props.offlineContent.find(data => data.ContentID === -1);
    if (tmp) {
      return false;
    } else {
      return true;
    }
  };
  //render methode
  render() {
    const { classes } = this.props;

    const feedContent = () => {
      if (this.state.memberView) {
        return this.props.offlineFeed.filter(value => {
          return value.rank === 0;
        });
      } else return this.props.offlineFeed;
    };

    return (
      <React.Fragment>
        <div className={classes.wrapper}>
          <Paper className={classes.paper}>
            <Grid container>
              {/*Settings Bereich*/}
              <Grid item xs={6} sm={4} style={{ border: "solid 0px red" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.designView}
                      onChange={() => {
                        this.setState({ designView: !this.state.designView });
                      }}
                      value="checkedB"
                      color="secondary"
                    />
                  }
                  label="Vorschau"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                {this.state.designView ? (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.memberView}
                        onChange={() => {
                          this.setState({ memberView: !this.state.memberView });
                        }}
                        color="secondary"
                      />
                    }
                    label="Mitglieder Sicht"
                  />
                ) : null}
              </Grid>
              {/*tatsächlicher Content Bereich*/}
            </Grid>
          </Paper>

          <Collapse in={this.props.feedHasToSave}>
            <Paper style={{ margin: "7px 0px" }}>
              <Button
                onClick={this.props.addToFeed}
                style={{
                  width: "100%",
                  color: "white",
                  backgroundColor: "green"
                }}
              >
                Änderungen Speichern
              </Button>
            </Paper>
          </Collapse>

          <Collapse in={this.props.feedHasToChange || this.props.error}>
            <Paper
              style={{
                width: "auto",
                color: "white",
                backgroundColor: "red",
                padding: "5px 0px",
                margin: "7px 0px"
              }}
            >
              <Typography variant="button">
                {!this.props.error
                  ? "Nicht Alle Inhalte besetzt"
                  : this.props.errorText}
              </Typography>
            </Paper>
          </Collapse>
        </div>
        <div style={{ marginTop: "7px" }}>
          {this.state.designView ? (
            this.props.offlineFeed ? (
              <Feed
                onlineData={false}
                offlineData={feedContent()}
                feedAction={tmpContentHead => {}}
              />
            ) : (
              <CircularProgress className={classes.progress} />
            )
          ) : this.props.offlineFeed ? (
            <div className={classes.wrapper}>
              <Grid spacing={4} alignItems="stretch" container>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  style={{ position: "relative" }}
                >
                  <Card style={{ height: "100%", minHeight: "140px" }}>
                    <ButtonBase
                      component="div"
                      style={{
                        height: "100%",
                        display: "block"
                      }}
                      onClick={() => {
                        this.props.addToTMPFeed(0);
                      }}
                    >
                      <AddIcon
                        style={{ color: "grey", width: "70px", height: "100%" }}
                      />
                    </ButtonBase>
                  </Card>
                </Grid>
                {this.displayContent()}
              </Grid>
            </div>
          ) : (
            <CircularProgress className={classes.progress} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

Feedmanagement.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Feedmanagement));
