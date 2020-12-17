import { withStyles } from "@material-ui/core/styles";

import {
  CircularProgress,
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  ButtonBase
} from "@material-ui/core";

import { getRequestwithAu } from "../../../actions.js";

import FolderDisplayer from "../Components/FolderDisplayer.js";
import { createTree, gotoFolder } from "../folderMethods.js";

import React from "react";
const styles = (theme) => ({});

class FilePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: props.files, //TODO auf props umstellen
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
            this.props.returnFileData({});
          }}
        >
          <Typography variant="button">Zurück</Typography>
        </ButtonBase>
        <Divider />
        <div style={{ padding: 10 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                style={{ padding: 10 }}
                onClick={() =>
                  this.props.onEdit(this.state.files, this.state.location)
                }
              >
                Dateien Bearbeiten
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                style={{ padding: 10 }}
                onClick={() =>
                  this.props.onUpload(this.state.files, this.state.location)
                }
              >
                Datei Hochladen
              </Button>
            </Grid>
          </Grid>
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
              this.props.returnFileData(file);
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}

FilePicker.propTypes = {};

export default withStyles(styles)(FilePicker);
