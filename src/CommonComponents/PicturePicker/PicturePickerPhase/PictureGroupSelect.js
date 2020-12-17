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
  TextField
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import { withRouter } from "react-router-dom";

import { getRequestwithAu } from "../../../actions.js";

import React from "react";
import { PICTURE_PICK, GROUP_DATE_SELECT, GROUP_EDIT } from "../constants.js";

const styles = (theme) => ({});

/**Beschreibung:
 * Es sollen Gruppen ausgewählt werden
 */

class PictureGroupSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: null,
      groupSearch: "",
      error: false,
      errorText: ""
    };
  }

  loadGroups = () => {
    getRequestwithAu(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/PictureGroup/getGroups.php",
      this.props.user,

      (response) => {
        if (response.data.success) {
          this.setState({
            groups: response.data.pictureGroups
          });
        } else {
          this.setState({
            error: true,
            errorText: response.data.errortext
          });
        }
      }
    );
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <CircularProgress />
      </div>
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

    //TODO return und changePhase verbinden bzw. testen
    //wenn Bilder noch nicht geladen wurden
    if (this.state.groups === null) {
      return this.loadGroups();
    }

    return (
      <React.Fragment>
        <List className={this.props.classes.root} component="nav">
          <ListItem
            button
            onClick={() => {
              this.props.changePhase(GROUP_EDIT);
            }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Ordner Bearbeiten" />
          </ListItem>
        </List>
        <Divider />
        <div style={{ padding: 10 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Suche"
            onChange={(event) =>
              this.setState({ groupSearch: event.target.value })
            }
          />
        </div>
        <Divider />
        <List component="nav">
          <ListItem
            selected={this.props.choosenGroup === null}
            button
            onClick={() => {
              this.props.returnGroup(null);
              this.props.changePhase(PICTURE_PICK);
            }}
          >
            <ListItemText primary="Alle" />
          </ListItem>
          <ListItem
            selected={
              this.props.choosenGroup !== null &&
              this.props.choosenGroup.dateGroup
            }
            button
            onClick={() => {
              this.props.changePhase(GROUP_DATE_SELECT);
            }}
          >
            <ListItemText primary="Datums Gruppen" />
          </ListItem>
          {this.state.groups.map((group, index) => {
            if (
              group.name
                .toUpperCase()
                .includes(this.state.groupSearch.toUpperCase())
            ) {
              return (
                <ListItem
                  key={index}
                  selected={
                    this.props.choosenGroup !== null &&
                    this.props.choosenGroup.GroupID === group.GroupID
                  }
                  button
                  onClick={() => {
                    this.props.returnGroup(group);
                    this.props.changePhase(PICTURE_PICK);
                  }}
                >
                  <ListItemText primary={group.name} />
                </ListItem>
              );
            } else {
              return null;
            }
          })}
        </List>
      </React.Fragment>
    );
  }
}

PictureGroupSelect.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureGroupSelect)));
