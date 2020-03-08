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

import PictureGroupDialogContent from "./PictureGroupDialogContent";

import Search from "@material-ui/icons/Search";

import PublishIcon from "@material-ui/icons/Publish";

import { withRouter } from "react-router-dom";

import { postRequest, postUploadPicture } from "../../../actions.js";

import React from "react";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  wrapper: {
    //border: "solid 2px red",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    },
    [theme.breakpoints.up("xs")]: {
      width: "306px"
    },
    [theme.breakpoints.up("sm")]: {
      width: "525px"
    },
    [theme.breakpoints.up("md")]: {
      width: "810px"
    }
  },
  newPicture: {
    padding: 15,
    paddingTop: 10
  },
  newPicture1: {
    padding: 15
  },
  newLink: {
    padding: 10,
    paddingTop: 5
  },
  newLink1: {
    padding: "0px 5px"
  },
  padding: {
    padding: 15
  },
  media: {
    "background-image": "url(https://picsum.photos/1000/500)",
    "background-repeat": "no-repeat",
    "background-size": "100%"
  },
  beschreibung: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%"
  },
  card: {
    maxHeight: 300,
    width: "100%",
    overflow: "hidden",
    "text-align": "center",
    color: "white"
  },
  hiddenInput: {
    width: "0.1px",
    height: "0.1px",
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    "z-index": -1
  },
  labelButton: {
    //theme.Button
  }
});
const EMPTY_PICTURE_START = 0;
const OWNPICTURE_START = 1;
const LINK_START = 2;
const CHOOSE_PICTURE = 3;
const UPLOAD_PICTURE = 4;
const CHOOSE_GROUP = 5;

class PictureDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateOfDialog: props.stateOfDialog,
      link: props.stateOfDialog === 0 ? props.pictureContent.content : "",
      getloadingErrorPicure: true,
      extendInfo: false,
      pictureLoaded: false,
      pictureList: null,
      imgSearch: "",
      pictureChange: false,
      newPicture: null,
      uploadReady: false,
      uploadName: "",
      uploadType: "",
      uploadFile: null,
      uploadImageSrc: "",
      uploadWidth: "",
      uploadHeight: "",
      progress: -1,
      linkReady: false,
      uploadError: false,
      uploadErrorText: "",
      pictureGroups: null,
      choosenPictureGroup: null
    };
  }

  renderDialogContent = () => {
    if (EMPTY_PICTURE_START === this.state.stateOfDialog) {
      return this.renderEmptyPictureStart();
    }
    if (OWNPICTURE_START === this.state.stateOfDialog) {
      return this.renderOwnPictureStart();
    }
    if (LINK_START === this.state.stateOfDialog) {
      return this.renderEmptyPictureStart();
    }
    if (CHOOSE_PICTURE === this.state.stateOfDialog) {
      return this.renderChoosePicture();
    }
    if (UPLOAD_PICTURE === this.state.stateOfDialog) {
      return this.renderUploadPicture();
    }
    if (CHOOSE_GROUP === this.state.stateOfDialog) {
      return this.renderChooseGroup();
    }
  };

  /**rendert den Dialog wenn kein Bild oder ein Bild Von einer anderen Quelle ausgewählt ist. */
  renderEmptyPictureStart = () => {
    const { classes } = this.props;
    return (
      <div style={{ padding: "8px 5px" }}>
        <div className={classes.newPicture}>
          <Button
            onClick={() => {
              this.setState({
                stateOfDialog: CHOOSE_PICTURE
              });
            }}
            className={classes.newPicture1}
            fullWidth
            variant="outlined"
          >
            Bild Auswählen
          </Button>
        </div>
        <Divider style={{ margin: "0px 15px" }} />
        <div className={classes.newLink}>
          <div className={classes.newLink1}>
            <Typography variant="caption">Bildlink einfügen</Typography>
            <TextField
              value={this.state.link}
              onChange={event => {
                this.setState({
                  link: event.target.value,
                  getloadingErrorPicure: true
                });
              }}
              variant="outlined"
              fullWidth
            >
              Wähle Bild
            </TextField>
          </div>
          <Collapse in={!this.state.getloadingErrorPicure}>
            <div style={{ paddingTop: "10px" }}>
              <img
                style={{ verticalAlign: "middle" }}
                onLoad={() => {
                  this.setState({ getloadingErrorPicure: false });
                }}
                onError={() => {
                  this.setState({ getloadingErrorPicure: true });
                }}
                id="myImg"
                width="100%"
                src={this.state.link}
                alt={this.props.pictureContent.name}
              />
            </div>
          </Collapse>
        </div>
      </div>
    );
  };

  /**rendert den Dialog wenn schon ein Bild vorhanden ist das im iamge Ordner gespeichert ist  */
  renderOwnPictureStart = () => {
    const { classes } = this.props;
    const displayedPicture = !this.state.pictureChange
      ? this.props.pictureContent
      : this.state.newPicture;
    return (
      <React.Fragment>
        <ButtonBase
          style={{
            width: "100%",
            verticalAlign: "middle"
          }}
          onClick={() => {
            this.setState({ extendInfo: !this.state.extendInfo });
          }}
        >
          <img
            id="myImg"
            width="100%"
            src={displayedPicture.content}
            alt={displayedPicture.name}
          />
        </ButtonBase>
        <div style={{ padding: 5 }}>
          <div style={{ padding: "0px 10px", paddingBottom: "0px" }}>
            <Collapse in={this.state.extendInfo}>
              {" "}
              <Typography variant="caption">
                name:{displayedPicture.name}
                <br />
                pictureID:{displayedPicture.pictureID}
                <br />
                width:{displayedPicture.width}px
                <br />
                height:{displayedPicture.height}px
                <br />
                date:{displayedPicture.date}px
                <br />
                <a href={displayedPicture.content}>link</a>
                <br />
              </Typography>
            </Collapse>
          </div>
          <div className={classes.newPicture}>
            <Button
              onClick={() => {
                this.setState({
                  stateOfDialog: CHOOSE_PICTURE
                });
              }}
              className={classes.newPicture1}
              fullWidth
              variant="outlined"
            >
              Bild Ändern
            </Button>
          </div>

          <Divider />
          <div style={{ padding: 15, paddingBottom: 10 }}>
            <Button
              onClick={() => {
                this.setState({
                  stateOfDialog: EMPTY_PICTURE_START,
                  pictureChange: false,
                  newPicture: null
                });
              }}
              className={classes.newPicture1}
              fullWidth
              variant="outlined"
            >
              Link Einfügen
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderChoosePicture = () => {
    const { classes } = this.props;

    const pictureChoosen = index => {
      this.setState({
        pictureChange: true,
        newPicture: this.state.pictureList[index],
        stateOfDialog: OWNPICTURE_START,
        pictureGroups: null,
        choosenPictureGroup: null
      });
    };
    const renderPictureList = () => {
      return (
        <Grid container>
          {this.state.pictureList.map((value, index) => {
            if (
              value.name
                .toUpperCase()
                .search(this.state.imgSearch.toUpperCase()) !== -1 &&
              (this.state.choosenPictureGroup === null ||
                -1 !==
                  this.state.choosenPictureGroup.gruppenmitglieder.findIndex(
                    value1 => {
                      return value.pictureID === value1;
                    }
                  ))
            ) {
              return (
                <Grid
                  key={index}
                  xs={12}
                  sm={6}
                  item
                  style={{ padding: "0px 5px", paddingBottom: 10 }}
                >
                  <ButtonBase
                    style={{
                      position: "relative",
                      display: "block",
                      width: "100%"
                    }}
                    onClick={() => {
                      pictureChoosen(index);
                    }}
                  >
                    <Card className={classes.card}>
                      <Typography style={{ color: "black" }} variant="h5">
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
                    </Card>
                  </ButtonBase>
                </Grid>
              );
            } else return null;
          })}
        </Grid>
      );
    };

    if (this.state.pictureList) {
      return (
        <div style={{ padding: 15, paddingBottom: 5 }}>
          <Button
            onClick={() => {
              this.setState({
                stateOfDialog: UPLOAD_PICTURE,
                pictureGroups: null,
                choosenPictureGroup: null
              });
            }}
            fullWidth
            variant="outlined"
            style={{ padding: 15 }}
          >
            <PublishIcon />
            Upload
          </Button>
          <Divider style={{ margin: "10px 0px" }} />
          <Button
            onClick={() => {
              this.setState({ stateOfDialog: CHOOSE_GROUP });
            }}
            fullWidth
            variant="outlined"
            style={{ padding: 15, marginBottom: 10 }}
          >
            Nach Gruppe Sortieren
          </Button>
          <TextField
            fullWidth
            variant="outlined"
            style={{ paddingBottom: 10 }}
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
          {this.state.choosenPictureGroup !== null ? (
            <Typography variant="overline" style={{ margin: "0px 10px" }}>
              Gruppe:{this.state.choosenPictureGroup.name}
            </Typography>
          ) : null}
          <div>{renderPictureList()}</div>
        </div>
      );
    } else {
      postRequest(
        "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/getPictures.php",
        this.props.user,
        "!",
        response => {
          if (response.data.success) {
            this.setState({
              pictureList: response.data.pictures
            });
          } else {
            this.setState({
              stateOfDialog: OWNPICTURE_START
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

  renderUploadPicture = () => {
    const { classes } = this.props;
    const onChange = event => {
      const reader = new FileReader();
      reader.onload = (file => {
        return e => {
          console.log(new Date(file.lastModified));
          const img = new Image();
          img.onload = () => {
            console.log(img.date);
            const tmp = file.name.split(".", 2);
            const date = new Date(file.lastModified);
            console.log(date.toISOString().substring(0, 10));
            this.setState({
              uploadName: tmp[0],
              uploadType: tmp[1],
              uploadFile: file,
              uploadImageSrc: e.target.result,
              uploadWidth: img.width,
              uploadHeight: img.height,
              pictureDate: date.toISOString().substring(0, 10)
            });
          };
          img.src = e.target.result;
        };
      })(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    };

    return (
      <div className={classes.padding}>
        <input
          type="file"
          name="file"
          id="file"
          accept="image/*"
          className={classes.hiddenInput}
          onChange={onChange}
        />

        <Collapse in={this.state.uploadReady}>
          <div style={{ marginBottom: 7 }}>
            <TextField
              style={{ marginBottom: "7px" }}
              variant="outlined"
              fullWidth
              label="Name des Bildes"
              value={this.state.uploadName}
              onChange={event => {
                const regex = /^[\w-]*$/;
                if (regex.test(event.target.value)) {
                  this.setState({ uploadName: event.target.value });
                }
              }}
            />
            <img
              width="100%"
              id="!"
              onLoad={() => {
                this.setState({ uploadReady: true });
              }}
              src={this.state.uploadImageSrc}
              alt="!"
            />
            <Typography variant="caption">
              name:{this.state.uploadName}
            </Typography>
            <br />
            <Typography variant="caption">
              datatype:{this.state.uploadType}
            </Typography>
            <br />
            <Typography variant="caption">
              width:{this.state.uploadWidth}px
            </Typography>
            <br />
            <Typography variant="caption">
              height:{this.state.uploadHeight}px
            </Typography>
            <br />
            <Typography variant="caption">
              date:{this.state.pictureDate}
            </Typography>
            <br />
          </div>
        </Collapse>

        <Button
          style={{ padding: 15 }}
          variant="outlined"
          fullWidth
          onClick={() => {
            var x = document.getElementById("file");
            x.click();
          }}
        >
          Wähle Bild
        </Button>
        <Collapse in={this.state.uploadReady && this.state.uploadName !== ""}>
          {this.state.progress === -1 ? (
            <Divider style={{ marginTop: 15 }} />
          ) : (
            <React.Fragment>
              <LinearProgress
                style={{ marginTop: 15 }}
                variant="determinate"
                value={this.state.progress}
              />
            </React.Fragment>
          )}
          <Button
            style={{ padding: 15, marginTop: "15px" }}
            variant="outlined"
            fullWidth
            onClick={() => {
              this.setState({
                uploadError: false,
                uploadErrorText: ""
              });
              postUploadPicture(
                this.props.user,
                this.state.uploadFile,
                this.state.uploadName,
                this.state.uploadType,
                this.state.uploadImageSrc,
                this.state.uploadWidth,
                this.state.uploadHeight,
                this.state.pictureDate,
                response => {
                  if (response.data.success) {
                    this.setState({
                      stateOfDialog: CHOOSE_PICTURE,
                      pictureList: null,
                      imgSearch: "",
                      pictureChange: false,
                      newPicture: null,
                      uploadReady: false,
                      uploadName: "",
                      uploadType: "",
                      uploadFile: null,
                      uploadImageSrc: "",
                      uploadWidth: "",
                      uploadHeight: "",
                      progress: -1,
                      linkReady: false,
                      uploadError: false,
                      uploadErrorText: ""
                    });
                  } else {
                    this.setState({
                      progress: -1,
                      uploadError: true,
                      uploadErrorText: response.data.errortext
                    });
                  }
                },
                progress => {
                  this.setState({ progress: progress });
                }
              );
              this.setState({ progress: 0 });
            }}
          >
            <PublishIcon />
            Upload
          </Button>
        </Collapse>
        <Collapse in={this.state.uploadError}>
          <Card
            style={{
              textAlign: "center",
              backgroundColor: "red",
              color: "white",
              padding: "15px",
              marginTop: "10px"
            }}
          >
            <Typography variant="button">
              {this.state.uploadErrorText}
            </Typography>
          </Card>
        </Collapse>
      </div>
    );
  };

  renderChooseGroup = () => {
    return (
      <PictureGroupDialogContent
        user={this.props.user}
        pictureList={this.state.pictureList}
        pictureGroups={this.state.pictureGroups}
        backUpGroups={Groups => {
          this.setState({ pictureGroups: Groups });
        }}
        pickedGroup={this.state.choosenPictureGroup}
        handleGroupPick={value => {
          this.setState({
            choosenPictureGroup: value,
            stateOfDialog: CHOOSE_PICTURE
          });
        }}
      />
    );
  };

  changeSave = () => {
    if (this.state.stateOfDialog === OWNPICTURE_START) {
      this.props.changeSave(
        2,
        this.props.pictureContent.reihenfolge,
        this.state.newPicture
      );
    }
    if (this.state.stateOfDialog === EMPTY_PICTURE_START) {
      this.props.changeSave(
        3,
        this.props.pictureContent.reihenfolge,
        this.state.link
      );
    }
    this.props.onClose();
  };

  //render methode
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          scroll="body"
          maxWidth="sm"
          fullWidth
          open={this.props.open}
          onClose={this.props.onClose}
          onExited={() => {
            this.setState({
              stateOfDialog: this.props.stateOfDialog,
              link:
                this.props.stateOfDialog === 0
                  ? this.props.pictureContent.content
                  : "",
              getloadingErrorPicure: true,
              extendInfo: false,
              pictureLoaded: false,
              pictureList: null,
              imgSearch: "",
              pictureChange: false,
              newPicture: null,
              uploadReady: false,
              uploadName: "",
              uploadType: "",
              uploadFile: null,
              uploadImageSrc: "",
              uploadWidth: "",
              uploadHeight: "",
              progress: -1,
              linkReady: false,
              uploadError: false,
              uploadErrorText: "",
              pictureGroups: null,
              choosenPictureGroup: null
            });
          }}
        >
          <Collapse
            in={
              ((this.state.pictureChange &&
                this.state.newPicture.pictureID !==
                  this.props.pictureContent.pictureID) ||
                (this.state.getloadingErrorPicure === false &&
                  this.state.link !== this.props.pictureContent.content)) &&
              (this.state.stateOfDialog === OWNPICTURE_START ||
                this.state.stateOfDialog === EMPTY_PICTURE_START)
            }
            style={{
              backgroundColor: "green"
            }}
          >
            <ButtonBase
              onClick={this.changeSave}
              style={{
                width: "100%",
                backgroundColor: "green",
                color: "white",
                height: "45px"
              }}
            >
              <Typography variant="button">Hinzufügen</Typography>
            </ButtonBase>
          </Collapse>
          <div>{this.renderDialogContent()}</div>
        </Dialog>
      </div>
    );
  }
}

PictureDialog.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PictureDialog)));
