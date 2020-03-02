import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  Typography,
  List,
  Divider,
  ListItemIcon,
  ListItem,
  CircularProgress,
  ListItemText,
  Paper,
  TextField,
  ButtonBase,
  Button,
  Collapse
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import { withRouter } from "react-router-dom";

import { postRequest } from "../../../actions.js";

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

const styles = theme => ({});

/**Beschreibung:
 * Es soll eine Gruppe Gelöscht werden
 */

class PictureGroupDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false
    };
  }

  deleteGroup = () => {
    const callback = response => {
      if (response.data.success) {
        this.setState({ deleted: true });
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };

    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/PictureGroup/deleteGroup.php",
      this.props.user,
      { GroupID: this.props.choosenGroup.GroupID },
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
            onClick={this.deleteGroup}
            style={{
              padding: 100,
              color: "white",
              backgroundColor: "red",
              marginBottom: 10
            }}
          >
            "{this.props.choosenGroup.name}" Löschen
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
              "{this.props.choosenGroup.name}" Gelöscht
            </Typography>
          </Paper>
        </Collapse>
        <Button
          onClick={() => {
            this.props.changePhase(
              this.state.deleted ? GROUP_EDIT : CHANGE_GROUP
            );
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

PictureGroupDelete.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureGroupDelete)));
