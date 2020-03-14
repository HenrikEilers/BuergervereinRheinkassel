import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  TextField,
  Dialog,
  Collapse,
  Button,
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  ButtonBase,
  Card,
  Typography,
  InputAdornment,
  CircularProgress,
  List,
  ListSubheader,
  ListItemText,
  ListItem,
  Checkbox
} from "@material-ui/core";

import Search from "@material-ui/icons/Search";

import PublishIcon from "@material-ui/icons/Publish";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import { postRequest } from "../../../actions.js";

import { withRouter } from "react-router-dom";

import PicturePicker from "../../../CommonComponents/PicturePicker/PicturePicker";

import Box from "../../../CommonComponents/Feed/Box";

//import { postRequest, postUploadPicture } from "../actions.js";

import React from "react";

const styles = theme => ({
  display: {
    [theme.breakpoints.only("xs")]: {
      display: "none"
    }
  },
  display1: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  card: {
    maxHeight: 300,
    width: "100%",
    overflow: "hidden",
    "text-align": "center",
    color: "white"
  }
});

const EDIT_CONTENTHEAD = "EDIT_CONTENTHEAD";
const PICK_PICTURE = "PICK_PICTURE";
const PICK_CONTENT_GROUP = "PICK_CONTENT_GROUP";

const boxSizeY = [153, 175, 270];
class tmpContentHeadDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tmpContentHead: this.props.contentHead,
      date:
        this.props.contentHead.date === "0000-00-00"
          ? new Date()
          : new Date(this.props.contentHead.date),
      dateError: false,
      displaySize: 0,
      first: false,
      stateOfDialog: EDIT_CONTENTHEAD,
      displayDate: this.props.contentHead.date === "0000-00-00" ? false : true,
      contentGroups: null,
      choosenContentGroups: null,
      choosenContentGroupsCopy: null
    };
  }

  renderPhase = () => {
    if (this.state.stateOfDialog === EDIT_CONTENTHEAD) {
      return <div style={{ margin: 15 }}>{this.renderGrid()}</div>;
    }
    if (this.state.stateOfDialog === PICK_PICTURE) {
      return this.renderPicturePick();
    }
    if (this.state.stateOfDialog === PICK_CONTENT_GROUP) {
      return this.renderChooseContentGroups();
    }
    return null;
  };

  /**erstellt Kopie von Objekten */
  bestCopyEver = src => {
    return JSON.parse(JSON.stringify(src));
  };

  /** hasToSave über prüft ob sich der Content auf dem ContentHeadDialog
   * sich verändert hat und gib wahrheits wert zurück
   */
  hasToSave = () => {
    if (this.state.stateOfDialog !== 0) {
      return false;
    }
    if (this.state.tmpContentHead.name === "") {
      return false;
    }
    if (this.state.tmpContentHead.name !== this.props.contentHead.name) {
      return true;
    }
    if (
      this.state.tmpContentHead.beschreibung !==
      this.props.contentHead.beschreibung
    ) {
      return true;
    }
    if (this.state.displayDate) {
      if (this.state.date !== null) {
        if (!isNaN(this.state.date.getTime())) {
          if (
            this.state.date.toISOString().substring(0, 10) !==
            this.props.contentHead.date
          ) {
            return true;
          }
        }
      }
    } else {
      if (this.props.contentHead.date !== "0000-00-00") {
        return true;
      }
    }
    if (this.state.tmpContentHead.imgsrc !== this.props.contentHead.imgsrc) {
      return true;
    }
    if (this.state.tmpContentHead.rank !== this.props.contentHead.rank) {
      return true;
    }
    if (
      this.state.tmpContentHead.pictureID !== this.props.contentHead.pictureID
    ) {
      return true;
    }
    if (
      this.state.tmpContentHead.imgcontent !== this.props.contentHead.imgcontent
    ) {
      return true;
    }
    if (this.state.contentGroups !== null) {
      if (
        (JSON.stringify(this.state.choosenContentGroups) !==
          JSON.stringify(this.state.choosenContentGroupsCopy) &&
          this.props.choosenContentGroups === null) ||
        (JSON.stringify(this.state.choosenContentGroups) !==
          JSON.stringify(this.props.choosenContentGroups) &&
          this.props.choosenContentGroups !== null)
      ) {
        return true;
      }
    }
    return false;
  };

  onExited = () => {
    this.setState({
      tmpContentHead: this.props.contentHead,
      date:
        this.props.contentHead.date === "0000-00-00"
          ? new Date()
          : new Date(this.props.contentHead.date),
      dateError: false,
      displaySize: 0,
      first: false,
      stateOfDialog: EDIT_CONTENTHEAD,
      displayDate: this.props.contentHead.date === "0000-00-00" ? false : true,
      pictureList: null,
      imgSearch: "",
      choosenPictureGroup: null,
      pictureGroups: null,

      choosenContentGroups:
        this.props.choosenContentGroups !== null
          ? this.props.choosenContentGroups
          : this.state.choosenContentGroupsCopy
    });
  };

  setContentHead = () => {
    this.props.addToContentHead(
      this.state.tmpContentHead,
      this.state.date,
      JSON.stringify(this.state.choosenContentGroups) ===
        JSON.stringify(this.state.choosenContentGroupsCopy)
        ? null
        : this.state.choosenContentGroups
    );
    this.props.onClose();
  };

  //render methode
  render() {
    const { classes } = this.props;

    return (
      <Dialog
        scroll="body"
        maxWidth="sm"
        fullWidth
        open={this.props.open}
        onEnter={event => {
          this.setState({
            tmpContentHead: this.props.contentHead
          });
        }}
        onClose={this.props.onClose}
        onExited={this.onExited}
      >
        <Collapse in={this.hasToSave()}>
          <Button
            onClick={this.setContentHead}
            fullWidth
            style={{
              padding: 10,
              color: "white",
              backgroundColor: "green"
            }}
          >
            Hinzufügen
          </Button>
        </Collapse>
        {this.renderPhase()}
      </Dialog>
    );
  }

  /**rendert die Bildauswahl für das Feed Element des ContentHeads */
  renderPicturePick = () => {
    const { classes } = this.props;

    return (
      <PicturePicker
        getPicture={picture => {
          this.setState({
            tmpContentHead: {
              ...this.state.tmpContentHead,
              pictureID: picture.pictureID,
              imgcontent: picture.imgcontent
            },
            stateOfDialog: EDIT_CONTENTHEAD
          });
        }}
        disableUpload={false}
        user={this.props.user}
      />
    );
  };

  /**rendert dei hauptbearbeitungs seite für den Contenthead */
  renderGrid = () => {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid xs={12} item container>
          {this.getInputContent()}
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ margin: "15px 0px" }} />
        </Grid>
        <Grid xs={12} item container>
          <Grid
            xs={12}
            sm={6}
            item
            style={{
              border: "solid 0px blue",
              textAlign: "center",
              padding: 10
            }}
          >
            <FormControl style={{ width: "100%", border: "solid 0px red" }}>
              <InputLabel htmlFor="box-size">Größe</InputLabel>
              <Select
                style={{ width: "100%" }}
                value={this.state.displaySize}
                onChange={event => {
                  this.setState({ displaySize: event.target.value });
                }}
                inputProps={{
                  name: "size",
                  id: "box-size"
                }}
              >
                <MenuItem value={0}>Mobil</MenuItem>
                <MenuItem value={1}>Klein</MenuItem>
                <MenuItem
                  className={
                    this.state.first ? classes.display1 : classes.display
                  }
                  value={2}
                >
                  Normal(Pc)
                </MenuItem>
              </Select>
              <FormHelperText>
                Anzeige auf verschieden Bildschirmgrößen
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            sm={6}
            item
            style={{
              border: "solid 0px blue",
              textAlign: "center",
              padding: 10
            }}
          >
            <FormControl style={{ width: "100%" }}>
              <InputLabel htmlFor="box-size">Erstes Element</InputLabel>
              <Select
                style={{ width: "100%" }}
                //autoWidth
                value={this.state.first}
                onChange={event => {
                  this.setState({ first: event.target.value });
                }}
                inputProps={{
                  name: "size",
                  id: "box-size"
                }}
              >
                <MenuItem value={false}>Normales Element</MenuItem>
                <MenuItem
                  className={
                    this.state.displaySize === 2
                      ? classes.display1
                      : classes.display
                  }
                  value={true}
                >
                  Erstes Element
                </MenuItem>
              </Select>
              <FormHelperText>
                Anzeige auf verschieden Feed Positionen
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ border: "solid 0px blue", textAlign: "center" }}
          >
            <div
              style={{
                border: "solid 0px yellow",
                height: this.state.first
                  ? boxSizeY[this.state.displaySize] * 2
                  : boxSizeY[this.state.displaySize],
                width: this.state.first
                  ? boxSizeY[this.state.displaySize] * 2
                  : boxSizeY[this.state.displaySize],
                margin: "auto"
              }}
            >
              <Box
                first={this.state.first}
                data={this.state.tmpContentHead}
                size={this.state.displaySize}
                onClick={tmpContentHead => {}}
              />
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            style={{ padding: "15px", marginTop: "10px" }}
            onClick={() => {
              this.setState({ stateOfDialog: PICK_PICTURE });
            }}
          >
            Bild verändern
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            style={{ padding: "15px", marginTop: "10px" }}
            onClick={() => {
              this.setState({ stateOfDialog: PICK_CONTENT_GROUP });
            }}
          >
            Gruppenzugehörigkeit
          </Button>
        </Grid>
      </Grid>
    );
  };

  /**rendert die Inputs die an "renderGrid()" angezeigt werden */
  getInputContent = () => {
    return (
      <React.Fragment>
        <TextField
          fullWidth
          variant="outlined"
          label="Überschrift"
          value={this.state.tmpContentHead.name}
          onChange={event => {
            this.setState({
              tmpContentHead: {
                ...this.state.tmpContentHead,
                name: event.target.value
              }
            });
          }}
        />
        <TextField
          fullWidth
          style={{ marginTop: "10px" }}
          variant="outlined"
          label="Beschriftung"
          value={this.state.tmpContentHead.beschreibung}
          onChange={event => {
            this.setState({
              tmpContentHead: {
                ...this.state.tmpContentHead,
                beschreibung: event.target.value
              }
            });
          }}
        />
        <Collapse in={this.state.displayDate} style={{ width: "100%" }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              //disableToolbar
              //variant="inline"
              style={{
                margin: 0,
                marginTop: 10,
                width: "100%",
                border: "solid 0px red"
              }}
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Datum"
              value={this.state.date}
              onChange={(eventDate, eventString) => {
                var t = false;
                if (eventDate !== null) {
                  if (!isNaN(eventDate.getTime())) {
                    t = true;
                  }
                }
                this.setState({
                  date: eventDate,
                  tmpContentHead: {
                    ...this.state.tmpContentHead,
                    date: t
                      ? eventDate.toISOString().substring(0, 10)
                      : this.state.tmpContentHead.date
                  }
                });
              }}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        </Collapse>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            this.setState({
              displayDate: !this.state.displayDate,
              tmpContentHead: {
                ...this.state.tmpContentHead,
                date: !this.state.displayDate
                  ? this.props.contentHead.date === "0000-00-00"
                    ? new Date()
                    : new Date(this.props.contentHead.date)
                  : "0000-00-00"
              }
            });
          }}
          style={{ marginTop: 10, padding: 15 }}
        >
          {this.state.displayDate ? "Datum Entfernen" : "Datum Hinzufügen"}
        </Button>
        <FormControl
          style={{ width: "100%", marginTop: 10, border: "solid 0px red" }}
        >
          <InputLabel htmlFor="rank-id">Rang</InputLabel>
          <Select
            style={{ width: "100%" }}
            value={this.state.tmpContentHead.rank}
            onChange={event => {
              this.setState({
                tmpContentHead: {
                  ...this.state.tmpContentHead,
                  rank: event.target.value
                }
              });
            }}
            inputProps={{
              name: "rank",
              id: "rank-id"
            }}
          >
            <MenuItem value={0}>Alle</MenuItem>
            <MenuItem value={1}>Mitglieder</MenuItem>
            <MenuItem value={2}>Beirat</MenuItem>
            <MenuItem value={3}>Vorsitzender/Admin</MenuItem>
          </Select>
          <FormHelperText>
            Mitglieder welchen Ranges sollen Zugriff haben
          </FormHelperText>
        </FormControl>
      </React.Fragment>
    );
  };

  renderChooseContentGroups = () => {
    if (this.state.contentGroups) {
      return (
        <React.Fragment>
          <List
            subheader={
              <ListSubheader component="div" id="group">
                Wähle Gruppen aus
              </ListSubheader>
            }
            className={this.props.classes.root}
            component="nav"
          >
            <div style={{ padding: "10px", paddingTop: 0, paddingBottom: 5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  this.setState({ stateOfDialog: EDIT_CONTENTHEAD });
                }}
                style={{ padding: "10px" }}
              >
                Zurück
              </Button>
            </div>
            <ListItem
              button
              onClick={() => {
                this.setState({
                  choosenContentGroups:
                    this.state.choosenContentGroups.length !==
                    this.state.contentGroups.length
                      ? this.state.contentGroups.map(value => {
                          return value.GroupID;
                        })
                      : []
                });
              }}
            >
              <ListItemText
                primary={
                  this.state.choosenContentGroups.length !==
                  this.state.contentGroups.length
                    ? "Alle Wählen"
                    : "Alle Abwählen"
                }
              />
            </ListItem>
            {this.state.contentGroups.map((value, index) => {
              return (
                <ListItem key={index}>
                  <ListItemText primary={value.name} />
                  <Checkbox
                    checked={this.state.choosenContentGroups.includes(
                      value.GroupID
                    )}
                    onChange={event => {
                      if (event.target.checked) {
                        this.setState({
                          choosenContentGroups: this.state.choosenContentGroups
                            .concat(value.GroupID)
                            .sort()
                        });
                      } else {
                        this.setState({
                          choosenContentGroups: this.state.choosenContentGroups.filter(
                            value1 => {
                              return value1 !== value.GroupID;
                            }
                          )
                        });
                      }
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </React.Fragment>
      );
    } else {
      postRequest(
        "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/ContentGroup/getGroups.php",
        this.props.user,
        { ContentID: this.props.contentHead.ContentID },
        response => {
          if (response.data.success) {
            response.data.groupsOfContent.sort();
            this.setState({
              contentGroups: response.data.groups,
              choosenContentGroups: response.data.groupsOfContent,
              choosenContentGroupsCopy: this.bestCopyEver(
                response.data.groupsOfContent
              )
            });
          }
        }
      );
      return (
        <div style={{ textAlign: "center", padding: 20 }}>
          <CircularProgress />
        </div>
      );
    }
  };
}

tmpContentHeadDialog.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(tmpContentHeadDialog)));
