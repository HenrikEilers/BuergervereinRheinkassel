import { withStyles } from "@material-ui/core/styles";

import {
  Button,
  Dialog,
  Collapse,
  TextField,
  Divider,
  Checkbox,
  Typography,
  ButtonBase
} from "@material-ui/core";

import FileBrowser from "../../../../../CommonComponents/Files/FileBrowser.js";

import { downloadFile } from "../../../../../actions.js";

import React from "react";
const styles = (theme) => ({
  file: {
    color: "blue",
    "&:hover": {
      textDecoration: "underline"
    }
  }
});

const FILE_BRWOSER = "FILE_BRWOSER";
const FILE_DIALOG = "FILE_DIALOG";
class Download extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: props.file,
      stateOfDialog: FILE_DIALOG,
      openFileDialog: false
    };
  }

  compareObject = (object1, object2) => {
    for (const [prop, value] of Object.entries(object1)) {
      if (typeof value === "object" && value !== null) {
        if (this.compareObject(value, object2[prop]) === true) {
          return true;
        }
      } else {
        if (value !== object2[prop]) {
          return true;
        }
      }
    }
    return false;
  };

  //render des FileDialog
  renderFileDialog = () => {
    if (this.state.stateOfDialog === FILE_BRWOSER) {
      return (
        <FileBrowser
          user={this.props.user}
          returnFileData={(file) => {
            this.setState({
              file: { ...this.state.file, ...file },
              stateOfDialog: FILE_DIALOG
            });
          }}
        />
      );
    }
    if (this.state.stateOfDialog === FILE_DIALOG) {
      return (
        <React.Fragment>
          <ButtonBase
            style={{ width: "100%", padding: 10 }}
            variant="outlined"
            onClick={() => {
              this.setState({
                stateOfDialog: FILE_DIALOG,
                openFileDialog: false
              });
            }}
          >
            <Typography variant="button">Zurück</Typography>
          </ButtonBase>
          <Divider />
          <div style={{ padding: "15px" }}>
            <Collapse in={this.state.file.fileID !== -1}>
              <Button
                variant="outlined"
                target="_blank"
                href={this.state.file.file}
                fullWidth
                style={{ marginBottom: 15, padding: 10 }}
                onClick={() =>
                  downloadFile(this.props.user, this.state.file.fileID)
                }
              >
                Lade Datei Herunter
              </Button>
              <Divider style={{ marginBottom: 15 }} />
            </Collapse>
            <TextField
              style={{ paddingBottom: 15 }}
              fullWidth
              variant="outlined"
              label="Angezeigter Text"
              value={this.state.file.fileDisplayed}
              onChange={(event) => {
                this.setState({
                  file: {
                    ...this.state.file,
                    fileDisplayed: event.target.value
                  }
                });
              }}
            />
            <Button
              style={{ padding: 10, marginBottom: 10 }}
              fullWidth
              variant="outlined"
              value={this.state.file.file}
              onClick={(event) => {
                this.setState({ stateOfDialog: FILE_BRWOSER });
              }}
            >
              {this.state.file.fileID === -1
                ? "Datei Ändern"
                : this.state.file.fileName + " gewählt"}
            </Button>
            <div
              style={{
                display: "-webkit-flex",
                alignItems: "center",
                WebkitAlignItems: "center",
                padding: "0px 15px"
              }}
            >
              <Checkbox
                color="primary"
                checked={this.state.file.fileParagraph}
                onChange={(event) => {
                  this.setState({
                    file: {
                      ...this.state.file,
                      fileParagraph: event.target.checked
                    }
                  });
                }}
              />

              <Typography
                style={{
                  textAlign: "center",
                  width: "100%"
                }}
              >
                Der Download soll als eigener Paragraph dargestellt werden
              </Typography>
            </div>
            <Collapse
              in={
                this.compareObject(this.state.file, this.props.file) &&
                this.state.file.fileID !== -1 &&
                this.state.file.fileDisplayed !== ""
              }
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  this.props.changeContentPiece(this.state.file);
                }}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: 15,
                  marginTop: 7
                }}
              >
                Hinzufügen
              </Button>
            </Collapse>
          </div>
        </React.Fragment>
      );
    }
  };
  //render Methode
  render() {
    return (
      <React.Fragment>
        <Button
          disabled={this.props.onChangeElements}
          fullWidth
          variant="outlined"
          style={{ display: "inline" }}
          onClick={() => {
            this.setState({
              openFileDialog: true
            });
          }}
        >
          Datei:
          <span
            className={
              !this.props.onChangeElements ? this.props.classes.file : null
            }
          >
            {this.props.file.fileDisplayed}
          </span>
        </Button>
        <Dialog
          open={this.state.openFileDialog}
          fullWidth
          maxWidth="md"
          onClose={() => {
            this.setState({
              openFileDialog: false
            });
          }}
          onExited={() => {
            this.setState({
              file: { ...this.props.file },
              stateOfDialog: FILE_DIALOG
            });
          }}
        >
          {this.renderFileDialog()}
        </Dialog>
      </React.Fragment>
    );
  }
}

Download.propTypes = {};

export default withStyles(styles)(Download);
