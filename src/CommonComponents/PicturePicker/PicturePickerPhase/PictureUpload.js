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

import Search from "@material-ui/icons/Search";

import PublishIcon from "@material-ui/icons/Publish";

import { withRouter } from "react-router-dom";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import {
  postRequest,
  getRequest,
  postUploadPicture
} from "../../../actions.js";

import React from "react";
import {
  PICTURE_PICK,
  GROUP_SELECT,
  GROUP_DATE_SELECT,
  GROUP_EDIT,
  NEW_GROUP,
  CHANGE_GROUP,
  DELETE_GROUP,
  UPLOAD_PICTURE,
  UPLOAD_GROUP_SELECT
} from "../constants.js";

const styles = theme => ({
  hiddenInput: {
    width: "0.1px",
    height: "0.1px",
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    "z-index": -1
  }
});

/**
 * Der PictureUpload kann Bilder hochladen und deren Datum und Namen verändern
 */

class PictureUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadReady: false,
      progress: -1,
      changeDate: false,
      picture: props.picture
    };
  }

  renderDatePicker = () => {
    return (
      <Collapse in={this.state.changeDate} style={{ width: "100%" }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            //disableToolbar
            //variant="inline"
            style={{
              margin: 0,
              marginBottom: 10,
              width: "100%",
              border: "solid 0px red"
            }}
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Datum"
            value={this.state.picture.pictureDate}
            onChange={eventDate => {
              this.setState({
                picture: {
                  ...this.state.picture,
                  pictureDate: eventDate
                }
              });
            }}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
        </MuiPickersUtilsProvider>
      </Collapse>
    );
  };

  onChange = event => {
    const reader = new FileReader();
    reader.onload = (file => {
      return e => {
        const img = new Image();
        img.onload = () => {
          const tmp = file.name.split(".", 2);
          const date = new Date(file.lastModified);
          const picture = {
            uploadName: tmp[0],
            uploadType: tmp[1],
            uploadFile: file,
            uploadImageSrc: e.target.result,
            uploadWidth: img.width,
            uploadHeight: img.height,
            pictureDate: date
          };
          this.setState({
            picture
          });
          this.props.setPicture(picture);
        };
        img.src = e.target.result;
      };
    })(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
  };

  onUpload = () => {
    this.setState({
      uploadError: false,
      uploadErrorText: ""
    });
    postUploadPicture(
      this.props.picture.user,
      this.state.picture.uploadFile,
      this.state.picture.uploadName,
      this.state.picture.uploadType,
      this.state.picture.uploadImageSrc,
      this.state.picture.uploadWidth,
      this.state.picture.uploadHeight,
      this.state.picture.pictureDate.toISOString().substring(0, 10),
      response => {
        if (response.data.success) {
          this.setState({
            success: true
          });
        } else {
          this.setState({
            uploadError: true,
            uploadErrorText: response.data.errortext
          });
        }
      },
      progress => {
        this.setState({ progress: progress });
      }
    );
    this.setState({ progress: 0 });
  };

  render() {
    return (
      <React.Fragment>
        <ButtonBase
          style={{ width: "100%", padding: 10 }}
          variant="outlined"
          onClick={() => {
            this.props.setPicture({
              uploadName: "",
              uploadType: "",
              uploadFile: null,
              uploadImageSrc: "",
              uploadWidth: -1,
              uploadHeight: -1,
              pictureDate: new Date()
            });
            this.props.changePhase(PICTURE_PICK);
          }}
        >
          <Typography variant="button">Zurück</Typography>
        </ButtonBase>
        <Divider />
        <div style={{ padding: 10 }}>
          <input
            type="file"
            name="file"
            id="file"
            accept="image/*"
            className={this.props.classes.hiddenInput}
            onChange={this.onChange}
          />

          <Collapse in={this.state.uploadReady}>
            <div style={{ marginBottom: 7 }}>
              <TextField
                style={{ marginBottom: "7px" }}
                variant="outlined"
                fullWidth
                label="Name des Bildes"
                value={this.state.picture.uploadName}
                onChange={event => {
                  const regex = /^[\w-]*$/;
                  if (regex.test(event.target.value)) {
                    this.setState({
                      picture: {
                        ...this.state.picture,
                        uploadName: event.target.value
                      }
                    });
                  }
                }}
              />
              <img
                width="100%"
                id="!"
                onLoad={() => {
                  this.setState({ uploadReady: true });
                }}
                src={this.state.picture.uploadImageSrc}
                alt="!"
              />
              <Typography variant="caption">
                name:{this.state.picture.uploadName}
              </Typography>
              <br />
              <Typography variant="caption">
                datatype:{this.state.picture.uploadType}
              </Typography>
              <br />
              <Typography variant="caption">
                width:{this.state.picture.uploadWidth}px
              </Typography>
              <br />
              <Typography variant="caption">
                height:{this.state.picture.uploadHeight}px
              </Typography>
              <br />
              <Typography variant="caption">
                date:{" "}
                {this.state.picture.pictureDate.toISOString().substring(0, 10)}
              </Typography>
              <br />
            </div>
            {this.renderDatePicker()}
            <Grid spacing={1} style={{ marginBottom: 4 }} container>
              <Grid xs={12} sm={6} item>
                <Button
                  onClick={() => {
                    this.props.changePhase(UPLOAD_GROUP_SELECT);
                  }}
                  fullWidth
                  style={{ padding: 10 }}
                  variant="outlined"
                >
                  Gruppen auswählen
                </Button>
              </Grid>
              <Grid xs={12} sm={6} item>
                <Button
                  onClick={() =>
                    this.setState({ changeDate: !this.state.changeDate })
                  }
                  fullWidth
                  style={{ padding: 10 }}
                  variant="outlined"
                >
                  Datum Ändern
                </Button>
              </Grid>
            </Grid>
          </Collapse>

          <Button
            style={{ padding: 10 }}
            variant="outlined"
            fullWidth
            onClick={() => {
              var x = document.getElementById("file");
              x.click();
            }}
          >
            Wähle Bild
          </Button>
          <Collapse
            in={this.state.uploadReady && this.state.picture.uploadName !== ""}
          >
            {this.state.progress === -1 ? (
              <Divider style={{ marginTop: 15 }} />
            ) : (
              <React.Fragment>
                <LinearProgress
                  style={{ marginTop: 15 }}
                  variant="determinate"
                  value={this.state.progress}
                />
              </React.Fragment>
            )}
            <Button
              style={{ padding: 15, marginTop: "15px" }}
              variant="outlined"
              fullWidth
              onClick={this.onUpload}
            >
              <PublishIcon />
              Upload
            </Button>
          </Collapse>
          <Collapse in={this.state.uploadError}>
            <Card
              style={{
                textAlign: "center",
                backgroundColor: "red",
                color: "white",
                padding: "15px",
                marginTop: "10px"
              }}
            >
              <Typography variant="button">
                {this.state.uploadErrorText}
              </Typography>
            </Card>
          </Collapse>
        </div>
      </React.Fragment>
    );
  }
}

PictureUpload.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureUpload)));
