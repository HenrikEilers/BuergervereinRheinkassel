import React from "react";
import PropTypes from "prop-types";

import {
  withStyles,
  withTheme,
  Card,
  ButtonBase,
  Typography
} from "@material-ui/core";

const styles = (theme) => ({
  card: {
    maxHeight: 300,
    width: "100%",
    overflow: "hidden",
    overflowY: "hidden",
    "text-align": "center",
    color: "white"
  },
  card1: {
    width: "100%",
    overflow: "hidden",
    overflowY: "hidden",
    "text-align": "center",
    maxHeight: 250,
    color: "white"
  }
});

class PictureTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      picture: null
    };
  }

  //render methode
  render() {
    const { picture } = this.props;
    return (
      <ButtonBase
        style={{
          position: "relative",
          display: "block",
          width: "100%"
        }}
        onClick={() => {
          this.props.onClick(picture);
        }}
      >
        <Card
          className={this.props.classes.card}
          style={{
            backgroundColor:
              this.props.choosen === true ? this.props.markedColor : "white"
          }}
        >
          <Typography
            style={{
              wordBreak: "break-all",
              color: this.props.choosen === true ? "white" : "black"
            }}
            variant="h5"
          >
            {picture.name}
          </Typography>
          <div style={{ padding: this.props.choosen !== undefined ? 5 : 0 }}>
            <Card className={this.props.classes.card1}>
              <img
                style={{
                  verticalAlign: "middle",
                  overflow: "hidden",
                  width: "100%"
                }}
                width="100%"
                height="auto"
                src={picture.content}
                alt={picture.name}
              />
            </Card>
          </div>
        </Card>
      </ButtonBase>
    );
  }
}

PictureTile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTheme(withStyles(styles)(PictureTile));
