import { withStyles } from "@material-ui/core/styles";

import { InputBase } from "@material-ui/core";

import { withRouter, Link } from "react-router-dom";

import React from "react";

const styles = (theme) => ({
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
  p: {
    //border: "solid 2px black",
    "text-align": "justify",
    textAlignLast: "center"
  }
});

class Text extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <InputBase
        disabled={this.props.onChangeElements}
        style={{ display: "inline", margin: 0, padding: 0 }}
        fullWidth
        multiline
        classes={{
          root: this.props.classes.inputTextContent,
          input: this.props.classes.p
        }}
        value={this.props.text.content}
        onChange={(event) => {
          this.props.changeContentPiece({
            ...this.props.text,
            content: event.target.value
          });
        }}
      />
    );
  }
}

Text.propTypes = {};

export default withStyles(styles)(Text);
