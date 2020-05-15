import { withStyles } from "@material-ui/core/styles";

import {
  Button,
  Dialog,
  Collapse,
  TextField,
  Divider,
  Checkbox,
  Typography
} from "@material-ui/core";

import { withRouter } from "react-router-dom";

import { postRequest } from "../../../../../actions.js";

import React from "react";
const styles = (theme) => ({
  link: {
    color: "blue",
    "&:hover": {
      textDecoration: "underline"
    }
  }
});

class Link extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: props.link,
      openLinkDialog: false
    };
  }

  compareObject = (object1, object2) => {
    for (const [prop, value] of Object.entries(object1)) {
      if (typeof value === "object" && value !== null) {
        console.log(prop);
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

  render() {
    return (
      <React.Fragment>
        <Button
          disabled={this.props.onChangeElements}
          fullWidth
          variant="outlined"
          style={{ display: "inline" }}
          onClick={() => {
            this.setState({
              openLinkDialog: true
            });
          }}
        >
          LINK:
          <span
            className={
              !this.props.onChangeElements ? this.props.classes.link : null
            }
          >
            {this.state.link.displayed}
          </span>
        </Button>
        <Dialog
          open={this.state.openLinkDialog}
          fullWidth
          maxWidth="md"
          onClose={() => {
            this.setState({
              openLinkDialog: false
            });
          }}
          onExit={() => {
            this.setState({
              link: { ...this.props.link }
            });
          }}
        >
          <div style={{ padding: "15px" }}>
            <Collapse in={this.state.link.link !== ""}>
              <Button
                variant="outlined"
                target="_blank"
                href={this.state.link.link}
                fullWidth
                style={{ marginBottom: 15, padding: 15 }}
              >
                Benutze Link
              </Button>
            </Collapse>
            <TextField
              style={{ paddingBottom: 15 }}
              fullWidth
              variant="outlined"
              label="Angezeigter Text"
              value={this.state.link.displayed}
              onChange={(event) => {
                this.setState({
                  link: { ...this.state.link, displayed: event.target.value }
                });
              }}
            />
            <Divider style={{ marginBottom: 15 }} />
            <TextField
              style={{ paddingBottom: 7 }}
              fullWidth
              variant="outlined"
              label="Link"
              value={this.state.link.link}
              onChange={(event) => {
                this.setState({
                  link: { ...this.state.link, link: event.target.value }
                });
              }}
            />
            <div
              style={{
                display: "-webkit-flex",
                alignItems: "center",
                WebkitAlignItems: "center",
                padding: "0px 15px"
              }}
            >
              <Checkbox
                color="primary"
                checked={this.state.link.paragraph}
                onChange={(event) => {
                  this.setState({
                    link: {
                      ...this.state.link,
                      paragraph: event.target.checked
                    }
                  });
                }}
              />

              <Typography
                style={{
                  textAlign: "center",
                  width: "100%"
                }}
              >
                Der Link soll als eigener Paragraph dargestellt werden
              </Typography>
            </div>
            <Collapse
              in={
                this.compareObject(this.state.link, this.props.link) &&
                this.state.link.link !== "" &&
                this.state.link.displayed !== ""
              }
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  this.props.changeContentPiece(this.state.link);
                  this.setState({ openLinkDialog: false });
                }}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: 15,
                  marginTop: 7
                }}
              >
                Hinzufügen
              </Button>
            </Collapse>
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

Link.propTypes = {};

export default withStyles(styles)(Link);
