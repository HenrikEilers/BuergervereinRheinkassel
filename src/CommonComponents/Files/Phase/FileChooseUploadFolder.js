import { withStyles } from "@material-ui/core/styles";

import {
  CircularProgress,
  Paper,
  Typography,
  Divider,
  ButtonBase
} from "@material-ui/core";

import { getRequestwithAu } from "../../../actions.js";

import FileMover from "../Components/FileMover.js";
import { createTree, gotoFolder } from "../folderMethods.js";

import React from "react";
const styles = (theme) => ({});

class FileChooseUploadFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: props.files,
      pointer: gotoFolder(props.location, props.files),
      location: props.location
    };
  }

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

  changeDirBack = (pathLength) => {
    var newPath = this.state.location.filter((value, index) => {
      return pathLength >= index;
    });

    this.setState({
      pointer: gotoFolder(newPath, this.state.files),
      location: newPath
    });
  };

  onFolderPick = (folder, name) => {
    this.setState({
      pointer: folder,
      location: [...this.state.location, name]
    });
  };

  onEnterFolder = () => {
    this.props.onChoose(this.state.location.join("/"), this.state.files);
  };

  onAddFolder = (name) => {
    const treeTMP = this.state.pointer;
    treeTMP[name] = {};
    this.setState({ pointer: treeTMP });
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
            this.props.onBack();
          }}
        >
          <Typography variant="button">Zurück</Typography>
        </ButtonBase>
        <Divider />
        <div
          style={{
            padding: 10,
            paddingBottom:
              Object.keys(this.state.pointer).length === 0 ? 75 : 10
          }}
        >
          <FileMover
            pointer={this.state.pointer}
            path={this.state.location}
            enterText="Ordner Wählen"
            changeDirBack={this.changeDirBack}
            onFolderPick={this.onFolderPick}
            onFilePick={(file) => {}}
            onEnterFolder={this.onEnterFolder}
            onAddFolder={this.onAddFolder}
          />
        </div>
      </React.Fragment>
    );
  }
}

FileChooseUploadFolder.propTypes = {};

export default withStyles(styles)(FileChooseUploadFolder);
