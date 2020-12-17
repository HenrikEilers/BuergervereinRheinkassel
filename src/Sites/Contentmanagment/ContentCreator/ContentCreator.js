import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  InputBase,
  Typography,
  ButtonBase,
  CircularProgress,
  Collapse,
  Button,
  Zoom,
  Paper,
  Grid,
  ClickAwayListener,
  Dialog
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import Clear from "@material-ui/icons/Clear";

import SubjectIcon from "@material-ui/icons/Subject";
import PhotoIcon from "@material-ui/icons/Photo";
import LinkIcon from "@material-ui/icons/Link";
import YouTubeIcon from "@material-ui/icons/YouTube";
import GetAppIcon from "@material-ui/icons/GetApp";
import TextFieldsIcon from "@material-ui/icons/TextFields";

import ImageSearchIcon from "@material-ui/icons/ImageSearch";

import { withRouter } from "react-router-dom";

import ContentDisplayer from "../../../CommonComponents/ContentDisplayer/ContentDisplayer";

import PictureDialog from "./ContentTypes/Picture/PictureDialog";
import ContentHeadDialog from "./tmpContentHeadDialog";

import { postRequest } from "../../../actions.js";

import Link from "./ContentTypes/Link/Link.js";
import Picture from "./ContentTypes/Picture/Picture.js";
import Text from "./ContentTypes/Text/Text.js";
import Headline from "./ContentTypes/Headline/Headline.js";
import Download from "./ContentTypes/Download/Download.js";

import React from "react";

const styles = (theme) => ({
  wrapper: {
    //border: "solid 2px red",
    //paddingTop: "10px",
    [theme.breakpoints.up("xs")]: {
      width: "90%",
      margin: "auto"
    },
    [theme.breakpoints.up("sm")]: {
      width: "525px",
      margin: "auto"
    },
    [theme.breakpoints.up("md")]: {
      width: "810px"
    }
  },
  inputTextContent: {
    htmlFontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontSize: "1rem",
    lineHeight: 1.5,
    letterSpacing: "0.00938em"
  },
  inputTextContent1: {
    "white-space": "pre"
  },
  captionImg: {
    ...theme.typography.caption,
    "text-decoration": "none",
    color: theme.palette.grey.A700
  },
  p: {
    //border: "solid 2px black",
    "text-align": "justify",
    textAlignLast: "center"
  },
  link: {
    color: "blue",
    "&:hover": {
      textDecoration: "underline"
    }
  },
  fab: {
    margin: theme.spacing(1)
    //backgroundColor:theme.palette.primary.light
  },
  buttonBase: {
    filter: "opacity(0.25)"
  },
  addButton: {
    color: "grey",
    padding: 25
  },
  menuPick: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    width: "90px",
    height: "90px"
  },
  labelNewContent: {
    position: "absolute",
    bottom: 3,
    left: "50%",
    transform: "translate(-50%,0)"
  },
  beschreibungText: {
    textAlign: "justify",
    textAlignLast: "center",
    ...theme.typography.overline,
    lineHeight: 1.66
  },
  beschreibungTextRoot: {
    display: "inline"
  },
  ueberschrift: {
    paddingTop: 10,
    ...theme.typography.h2,
    textAlign: "center"
  }
});
const TEXT_CONTENT = 1;
const NATIVE_IMAGE_CONTENT = 2;
const LINKED_IMAGE_CONTENT = 3;
const LINK_CONTENT = 4;
const VIDEO_CONTENT = 5;
const HEADLINE_CONTENT = 6;
const DOWNLOAD_CONTENT = 7;

class ContentCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errortext: "",
      contentHead: this.props.contentHead,
      lastUpdated: null,
      contentBody: [],
      safeContentBody: [],
      pictureDialogOpen: false,
      pictureDialogIndex: -1,
      siteLoaded: this.props.contentHead.ContentID === -1 ? true : false,
      loadingError: this.props.contentHead.ContentID < -1 ? true : false,
      loadingErrorText:
        this.props.contentHead.ContentID === -2
          ? "Sie sind nicht angemeldet"
          : this.props.contentHead.ContentID === -3
          ? "Das gesuchte Content Element Existiert nicht"
          : "",
      openLinkDialog: -1,
      hasToSave: false,
      onChangeElements: this.props.contentHead.ContentID === -1 ? true : false,
      tmpLinkName: "",
      tmpLink: "",
      tmpParagraph: false,
      openContentHeadDialog: false,
      choosenContentGroups: null,
      test: true
    };
  }

  /**hasToSave überprüft ob sich der Content im ContentCreator verändert hat
   * im vergleich zu dem Content der im Contentmanger hinterlegt ist.
   * Gib Wahrheits wert zurück
   */

  compareObject = (object1, object2) => {
    for (const [prop, value] of Object.entries(object1)) {
      if (typeof value === "object" && value !== null) {
        if (this.compareObject(value, object2[prop]) === true) {
          return true;
        }
      } else {
        if (value !== object2[prop]) {
          return true;
        }
      }
    }
    return false;
  };

  hasToSave = () => {
    //Die verplichteten Felder sind nicht Ausgefüllt
    if (
      this.state.contentHead.name === "" ||
      this.state.contentHead.pictureID === "" ||
      this.state.contentHead.ueberschrift === "" ||
      this.state.contentHead.imgcontent === "none"
    ) {
      return false;
    }

    //ContentHeadDialog is offen
    if (this.state.openContentHeadDialog) {
      return false;
    }

    //Die Content Gruppe hat sich verändert
    if (this.state.choosenContentGroups !== null) {
      return true;
    }

    //Länge des Contentbody hat sich verändern
    if (this.state.contentBody.length !== this.state.safeContentBody.length) {
      return true;
    }

    //is Contentbody verändert worden
    for (let index in this.state.contentBody) {
      if (
        this.compareObject(
          this.state.contentBody[index],
          this.state.safeContentBody[index]
        )
      ) {
        return true;
      }
    }

    //Ist der ContentHead verändert werden
    if (this.compareObject(this.state.contentHead, this.props.contentHead)) {
      return true;
    }
    return false;
  };

  /**erstellt Kopie von Objekten */
  bestCopyEver = (src) => {
    return JSON.parse(JSON.stringify(src));
  };

  /** fügt Contenthead veränderung ,die in ContentHeadDialog
   *  gemacht werden dem state von ContentCreator hinzu */
  addToContentHead = (tmpContentHead, date, choosenContentGroups) => {
    this.setState({
      contentHead: tmpContentHead,
      choosenContentGroups: choosenContentGroups
    });
  };

  /**fügt neues ContentBodyElement  ein */
  addToBody = (index) => {
    const emptyElement = {
      ContentID: this.props.contentHead.ContentID,
      ContentBodyID: -1,
      ContentTypeID: -1,
      content: "",
      reihenfolge: index,
      name: "Nicht Hinzugefügt",
      imgcontent: null,
      pictureID: 0,
      width: null,
      height: null,
      LinkID: 0,
      displayed: "",
      link: "",
      paragraph: false,
      fileID: -1,
      fileName: "",
      filePath: "",
      fileRank: "",
      fileDisplayed: "",
      fileParagraph: false
    };
    var tmpContentBody = this.state.contentBody;
    tmpContentBody.splice(index + 1, 0, emptyElement);
    tmpContentBody = tmpContentBody.map((value, index) => {
      value.reihenfolge = index;
      return value;
    });
    this.setState({
      contentBody: tmpContentBody
    });
  };

  /**löscht ContentBodyElement */
  deleteFromBody = (index) => {
    var tmpContentBody = this.state.contentBody;
    tmpContentBody.splice(index, 1);
    tmpContentBody = tmpContentBody.map((value, index) => {
      value.reihenfolge = index;
      return value;
    });
    this.setState({
      contentBody: tmpContentBody
    });
  };

  /** rendert eine Auswahl menü das einem ermöglicht
   *  zu bestimmen welche art von content hinzugefügt
   *  werden sollte */

  pickContent = (index) => {
    return (
      <div style={{ margin: "10px 0px" }}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <div style={{ position: "relative" }}>
              <ButtonBase
                onClick={() => {
                  const tmpContentBody = this.state.contentBody;
                  tmpContentBody[index].ContentTypeID = HEADLINE_CONTENT;
                  this.setState({ contentBody: tmpContentBody });
                }}
              >
                <Paper
                  square
                  elevation={10}
                  className={this.props.classes.menuPick}
                >
                  <TextFieldsIcon style={{ width: "50px", height: "100%" }} />
                  <Typography
                    className={this.props.classes.labelNewContent}
                    variant="caption"
                  >
                    Überschrift
                  </Typography>
                </Paper>
              </ButtonBase>
            </div>
          </Grid>
          <Grid item>
            <div style={{ position: "relative" }}>
              <ButtonBase
                onClick={() => {
                  const tmpContentBody = this.state.contentBody;
                  tmpContentBody[index].ContentTypeID = 1;
                  this.setState({ contentBody: tmpContentBody });
                }}
              >
                <Paper
                  square
                  elevation={10}
                  className={this.props.classes.menuPick}
                >
                  <SubjectIcon style={{ width: "50px", height: "100%" }} />
                  <Typography
                    className={this.props.classes.labelNewContent}
                    variant="caption"
                  >
                    Text
                  </Typography>
                </Paper>
              </ButtonBase>
            </div>
          </Grid>
          <Grid item>
            <div style={{ position: "relative" }}>
              <ButtonBase
                onClick={() => {
                  const tmpContentBody = this.state.contentBody;
                  tmpContentBody[index].ContentTypeID = 3;
                  this.setState({ contentBody: tmpContentBody });
                }}
              >
                <Paper
                  square
                  elevation={10}
                  className={this.props.classes.menuPick}
                >
                  <PhotoIcon style={{ width: "50px", height: "100%" }} />
                  <Typography
                    className={this.props.classes.labelNewContent}
                    variant="caption"
                  >
                    Bild
                  </Typography>
                </Paper>
              </ButtonBase>
            </div>
          </Grid>

          <Grid item>
            <div style={{ position: "relative" }}>
              <ButtonBase
                onClick={() => {
                  const tmpContentBody = this.state.contentBody;
                  tmpContentBody[index].ContentTypeID = 4;
                  this.setState({ contentBody: tmpContentBody });
                }}
              >
                <Paper
                  square
                  elevation={10}
                  className={this.props.classes.menuPick}
                >
                  <LinkIcon style={{ width: "50px", height: "100%" }} />
                  <Typography
                    className={this.props.classes.labelNewContent}
                    variant="caption"
                  >
                    Link
                  </Typography>
                </Paper>
              </ButtonBase>
            </div>
          </Grid>
          <Grid item>
            <div style={{ position: "relative" }}>
              <ButtonBase
                onClick={() => {
                  const tmpContentBody = this.state.contentBody;
                  tmpContentBody[index].ContentTypeID = DOWNLOAD_CONTENT;
                  this.setState({ contentBody: tmpContentBody });
                }}
              >
                <Paper
                  square
                  elevation={10}
                  className={this.props.classes.menuPick}
                >
                  <GetAppIcon style={{ width: "50px", height: "100%" }} />
                  <Typography
                    className={this.props.classes.labelNewContent}
                    variant="caption"
                  >
                    Download
                  </Typography>
                </Paper>
              </ButtonBase>
            </div>
          </Grid>
          <Grid item>
            <div style={{ position: "relative" }}>
              <ButtonBase
                onClick={() => {
                  const tmpContentBody = this.state.contentBody;
                  tmpContentBody[index].ContentTypeID = 5;
                  this.setState({ contentBody: tmpContentBody });
                }}
                disabled
                classes={{ disabled: this.props.classes.buttonBase }}
              >
                <Paper
                  square
                  elevation={10}
                  className={this.props.classes.menuPick}
                >
                  <YouTubeIcon style={{ width: "50px", height: "100%" }} />
                  <Typography
                    className={this.props.classes.labelNewContent}
                    variant="caption"
                  >
                    Video
                  </Typography>
                </Paper>
              </ButtonBase>
            </div>
          </Grid>

          <Grid item>
            <ButtonBase
              onClick={() => {
                this.deleteFromBody(index);
              }}
            >
              <Paper
                square
                elevation={10}
                style={{
                  color: "white",
                  backgroundColor: "red",
                  width: "90px",
                  height: "90px"
                }}
              >
                <Clear style={{ width: "50px", height: "100%" }} />
              </Paper>
            </ButtonBase>
          </Grid>
        </Grid>
      </div>
    );
  };

  changeContentPiece = (value, index) => {
    const tmpContentBody = this.state.contentBody;
    tmpContentBody[index] = value;
    this.setState({ contentBody: tmpContentBody });
  };

  /** rendert den ConentBodyEditor. Hier wird zwischen den verschiedenen
   *  ContentArten unterschieden und sie werden in unterschiedlichen
   *  Methoden gerendert */
  renderContentBody = () => {
    return this.state.contentBody.map((value, index) => {
      var re = null;
      if (value.ContentTypeID === TEXT_CONTENT)
        re = (
          <Text
            onChangeElements={this.state.onChangeElements}
            text={value}
            changeContentPiece={(value) =>
              this.changeContentPiece(value, index)
            }
          />
        );
      if (
        value.ContentTypeID === NATIVE_IMAGE_CONTENT ||
        value.ContentTypeID === LINKED_IMAGE_CONTENT
      )
        re = (
          <Picture
            user={this.props.user}
            onChangeElements={this.state.onChangeElements}
            picture={value}
            changeContentPiece={(value) =>
              this.changeContentPiece(value, index)
            }
          />
        );
      //if (value.ContentTypeID === LINK_CONTENT) re = this.renderLink(index);
      if (value.ContentTypeID === LINK_CONTENT)
        re = (
          <Link
            onChangeElements={this.state.onChangeElements}
            link={value}
            changeContentPiece={(value) =>
              this.changeContentPiece(value, index)
            }
          />
        );
      if (value.ContentTypeID === VIDEO_CONTENT) re = this.renderVideo(index);
      if (value.ContentTypeID === HEADLINE_CONTENT)
        re = (
          <Headline
            onChangeElements={this.state.onChangeElements}
            headline={value}
            changeContentPiece={(value) =>
              this.changeContentPiece(value, index)
            }
          />
        );
      if (value.ContentTypeID === DOWNLOAD_CONTENT)
        re = (
          <Download
            user={this.props.user}
            onChangeElements={this.state.onChangeElements}
            file={value}
            changeContentPiece={(value) => {
              this.changeContentPiece(value, index);
            }}
          />
        );

      return (
        <div
          key={index}
          style={{ margin: "15px 0px", marginTop: index === 0 ? 5 : 15 }}
        >
          {value.ContentTypeID !== -1 ? (
            <div
              style={{
                position: "relative",
                minHeight: this.state.onChangeElements ? 110 : 0,
                display: "-webkit-flex",
                alignItems: "center",
                WebkitAlignItems: "center",
                justifyContent: "center",
                WebkitJustifyContent: "center"
              }}
            >
              {re}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: this.state.onChangeElements ? "block" : "none"
                }}
              >
                <Zoom in={this.state.onChangeElements}>
                  <ButtonBase
                    onClick={() => {
                      this.deleteFromBody(index);
                    }}
                  >
                    <Paper
                      elevation={10}
                      style={{
                        color: "white",
                        backgroundColor: "red",
                        width: "100px",
                        height: "100px"
                      }}
                    >
                      <Clear style={{ width: "50px", height: "100%" }} />
                    </Paper>
                  </ButtonBase>
                </Zoom>
              </div>
            </div>
          ) : (
            this.pickContent(index)
          )}
          <Collapse in={this.state.onChangeElements}>
            <Paper
              elevation={10}
              style={{
                backgroundColor: "green",
                marginTop: 15
              }}
              color="primary"
              aria-label="add"
            >
              <ButtonBase
                onClick={() => {
                  this.addToBody(index);
                }}
                style={{
                  height: "100%",
                  display: "block",
                  width: "100%",
                  padding: "25px"
                }}
              >
                <AddIcon
                  style={{ color: "white", width: "40px", height: "100%" }}
                />
              </ButtonBase>
            </Paper>
          </Collapse>
        </div>
      );
    });
  };

  /**rendert ein Text ContentElement */
  renderText = (index) => {
    return (
      <React.Fragment key={index}>
        <InputBase
          disabled={this.state.onChangeElements}
          style={{ display: "inline", margin: 0, padding: 0 }}
          fullWidth
          multiline
          classes={{
            root: this.props.classes.inputTextContent,
            input: this.props.classes.p
          }}
          value={this.state.contentBody[index].content}
          onChange={(event) => {
            let tmp = this.state.contentBody;
            tmp[index].content = event.target.value;
            this.setState({ contentBody: tmp });
          }}
        />
      </React.Fragment>
    );
  };

  /**render ein Bild ContentElement und den PictureDialog
   *  um das Element verändern zu können */
  renderBild = (index) => {
    const renderCaption = () => {
      if (this.state.contentBody[index].content === "") {
        return null;
      }
      if (
        !this.state.contentBody[index].content.includes(
          "buergerverein-rheindoerfer.de"
        ) &&
        !this.state.contentBody[index].content.includes(
          "buergerverein-rheilaka.de"
        ) &&
        !this.state.onChangeElements
      ) {
        const tmpIndex =
          -1 !== this.state.contentBody[index].content.indexOf("www")
            ? this.state.contentBody[index].content.indexOf("www")
            : 8;
        const tmpDomain = this.state.contentBody[index].content.substring(
          tmpIndex
        );
        const tmpIndex1 = tmpDomain.indexOf("/");
        const tmpDomain1 = tmpDomain.substring(0, tmpIndex1);

        return (
          <Typography variant="caption">
            <a
              disabled={this.state.onChangeElements}
              className={this.props.classes.captionImg}
              href={this.state.contentBody[index].content}
            >
              Quelle:{tmpDomain1}
            </a>
          </Typography>
        );
      }
      return null;
    };

    return (
      <div key={index}>
        <ButtonBase
          disabled={this.state.onChangeElements}
          classes={{ disabled: this.props.classes.buttonBase }}
          onClick={() => {
            this.setState({
              pictureDialogOpen: true,
              pictureDialogIndex: index
            });
          }}
        >
          <div style={{ display: "-webkit-inline-flex" }}>
            {this.state.contentBody[index].content === "" ? (
              <Paper
                square
                style={{
                  width: "100px",
                  height: "100px"
                }}
              >
                <ImageSearchIcon style={{ width: "75px", height: "100%" }} />
              </Paper>
            ) : (
              <img
                style={{ display: "inline", height: "100%", width: "100%" }}
                src={this.state.contentBody[index].content}
                alt={this.state.contentBody[index].name}
                //height="auto"
                //width="100%"
              />
            )}
          </div>
        </ButtonBase>
        <div>{renderCaption()}</div>
        <PictureDialog
          pictureContent={this.state.contentBody[index]}
          changeSave={(value) => this.changeContentPiece(value, index)}
          open={
            this.state.pictureDialogOpen &&
            this.state.pictureDialogIndex === index
          }
          user={this.props.user}
          stateOfDialog={
            this.state.contentBody[index].ContentTypeID === 2
              ? "OWNPICTURE_START"
              : "EMPTY_PICTURE_START"
          }
          //stateOfDialog={1}
          onClose={() => {
            this.setState({ pictureDialogOpen: false, pictureDialogIndex: -1 });
          }}
        />
      </div>
    );
  };

  //TODO nach Datenschut fragen und den evtl wenn zeit und lust implementieren
  renderVideo = (value, index) => {};

  /** verändert den State so das der
   *  PictureDialog den Content anpassen kann
   *  sollte der Nutzer das wählen */
  changeSave = (ContentTypeID, index, newContent) => {
    if (ContentTypeID === 2) {
      const tmpContentBody = this.state.contentBody;
      tmpContentBody[index] = {
        ...tmpContentBody[index],
        ...newContent,
        ContentTypeID: ContentTypeID
      };
      this.setState({ contentBody: tmpContentBody });
    }
    if (ContentTypeID === 3) {
      const tmpContentBody = this.state.contentBody;
      tmpContentBody[index] = {
        ConetentID: tmpContentBody[index].ContentID,
        ContentBodyID: tmpContentBody[index].ContentBodyID,
        reihenfolge: tmpContentBody[index].reihenfolge,
        content: newContent,
        ContentTypeID: ContentTypeID
      };
      this.setState({ contentBody: tmpContentBody });
    }
  };

  /**onSave  ist zum speichern der Daten dar.
   * sendet einen Axios post request an den server um die Datenbank zu verändern */
  onSave = () => {
    const callback = (response) => {
      if (response.data.success) {
        this.props.updateContentHeads(response.data.obj.load.contentHead);
        this.setState({
          lastUpdated: null,
          contentBody: [],
          contentHead: response.data.obj.load.contentHead,
          pictureDialogOpen: false,
          pictureDialogIndex: -1,
          siteLoaded: false,
          loadingError: false,
          loadingErrorText: "",
          openLinkDialog: -1,
          hasToSave: false,
          onChangeElements: false,
          tmpLinkName: "",
          tmpLink: "",
          tmpParagraph: false,
          openContentHeadDialog: false,
          choosenContentGroups: null
        });

        if (
          this.props.location.pathname !==
          "/contentmanager/content_creator/" + this.state.contentHead.name
        ) {
          this.props.history.push(
            "/contentmanager/content_creator/" + this.state.contentHead.name
          );
        }
      } else {
        if (response.data.editConfict === undefined) {
          this.setState({
            loadingError: true,
            loadingErrorText: response.data.errortext
          });
        } else {
          this.setState({
            error: true,
            errortext: response.data.errortext
          });
        }
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/setContent.php",
      this.props.user,
      {
        lastUpdated: this.state.lastUpdated,
        contentHead: this.state.contentHead,
        contentBody: this.state.contentBody,
        choosenContentGroups: this.state.choosenContentGroups
      },
      callback
    );
  };

  renderEditMode = () => {
    return (
      <React.Fragment>
        <InputBase
          //fullWidth
          multiline
          classes={{
            root: this.props.classes.ueberschriftRoot,
            input: this.props.classes.ueberschrift
          }}
          placeholder="Überschrift"
          value={this.state.contentHead.ueberschrift}
          onChange={(event) => {
            this.setState({
              contentHead: {
                ...this.state.contentHead,
                ueberschrift: event.target.value
              }
            });
          }}
        />

        <InputBase
          //fullWidth
          multiline
          classes={{
            root: this.props.classes.beschreibungTextRoot,
            input: this.props.classes.beschreibungText
          }}
          placeholder="Beschreibung"
          value={this.state.contentHead.beschreibungText}
          onChange={(event) => {
            this.setState({
              contentHead: {
                ...this.state.contentHead,
                beschreibungText: event.target.value
              }
            });
          }}
        />

        <Collapse in={this.hasToSave() && !this.state.onChangeElements}>
          <Button
            fullWidth
            onClick={this.onSave}
            style={{
              backgroundColor: "green",
              color: "white",
              padding: 10,
              marginTop: 10
            }}
          >
            Seite Speichern
          </Button>
        </Collapse>
        <Collapse in={this.state.onChangeElements}>
          <Paper
            elevation={10}
            style={{
              marginTop: 10,
              backgroundColor: "green"
            }}
            color="primary"
            aria-label="add"
          >
            <ButtonBase
              onClick={() => {
                this.addToBody(-1);
              }}
              style={{
                height: "100%",
                display: "block",
                width: "100%",
                padding: "25px"
              }}
            >
              <AddIcon
                style={{ color: "white", width: "40px", height: "100%" }}
              />
            </ButtonBase>
          </Paper>
        </Collapse>

        {this.renderContentBody()}
        <ContentHeadDialog
          open={this.state.openContentHeadDialog}
          onClose={() => {
            this.setState({ openContentHeadDialog: false });
          }}
          user={this.props.user}
          contentHead={this.state.contentHead}
          addToContentHead={this.addToContentHead}
          setChoosenContentGroups={(value) => {
            this.setState({ choosenContentGroups: value });
          }}
          choosenContentGroups={this.state.choosenContentGroups}
        />
      </React.Fragment>
    );
  };

  renderContentDisplayer = () => {
    return (
      <ContentDisplayer
        user={this.props.user}
        contentHead={this.state.contentHead}
        contentBody={this.state.contentBody}
      />
    );
  };

  /**loads and redners the Component */
  render() {
    const { classes } = this.props;

    if (this.state.siteLoaded) {
      return (
        <React.Fragment>
          <div className={classes.wrapper}>
            <ClickAwayListener
              mouseEvent="onMouseUp"
              onClickAway={() => {
                this.setState({ onChangeElements: false });
              }}
            >
              <div>
                <Grid container spacing={1}>
                  <Grid
                    xs={12}
                    sm={this.state.preview ? 6 : 12}
                    md={this.state.preview ? 6 : 4}
                    item
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() =>
                        this.setState({
                          preview: !this.state.preview
                        })
                      }
                      style={{
                        padding: 10
                      }}
                    >
                      {this.state.preview ? "Bearbeiten" : "Preview"}
                    </Button>
                  </Grid>
                  <Grid xs={12} sm={6} md={this.state.preview ? 6 : 4} item>
                    <Button
                      fullWidth
                      onClick={() =>
                        this.setState({
                          openContentHeadDialog: true
                        })
                      }
                      color="primary"
                      variant="contained"
                      style={{
                        //backgroundColor: this.props.theme.palette.primary.main,
                        //color: "white",
                        padding: 10
                      }}
                    >
                      Einstellungen
                    </Button>
                  </Grid>

                  {this.state.preview ? null : (
                    <Grid xs={12} sm={6} md={4} item>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() =>
                          this.setState({
                            onChangeElements: !this.state.onChangeElements
                          })
                        }
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          padding: 10
                        }}
                      >
                        {this.state.onChangeElements ? (
                          "Normale ansicht"
                        ) : (
                          <React.Fragment>
                            <AddIcon />
                            Element Hinzufügen
                          </React.Fragment>
                        )}
                      </Button>
                    </Grid>
                  )}
                </Grid>
                {this.state.preview ? null : this.renderEditMode()}
                {/**<Typography variant="h2">{this.state.contentHead.name}</Typography> */}
                <Collapse in={this.state.loadingError}>
                  <Paper
                    style={{
                      backgroundColor: "red",
                      padding: 10,
                      marginTop: 10
                    }}
                  >
                    <Typography style={{ color: "white" }}>
                      {this.state.loadingErrorText}
                    </Typography>
                  </Paper>
                </Collapse>
              </div>
            </ClickAwayListener>
          </div>
          {this.state.preview ? this.renderContentDisplayer() : null}
          <Dialog
            open={this.state.error}
            onClose={() => this.setState({ error: false })}
          >
            <Paper
              style={{
                padding: 10,
                backgroundColor: "red",
                textAlign: "center"
              }}
            >
              <Typography style={{ color: "white" }}>
                {this.state.errortext}
              </Typography>
            </Paper>
          </Dialog>
        </React.Fragment>
      );
    } else {
      postRequest(
        "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/getContentBody.php",
        this.props.user,
        { ContentID: this.state.contentHead.ContentID },
        (response) => {
          if (response.data.success) {
            this.setState({
              siteLoaded: true,
              lastUpdated: response.data.lastUpdated,
              contentBody: response.data.contentBody,
              safeContentBody: this.bestCopyEver(response.data.contentBody)
            });
          } else {
            this.setState({
              loadingError: true,
              loadingErrorText: response.data.errortext
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
  }
}

ContentCreator.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(ContentCreator)));
