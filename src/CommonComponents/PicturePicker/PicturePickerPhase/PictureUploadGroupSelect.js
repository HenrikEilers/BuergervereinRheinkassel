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
  Checkbox,
  ButtonBase
} from "@material-ui/core";

import { withRouter } from "react-router-dom";

import { getRequestwithAu } from "../../../actions.js";

import React from "react";
import { UPLOAD_PICTURE } from "../constants.js";

const styles = (theme) => ({});

/**Beschreibung:
 * Es sollen Gruppen ausgewählt werden
 */

class PictureUploadGroupSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choosenGroups: props.uploadGroups,
      groups: null,
      allGroups: false,
      groupSearch: ""
    };
  }

  onCheck = (group) => {
    var choosenGroupsTMP = this.state.choosenGroups;
    if (this.state.choosenGroups.includes(group.GroupID)) {
      choosenGroupsTMP = choosenGroupsTMP.filter((value) => {
        return value !== group.GroupID;
      });
    } else {
      choosenGroupsTMP.push(group.GroupID);
    }
    this.setState({
      choosenGroups: choosenGroupsTMP,
      allGroups:
        this.state.groups.length === choosenGroupsTMP.length ? true : false
    });
  };

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
        <ButtonBase
          style={{ width: "100%", padding: 10 }}
          variant="outlined"
          onClick={() => {
            this.props.setUploadGroups(this.state.choosenGroups);
            this.props.changePhase(UPLOAD_PICTURE);
          }}
        >
          <Typography variant="button">Zurück zu Upload</Typography>
        </ButtonBase>
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
              this.setState({
                choosenGroups: this.state.allGroups
                  ? []
                  : this.state.groups.map((group) => {
                      return group.GroupID;
                    }),
                allGroups: !this.state.allGroups
              });
            }}
          >
            <ListItemText
              primary={
                this.state.allGroups ? "Alle Abwählen" : "Alle Auswählen"
              }
            />
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
                  role={undefined}
                  dense
                  button
                  onClick={() => this.onCheck(group)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={this.state.choosenGroups.includes(group.GroupID)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText id={index} primary={group.name} />
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

PictureUploadGroupSelect.propTypes = {};

export default withTheme(
  withStyles(styles)(withRouter(PictureUploadGroupSelect))
);
