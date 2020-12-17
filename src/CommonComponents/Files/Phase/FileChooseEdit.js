import { withStyles } from "@material-ui/core/styles";

import {
  CircularProgress,
  Paper,
  Typography,
  Divider,
  ButtonBase
} from "@material-ui/core";

import { getRequestwithAu } from "../../../actions.js";

import FolderDisplayer from "../Components/FolderDisplayer.js";
import { createTree, gotoFolder } from "../folderMethods.js";

import React from "react";
const styles = (theme) => ({});

class FileChooseEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: props.files,
      pointer: gotoFolder(props.location, props.files),
      location: props.location
    };
  }

  //Ließ die Pfade der Dateien aus und erstellt ein Object das der ordner Strucktur enspricht
  createTree = (files) => {
    const fileTree = {};

    const createFolders = (path, file, obj) => {
      if (path.length !== 0) {
        if (obj[path[0]] === undefined) {
          obj[path[0]] = {};
        }
        var tmp = obj[path[0]];
        path.shift();
        createFolders(path, file, tmp);
      } else {
        obj[file.fileID] = file;
      }
    };
    fileTree.Dateien = {};
    for (var file of files) {
      var path = file.filePath.split("/");
      if (path[0] === "") {
        path.shift();
      }
      if (path[path.length - 1] === "") {
        path.pop();
      }
      createFolders(path, file, fileTree.Dateien);
    }
    return fileTree;
  };

  //Läd die Information der Dateien aus
  loadFiles = () => {
    const callback = (response) => {
      if (response.data.success) {
        const files = createTree(response.data.files);
        this.setState({
          files: files,
          pointer: gotoFolder(this.state.location, files)
        });
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };
    getRequestwithAu(
      "https://www.buergerverein-rheindoerfer.de/phpTest/Files/getFiles.php",
      this.props.user,
      callback
    );
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <CircularProgress />
      </div>
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

    //wenn Bilder noch nicht geladen wurden
    if (this.state.files === null) {
      return this.loadFiles();
    }

    return (
      <React.Fragment>
        <ButtonBase
          style={{ width: "100%", padding: 10 }}
          variant="outlined"
          onClick={() => {
            this.props.onBack(this.state.files, this.state.location);
          }}
        >
          <Typography variant="button">Zurück</Typography>
        </ButtonBase>
        <Divider />
        <div style={{ padding: 10 }}>
          <Typography align="center" variant="h6">
            Datei zum Bearbeiten auswählen
          </Typography>
          <Divider style={{ margin: "10px 0px" }} />
          <FolderDisplayer
            user={this.props.user}
            content={this.state.pointer}
            path={this.state.location}
            changeDirBack={(pathLength) => {
              var newPath = this.state.location.filter((value, index) => {
                return pathLength >= index;
              });
              this.setState({
                pointer: gotoFolder(newPath, this.state.files),
                location: newPath
              });
            }}
            onFolderPick={(folder, name) => {
              this.setState({
                pointer: folder,
                location: [...this.state.location, name]
              });
            }}
            onFilePick={(file) => {
              this.props.onEdit(file, this.state.location);
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}

FileChooseEdit.propTypes = {};

export default withStyles(styles)(FileChooseEdit);
