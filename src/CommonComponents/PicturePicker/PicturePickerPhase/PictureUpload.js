import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  Typography,
  Grid,
  Button,
  TextField,
  Divider,
  Collapse,
  ButtonBase,
  Card,
  LinearProgress,
  Paper
} from "@material-ui/core";

import PublishIcon from "@material-ui/icons/Publish";

import { withRouter } from "react-router-dom";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import { postUploadPicture } from "../../../actions.js";

import React from "react";
import { PICTURE_PICK, UPLOAD_GROUP_SELECT } from "../constants.js";

const styles = (theme) => ({
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
      picture: props.picture,
      nameError: !/^[\w-]*$/.test(props.picture.uploadName),
      success: false,
      uploadError: false,
      uploadErrorText: ""
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
            onChange={(eventDate) => {
              this.setState({
                picture: {
                  ...this.state.picture,
                  pictureDate: eventDate
                }
              });
              this.props.setPicture(
                {
                  ...this.state.picture,
                  pictureDate: eventDate
                },
                this.props.uploadGroups
              );
            }}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
        </MuiPickersUtilsProvider>
      </Collapse>
    );
  };

  onChange = (event) => {
    const reader = new FileReader();
    reader.onload = ((file) => {
      return (e) => {
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
            picture,
            nameError: !/^[\w-]*$/.test(picture.uploadName)
          });
          this.props.setPicture(picture, this.props.uploadGroups);
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
      this.props.user,
      this.state.picture.uploadFile,
      this.state.picture.uploadName,
      this.state.picture.uploadType,
      this.state.picture.uploadImageSrc,
      this.state.picture.uploadWidth,
      this.state.picture.uploadHeight,
      this.state.picture.pictureDate.toISOString().substring(0, 10),
      this.props.uploadGroups,
      (response) => {
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
      (progress) => {
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
            this.props.setPicture(
              {
                uploadName: "",
                uploadType: "",
                uploadFile: null,
                uploadImageSrc: "",
                uploadWidth: -1,
                uploadHeight: -1,
                pictureDate: new Date()
              },
              []
            );
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
              <Paper
                style={{
                  padding: 10,
                  marginBottom: 15,
                  border: "solid red 2px",
                  textAlign: "center"
                }}
              >
                <Typography>
                  Beim Hochladen von Bildern sind das Urheberrecht und die
                  Persönlichkeitsrechte zu Beachten
                </Typography>
              </Paper>
              <TextField
                error={this.state.nameError}
                style={{ marginBottom: "7px" }}
                variant="outlined"
                fullWidth
                label="Name des Bildes"
                value={this.state.picture.uploadName}
                onChange={(event) => {
                  const regex = /^[\w-]*$/;
                  this.setState({
                    picture: {
                      ...this.state.picture,
                      uploadName: event.target.value
                    },
                    nameError: !regex.test(event.target.value)
                  });
                }}
              />
              <Collapse in={this.state.nameError}>
                <Paper
                  style={{
                    padding: 10,
                    textAlign: "center",
                    marginBottom: 10,
                    backgroundColor: "red"
                  }}
                >
                  <Typography style={{ color: "white" }}>
                    Der Name darf nur aus Buchstaben, Nummern und Unterstrichen
                    bestehen. Umlaute und 'ß' sind nicht erlaubt.
                  </Typography>
                </Paper>
              </Collapse>
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
              <Grid xs={12} sm={6} item>
                <Button
                  onClick={() => {
                    this.props.changePhase(UPLOAD_GROUP_SELECT);
                  }}
                  fullWidth
                  style={{ padding: 10 }}
                  variant="outlined"
                >
                  {this.props.uploadGroups.length === 0
                    ? "Gruppen auswählen"
                    : this.props.uploadGroups.length + " Gruppen Ausgewählt"}
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
          <Collapse in={this.state.success}>
            <Paper
              style={{
                marginTop: 10,
                backgroundColor: "green",
                color: "white",
                textAlign: "center",
                padding: 10
              }}
            >
              <Typography>Upload war erfolgreich</Typography>
            </Paper>
          </Collapse>
          <Collapse
            in={
              this.state.uploadReady &&
              this.state.picture.uploadName !== "" &&
              this.state.success === false
            }
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
