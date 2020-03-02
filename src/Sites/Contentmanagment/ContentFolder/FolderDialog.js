import React from "react";
import {
  withStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Checkbox,
  Collapse,
  ButtonBase,
  Typography,
  ListSubheader,
  InputBase,
  TextField,
  Button,
  Paper
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Clear from "@material-ui/icons/Clear";

import { Dialog } from "@material-ui/core";

const styles = theme => ({
  root: {
    width: 360,
    backgroundColor: theme.palette.background.paper
  }
});
const NORMAL_GROUPPICK = 1;
const CHANGE_GROUPS = 2;
const ADD_TO_GROUP = 3;
const ADD_NEW_GROUP = 4;
const DELETE_GROUP = 5;

class FolderDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateOfDialog: NORMAL_GROUPPICK,
      choosenGroup: {
        name: "",
        GroupID: -1,
        gruppenmitglieder: []
      },
      offlineContentplusGroup: null,
      groupChanged: false,
      error: false,
      errormessage: ""
    };
  }

  //Hilfsmethoden die Von verschieden Phasen Benutzt werden

  /** rendert die eine Liste aus dem parameter content und 
  gibt ein onClick callbackzurück beim drücken eines Elementes**/
  renderGroupList = (content, onClick) => {
    if (content) {
      return content.map((value, index) => {
        return (
          <ListItem key={index} button onClick={() => onClick(value)}>
            <ListItemText primary={value.name} />
          </ListItem>
        );
      });
    } else {
      return <CircularProgress />;
    }
  };

  /**rendert die Liste des Content mit Ceckboxen
    bei änderung der Checkboxen wird changeContent aufgerufen**/
  renderContentList = content => {
    return content.map((value, index) => {
      return (
        <ListItem key={index}>
          <ListItemText primary={value.name} />
          <Checkbox
            checked={value.included}
            onChange={() => this.changeContent(value.ContentID)}
          />
        </ListItem>
      );
    });
  };

  /**ändert den State mit dem neuen datum der Ceckbox
      überprüft ob die neu Gruppe anders ist bzw. gespeichert werden muss mit groupChanged()**/
  changeContent = contentID => {
    const offlineContentTMP = this.state.offlineContentplusGroup.map(value => {
      if (value.ContentID === contentID) value.included = !value.included;
      return value;
    });
    this.setState({
      offlineContentplusGroup: offlineContentTMP,
      groupChanged: this.groupChanged(this.state.choosenGroup.name)
    });
  };
  //überprüft ob sich die gruppe geändert hat bzw. gespeichert werden muss
  groupChanged = name => {
    if (name === "") return false;
    if (this.state.choosenGroup.GroupID === -1) return true;
    const realGroup = this.props.group.find(value => {
      return value.GroupID === this.state.choosenGroup.GroupID;
    });

    if (realGroup.name !== name) return true;
    const gruppenmitgliederTMP = this.state.offlineContentplusGroup
      .filter(value => {
        return value.included;
      })
      .map(value => {
        return value.ContentID;
      });
    return !gruppenmitgliederTMP.sort().every((value, index) => {
      return this.state.choosenGroup.gruppenmitglieder.sort()[index] === value;
    });
  };

  /**handlet das Drücken des Speicherknopfes
      spricht post methode in Contentmanager an
      upadatet danach per callback den State**/
  onSave = () => {
    const gruppenmitgliederTMP = this.state.offlineContentplusGroup
      .filter(value => {
        return value.included;
      })
      .map(value => {
        return value.ContentID;
      });

    const update = GroupID => {
      this.setState({
        choosenGroup: {
          ...this.state.choosenGroup,
          GroupID: GroupID,
          gruppenmitglieder: gruppenmitgliederTMP
        },
        groupChanged: false,
        stateOfDialog: ADD_TO_GROUP
      });
    };
    this.props.editGroup(
      this.state.choosenGroup.name,
      this.state.choosenGroup.GroupID,
      gruppenmitgliederTMP,
      update
    );
  };

  chooseAll = () => {
    const offlineContentTMP = this.state.offlineContentplusGroup.map(value => {
      value.included = true;
      return value;
    });
    this.setState({
      offlineContentplusGroup: offlineContentTMP,
      groupChanged: this.groupChanged(this.state.choosenGroup.name)
    });
  };

  //render methoden für die verschieden Phasen

  /**rendert die erste Phase in der man nur die Gruppen auswählen kann**/
  renderGroupPick = () => {
    const onClick = value => {
      this.props.handleFolderChange(value.GroupID);
      this.props.onClose();
    };
    return (
      <React.Fragment>
        <List className={this.props.classes.root} component="nav">
          <ListItem
            button
            onClick={() => {
              this.setState({ stateOfDialog: CHANGE_GROUPS });
            }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Ordner Bearbeiten" />
          </ListItem>
        </List>
        <Divider />
        <List component="nav">
          <ListItem
            button
            onClick={() => {
              this.props.handleFolderAll();
              this.props.onClose();
            }}
          >
            <ListItemText primary="Alle" />
          </ListItem>
          {this.renderGroupList(this.props.group, onClick)}
        </List>
      </React.Fragment>
    );
  };

  /**rendert die Phase in der man die Gruppe zum Bearbeiten auswählen  oder eine neu erstellen kann**/
  renderChangeGroups = () => {
    const onClick = value => {
      const offlineContentTMP = this.props.offlineContent.map(valueContent => {
        valueContent.included = value.gruppenmitglieder.includes(
          valueContent.ContentID
        );
        return valueContent;
      });
      this.setState({
        stateOfDialog: ADD_TO_GROUP,
        choosenGroup: value,
        offlineContentplusGroup: offlineContentTMP
      });
    };
    return (
      <React.Fragment>
        <List className={this.props.classes.root} component="nav">
          <ListItem
            button
            onClick={() => {
              this.setState({
                stateOfDialog: ADD_NEW_GROUP,
                offlineContentplusGroup: this.props.offlineContent.map(
                  valueContent => {
                    valueContent.included = false;
                    return valueContent;
                  }
                )
              });
            }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Neuer Ordner" />
          </ListItem>
        </List>
        <Divider />
        <List component="nav">
          {this.renderGroupList(this.props.group, onClick)}
        </List>
      </React.Fragment>
    );
  };

  /**rendert die Phase in der man die Gruppe an sich verändern kann**/
  renderAddToGroup = () => {
    return (
      <React.Fragment>
        <List
          subheader={
            <ListSubheader component="div" id="group">
              <InputBase
                value={this.state.choosenGroup.name}
                onChange={event => {
                  this.setState({
                    choosenGroup: {
                      ...this.state.choosenGroup,
                      name: event.target.value
                    },
                    groupChanged: this.groupChanged(event.target.value)
                  });
                }}
              />
            </ListSubheader>
          }
          className={this.props.classes.root}
          component="nav"
        >
          <ListItem
            button
            onClick={() => {
              this.setState({ stateOfDialog: DELETE_GROUP });
            }}
          >
            <ListItemIcon>
              <Clear />
            </ListItemIcon>
            <ListItemText primary="Ordner Löschen" />
          </ListItem>
        </List>
        <Divider />
        <Collapse in={this.state.groupChanged}>
          <ButtonBase
            onClick={this.onSave}
            style={{
              width: "100%",
              backgroundColor: "green",
              color: "white",
              height: "45px"
            }}
          >
            <Typography variant="button">Speichern</Typography>
          </ButtonBase>
        </Collapse>
        <List component="nav">
          <ListItem
            button
            onClick={() => {
              this.chooseAll();
            }}
          >
            <ListItemText primary="Alle Auswählen" />
          </ListItem>
          {this.renderContentList(this.state.offlineContentplusGroup)}
        </List>
      </React.Fragment>
    );
  };

  renderAddNewGroup = () => {
    return (
      <React.Fragment>
        <div style={{ textAlign: "center", padding: 10 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={this.state.choosenGroup.name}
            label="Ordnername"
            onChange={event => {
              this.setState({
                choosenGroup: {
                  ...this.state.choosenGroup,
                  name: event.target.value
                },
                groupChanged: this.groupChanged(event.target.value)
              });
            }}
          />
        </div>

        <Divider />
        <Collapse in={this.state.groupChanged}>
          <ButtonBase
            onClick={this.onSave}
            style={{
              width: "100%",
              backgroundColor: "green",
              color: "white",
              height: "45px"
            }}
          >
            <Typography variant="button">Speichern</Typography>
          </ButtonBase>
        </Collapse>
        <List className={this.props.classes.root} component="nav">
          <ListItem
            button
            onClick={() => {
              this.chooseAll();
            }}
          >
            <ListItemText primary="Alle Auswählen" />
          </ListItem>
          {this.renderContentList(this.state.offlineContentplusGroup)}
        </List>
      </React.Fragment>
    );
  };

  renderDeleteGroup = () => {
    const deleteCallback = response => {
      if (response.data.success) {
        this.props.onClose();
      } else {
        this.setState({ error: true, errormessage: response.data.errortext });
      }
    };

    return (
      <React.Fragment>
        <div className={this.props.classes.root}>
          <div style={{ margin: "20px", marginBottom: "5px" }}>
            <Button
              onClick={() => {
                this.props.deleteGroup(
                  this.state.choosenGroup.GroupID,
                  deleteCallback
                );
              }}
              style={{
                width: "100%",
                height: "100px",
                backgroundColor: "red",
                color: "white"
              }}
            >
              Gruppe {this.state.choosenGroup.name} Löschen
            </Button>
          </div>
          <Collapse style={{ margin: "10px 20px" }} in={this.state.error}>
            <Paper style={{ border: "solid 2px red", padding: "5px" }}>
              <Typography
                //color="error"
                variant="button"
                align="center"
                display="block"
              >
                {this.state.errormessage}
              </Typography>
            </Paper>
          </Collapse>
          <div style={{ margin: "20px", marginTop: "5px" }}>
            <Button
              onClick={() => {
                this.setState({
                  stateOfDialog: ADD_TO_GROUP,
                  error: false,
                  errormessage: ""
                });
              }}
              style={{
                width: "100%",
                height: "50px",
                backgroundColor: "green",
                color: "white"
              }}
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  /**rendert den Dialog entsprechend der richtigen phase**/
  render() {
    //const { classes } = this.props;
    const dialogContent = () => {
      if (this.state.stateOfDialog === NORMAL_GROUPPICK)
        return this.renderGroupPick();
      if (this.state.stateOfDialog === CHANGE_GROUPS)
        return this.renderChangeGroups();
      if (this.state.stateOfDialog === ADD_TO_GROUP)
        return this.renderAddToGroup();
      if (this.state.stateOfDialog === ADD_NEW_GROUP)
        return this.renderAddNewGroup();
      if (this.state.stateOfDialog === DELETE_GROUP)
        return this.renderDeleteGroup();
    };
    return (
      <Dialog
        scroll="body"
        open={this.props.open}
        onClose={this.props.onClose}
        onExited={() =>
          this.setState({
            stateOfDialog: NORMAL_GROUPPICK,
            choosenGroup: {
              name: "",
              GroupID: -1,
              gruppenmitglieder: []
            },
            offlineContentplusGroup: null,
            groupChanged: false
          })
        }
      >
        {dialogContent()}
      </Dialog>
    );
  }
}
export default withStyles(styles)(FolderDialog);
