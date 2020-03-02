import { withStyles } from "@material-ui/core/styles";

import { withTheme } from "@material-ui/core/styles";

import { Typography, CircularProgress, Paper, Link } from "@material-ui/core";

import ImageSearchIcon from "@material-ui/icons/ImageSearch";

import { withRouter } from "react-router-dom";

import { postRequest } from "../../actions.js";

import React from "react";

const styles = theme => ({
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
  captionImg: {
    ...theme.typography.caption,
    "text-decoration": "none",
    color: theme.palette.grey.A700
  },
  formating: {
    ...theme.typography.body1,
    display: "block",
    textAlign: "justify",
    textAlignLast: "center"
  }
});
const TEXT_CONTENT = 1;
const NATIVE_IMAGE_CONTENT = 2;
const LINKED_IMAGE_CONTENT = 3;
const LINK_CONTENT = 4;
const VIDEO_CONTENT = 5;

class ContentDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentHead: this.props.contentHead,
      contentBody: this.props.contentBody,
      loadingError: this.props.errorText === undefined ? false : true,
      loadingErrorText:
        this.props.errorText === undefined ? "" : this.props.errorText
    };
  }

  /** rendert die einzelen ContentTyps */
  renderContentBody = () => {
    return this.state.contentBody.map((value, index) => {
      var re = null;
      if (value.ContentTypeID === TEXT_CONTENT) re = this.renderText(index);
      if (
        value.ContentTypeID === NATIVE_IMAGE_CONTENT ||
        value.ContentTypeID === LINKED_IMAGE_CONTENT
      )
        re = this.renderBild(index);
      if (value.ContentTypeID === LINK_CONTENT) re = this.renderLink(index);
      if (value.ContentTypeID === VIDEO_CONTENT) re = this.renderVideo(index);
      return <React.Fragment key={index}> {re}</React.Fragment>;
    });
  };

  /**rendert ein Text ContentElement */
  renderText = index => {
    return (
      <React.Fragment key={index}>
        <span style={{ whiteSpace: "pre-wrap" }}>
          {this.state.contentBody[index].content}
        </span>
      </React.Fragment>
    );
  };

  /**render ein Bild ContentElement  */
  renderBild = index => {
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
      <div style={{ margin: "10px 0px" }} key={index}>
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
              style={{ height: "auto", width: "100%" }}
              src={this.state.contentBody[index].content}
              alt={this.state.contentBody[index].name}
            />
          )}
        </div>
        <div>{renderCaption()}</div>
      </div>
    );
  };

  /**rendert ein Link Element */
  renderLink = index => {
    return (
      <React.Fragment key={index}>
        {this.state.contentBody[index].paragraph ? (
          <div
            style={{
              margin: "10px 0px",
              display: "block",
              textAlign: "center",
              textAlignLast: "center"
            }}
          >
            <Link
              color="primary"
              style={{ margin: "auto" }}
              href={this.state.contentBody[index].link}
            >
              {this.state.contentBody[index].displayed.toUpperCase()}
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "inline-block",
              textAlign: "center",
              textAlignLast: "center"
            }}
          >
            <Link
              color="primary"
              //style={{ "text-decoration-line": "none" }}
              href={this.state.contentBody[index].link}
            >
              {this.state.contentBody[index].displayed}
            </Link>
          </div>
        )}
      </React.Fragment>
    );
  };
  //TODO nach Datenschut fragen und den evtl wenn zeit und lust implementieren
  renderVideo = (value, index) => {};

  /**loads and redners the Component */
  render() {
    const { classes, theme } = this.props;
    if (this.state.loadingError) {
      return (
        <Typography style={{ textAlign: "center" }} color="error" variant="h3">
          {this.state.loadingErrorText}
        </Typography>
      );
    }

    if (this.state.contentBody) {
      return (
        <React.Fragment>
          <div className={classes.wrapper}>
            <Typography variant="h2">
              {this.state.contentHead.ueberschrift}
            </Typography>
            <Typography
              style={{
                lineHeight: 1.66,
                textAlign: "justify",
                textAlignLast: "center"
              }}
              display="block"
              variant="overline"
            >
              {this.state.contentHead.beschreibungText}
            </Typography>
            <div
              className={classes.formating}
              style={{ display: "block", textAlign: "justify" }}
            >
              {this.renderContentBody()}
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      postRequest(
        "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/getContentBody.php",
        this.props.user,
        this.state.contentHead,
        response => {
          if (response.data.success) {
            this.setState({
              contentBody: response.data.contentBody
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

ContentDisplayer.propTypes = {};

export default withTheme(withStyles(styles)(withRouter(ContentDisplayer)));
