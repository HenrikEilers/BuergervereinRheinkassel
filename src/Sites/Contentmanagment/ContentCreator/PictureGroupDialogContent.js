import { withTheme } from "@material-ui/core/styles";

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
  Paper,
  Grid,
  Card,
  InputAdornment,
  Zoom
} from "@material-ui/core";

import Search from "@material-ui/icons/Search";

import AddIcon from "@material-ui/icons/Add";

import Clear from "@material-ui/icons/Clear";

import Delete from "@material-ui/icons/Delete";

import { postRequest } from "../../../actions.js";

import { withRouter } from "react-router-dom";

//import { postRequest, postUploadPicture } from "../actions.js";

import React from "react";
import { red } from "@material-ui/core/colors";

const styles = theme => ({
  card: {
    maxHeight: 300,
    width: "100%",
    overflow: "hidden",
    "text-align": "center",
    color: "white"
  }
});

const NORMAL_GROUPPICK = 1;
const CHANGE_GROUPS = 2;
const ADD_TO_GROUP = 3;
const ADD_NEW_GROUP = 4;
const DELETE_GROUP = 5;
class PictureGroupDialogContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateOfGroupAction: NORMAL_GROUPPICK,
      pictureGroups: this.props.pictureGroups,
      changingElement: null,
      groupOnEdit: null,
      imgSearch: "",
      error: false,
      errorText: ""
    };
  }

  //render methode
  render() {
    const { classes } = this.props;
    if (this.state.error) {
      return (
        <Paper
          style={{
            backgroundColor: red,
            color: "white",
            padding: "white",
            textAlign: "center"
          }}
        >
          <Typography variant="h2">Error</Typography>
          <Typography>{this.state.errorText}</Typography>
          <Button
            fullWidth
            onClick={() => {
              this.setState({ pictureGroups: null });
            }}
          >
            Reload
          </Button>
        </Paper>
      );
    }
    if (this.state.stateOfGroupAction === NORMAL_GROUPPICK) {
      return this.renderGroupPick();
    }
    if (this.state.stateOfGroupAction === CHANGE_GROUPS) {
      return this.renderChangeGroups();
    }
    if (this.state.stateOfGroupAction === ADD_TO_GROUP) {
      return this.renderAddToGroup();
    }
    if (this.state.stateOfGroupAction === ADD_NEW_GROUP) {
      return this.renderAddNewGroup();
    }
    if (this.state.stateOfGroupAction === DELETE_GROUP) {
      return this.renderDeleteGroup();
    }
  }

  renderGroupPick = () => {
    if (!this.state.pictureGroups) {
      const callback = response => {
        if (response.data.success) {
          this.setState({
            stateOfGroupAction: NORMAL_GROUPPICK,
            pictureGroups: response.data.pictureGroups
          });
          this.props.backUpGroups(response.data.pictureGroups);
        } else {
          this.setState({ error: true, errorText: response.data.errortext });
        }
      };
      postRequest(
        "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/PictureGroup/getGroups.php",
        this.props.user,
        {},
        callback
      );
      return (
        <div style={{ textAlign: "center", padding: 20 }}>
          <CircularProgress />
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <List className={this.props.classes.root} component="nav">
            <ListItem
              button
              onClick={() => {
                this.setState({ stateOfGroupAction: CHANGE_GROUPS });
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
              selected={this.props.pickedGroup === null}
              button
              onClick={() => {
                this.props.handleGroupPick(null);
              }}
            >
              <ListItemText primary="Alle" />
            </ListItem>
            {this.state.pictureGroups.map((value, index) => {
              return (
                <ListItem
                  key={index}
                  selected={
                    this.props.pickedGroup !== null &&
                    this.props.pickedGroup.GroupID === value.GroupID
                  }
                  button
                  onClick={() => {
                    this.props.handleGroupPick(value);
                  }}
                >
                  <ListItemText primary={value.name} />
                </ListItem>
              );
            })}
          </List>
        </React.Fragment>
      );
    }
  };

  renderChangeGroups = () => {
    return (
      <React.Fragment>
        <List className={this.props.classes.root} component="nav">
          <ListItem
            button
            onClick={() => {
              this.setState({
                stateOfGroupAction: ADD_NEW_GROUP,
                groupOnEdit: {
                  GroupID: -1,
                  name: "",
                  kind: 1,
                  gruppenmitglieder: []
                }
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
          {this.state.pictureGroups.map((value, index) => {
            return (
              <ListItem
                key={index}
                selected={
                  this.props.pickedGroup !== null &&
                  this.props.pickedGroup.GroupID === value.GroupID
                }
                button
                onClick={() => {
                  this.setState({
                    stateOfGroupAction: ADD_TO_GROUP,
                    groupOnEdit: value
                  });
                }}
              >
                <ListItemText primary={value.name} />
              </ListItem>
            );
          })}
        </List>
      </React.Fragment>
    );
  };

  renderAddToGroup = () => {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <List
          subheader={
            <ListSubheader component="div" id="group">
              <InputBase
                value={this.state.groupOnEdit.name}
                onChange={event => {
                  this.setState({
                    groupOnEdit: {
                      ...this.state.groupOnEdit,
                      name: event.target.value
                    }
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
              this.setState({ stateOfGroupAction: DELETE_GROUP });
            }}
          >
            <ListItemIcon>
              <Clear />
            </ListItemIcon>
            <ListItemText primary="Ordner Löschen" />
          </ListItem>
        </List>
        <Divider />
        <Collapse
          in={
            JSON.stringify(this.state.groupOnEdit) !==
            JSON.stringify(
              this.props.pictureGroups.find(value => {
                return value.GroupID === this.state.groupOnEdit.GroupID;
              })
            )
          }
        >
          <ButtonBase
            onClick={() => {
              const callback = response => {
                if (response.data.success) {
                  this.setState({
                    pictureGroups: response.data.pictureGroups,
                    groupOnEdit: response.data.pictureGroups.find(value1 => {
                      return value1.GroupID === this.state.groupOnEdit.GroupID;
                    })
                  });
                  this.props.backUpGroups(response.data.pictureGroups);
                } else {
                  this.setState({
                    error: true,
                    errorText: response.data.errortext
                  });
                }
              };
              postRequest(
                "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/PictureGroup/editGroup.php",
                this.props.user,
                { group: this.state.groupOnEdit },
                callback
              );
            }}
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "green",
              color: "white"
            }}
          >
            <Typography variant="button">Speichern</Typography>
          </ButtonBase>
        </Collapse>
        <Collapse in={this.state.imgSearch === ""}>
          <div style={{ padding: "10px", paddingBottom: 0 }}>
            <Button
              fullWidth
              variant="outlined"
              style={{ padding: 10 }}
              onClick={() => {
                this.setState({
                  groupOnEdit: {
                    ...this.state.groupOnEdit,
                    gruppenmitglieder: this.props.pictureList.every(
                      (value, index) => {
                        return this.state.groupOnEdit.gruppenmitglieder.includes(
                          value.pictureID
                        );
                      }
                    )
                      ? []
                      : this.props.pictureList.map(value => {
                          return value.pictureID;
                        })
                  }
                });
              }}
            >
              {this.props.pictureList.every((value, index) => {
                return this.state.groupOnEdit.gruppenmitglieder.includes(
                  value.pictureID
                );
              })
                ? "Alle Abwählen"
                : "Alle Wählen"}
            </Button>
          </div>
        </Collapse>
        <div style={{ padding: 10, paddingBottom: 0 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={this.state.imgSearch}
            onChange={event => {
              this.setState({ imgSearch: event.target.value });
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </div>

        <div style={{ padding: 10 }}>
          <Grid style={{ width: "100%" }} container justify="flex-start">
            {this.state.groupOnEdit.gruppenmitglieder.map((value, index) => {
              const picture = this.props.pictureList.find(value1 => {
                return value1.pictureID === value;
              });
              if (
                picture !== undefined &&
                picture.name
                  .toUpperCase()
                  .search(this.state.imgSearch.toUpperCase()) !== -1
              ) {
                return (
                  <Grid key={index} item xs={12} sm={6} style={{ padding: 5 }}>
                    <Zoom
                      in={!(picture.pictureID === this.state.changingElement)}
                      onExited={() => {
                        const tmpGruppenmitglieder = this.state.groupOnEdit.gruppenmitglieder.filter(
                          value1 => {
                            return value1 !== picture.pictureID;
                          }
                        );
                        this.setState({
                          groupOnEdit: {
                            ...this.state.groupOnEdit,
                            gruppenmitglieder: tmpGruppenmitglieder
                          },
                          changingElement: null
                        });
                      }}
                    >
                      <Card
                        style={{ backgroundColor: "green", color: "white" }}
                      >
                        <ButtonBase
                          style={{
                            width: "100%",
                            display: "block",
                            padding: 5
                          }}
                          onClick={() => {
                            this.setState({
                              changingElement: picture.pictureID
                            });
                          }}
                        >
                          <Typography style={{ color: "white" }} variant="h5">
                            {picture.name}
                          </Typography>
                          <Card className={classes.card}>
                            <img
                              style={{
                                verticalAlign: "middle",
                                overflowY: "hidden"
                              }}
                              width="100%"
                              src={picture.content}
                              alt={picture.name}
                            />
                          </Card>
                        </ButtonBase>
                      </Card>
                    </Zoom>
                  </Grid>
                );
              } else {
                return null;
              }
            })}
            {this.props.pictureList.map((value, index) => {
              if (
                this.state.groupOnEdit.gruppenmitglieder.length === 0 ||
                (-1 ===
                  this.state.groupOnEdit.gruppenmitglieder.findIndex(value1 => {
                    return value1 === value.pictureID;
                  }) &&
                  value.name
                    .toUpperCase()
                    .search(this.state.imgSearch.toUpperCase()) !== -1)
              ) {
                return (
                  <Grid key={index} item xs={12} sm={6} style={{ padding: 5 }}>
                    <Zoom
                      in={!(value.pictureID === this.state.changingElement)}
                      onExited={() => {
                        const tmpGruppenmitglieder = this.state.groupOnEdit.gruppenmitglieder.concat(
                          value.pictureID
                        );
                        this.setState({
                          groupOnEdit: {
                            ...this.state.groupOnEdit,
                            gruppenmitglieder: tmpGruppenmitglieder
                          },
                          changingElement: null
                        });
                      }}
                    >
                      <Card style={{ backgroundColor: "red", color: "white" }}>
                        <ButtonBase
                          style={{
                            width: "100%",
                            display: "block",
                            padding: 5
                          }}
                          onClick={() => {
                            this.setState({
                              changingElement: value.pictureID
                            });
                          }}
                        >
                          <Typography style={{ color: "white" }} variant="h5">
                            {value.name}
                          </Typography>
                          <Card className={classes.card}>
                            <img
                              style={{
                                verticalAlign: "middle",
                                overflowY: "hidden"
                              }}
                              width="100%"
                              src={value.content}
                              alt={value.name}
                            />
                          </Card>
                        </ButtonBase>
                      </Card>
                    </Zoom>
                  </Grid>
                );
              } else {
                return null;
              }
            })}
          </Grid>
        </div>
      </React.Fragment>
    );
  };

  renderAddNewGroup = () => {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div style={{ padding: 10 }}>
          <TextField
            fullWidth
            label="Ordnername"
            variant="outlined"
            value={this.state.groupOnEdit.name}
            onChange={event => {
              this.setState({
                groupOnEdit: {
                  ...this.state.groupOnEdit,
                  name: event.target.value
                }
              });
            }}
          />
        </div>

        <Divider />
        <Collapse in={this.state.groupOnEdit.name !== ""}>
          <ButtonBase
            onClick={() => {
              const callback = response => {
                if (response.data.success) {
                  this.setState({
                    pictureGroups: response.data.pictureGroups,
                    groupOnEdit: response.data.pictureGroups.find(value1 => {
                      return value1.GroupID === response.data.GroupID;
                    }),
                    stateOfGroupAction: ADD_TO_GROUP
                  });
                  this.props.backUpGroups(response.data.pictureGroups);
                } else {
                  this.setState({
                    error: true,
                    errorText: response.data.errortext
                  });
                }
              };
              console.log(this.state.groupOnEdit);
              postRequest(
                "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/PictureGroup/addGroup.php",
                this.props.user,
                { group: this.state.groupOnEdit },
                callback
              );
            }}
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "green",
              color: "white"
            }}
          >
            <Typography variant="button">Speichern</Typography>
          </ButtonBase>
        </Collapse>
        <Collapse in={this.state.imgSearch === ""}>
          <div style={{ padding: "10px", paddingBottom: 0 }}>
            <Button
              fullWidth
              variant="outlined"
              style={{ padding: 10 }}
              onClick={() => {
                this.setState({
                  groupOnEdit: {
                    ...this.state.groupOnEdit,
                    gruppenmitglieder: this.props.pictureList.every(
                      (value, index) => {
                        return this.state.groupOnEdit.gruppenmitglieder.includes(
                          value.pictureID
                        );
                      }
                    )
                      ? []
                      : this.props.pictureList.map(value => {
                          return value.pictureID;
                        })
                  }
                });
              }}
            >
              {this.props.pictureList.every((value, index) => {
                return this.state.groupOnEdit.gruppenmitglieder.includes(
                  value.pictureID
                );
              })
                ? "Alle Abwählen"
                : "Alle Wählen"}
            </Button>
          </div>
        </Collapse>
        <div style={{ padding: 10, paddingBottom: 0 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={this.state.imgSearch}
            onChange={event => {
              this.setState({ imgSearch: event.target.value });
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </div>

        <div style={{ padding: 10 }}>
          <Grid style={{ width: "100%" }} container justify="flex-start">
            {this.state.groupOnEdit.gruppenmitglieder.map((value, index) => {
              const picture = this.props.pictureList.find(value1 => {
                return value1.pictureID === value;
              });
              if (
                picture !== undefined &&
                picture.name
                  .toUpperCase()
                  .search(this.state.imgSearch.toUpperCase()) !== -1
              ) {
                return (
                  <Grid key={index} item xs={12} sm={6} style={{ padding: 5 }}>
                    <Zoom
                      in={!(picture.pictureID === this.state.changingElement)}
                      onExited={() => {
                        const tmpGruppenmitglieder = this.state.groupOnEdit.gruppenmitglieder.filter(
                          value1 => {
                            return value1 !== picture.pictureID;
                          }
                        );
                        this.setState({
                          groupOnEdit: {
                            ...this.state.groupOnEdit,
                            gruppenmitglieder: tmpGruppenmitglieder
                          },
                          changingElement: null
                        });
                      }}
                    >
                      <Card
                        style={{ backgroundColor: "green", color: "white" }}
                      >
                        <ButtonBase
                          style={{
                            width: "100%",
                            display: "block",
                            padding: 5
                          }}
                          onClick={() => {
                            this.setState({
                              changingElement: picture.pictureID
                            });
                          }}
                        >
                          <Typography style={{ color: "white" }} variant="h5">
                            {picture.name}
                          </Typography>
                          <Card className={classes.card}>
                            <img
                              style={{
                                verticalAlign: "middle",
                                overflowY: "hidden"
                              }}
                              width="100%"
                              src={picture.content}
                              alt={picture.name}
                            />
                          </Card>
                        </ButtonBase>
                      </Card>
                    </Zoom>
                  </Grid>
                );
              } else {
                return null;
              }
            })}
            {this.props.pictureList.map((value, index) => {
              if (
                this.state.groupOnEdit.gruppenmitglieder.length === 0 ||
                (-1 ===
                  this.state.groupOnEdit.gruppenmitglieder.findIndex(value1 => {
                    return value1 === value.pictureID;
                  }) &&
                  value.name
                    .toUpperCase()
                    .search(this.state.imgSearch.toUpperCase()) !== -1)
              ) {
                return (
                  <Grid key={index} item xs={12} sm={6} style={{ padding: 5 }}>
                    <Zoom
                      in={!(value.pictureID === this.state.changingElement)}
                      onExited={() => {
                        const tmpGruppenmitglieder = this.state.groupOnEdit.gruppenmitglieder.concat(
                          value.pictureID
                        );
                        this.setState({
                          groupOnEdit: {
                            ...this.state.groupOnEdit,
                            gruppenmitglieder: tmpGruppenmitglieder
                          },
                          changingElement: null
                        });
                      }}
                    >
                      <Card style={{ backgroundColor: "red", color: "white" }}>
                        <ButtonBase
                          style={{
                            width: "100%",
                            display: "block",
                            padding: 5
                          }}
                          onClick={() => {
                            this.setState({
                              changingElement: value.pictureID
                            });
                          }}
                        >
                          <Typography style={{ color: "white" }} variant="h5">
                            {value.name}
                          </Typography>
                          <Card className={classes.card}>
                            <img
                              style={{
                                verticalAlign: "middle",
                                overflowY: "hidden"
                              }}
                              width="100%"
                              src={value.content}
                              alt={value.name}
                            />
                          </Card>
                        </ButtonBase>
                      </Card>
                    </Zoom>
                  </Grid>
                );
              } else {
                return null;
              }
            })}
          </Grid>
        </div>
      </React.Fragment>
    );
  };

  renderDeleteGroup = () => {
    return (
      <React.Fragment>
        <div style={{ margin: "10px" }}>
          <Button
            onClick={() => {
              const callback = response => {
                if (response.data.success) {
                  this.setState({
                    pictureGroups: response.data.pictureGroups,
                    groupOnEdit: null,
                    stateOfGroupAction: CHANGE_GROUPS,
                    changingElement: null,
                    imgSearch: ""
                  });
                  this.props.backUpGroups(response.data.pictureGroups);
                } else {
                  this.setState({
                    error: true,
                    errorText: response.data.errortext
                  });
                }
              };
              postRequest(
                "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/PictureGroup/deleteGroup.php",
                this.props.user,
                { GroupID: this.state.groupOnEdit.GroupID },
                callback
              );
            }}
            style={{
              marginBottom: "5px",
              width: "100%",
              height: "100px",
              backgroundColor: "red",
              color: "white",
              display: "-webkit-flex",
              justifyContent: "space-around",
              WebkitJustifyContent: "space-around"
            }}
          >
            <Delete style={{ marginLeft: 10, width: "40px", height: "40px" }} />
            <span>Gruppe "{this.state.groupOnEdit.name}" Löschen</span>
          </Button>

          <Button
            onClick={() => {
              this.setState({
                stateOfGroupAction: ADD_TO_GROUP,
                error: false,
                errormessage: ""
              });
            }}
            style={{
              marginTop: "5px",
              width: "100%",
              height: "50px",
              backgroundColor: "green",
              color: "white"
            }}
          >
            Abbrechen
          </Button>
        </div>
      </React.Fragment>
    );
  };
}

PictureGroupDialogContent.propTypes = {};

export default withTheme(
  withStyles(styles)(withRouter(PictureGroupDialogContent))
);
