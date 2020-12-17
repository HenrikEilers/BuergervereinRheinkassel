import { withStyles } from "@material-ui/core/styles";

import {
  Typography,
  Divider,
  Grid,
  Button,
  Collapse,
  TextField
} from "@material-ui/core";

import FolderDisplayer from "./FolderDisplayer.js";

import React from "react";
const styles = (theme) => ({});

class FileMover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      createFolderOpen: false
    };
  }

  render() {
    return (
      <React.Fragment>
        <Typography align="center" variant="h6">
          {this.props.description}
        </Typography>
        <Grid container spacing={1}>
          <Grid item sm={6} xs={12}>
            <Button
              fullWidth
              variant="outlined"
              onClick={this.props.onEnterFolder}
            >
              {this.props.enterText}
            </Button>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                this.setState({
                  createFolderOpen: !this.state.createFolderOpen
                });
              }}
            >
              Neuen Ordner Erstellen
            </Button>
          </Grid>
        </Grid>
        <Collapse in={this.state.createFolderOpen}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            style={{ marginTop: 10 }}
          >
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Ordner Name"
                value={this.props.newFolderName}
                onChange={(event) => {
                  this.setState({ name: event.target.value });
                }}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Button
                fullWidth
                variant="outlined"
                style={{ padding: 10 }}
                disabled={this.state.name === ""}
                onClick={() => {
                  this.props.onAddFolder(this.state.name);
                  this.setState({ name: "" });
                }}
              >
                Ordner Hinzufügen
              </Button>
            </Grid>
          </Grid>
        </Collapse>
        <Divider style={{ margin: "10px 0px" }} />
        <FolderDisplayer
          user={this.props.user}
          content={this.props.pointer}
          path={this.props.path}
          changeDirBack={this.props.changeDirBack}
          onFolderPick={this.props.onFolderPick}
          onFilePick={this.props.onFilePick}
        />
      </React.Fragment>
    );
  }
}

FileMover.propTypes = {};

export default withStyles(styles)(FileMover);
