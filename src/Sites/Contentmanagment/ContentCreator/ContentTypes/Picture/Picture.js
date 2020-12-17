import { withStyles } from "@material-ui/core/styles";

import { Typography, ButtonBase, Paper } from "@material-ui/core";

import ImageSearchIcon from "@material-ui/icons/ImageSearch";

import PictureDialog from "./PictureDialog.js";

import React from "react";

const styles = (theme) => ({
  captionImg: {
    ...theme.typography.caption,
    "text-decoration": "none",
    color: theme.palette.grey.A700
  }
});

class Picture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureDialogOpen: false,
      picture: props.picture
    };
  }

  render() {
    const renderCaption = () => {
      if (this.state.picture.content === "") {
        return null;
      }
      if (
        !this.state.picture.content.includes("buergerverein-rheindoerfer.de") &&
        !this.state.picture.content.includes("buergerverein-rheilaka.de") &&
        !this.props.onChangeElements
      ) {
        const tmpIndex =
          -1 !== this.state.picture.content.indexOf("www")
            ? this.state.picture.content.indexOf("www")
            : 8;
        const tmpDomain = this.state.picture.content.substring(tmpIndex);
        const tmpIndex1 = tmpDomain.indexOf("/");
        const tmpDomain1 = tmpDomain.substring(0, tmpIndex1);

        return (
          <Typography variant="caption">
            <a
              disabled={this.props.onChangeElements}
              className={this.props.classes.captionImg}
              href={this.state.picture.content}
            >
              Quelle:{tmpDomain1}
            </a>
          </Typography>
        );
      }
      return null;
    };

    return (
      <div>
        <ButtonBase
          disabled={this.props.onChangeElements}
          classes={{ disabled: this.props.classes.buttonBase }}
          onClick={() => {
            this.setState({
              pictureDialogOpen: true
            });
          }}
        >
          <div style={{ display: "-webkit-inline-flex" }}>
            {this.state.picture.content === "" ? (
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
                src={this.state.picture.content}
                alt={this.state.picture.name}
                //height="auto"
                //width="100%"
              />
            )}
          </div>
        </ButtonBase>
        <div>{renderCaption()}</div>
        <PictureDialog
          pictureContent={this.state.picture}
          changeSave={this.props.changeContentPiece}
          open={this.state.pictureDialogOpen}
          user={this.props.user}
          stateOfDialog={
            this.state.picture.ContentTypeID === 2
              ? "OWNPICTURE_START"
              : "EMPTY_PICTURE_START"
          }
          onClose={() => {
            this.setState({ pictureDialogOpen: false });
          }}
          onExit={() => {
            this.setState({ picture: this.props.picture });
          }}
        />
      </div>
    );
  }
}

Picture.propTypes = {};

export default withStyles(styles)(Picture);
