import { withStyles } from "@material-ui/core/styles";

import {
  Button,
  Divider,
  TextField,
  Paper,
  ButtonBase,
  CircularProgress,
  Typography,
  Collapse,
  FormControl,
  Select,
  MenuItem,
  FormHelperText
} from "@material-ui/core";

import { postRequest, downloadFile } from "../../../actions.js";
import {
  NORMAL_USER,
  MEMBER_USER,
  BEIRAT_USER,
  VORSITZ_USER
} from "../constants.js";

import React from "react";
const styles = (theme) => ({});

class FileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: props.file,
      compareFile: props.compareFile,
      loaded: true,
      error: false,
      errorText: ""
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

  loadFile = () => {
    const callback = (response) => {
      if (response.data.success) {
        this.setState({
          file: response.data.file,
          compareFile: { ...response.data.file }
        });
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/Files/getFileInfo.php",
      this.props.user,
      { fileID: this.props.FileID },
      callback
    );
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <CircularProgress />
      </div>
    );
  };

  onSave = () => {
    const callback = (response) => {
      if (response.data.success) {
        this.setState({
          file: null,
          compareFile: null
        });
        this.props.onEdit();
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/Files/editFile.php",
      this.props.user,
      { file: this.state.file },
      callback
    );
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

    //wenn Datei Info noch nicht geladen wurden
    if (this.state.file === null) {
      return this.loadFile();
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
        <div style={{ padding: 10, paddingBottom: 0 }}>
          <Button
            variant="outlined"
            fullWidth
            style={{ padding: 10 }}
            onClick={() => downloadFile(this.props.user, this.props.FileID)}
          >
            Datei Herunterladen
          </Button>
          <Divider style={{ marginTop: 10 }} />
        </div>
        <Collapse
          in={this.compareObject(this.state.file, this.state.compareFile)}
        >
          <ButtonBase onClick={this.onSave} style={{ width: "100%" }}>
            <Paper
              square
              style={{
                padding: 10,
                width: "100%",
                color: "white",
                backgroundColor: "green"
              }}
            >
              <Typography variant="button">Änderungen Speichern</Typography>
            </Paper>
          </ButtonBase>
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
            <Select
              fullWidth
              label="Rang"
              style={{ width: "100%" }}
              value={this.state.file.fileRank}
              onChange={(event) => {
                this.setState({
                  file: {
                    ...this.state.file,
                    fileRank: event.target.value
                  }
                });
              }}
              inputProps={{
                name: "rank",
                id: "rank-id"
              }}
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
            onClick={() =>
              this.props.onFolderChange(this.state.file, this.state.compareFile)
            }
          >
            {this.state.file.filePath === ""
              ? "Ordner Auswählen"
              : "Ordner: '" + this.state.file.filePath + "' Ausgewählt"}
          </Button>
          <Divider style={{ margin: "10px 0px" }} />
          <Button
            variant="outlined"
            fullWidth
            style={{ padding: 10 }}
            onClick={() =>
              this.props.onDelete(this.state.file, this.state.compareFile)
            }
          >
            Datei Löschen
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

FileEdit.propTypes = {};

export default withStyles(styles)(FileEdit);
