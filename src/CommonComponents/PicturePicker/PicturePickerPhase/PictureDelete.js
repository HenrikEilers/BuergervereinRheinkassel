import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  Typography,
  CircularProgress,
  Paper,
  ButtonBase,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Collapse
} from "@material-ui/core";

import PictureSelect from "./../Components/PictureSelect.js";

import { withRouter } from "react-router-dom";

import { getRequestwithAu, postRequest } from "../../../actions.js";

import React from "react";
import { PICTURE_PICK } from "../constants.js";

const styles = (theme) => ({});

/**Der PicturePicker soll eine Common Component werden,
 * die Standartmäßig für das auswählen der bilder benutzt werden
 * - Es soll ein Bild ausgewählt werden können das dann mit allen infos zurück geliefert wird
 * - Uplaods sollen auch möglich sein.(Diese Funktion kann mann aber über die Props ausschalten)
 * - Die Bilder sollten in Gruppen oder ander Eigenschaften zuorden sein
 */

class PictureDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: null,
      choosenToDelete: [],
      confirmDelete: false,
      deleteError: null,
      deleteSuccess: null
    };
  }

  loadPictures = () => {
    getRequestwithAu(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/getPictures.php",
      this.props.user,

      (response) => {
        if (response.data.success) {
          this.setState({
            pictures: response.data.pictures,
            choosenToDelete: this.state.choosenToDelete.filter((value) => {
              return (
                -1 !==
                response.data.pictures.findIndex(
                  (searchValue) => value === searchValue.pictureID
                )
              );
            })
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
  deletePictures = () => {
    const callback = (response) => {
      if (response.data.success) {
        this.setState({
          deleteError: response.data.deleteError,
          deleteSuccess: response.data.deleteSuccess
        });
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/deletePictures.php",
      this.props.user,
      { choosenToDelete: this.state.choosenToDelete },
      callback
    );
  };

  renderDeleteResult = () => {
    return (
      <React.Fragment>
        {this.state.deleteSuccess.length !== 0 ? (
          <Typography style={{ color: "green" }} variant="h5">
            Bestätigungen:
          </Typography>
        ) : null}
        <List>
          {this.state.deleteSuccess.map((value, index) => {
            return (
              <ListItem style={{ color: "green" }}>
                <ListItemText
                  primary={
                    <div dangerouslySetInnerHTML={{ __html: value }}></div>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        {this.state.deleteError.length !== 0 ? (
          <Typography style={{ color: "red" }} variant="h5">
            Fehler:
          </Typography>
        ) : null}
        <List>
          {this.state.deleteError.map((value, index) => {
            if (value !== null) {
              return (
                <ListItem style={{ color: "red" }}>
                  <ListItemText
                    primary={
                      <div dangerouslySetInnerHTML={{ __html: value }}></div>
                    }
                  />
                </ListItem>
              );
            } else {
              if (index !== this.state.deleteError.length - 1) {
                return <Divider />;
              } else {
                return null;
              }
            }
          })}
        </List>
      </React.Fragment>
    );
  };

  renderDeleteInfo = () => {
    return (
      <React.Fragment>
        <Paper
          style={{
            padding: 10,
            marginBottom: 15,
            border: "solid red 2px",
            textAlign: "center"
          }}
        >
          <Typography>
            Bilder, die in Seiten vorkommen oder Titelbilder sind, können nicht
            gelöscht werden.
          </Typography>
        </Paper>
        <Typography>Die zu löschende Bilder:</Typography>
        <div style={{ paddingLeft: 10, margin: "10px 0px" }}>
          {this.state.pictures
            .filter((value) => {
              console.log(value);
              //Bilder die Gelöscht werden auswählen
              return (
                -1 !==
                this.state.choosenToDelete.findIndex((searchValue) => {
                  return searchValue === value.pictureID;
                })
              );
            })
            .map((value, index) => {
              console.log(value);
              return <Typography key={index}>- {value.name}</Typography>;
            })}
        </div>
      </React.Fragment>
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
    if (this.state.confirmDelete === true) {
      return (
        <React.Fragment>
          <ButtonBase
            style={{ width: "100%", padding: 10 }}
            variant="outlined"
            onClick={() => {
              this.setState({
                confirmDelete: false,
                pictures:
                  this.state.deleteSuccess !== null &&
                  this.state.deleteSuccess.length !== 0
                    ? null
                    : this.state.pictures,
                deleteSuccess: null,
                deleteError: null
              });
            }}
          >
            <Typography variant="button">Zurück</Typography>
          </ButtonBase>
          <Divider />
          <div style={{ padding: 10 }}>
            {this.state.deleteSuccess === null
              ? this.renderDeleteInfo()
              : this.renderDeleteResult()}
            <Collapse in={this.state.deleteSuccess === null}>
              <Button
                fullWidth
                variant="outlined"
                onClick={this.deletePictures}
                style={{
                  padding: 10,
                  color: "white",
                  backgroundColor: "red",
                  marginBottom: 10
                }}
              >
                Löschen
              </Button>
            </Collapse>
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <ButtonBase
          style={{ width: "100%", padding: 10 }}
          variant="outlined"
          onClick={() => {
            this.props.changePhase(PICTURE_PICK);
          }}
        >
          <Typography variant="button">Zurück</Typography>
        </ButtonBase>
        <Divider />
        <div style={{ padding: 10 }}>
          <Button
            fullWidth
            onClick={() => this.setState({ confirmDelete: true })}
            style={{
              padding: 10,
              marginBottom: 10,
              color: this.state.choosenToDelete.length === 0 ? "grey" : "white",
              backgroundColor:
                this.state.choosenToDelete.length === 0 ? "white" : "red"
            }}
            disabled={this.state.choosenToDelete.length === 0}
            variant="contained"
          >
            Bilder Löschen
          </Button>
        </div>
        <PictureSelect
          markingColor="red"
          pictures={this.state.pictures}
          groupMember={this.state.choosenToDelete}
          setGroupMember={(choosenToDelete) =>
            this.setState({ choosenToDelete })
          }
        />
      </React.Fragment>
    );
  }
}

PictureDelete.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureDelete)));
