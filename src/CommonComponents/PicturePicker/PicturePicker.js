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
  LinearProgress
} from "@material-ui/core";

import Search from "@material-ui/icons/Search";

import PublishIcon from "@material-ui/icons/Publish";

import { withRouter } from "react-router-dom";

//import { postRequest, getRequest, postUploadPicture } from "../../actions.js";

import PicturePick from "./PicturePickerPhase/PicturePick.js";
import PictureGroupSelect from "./PicturePickerPhase/PictureGroupSelect.js";
import PictureGroupCreation from "./PicturePickerPhase/PictureGroupCreation.js";
import PictureGroupChange from "./PicturePickerPhase/PictureGroupChange.js";
import PictureUpload from "./PicturePickerPhase/PictureUpload.js";
import PictureGroupOnEdit from "./PicturePickerPhase/PictureGroupOnEdit.js";
import PictureGroupDate from "./PicturePickerPhase/PictureGroupDate.js";
import PictureGroupDelete from "./PicturePickerPhase/PictureGroupDelete.js";

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
} from "./constants.js";

const styles = theme => ({});

/**Der PicturePicker soll eine Common Component werden,
 * die Standartmäßig für das auswählen der bilder benutzt werden
 * - Es soll ein Bild ausgewählt werden können das dann mit allen infos zurück geliefert wird
 * - Uplaods sollen auch möglich sein.(Diese Funktion kann mann aber über die Props ausschalten)
 * - Die Bilder sollten in Gruppen oder ander Eigenschaften zuorden sein
 */

class PicturePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateOfComponent:
        this.props.stateOfComponent === undefined
          ? PICTURE_PICK
          : this.props.stateOfComponent,
      choosenGroup: null,
      uploadPicture: {
        uploadName: "",
        uploadType: "",
        uploadFile: null,
        uploadImageSrc: "",
        uploadWidth: -1,
        uploadHeight: -1,
        pictureDate: new Date()
      }
    };
  }

  changePhase = newPhase => {
    this.setState({ stateOfComponent: newPhase });
  };

  render() {
    switch (this.state.stateOfComponent) {
      case PICTURE_PICK:
        return (
          <React.Fragment>
            <PicturePick
              changePhase={this.changePhase}
              disableUpload={this.props.disableUpload}
              user={this.props.user}
              returnPicture={this.props.getPicture}
              choosenGroup={this.state.choosenGroup}
            />
          </React.Fragment>
        );
      case GROUP_SELECT:
        return (
          <React.Fragment>
            <PictureGroupSelect
              user={this.props.user}
              choosenGroup={this.state.choosenGroup}
              returnGroup={group => this.setState({ choosenGroup: group })}
              changePhase={this.changePhase}
            />
          </React.Fragment>
        );
      case GROUP_DATE_SELECT:
        return (
          <React.Fragment>
            <PictureGroupDate
              user={this.props.user}
              choosenGroup={this.state.choosenGroup}
              returnGroup={group =>
                this.setState({
                  choosenGroup: group
                })
              }
              changePhase={this.changePhase}
            />
          </React.Fragment>
        );

      case GROUP_EDIT:
        return (
          <React.Fragment>
            <PictureGroupOnEdit
              user={this.props.user}
              returnGroup={group => this.setState({ choosenGroup: group })}
              changePhase={this.changePhase}
            />
          </React.Fragment>
        );
      case NEW_GROUP:
        return (
          <React.Fragment>
            <PictureGroupCreation
              user={this.props.user}
              choosenGroup={this.state.choosenGroup}
              returnGroup={group => this.setState({ chooseGroup: group })}
              changePhase={this.changePhase}
            />
          </React.Fragment>
        );
      case CHANGE_GROUP:
        return (
          <React.Fragment>
            <PictureGroupChange
              user={this.props.user}
              choosenGroup={this.state.choosenGroup}
              returnGroup={group => this.setState({ chooseGroup: group })}
              changePhase={this.changePhase}
            />
          </React.Fragment>
        );
      case DELETE_GROUP:
        return (
          <React.Fragment>
            <PictureGroupDelete
              user={this.props.user}
              choosenGroup={this.state.choosenGroup}
              returnGroup={group => this.setState({ chooseGroup: group })}
              changePhase={this.changePhase}
            />
          </React.Fragment>
        );
      case UPLOAD_PICTURE:
        return (
          <React.Fragment>
            <PictureUpload
              picture={this.state.uploadPicture}
              setPicture={picture => {
                this.setState({ uploadPicture: picture });
              }}
              user={this.props.user}
              changePhase={this.changePhase}
            />
          </React.Fragment>
        );
      default:
        break;
    }
    return <div>sidfsdfkbuids</div>;
  }
}

PicturePicker.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PicturePicker)));
