import React from "react";
import "../../styles.css";
import Zoom from "@material-ui/core/Zoom";
import Collapse from "@material-ui/core/Collapse";

import Typography from "@material-ui/core/Typography";

import { withStyles, withTheme } from "@material-ui/core";

const styles = (theme) => ({
  box: {
    border: "solid 0px red",
    height: "100%",
    position: "relative"
  },
  bildContainer: {
    width: "100%",
    display: "block",
    overflow: "hidden",
    height: "100%",
    position: "absolute"
  },
  bild: {
    position: "absolute",
    left: "50%",
    top: "50%",
    height: "102%",
    width: "auto",
    transform: "translate(-50%,-50%)",
    verticalAlign: "middle",
    transition: "filter 0.5s",
    filter: "blur(0px)"
  },
  content: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "-webkit-flex",
    flexDirection: "column",
    WebkitFlexDirection: "column",
    justifyContent: "center",
    WebkitjustifyContent: "center",
    alignItems: "center",
    WebkitAlignItems: "center",
    border: "solid 0px red",
    "word-wrap": "break-word",
    overflow: "hidden"

    //textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
  },
  firstHeadline: {
    textShadow: "2px 2px 8px #000000",
    width: "90%",
    "word-wrap": "break-word",
    ...theme.typography.h1,
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    [theme.breakpoints.up("xs")]: {
      "font-size": "42px"
    },
    [theme.breakpoints.up("sm")]: {
      "font-size": "50px"
    },
    [theme.breakpoints.up("md")]: {
      "font-size": "60px"
    }
    //"font-size": "50px"
  },
  firstHeadline1: {
    textShadow: "2px 2px 8px #000000",
    width: "90%",
    "word-wrap": "break-word",
    ...theme.typography.h1,
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "42px"
  },
  firstHeadline2: {
    textShadow: "2px 2px 8px #000000",
    width: "90%",
    "word-wrap": "break-word",
    ...theme.typography.h1,
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "50px"
  },
  firstHeadline3: {
    textShadow: "2px 2px 8px #000000",
    width: "90%",
    "word-wrap": "break-word",
    ...theme.typography.h1,
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "60px"
  },
  secondHeadline: {
    ...theme.typography.h1,
    textShadow:
      "1px 1px 4px rgba(0,0,0,0.3),-1px 1px 4px rgba(0,0,0,0.3),1px -1px 4px rgba(0,0,0,0.3),-1px -1px 4px rgba(0,0,0,0.3)",
    width: "100%",
    "margin-block": "0px",
    "word-wrap": "break-word",
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    "font-size": "25px",
    color: "white",
    [theme.breakpoints.up("xs")]: {
      "font-size": "24px"
    },
    [theme.breakpoints.up("sm")]: {
      "font-size": "28px"
    },
    [theme.breakpoints.up("md")]: {
      "font-size": "34px"
    }
  },
  secondHeadline1: {
    ...theme.typography.h1,
    textShadow:
      "1px 1px 4px rgba(0,0,0,0.3),-1px 1px 4px rgba(0,0,0,0.3),1px -1px 4px rgba(0,0,0,0.3),-1px -1px 4px rgba(0,0,0,0.3)",
    width: "100%",
    "margin-block": "0px",
    "word-wrap": "break-word",
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "24px"
  },
  secondHeadline2: {
    ...theme.typography.h1,
    textShadow:
      "1px 1px 4px rgba(0,0,0,0.3),-1px 1px 4px rgba(0,0,0,0.3),1px -1px 4px rgba(0,0,0,0.3),-1px -1px 4px rgba(0,0,0,0.3)",
    width: "100%",
    "margin-block": "0px",
    "word-wrap": "break-word",
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "28px"
  },
  secondHeadline3: {
    ...theme.typography.h1,
    textShadow:
      "1px 1px 4px rgba(0,0,0,0.3),-1px 1px 4px rgba(0,0,0,0.3),1px -1px 4px rgba(0,0,0,0.3),-1px -1px 4px rgba(0,0,0,0.3)",
    width: "100%",
    "margin-block": "0px",
    "word-wrap": "break-word",
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "34px"
  },

  beschreibung: {
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "12px",

    [theme.breakpoints.up("xs")]: {
      "font-size": "12px",
      padding: "6px",
      paddingBottom: "4px"
    },
    [theme.breakpoints.up("sm")]: {
      "font-size": "14px",
      padding: "7px",
      paddingBottom: "4px"
    },
    [theme.breakpoints.up("md")]: {
      "font-size": "16px",
      padding: "8px",
      paddingBottom: "4px"
    }
  },
  date: {
    //color: "white"
  },
  beschreibung1: {
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "14px",
    padding: "6px",
    paddingBottom: "4px"
  },
  beschreibung2: {
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "12px",
    padding: "7px",
    paddingBottom: "4px"
  },
  beschreibung3: {
    "font-family": "Playfair Display, sans-serif",
    "font-weight": "normal",
    color: "white",
    "font-size": "16px",
    padding: "8px",
    paddingBottom: "4px"
  }
});

