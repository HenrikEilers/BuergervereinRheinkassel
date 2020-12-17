import { withStyles } from "@material-ui/core/styles";

import {
  Button,
  Divider,
  TextField,
  Paper,
  ButtonBase,
  Typography,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  LinearProgress
} from "@material-ui/core";

import { postUploadFile } from "../../../actions.js";
import {
  NORMAL_USER,
  MEMBER_USER,
  BEIRAT_USER,
  VORSITZ_USER
} from "../constants.js";

import React from "react";
const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
});

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: { ...this.props.file },
      error: false,
      errorText: "",
      uploadError: false,
      uploadErrorText: "",
      progress: -1
    };
  }

  onUpload = () => {
    const callback = (response) => {
      if (response.data.success === true) {
        this.setState({
          progress: -1
        });
        this.props.onUpload(response.data.file);
      } else {
        this.setState({
          uploadError: true,
          uploadErrorText: response.data.errortext,
          progress: -1
        });
      }
    };
    const progress = (progress) => {
      this.setState({ progress });
    };
    postUploadFile(this.props.user, this.state.file, callback, progress);
    this.setState({ uploadError: false, uploadErrorText: "" });
  };

  readyToUpload = () => {
    if (this.state.file.fileName === "") {
      return false;
    }
    if (this.state.file.fileRank === "") {
      return false;
    }
    if (this.state.file.filePath === "") {
      return false;
    }
    return true;
  };

  onChooseFile = (event) => {
    this.setState({
      file: {
        ...this.state.file,
        file: event.target.files[0],
        fileName:
          this.state.file.fileName === ""
            ? event.target.files[0].name
            : this.state.file.fileName
      }
    });
  };

  render() {
    //wenn Ein schwerwiegender Fehler auftritt
    if (this.state.error) {
      return (
        <Paper
          style={{ padding: 10, backgroundColor: "red", textAlign: "center" }}
        >
          <Typography style={{ color: "white" }}>
            {this.state.errorText}
          </Typography>
        </Paper>
      );
    }

    return (
      <React.Fragment>
        <ButtonBase
          style={{ width: "100%", padding: 10 }}
          variant="outlined"
          onClick={this.props.onBack}
        >
          <Typography variant="button">Zurück</Typography>
        </ButtonBase>
        <Divider />
        <div style={{ padding: 10 }}>
          <Button
            variant="outlined"
            fullWidth
            style={{ padding: 10 }}
            onClick={() => {
              var x = document.getElementById("file");
              x.click();
            }}
          >
            {this.state.file.file === null
              ? "Datei Auswählen"
              : this.state.file.file.name}
          </Button>
          <input
            type="file"
            name="file"
            id="file"
            style={{ display: "none" }}
            onChange={this.onChooseFile}
          />
          {this.state.progress === -1 ? (
            <Divider style={{ margin: 10 }} />
          ) : (
            <React.Fragment>
              <LinearProgress
                style={{ margin: 10 }}
                variant="determinate"
                value={this.state.progress}
              />
            </React.Fragment>
          )}
        </div>
        <Collapse in={this.readyToUpload()}>
          <ButtonBase onClick={this.onUpload} style={{ width: "100%" }}>
            <Paper
              square
              style={{
                padding: 10,
                width: "100%",
                color: "white",
                backgroundColor: "green"
              }}
            >
              <Typography variant="button">Datei Hochladen</Typography>
            </Paper>
          </ButtonBase>
        </Collapse>
        <Collapse in={this.state.uploadError}>
          <Paper
            style={{ padding: 10, backgroundColor: "red", textAlign: "center" }}
          >
            <Typography style={{ color: "white" }}>
              {this.state.uploadErrorText}
            </Typography>
          </Paper>
        </Collapse>
        <div style={{ padding: 10 }}>
          <TextField
            variant="outlined"
            fullWidth
            style={{ marginBottom: 10 }}
            label="Datei Name"
            value={this.state.file.fileName}
            onChange={(event) => {
              this.setState({
                file: { ...this.state.file, fileName: event.target.value }
              });
            }}
          />
          <FormControl
            fullWidth
            style={{ marginBottom: 10, border: "solid 0px red" }}
          >
            <InputLabel id="simple-select-label">Rang</InputLabel>
            <Select
              labelId="simple-select-label"
              id="simple-select"
              value={this.state.file.fileRank}
              onChange={(event) =>
                this.setState({
                  file: { ...this.state.file, fileRank: event.target.value }
                })
              }
            >
              <MenuItem value={NORMAL_USER}>Alle</MenuItem>
              <MenuItem value={MEMBER_USER}>Mitglieder</MenuItem>
              <MenuItem value={BEIRAT_USER}>Beirat</MenuItem>
              <MenuItem value={VORSITZ_USER}>Vorsitzender/Admin</MenuItem>
            </Select>
            <FormHelperText>
              Mitglieder welchen Ranges sollen Zugriff haben
            </FormHelperText>
          </FormControl>

          <Button
            variant="outlined"
            fullWidth
            style={{ padding: 10 }}
            onClick={() => this.props.onFolderChange(this.state.file)}
          >
            {this.state.file.filePath === ""
              ? "Ordner Auswählen"
              : "Ordner: '" + this.state.file.filePath + "' Ausgewählt"}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

FileUpload.propTypes = {};

export default withStyles(styles)(FileUpload);
