import React from "react";
import PropTypes from "prop-types";

import PictureTile from "./PictureTile";

import UP from "@material-ui/icons/ArrowUpward";
import Down from "@material-ui/icons/ArrowDownward";
import Search from "@material-ui/icons/Search";

import {
  withStyles,
  withTheme,
  IconButton,
  InputAdornment,
  FormControl,
  Grid,
  MenuItem,
  InputLabel,
  Select,
  TextField,
  Button
} from "@material-ui/core";

const styles = theme => ({
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

/**
 * common Component die Den Bilder verlauf für die neue Gruppen Phase und die change Gruppe Phase
 * TODO:
 * - Bild steht über
 */

class PictureSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: props.pictures,
      imgSearch: "",
      sortAfterProp: "pictureID",
      desc: false,
      selectAll: false
    };
  }

  componentDidMount() {
    this.sortPictures(
      "pictureID",
      false,
      this.props.groupMember,
      this.state.pictures
    );
  }

  selectAll = () => {
    const groupMemberTmp = this.state.pictures.map((picture, index) => {
      return picture.pictureID;
    });
    this.props.setGroupMember(this.state.selectAll ? [] : groupMemberTmp);
    this.setState({ selectAll: !this.state.selectAll });
  };

  pictureClick = picture => {
    var groupMemberTmp = this.props.groupMember;
    if (groupMemberTmp.includes(picture.pictureID)) {
      groupMemberTmp = groupMemberTmp.filter(value => {
        return value !== picture.pictureID;
      });
    } else {
      groupMemberTmp.push(picture.pictureID);
    }
    this.props.setGroupMember(groupMemberTmp);
    this.sortPictures(
      this.state.sortAfterProp,
      this.state.desc,
      groupMemberTmp
    );
  };

  sortPictures = (
    prop,
    desc,
    groupMember = this.props.groupMember,
    pictures = this.state.pictures
  ) => {
    const pictureTmp = pictures.sort((firstPicture, secondPicture) => {
      const groupMemberFirst = groupMember.includes(firstPicture.pictureID);
      const groupMemberSecond = groupMember.includes(secondPicture.pictureID);

      if (groupMemberFirst && !groupMemberSecond) {
        return -1;
      }
      if (!groupMemberFirst && groupMemberSecond) {
        return 1;
      }

      var returnTmp = 0;
      if (firstPicture[prop] < secondPicture[prop]) {
        returnTmp = -1;
      }
      if (firstPicture[prop] > secondPicture[prop]) {
        returnTmp = 1;
      }
      if (desc) {
        returnTmp = returnTmp * -1;
      }
      return returnTmp;
    });
    this.setState({
      sortAfterProp: prop,
      pictures: pictureTmp,
      desc: desc,
      selectAll: pictureTmp.length === groupMember.length
    });
  };

  shouldBeDisplayed = picture => {
    if (
      picture.name.toUpperCase().search(this.state.imgSearch.toUpperCase()) !==
      -1
    ) {
      return true;
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
                        choosen={this.props.groupMember.includes(
                          picture.pictureID
                        )}
                        picture={picture}
                        onClick={() => this.pictureClick(picture)}
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
                        choosen={this.props.groupMember.includes(
                          picture.pictureID
                        )}
                        picture={picture}
                        onClick={() => this.pictureClick(picture)}
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
                      choosen={this.props.groupMember.includes(
                        picture.pictureID
                      )}
                      picture={picture}
                      onClick={() => this.pictureClick(picture)}
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

  selectAllText = () => {
    if (this.state.pictures.length === this.props.groupMember.length) {
      return "Alles Abwählen";
    }
    if (this.state.selectAll === true) {
      return "Alles Abwählen";
    }
    if (this.state.selectAll === false) {
      return "Alles Auswählen";
    }
    return "Alles Auswählen";
  };

  //render methode
  render() {
    const { pictures, groupmember } = this.props;
    return (
      <div style={{ padding: 10 }}>
        <Grid spacing={1} container style={{ marginBottom: 10 }}>
          <Grid xs={12} sm={6} item>
            <Button
              style={{ padding: 10 }}
              fullWidth
              variant="outlined"
              onClick={this.selectAll}
            >
              {this.selectAllText()}
            </Button>
          </Grid>
          <Grid xs={12} sm={6} item>
            <FormControl fullWidth>
              <InputLabel htmlFor="box-size">Sortieren nach:</InputLabel>
              <Select
                value={this.state.sortAfterProp}
                style={{ width: "100%" }}
                onChange={event => {
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
              <IconButton
                onClick={() =>
                  this.sortPictures(this.state.sortAfterProp, !this.state.desc)
                }
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

PictureSelect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTheme(withStyles(styles)(PictureSelect));
