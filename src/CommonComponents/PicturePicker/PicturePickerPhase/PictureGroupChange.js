import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  Dialog,
  Typography,
  Grid,
  Button,
  TextField,
  Divider,
  Collapse,
  ButtonBase,
  CircularProgress,
  InputAdornment,
  Card,
  LinearProgress,
  Paper
} from "@material-ui/core";

import Search from "@material-ui/icons/Search";

import PictureSelect from "./../Components/PictureSelect.js";

import { withRouter } from "react-router-dom";

import { getRequestwithAu, postRequest } from "../../../actions.js";

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

/**Der PicturePicker soll eine Common Component werden,
 * die Standartmäßig für das auswählen der bilder benutzt werden
 * - Es soll ein Bild ausgewählt werden können das dann mit allen infos zurück geliefert wird
 * - Uplaods sollen auch möglich sein.(Diese Funktion kann mann aber über die Props ausschalten)
 * - Die Bilder sollten in Gruppen oder ander Eigenschaften zuorden sein
 */

class PictureGroupChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: null,
      groupName: props.choosenGroup.name,
      groupMember: [...props.choosenGroup.gruppenmitglieder]
    };
  }

  loadPictures = () => {
    getRequestwithAu(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/getPictures.php",
      this.props.user,

      response => {
        console.log(response);
        if (response.data.success) {
          this.setState({
            pictures: response.data.pictures
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

  hasToSave = () => {
    if (this.state.groupName !== this.props.choosenGroup.name) {
      return true;
    }
    if (
      this.state.groupMember.length !==
      this.props.choosenGroup.gruppenmitglieder.length
    ) {
      return true;
    }
    return !this.state.groupMember.every((value, index) => {
      return this.props.choosenGroup.gruppenmitglieder.includes(value);
    });
  };

  sendGroup = () => {
    var groupTMP = this.props.choosenGroup;
    groupTMP.gruppenmitglieder = this.state.groupMember;
    groupTMP.name = this.state.groupName;
    const callback = response => {
      if (response.data.success) {
        this.props.returnGroup(groupTMP);
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/PictureGroup/editGroup.php",
      this.props.user,
      { group: groupTMP },
      callback
    );
  };

  render() {
    //wenn ein schwerwiegender Fehler auftritt
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
    if (this.state.pictures === null) {
      return this.loadPictures();
    }
    return (
      <React.Fragment>
        <ButtonBase
          style={{ width: "100%", padding: 10 }}
          variant="outlined"
          onClick={() => {
            this.props.changePhase(GROUP_EDIT);
          }}
        >
          <Typography variant="button">Zurück</Typography>
        </ButtonBase>
        <Divider />
        <Collapse in={this.hasToSave()}>
          <ButtonBase onClick={this.sendGroup} style={{ width: "100%" }}>
            <Paper
              square
              style={{
                padding: 10,
                width: "100%",
                color: "white",
                backgroundColor: "green"
              }}
            >
              <Typography variant="button">Gruppe Speichern</Typography>
            </Paper>
          </ButtonBase>
        </Collapse>
        <div style={{ padding: "0px 10px", marginTop: "10px" }}>
          <TextField
            //size="small"
            label="Gruppen Namen"
            variant="outlined"
            fullWidth
            value={this.state.groupName}
            onChange={event => {
              this.setState({ groupName: event.target.value });
            }}
          />
        </div>
        <div style={{ padding: "10px", paddingBottom: 0 }}>
          <Button
            onClick={() => {
              this.props.changePhase(DELETE_GROUP);
            }}
            fullWidth
            variant="outlined"
            style={{ padding: 10, color: "white", backgroundColor: "red" }}
          >
            Gruppe Löschen
          </Button>
        </div>
        <PictureSelect
          pictures={this.state.pictures}
          groupMember={this.state.groupMember}
          pictureClick={this.changeGroup}
          setGroupMember={groupMember => this.setState({ groupMember })}
        />
      </React.Fragment>
    );
  }
}

PictureGroupChange.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureGroupChange)));