class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      hoverTouch: false,
      buttonBaseActive: false,
      picLoaded: false,
      useTouch: false
    };
  }

  test1 = (event) => {
    const t = event.nativeEvent.sourceCapabilities.firesTouchEvents;
    if (t) {
      if (this.state.hoverTouch) {
        this.props.onClick(this.props.data);
      } else {
        this.setState({ hoverTouch: true });
      }
    } else {
      this.props.onClick(this.props.data);
    }
  };

  render() {
    const { classes, data } = this.props;
    const { name, imgcontent, beschreibung, date } = data;
    const classtext = () => {
      if (this.props.first) {
        return bigCenteredTextClass();
      } else {
        return smallCenteredTextClass();
      }
    };

    const smallCenteredTextClass = () => {
      if (this.props.size !== undefined) {
        if (this.props.size === 0) {
          return classes.secondHeadline1;
        }
        if (this.props.size === 1) {
          return classes.secondHeadline2;
        }
        if (this.props.size === 2) {
          return classes.secondHeadline3;
        }
      } else {
        return classes.secondHeadline;
      }
    };

    const bigCenteredTextClass = () => {
      if (this.props.size !== undefined) {
        if (this.props.size === 0) {
          return classes.firstHeadline1;
        }
        if (this.props.size === 1) {
          return classes.firstHeadline2;
        }
        if (this.props.size === 2) {
          return classes.firstHeadline3;
        }
      } else {
        return classes.firstHeadline;
      }
    };

    const beschreibungTextClass = () => {
      if (this.props.size !== undefined) {
        if (this.props.size === 0) {
          return classes.beschreibung1;
        }
        if (this.props.size === 1) {
          return classes.beschreibung2;
        }
        if (this.props.size === 2) {
          return classes.beschreibung3;
        }
      } else {
        return classes.beschreibung;
      }
    };

    return (
      <React.Fragment>
        <Zoom in={this.state.picLoaded}>
          <div
            className={classes.box}
            onTouchStart={() => {
              if (!this.state.useTouch) {
                this.setState({ useTouch: true });
              }
            }}
            onClick={() => {
              if (!this.state.useTouch) {
                this.props.onClick(data);
              } else {
                if (!this.state.hoverTouch) {
                  this.setState({ hoverTouch: true });
                } else {
                  this.props.onClick(data);
                }
              }
            }}
            onMouseEnter={(event) => {
              if (!this.state.hover) {
                this.setState({ hover: true });
              }
            }}
            onMouseLeave={() => {
              if (this.state.hover || this.state.hoverTouch) {
                this.setState({ hover: false, hoverTouch: false });
              }
            }}
          >
            <div className={classes.bildContainer}>
              <img
                style={{
                  filter:
                    this.state.hover || this.state.hoverTouch
                      ? "blur(3px)"
                      : "blur(0px)"
                }}
                onLoad={() => {
                  this.setState({ picLoaded: true });
                }}
                className={classes.bild}
                src={imgcontent}
                alt={name}
              />
            </div>
            <div className={classes.content}>
              <Typography className={classtext()}>{name}</Typography>
              <Collapse in={this.state.hover || this.state.hoverTouch}>
                {beschreibung !== "" ? (
                  <Typography
                    className={beschreibungTextClass()}
                    variant="body1"
                  >
                    {beschreibung}
                  </Typography>
                ) : null}
                {date !== "0000-00-00" ? (
                  <Typography style={{ color: "white" }} variant="caption">
                    {new Date(date).getDate()}/{new Date(date).getMonth() + 1}/
                    {new Date(date).getFullYear()}
                  </Typography>
                ) : null}
              </Collapse>
            </div>
          </div>
        </Zoom>
      </React.Fragment>
    );
  }
}

export default withTheme(withStyles(styles)(Box));
