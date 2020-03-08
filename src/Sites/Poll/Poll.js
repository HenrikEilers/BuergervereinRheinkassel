import React from "react";
import PropTypes from "prop-types";

import PicturePicker from "../../CommonComponents/PicturePicker/PicturePicker";

import {
  withStyles,
  withTheme,
  Dialog,
  Button,
  Paper
} from "@material-ui/core";

const styles = theme => ({});

class Poll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      picture: null
    };
  }

  getPicture = picture => {
    console.log(picture);
    this.setState({ picture, open: false });
  };

  //render methode
  render() {
    const { classes, user } = this.props;
    return (
      <Paper className={classes.wrapper}>
        <Button
          onClick={() => {
            this.setState({ open: !this.state.open });
          }}
        >
          open
        </Button>
        {this.state.picture ? (
          <ul style={{ textAlign: "left" }}>
            <li>{this.state.picture.pictureID}</li>
            <li>{this.state.picture.imgcontent}</li>
            <li>{this.state.picture.date}</li>
            <li>{this.state.picture.name}</li>
            <li>{this.state.picture.width}</li>
            <li>{this.state.picture.height}</li>
            <li>{this.state.picture.date}</li>
          </ul>
        ) : null}

        <Dialog
          scroll="body"
          maxWidth="sm"
          fullWidth
          open={this.state.open}
          onClose={() => {
            this.setState({ open: false });
          }}
        >
          <PicturePicker
            getPicture={this.getPicture}
            disableUpload={false}
            user={this.props.user}
          />
        </Dialog>
      </Paper>
    );
  }
}

Poll.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTheme(withStyles(styles)(Poll));
