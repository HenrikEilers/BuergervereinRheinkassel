import { withStyles } from "@material-ui/core/styles";

import { Paper, Typography, Collapse, Button } from "@material-ui/core";

import { postRequest } from "../../../actions.js";

import React from "react";
const styles = (theme) => ({});

class FileDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false
    };
  }

  onDelete = () => {
    const callback = (response) => {
      if (response.data.success) {
        this.setState({ deleted: true });
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };

    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/Files/deleteFile.php",
      this.props.user,
      { fileID: this.props.FileID },
      callback
    );
  };

  render() {
    //wenn schwerwiegender Fehler auftritt
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
      <div style={{ padding: 10 }}>
        <Collapse in={!this.state.deleted}>
          <Button
            fullWidth
            variant="outlined"
            onClick={this.onDelete}
            style={{
              padding: 100,
              color: "white",
              backgroundColor: "red",
              marginBottom: 10
            }}
          >
            Datei Löschen
          </Button>
        </Collapse>
        <Collapse in={this.state.deleted}>
          <Paper
            style={{
              textAlign: "center",
              width: "100%",
              backgroundColor: "green",
              padding: "100px 0px",
              marginBottom: 10
            }}
          >
            <Typography variant="button" style={{ color: "white" }}>
              Datei Gelöscht
            </Typography>
          </Paper>
        </Collapse>
        <Button
          onClick={() => {
            this.state.deleted
              ? this.props.onDeleteBack()
              : this.props.onAbort();
          }}
          fullWidth
          variant="outlined"
          style={{ padding: 50 }}
        >
          {this.state.deleted ? "Zurück" : "Abbrechen"}
        </Button>
      </div>
    );
  }
}

FileDelete.propTypes = {};

export default withStyles(styles)(FileDelete);
