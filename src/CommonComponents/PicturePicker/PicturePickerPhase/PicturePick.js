import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import {
  Typography,
  Grid,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  ButtonBase,
  CircularProgress,
  InputAdornment,
  Card,
  IconButton,
  TextField,
  Paper
} from "@material-ui/core";

import UP from "@material-ui/icons/ArrowUpward";
import Down from "@material-ui/icons/ArrowDownward";
import Search from "@material-ui/icons/Search";

import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from "@material-ui/icons/Delete";

import { withRouter } from "react-router-dom";

import PictureTile from "./../Components/PictureTile.js";
import { getRequestwithAu } from "../../../actions.js";

import React from "react";
import { GROUP_SELECT, UPLOAD_PICTURE, DELETE_PICTURE } from "../constants.js";

const styles = (theme) => ({
  card: {
    maxHeight: 300,
    width: "100%",
    overflow: "hidden",
    "text-align": "center",
    color: "white"
  },
  smallScreeenPicker: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  bigScreeenPicker: {
    [theme.breakpoints.only("xs")]: {
      display: "none"
    }
  }
});

/**Beschreibung:
 * Es sollen Bilder geladen und ausgewählt werden
 */

class PicturePick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: null,
      sortAfterProp: "pictureID",
      imgSearch: "",
      choosenPictureGroup: null,
      error: false,
      errorText: "",
      desc: false
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

  sortPictures = (prop, Desk = false) => {
    const picturestmp = this.state.pictures.sort(
      (firstPicture, secondPicture) => {
        var returnTmp = 0;
        if (firstPicture[prop] < secondPicture[prop]) {
          returnTmp = -1;
        }
        if (firstPicture[prop] > secondPicture[prop]) {
          returnTmp = 1;
        }
        if (Desk) {
          returnTmp = returnTmp * -1;
        }
        return returnTmp;
      }
    );
    this.setState({ pictures: picturestmp });
  };

  shouldBeDisplayed = (picture) => {
    //Abgleichung mit Suchleiste
    if (
      picture.name.toUpperCase().search(this.state.imgSearch.toUpperCase()) !==
      -1
    ) {
      //Keine Gruppe Angegeben
      if (this.props.choosenGroup === null) {
        return true;
      }
      // Ist Mitglied der Ausgewählten Gruppe
      if (
        -1 !==
        this.props.choosenGroup.gruppenmitglieder.findIndex((value1) => {
          return picture.pictureID === value1;
        })
      ) {
        return true;
      }
    }
    return false;
  };

  renderPictures = () => {
    return (
      <React.Fragment>
        <Grid container className={this.props.classes.bigScreeenPicker}>
          <Grid sm={6} item>
            {this.state.pictures.map((picture, index) => {
              if (index % 2 === 0) {
                if (this.shouldBeDisplayed(picture)) {
                  return (
                    <Grid
                      key={index}
                      item
                      sm={12}
                      style={{ marginBottom: 10, paddingRight: 5 }}
                    >
                      <PictureTile
                        markedColor="green"
                        picture={picture}
                        onClick={this.props.returnPicture}
                      />
                    </Grid>
                  );
                }
              }
              return null;
            })}
          </Grid>
          <Grid sm={6} item>
            {this.state.pictures.map((picture, index) => {
              if (index % 2 === 1) {
                if (this.shouldBeDisplayed(picture)) {
                  return (
                    <Grid
                      key={index}
                      item
                      sm={12}
                      style={{ marginBottom: 10, paddingLeft: 5 }}
                    >
                      <PictureTile
                        markedColor="green"
                        picture={picture}
                        onClick={this.props.returnPicture}
                      />
                    </Grid>
                  );
                }
              }
              return null;
            })}
          </Grid>
        </Grid>
        <Grid container className={this.props.classes.smallScreeenPicker}>
          <Grid xs={12} item container>
            {this.state.pictures.map((picture, index) => {
              if (this.shouldBeDisplayed(picture)) {
                return (
                  <Grid key={index} item sm={12} style={{ marginBottom: 10 }}>
                    <PictureTile
                      markedColor="green"
                      picture={picture}
                      onClick={this.props.returnPicture}
                    />
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  renderPicturesOld = () => {
    return (
      <Grid container>
        {this.state.pictures.map((value, index) => {
          if (
            value.name
              .toUpperCase()
              .search(this.state.imgSearch.toUpperCase()) !== -1 &&
            (this.state.choosenPictureGroup === null ||
              -1 !==
                this.state.choosenPictureGroup.gruppenmitglieder.findIndex(
                  (value1) => {
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
                    this.props.returnPicture(value);
                  }}
                >
                  <Card className={this.props.classes.card}>
                    <Typography style={{ color: "black" }} variant="h5">
                      {value.name}
                    </Typography>
                    <Card className={this.props.classes.card}>
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

  renderUploadButton = () => {
    if (
      this.props.disableUpload === undefined ||
      this.props.disableUpload === false
    ) {
      return (
        <Grid xs={12} md={this.props.disableDelete === true ? 12 : 6} item>
          <Button
            onClick={() => this.props.changePhase(UPLOAD_PICTURE)}
            variant="outlined"
            fullWidth
            style={{ padding: 10 }}
          >
            <div style={{ width: "100%" }}>Bild Hochladen</div>
            <PublishIcon />
          </Button>
        </Grid>
      );
    }
  };

  renderDeleteButton = () => {
    if (
      this.props.disableDelete === undefined ||
      this.props.disableDelete === false
    ) {
      return (
        <Grid xs={12} md={this.props.disableUpload === true ? 12 : 6} item>
          <Button
            onClick={() => this.props.changePhase(DELETE_PICTURE)}
            variant="outlined"
            fullWidth
            style={{ padding: 10 }}
          >
            <div style={{ width: "100%" }}>Bild Löschen</div>
            <DeleteIcon />
          </Button>
        </Grid>
      );
    }
  };

  renderDeleteAndUpload = () => {
    return (
      <Grid container spacing={1} style={{ marginBottom: 5 }}>
        {this.renderUploadButton()}
        {this.renderDeleteButton()}
      </Grid>
    );
  };

  render() {
    //wenn Ein schwerwiegender Fehler auftritt
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
      <div style={{ padding: 10 }}>
        {this.renderDeleteAndUpload()}
        <Grid spacing={1} container style={{ marginBottom: 10 }}>
          <Grid xs={12} sm={6} item>
            <Button
              style={{ padding: 10 }}
              onClick={() => {
                this.props.changePhase(GROUP_SELECT);
              }}
              fullWidth
              variant="outlined"
            >
              {this.props.choosenGroup === null
                ? "Gruppe Auswählen"
                : '"' + this.props.choosenGroup.name + '"'}
            </Button>
          </Grid>
          <Grid xs={12} sm={6} item>
            <FormControl fullWidth>
              <InputLabel htmlFor="box-size">Sortieren nach:</InputLabel>
              <Select
                style={{ width: "100%" }}
                defaultValue="pictureID"
                onChange={(event) => {
                  this.sortPictures(event.target.value, this.state.desc);
                }}
                inputProps={{
                  name: "sortAfter",
                  id: "sortPropSelect"
                }}
              >
                <MenuItem value="pictureID">PictureID</MenuItem>
                <MenuItem value="date">Datum Bild</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="width">Breite</MenuItem>
                <MenuItem value="height">Höhe</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                display: "-webkit-flex",
                alignItems: "center",
                WebkitAlignItems: "center"
              }}
            >
              <TextField
                style={{ witdth: "100%" }}
                fullWidth
                size="small"
                variant="outlined"
                value={this.state.imgSearch}
                onChange={(event) => {
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
              <IconButton
                onClick={() => {
                  this.setState({
                    desc: !this.state.desc,
                    pictures: this.state.pictures.reverse()
                  });
                }}
                style={{ marginLeft: 5 }}
              >
                {this.state.desc ? <UP /> : <Down />}
              </IconButton>
            </div>
          </Grid>
        </Grid>
        {this.renderPictures()}
      </div>
    );
  }
}

PicturePick.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(PicturePick)));
