import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  Dialog,
  Typography,
  Grid,
  Button,
  TextField,
  Divider,
  Collapse,
  ButtonBase,
  CircularProgress,
  InputAdornment,
  Card,
  LinearProgress
} from "@material-ui/core";

import PicturePicker from "../../../CommonComponents/PicturePicker/PicturePicker";

import Search from "@material-ui/icons/Search";

import PublishIcon from "@material-ui/icons/Publish";

import { withRouter } from "react-router-dom";

import { postRequest, postUploadPicture } from "../../../actions.js";

import React from "react";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  wrapper: {
    //border: "solid 2px red",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    },
    [theme.breakpoints.up("xs")]: {
      width: "306px"
    },
    [theme.breakpoints.up("sm")]: {
      width: "525px"
    },
    [theme.breakpoints.up("md")]: {
      width: "810px"
    }
  },
  newPicture: {
    padding: 15,
    paddingTop: 10
  },
  newPicture1: {
    padding: 15
  },
  newLink: {
    padding: 10,
    paddingTop: 5
  },
  newLink1: {
    padding: "0px 5px"
  },
  padding: {
    padding: 15
  },
  media: {
    "background-image": "url(https://picsum.photos/1000/500)",
    "background-repeat": "no-repeat",
    "background-size": "100%"
  },
  beschreibung: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%"
  },
  card: {
    maxHeight: 300,
    width: "100%",
    overflow: "hidden",
    "text-align": "center",
    color: "white"
  },
  hiddenInput: {
    width: "0.1px",
    height: "0.1px",
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    "z-index": -1
  },
  labelButton: {
    //theme.Button
  }
});
const EMPTY_PICTURE_START = "EMPTY_PICTURE_START";
const OWNPICTURE_START = "OWNPICTURE_START";
const CHOOSE_PICTURE = "CHOOSE_PICTURE";

class PictureDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picture:
        props.pictureContent.ContentTypeID === 2
          ? { ...props.pictureContent }
          : null,
      stateOfDialog: props.stateOfDialog,
      link:
        props.pictureContent.ContentTypeID === 3
          ? props.pictureContent.content
          : "",
      getloadingErrorPicure: true,
      extendInfo: false
    };
  }

  renderDialogContent = () => {
    if (EMPTY_PICTURE_START === this.state.stateOfDialog) {
      return this.renderEmptyPictureStart();
    }
    if (OWNPICTURE_START === this.state.stateOfDialog) {
      return this.renderOwnPictureStart();
    }
    if (CHOOSE_PICTURE === this.state.stateOfDialog) {
      return this.renderChoosePicture();
    }
  };

  /**rendert den Dialog wenn kein Bild oder ein Bild Von einer anderen Quelle ausgewählt ist. */
  renderEmptyPictureStart = () => {
    const { classes } = this.props;
    return (
      <div style={{ padding: "8px 5px" }}>
        <div className={classes.newPicture}>
          <Button
            onClick={() => {
              this.setState({
                stateOfDialog: CHOOSE_PICTURE
              });
            }}
            className={classes.newPicture1}
            fullWidth
            variant="outlined"
          >
            Bild Auswählen
          </Button>
        </div>
        <Divider style={{ margin: "0px 15px" }} />
        <div className={classes.newLink}>
          <div className={classes.newLink1}>
            <Typography variant="caption">Bildlink einfügen</Typography>
            <TextField
              value={this.state.link}
              onChange={event => {
                this.setState({
                  link: event.target.value,
                  getloadingErrorPicure: true
                });
              }}
              variant="outlined"
              fullWidth
            >
              Wähle Bild
            </TextField>
          </div>
          <Collapse in={!this.state.getloadingErrorPicure}>
            <div style={{ paddingTop: "10px" }}>
              <img
                style={{ verticalAlign: "middle" }}
                onLoad={() => {
                  this.setState({ getloadingErrorPicure: false });
                }}
                onError={() => {
                  this.setState({ getloadingErrorPicure: true });
                }}
                id="myImg"
                width="100%"
                src={this.state.link}
                alt={this.props.pictureContent.name}
              />
            </div>
          </Collapse>
        </div>
      </div>
    );
  };

  /**rendert den Dialog wenn schon ein Bild vorhanden ist das im iamge Ordner gespeichert ist  */
  renderOwnPictureStart = () => {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <ButtonBase
          style={{
            width: "100%",
            verticalAlign: "middle"
          }}
          onClick={() => {
            this.setState({ extendInfo: !this.state.extendInfo });
          }}
        >
          <img
            id="myImg"
            width="100%"
            src={this.state.picture.content}
            alt={this.state.picture.name}
          />
        </ButtonBase>
        <div style={{ padding: 5 }}>
          <div style={{ padding: "0px 10px", paddingBottom: "0px" }}>
            <Collapse in={this.state.extendInfo}>
              {" "}
              <Typography variant="caption">
                name:{this.state.picture.name}
                <br />
                pictureID:{this.state.picture.pictureID}
                <br />
                width:{this.state.picture.width}px
                <br />
                height:{this.state.picture.height}px
                <br />
                date:{this.state.picture.date}px
                <br />
                <a href={this.state.picture.content}>link</a>
                <br />
              </Typography>
            </Collapse>
          </div>
          <div className={classes.newPicture}>
            <Button
              onClick={() => {
                this.setState({
                  stateOfDialog: CHOOSE_PICTURE
                });
              }}
              className={classes.newPicture1}
              fullWidth
              variant="outlined"
            >
              Bild Ändern
            </Button>
          </div>

          <Divider />
          <div style={{ padding: 15, paddingBottom: 10 }}>
            <Button
              onClick={() => {
                this.setState({
                  stateOfDialog: EMPTY_PICTURE_START,
                  picture: null
                });
              }}
              className={classes.newPicture1}
              fullWidth
              variant="outlined"
            >
              Link Einfügen
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderChoosePicture = () => {
    return (
      <PicturePicker
        getPicture={picture =>
          this.setState({
            picture,
            open: false,
            stateOfDialog: OWNPICTURE_START
          })
        }
        disableUpload={false}
        user={this.props.user}
      />
    );
  };

  changeSave = () => {
    if (this.state.stateOfDialog === OWNPICTURE_START) {
      this.props.changeSave(
        2,
        this.props.pictureContent.reihenfolge,
        this.state.picture
      );
    }
    if (this.state.stateOfDialog === EMPTY_PICTURE_START) {
      this.props.changeSave(
        3,
        this.props.pictureContent.reihenfolge,
        this.state.link
      );
    }
    this.props.onClose();
  };

  hasToSave = () => {
    /**Voraussetzungen:
     * -Nur in den Phasen OWNPICTURE_START und EMPTY_PICTURE_START darf gespeichert werden
     * -Content muss sich verändert haben
     * -Link muss funktionieren
     */

    //Phase OWNPICTURE_START ist aktiv
    if (this.state.stateOfDialog === OWNPICTURE_START) {
      //Vor her war ein Link ausgewählt
      if (this.props.pictureContent.ContentTypeID === 3) {
        return true;
      } else {
        //Anderes Bild muss gewählt sein
        if (
          this.props.pictureContent.pictureID !== this.state.picture.pictureID
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
    //Phase EMPTY_PICTURE_START ist aktiv
    if (this.state.stateOfDialog === EMPTY_PICTURE_START) {
      //Der Link zeigt auf ein Reales Bild
      if (this.state.getloadingErrorPicure === false) {
        //Vor her war ein Bild ausgewählt
        if (this.props.pictureContent.ContentTypeID === 2) {
          return true;
        } else {
          //Anderer Link muss ausgewählt worden sein
          if (this.props.pictureContent.content !== this.state.link) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  };

  //render methode
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          scroll="body"
          maxWidth="sm"
          fullWidth
          open={this.props.open}
          onClose={this.props.onClose}
          onExited={() => {
            this.setState({
              picture:
                this.props.pictureContent.ContentTypeID === 2
                  ? { ...this.props.pictureContent }
                  : null,
              stateOfDialog: this.props.stateOfDialog,
              link:
                this.props.pictureContent.ContentTypeID === 3
                  ? this.props.pictureContent.content
                  : "",
              getloadingErrorPicure: true,
              extendInfo: false
            });
          }}
        >
          <Collapse
            in={this.hasToSave()}
            style={{
              backgroundColor: "green"
            }}
          >
            <ButtonBase
              onClick={this.changeSave}
              style={{
                width: "100%",
                backgroundColor: "green",
                color: "white",
                height: "45px"
              }}
            >
              <Typography variant="button">Hinzufügen</Typography>
            </ButtonBase>
          </Collapse>
          <div>{this.renderDialogContent()}</div>
        </Dialog>
      </div>
    );
  }
}

PictureDialog.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureDialog)));
