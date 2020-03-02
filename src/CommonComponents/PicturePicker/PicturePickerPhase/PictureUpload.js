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
  UPLOAD_PICTURE
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

/**Der PicturePicker soll eine Common Component werden,
 * die Standartmäßig für das auswählen der bilder benutzt werden
 * - Es soll ein Bild ausgewählt werden können das dann mit allen infos zurück geliefert wird
 * - Uplaods sollen auch möglich sein.(Diese Funktion kann mann aber über die Props ausschalten)
 * - Die Bilder sollten in Gruppen oder ander Eigenschaften zuorden sein
 */

class PictureUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: null
    };
  }

  onChange = event => {
    const reader = new FileReader();
    reader.onload = (file => {
      return e => {
        const img = new Image();
        img.onload = () => {
          const tmp = file.name.split(".", 2);
          this.setState({
            uploadName: tmp[0],
            uploadType: tmp[1],
            uploadFile: file,
            uploadImageSrc: e.target.result,
            uploadWidth: img.width,
            uploadHeight: img.height
          });
        };
        img.src = e.target.result;
      };
    })(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
  };

  render() {
    return (
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
              value={this.state.uploadName}
              onChange={event => {
                const regex = /^[\w-]*$/;
                if (regex.test(event.target.value)) {
                  this.setState({ uploadName: event.target.value });
                }
              }}
            />
            <img
              width="100%"
              id="!"
              onLoad={() => {
                this.setState({ uploadReady: true });
              }}
              src={this.state.uploadImageSrc}
              alt="!"
            />
            <Typography variant="caption">
              name:{this.state.uploadName}
            </Typography>
            <br />
            <Typography variant="caption">
              datatype:{this.state.uploadType}
            </Typography>
            <br />
            <Typography variant="caption">
              width:{this.state.uploadWidth}px
            </Typography>
            <br />
            <Typography variant="caption">
              height:{this.state.uploadHeight}px
            </Typography>
            <br />
          </div>
        </Collapse>

        <Button
          style={{ padding: 15 }}
          variant="outlined"
          fullWidth
          onClick={() => {
            var x = document.getElementById("file");
            x.click();
          }}
        >
          Wähle Bild
        </Button>
        <Collapse in={this.state.uploadReady && this.state.uploadName !== ""}>
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
            onClick={() => {
              this.setState({
                uploadError: false,
                uploadErrorText: ""
              });
              postUploadPicture(
                this.props.user,
                this.state.uploadFile,
                this.state.uploadName,
                this.state.uploadType,
                this.state.uploadImageSrc,
                this.state.uploadWidth,
                this.state.uploadHeight,
                response => {
                  if (response.data.success) {
                    this.setState({
                      stateOfDialog: CHOOSE_PICTURE,
                      pictureList: null,
                      imgSearch: "",
                      pictureChange: false,
                      newPicture: null,
                      uploadReady: false,
                      uploadName: "",
                      uploadType: "",
                      uploadFile: null,
                      uploadImageSrc: "",
                      uploadWidth: "",
                      uploadHeight: "",
                      progress: -1,
                      linkReady: false,
                      uploadError: false,
                      uploadErrorText: ""
                    });
                  } else {
                    this.setState({
                      progress: -1,
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
            }}
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
    );
  }
}

PictureUpload.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureUpload)));
