import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  Typography,
  TextField,
  Divider,
  Collapse,
  ButtonBase,
  CircularProgress,
  Paper
} from "@material-ui/core";

import PictureSelect from "./../Components/PictureSelect.js";

import { withRouter } from "react-router-dom";

import { getRequestwithAu, postRequest } from "../../../actions.js";

import React from "react";
import { GROUP_EDIT, CHANGE_GROUP } from "../constants.js";

const styles = (theme) => ({});

/**Der PicturePicker soll eine Common Component werden,
 * die Standartmäßig für das auswählen der bilder benutzt werden
 * - Es soll ein Bild ausgewählt werden können das dann mit allen infos zurück geliefert wird
 * - Uplaods sollen auch möglich sein.(Diese Funktion kann mann aber über die Props ausschalten)
 * - Die Bilder sollten in Gruppen oder ander Eigenschaften zuorden sein
 */

class PictureGroupCreation extends React.Component {
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

      (response) => {
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
    if (this.state.groupName === "") {
      return false;
    }
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
    const callback = (response) => {
      if (response.data.success) {
        this.props.returnGroup(groupTMP);
        this.props.changePhase(CHANGE_GROUP);
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/PictureGroup/addGroup.php",
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
              <Typography variant="button">Neue Gruppe Erstellen</Typography>
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
            onChange={(event) => {
              this.setState({ groupName: event.target.value });
            }}
          />
        </div>
        <PictureSelect
          markingColor="green"
          pictures={this.state.pictures}
          groupMember={this.state.groupMember}
          setGroupMember={(groupMember) => this.setState({ groupMember })}
        />
      </React.Fragment>
    );
  }
}

PictureGroupCreation.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureGroupCreation)));
