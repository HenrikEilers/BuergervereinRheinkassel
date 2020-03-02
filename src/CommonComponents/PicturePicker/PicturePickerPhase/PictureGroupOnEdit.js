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
  ButtonBase
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import { withRouter } from "react-router-dom";

import { getRequestwithAu } from "../../../actions.js";

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
 * Es sollen Gruppen ausgewählt werden
 */

class PictureGroupOnEdit extends React.Component {
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

      response => {
        console.log(response);
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

    //wenn Bilder noch nicht geladen wurden
    if (this.state.groups === null) {
      return this.loadGroups();
    }

    return (
      <React.Fragment>
        <ButtonBase
          style={{ width: "100%", padding: 10 }}
          variant="outlined"
          onClick={() => {
            this.props.changePhase(GROUP_SELECT);
          }}
        >
          <Typography variant="button">Zurück</Typography>
        </ButtonBase>
        <Divider />
        <List className={this.props.classes.root} component="nav">
          <ListItem
            button
            onClick={() => {
              this.props.returnGroup({
                gruppenmitglieder: [],
                name: "",
                GroupID: -1,
                kind: 1
              });
              this.props.changePhase(NEW_GROUP);
            }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Neuer Ordner" />
          </ListItem>
        </List>
        <Divider />
        <div style={{ padding: 10 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Suche"
            onChange={event =>
              this.setState({ groupSearch: event.target.value })
            }
          />
        </div>
        <Divider />
        <List component="nav">
          {this.state.groups.map((group, index) => {
            if (
              group.name
                .toUpperCase()
                .includes(this.state.groupSearch.toUpperCase())
            ) {
              return (
                <ListItem
                  key={index}
                  button
                  onClick={() => {
                    this.props.returnGroup(group);
                    this.props.changePhase(CHANGE_GROUP);
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

PictureGroupOnEdit.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureGroupOnEdit)));
