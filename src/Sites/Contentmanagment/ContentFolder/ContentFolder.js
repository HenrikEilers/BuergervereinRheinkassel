import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

import {
  Button,
  ButtonBase,
  Card,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  InputAdornment,
  CircularProgress
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import Search from "@material-ui/icons/Search";
import Folder from "@material-ui/icons/Folder";

import Grid from "@material-ui/core/Grid";

import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import ContentBox from "../../../CommonComponents/ContentCard/ContentBox";
import FolderDialog from "./FolderDialog";

import PropTypes from "prop-types";
import React from "react";

const styles = theme => ({
  wrapper: {
    //border:"solid 2px red",
    paddingTop: "10px",
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
  card: {
    //border:"solid 2px red",
    //margin:"10px",

    height: "100%",
    width: "100%"
  },
  media: {
    height: "140px"
  },
  newAdd: {
    position: "absolute",

    [theme.breakpoints.only("xs")]: {
      left: "153px",
      bottom: "-10px"
    },
    [theme.breakpoints.up("sm")]: {
      right: "-11px",
      top: "130px"
    },
    zIndex: "10"
  },
  newCancel: {
    position: "absolute",
    right: "5px",
    top: "5px",
    zIndex: "10",
    backgroundColor: "white"
  },
  paper: {
    //marginBottom: "15px"
    //padding:"15px 20px"
  },
  progress: {
    margin: theme.spacing(2)
  },
  root: {
    width: 360,
    backgroundColor: theme.palette.background.paper
  }
});

class ContentFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      designView: true,
      openDeleteAlert: false,
      usedInFeed: false,
      contentToBeDeleted: null,
      search: "",
      openFolderDialog: false,
      openFolderEditDialog: false,
      groupOnEdit: {
        GroupID: -1,
        name: "!"
      },
      openEditFolderAlert: false,
      error: false,
      errormessage: ""
    };
  }

  deleteContent = content => {
    const usedInFeed = this.props.feed.find((value, index) => {
      return value.ContentID === content.ContentID;
    });
    this.setState({
      openDeleteAlert: true,
      usedInFeed,
      contentToBeDeleted: content
    });
  };

  handleDeleteClose = loeschen => {
    if (loeschen) {
      axios
        .post(
          "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/deleteFromContent.php",
          {
            authentication: {
              email: this.props.user.email,
              password: this.props.user.password
            },
            load: {
              data: this.state.contentToBeDeleted
            }
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        )
        .then(response => {
          if (response.data.success) {
            this.props.updateContentHeads(response.data.contentHeads);
            this.setState({
              openDeleteAlert: false
            });

            //Success aus geben
          } else {
            this.setState({
              error: true,
              errormessage: response.data.errortext
            });
            //Error mit Text ausgeben
          }
        })
        .catch(err => console.log(err));
    } else {
      this.setState({
        openDeleteAlert: false
      });
    }
  };

  displayContent = () => {
    if (this.props.offlineContent) {
      return this.props.offlineContent.map((value, index) => {
        return (
          <ContentBox
            checked={false}
            classes={this.props.classes}
            content={value}
            cardPressed={() => {
              this.props.history.push(
                "/contentmanager/content_creator/" + value.name
              );
              this.props.setIndex(index);
            }}
            cancelBoxPressed={() => {
              this.deleteContent(value);
            }}
            offlineContent={this.props.offlineContent}
            key={value.ContentID}
          />
        );
      });
    }
  };

  renderDeleteDialog = () => {
    return (
      <Dialog
        open={this.state.openDeleteAlert}
        onClose={() => this.handleDeleteClose(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Wollen sie den Content Löschen"}
        </DialogTitle>
        {this.state.usedInFeed ? (
          <DialogContent>
            <DialogContentText color="error" id="alert-dialog-description">
              Content kann nicht gelöscht werden da er Teil des Feeds ist.
            </DialogContentText>
          </DialogContent>
        ) : null}
        {this.state.error ? (
          <DialogContent>
            <DialogContentText color="error" id="alert-dialog-error">
              {this.state.errormessage}
            </DialogContentText>
          </DialogContent>
        ) : null}
        <DialogActions>
          <Button
            onClick={() => {
              this.handleDeleteClose(false);
            }}
            color="primary"
          >
            Abbrechen
          </Button>
          {!this.state.usedInFeed ? (
            <Button
              onClick={() => {
                this.handleDeleteClose(true);
              }}
              color="primary"
              autoFocus
            >
              Löschen
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    );
  };

  handleFolderDialogClose = () => {
    this.setState({ openFolderDialog: false, openFolderEditDialog: false });
  };

  renderFolderDialog = () => {
    return (
      <FolderDialog
        open={this.state.openFolderDialog}
        onClose={this.handleFolderDialogClose}
        handleFolderAll={this.props.handleFolderAll}
        group={this.props.group}
        handleFolderChange={this.props.handleFolderChange}
        offlineContent={this.props.offlineFullContent}
        editGroup={this.props.editGroup}
        deleteGroup={this.props.deleteGroup}
      />
    );
  };

  //render methode
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <Grid spacing={2} container alignContent="stretch">
          <Grid item xs={9} sm={10} md="auto" lg={11} style={{ width: "90%" }}>
            <Paper className={classes.paper}>
              <TextField
                style={{ minWidth: "0px", width: "100%" }}
                variant="outlined"
                value={this.state.contentSearch}
                onChange={this.props.handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search style={{ color: "grey" }} />
                    </InputAdornment>
                  )
                }}
              />
            </Paper>
          </Grid>
          <Grid
            item
            xs={3}
            sm={2}
            md
            lg={1}
            style={{ position: "relative", width: "10%" }}
          >
            <Card style={{ height: "100%" }}>
              <ButtonBase
                component="div"
                style={{
                  height: "100%",
                  display: "block"
                }}
                onClick={() => this.setState({ openFolderDialog: true })}
              >
                <Folder style={{ height: "100%", color: "grey" }} />
              </ButtonBase>
            </Card>
          </Grid>
        </Grid>
        {this.props.offlineContent ? (
          <div style={{ marginTop: "15px" }}>
            <Grid spacing={4} alignItems="stretch" container styles={{}}>
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
                    style={{
                      height: "100%",
                      display: "block"
                    }}
                    component={Link}
                    to="/contentmanager/content_creator/neu"
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
        {this.renderDeleteDialog()}
        {this.renderFolderDialog()}
      </div>
    );
  }
}

ContentFolder.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(ContentFolder));
