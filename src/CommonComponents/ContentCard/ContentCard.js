import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import Clear from "@material-ui/icons/Clear";
import Folder from "@material-ui/icons/Folder";
import { CircularProgress } from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import ContentBox from "./ContentBox";
import { postRequest } from "../../actions.js";

import {
  Dialog,
  Button,
  IconButton,
  Fab,
  Zoom,
  Collapse,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  ButtonBase,
  withTheme
} from "@material-ui/core";

const styles = theme => ({
  wrapper: {
    [theme.breakpoints.up("xs")]: {
      width: "306px",
      margin: "auto"
    },
    [theme.breakpoints.up("sm")]: {
      width: "575px",
      margin: "auto"
    },
    [theme.breakpoints.up("md")]: {
      width: "810px"
    },
    [theme.breakpoints.up("lg")]: {
      width: "1080px"
    }
  },
  paper: {
    marginBottom: "10px"
  },

  progress: {
    margin: theme.spacing(2)
  },
  card: {
    //border:"solid 2px red",
    //margin:"10px",

    height: "100%",
    width: "100%"
  },
  media: {
    height: "140px"
  },
  buttonBase: {
    height: "100%",
    display: "block",
    [theme.breakpoints.only("xs")]: {
      paddingBottom: "15px"
    }
  },
  newAdd: {
    position: "absolute",

    [theme.breakpoints.only("xs")]: {
      left: "153px",
      bottom: "-10px"
    },
    [theme.breakpoints.up("sm")]: {
      right: "-11px",
      top: "130px"
    },
    zIndex: "10"
  },
  newCancel: {
    position: "absolute",
    right: "5px",
    top: "5px",
    zIndex: "10",
    backgroundColor: "white"
  },
  root: {
    width: 360,
    backgroundColor: theme.palette.background.paper
  }
});

class ContentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newBox: false,
      openDialog: false,
      orderByGroups: false,
      choosenGroupIndex: -1
    };
  }

  openDialog = () => {
    this.setState({
      openDialog: true
    });
  };

  renderContentList = content => {
    if (content) {
      return content
        .filter(value => {
          if (this.state.choosenGroupIndex === -1) {
            return true;
          }

          return this.props.groups[
            this.state.choosenGroupIndex
          ].gruppenmitglieder.includes(value.ContentID);
        })
        .map((value, index) => {
          return (
            <ListItem
              key={index}
              button
              onClick={() => {
                this.setState({ openDialog: false });
                this.props.changeFeedContent(value, this.props.content.FeedID);
              }}
            >
              <ListItemText primary={value.name} />
            </ListItem>
          );
        });
    } else {
      return <CircularProgress />;
    }
  };

  renderGroupsList = () => {
    if (this.props.groups) {
      return this.props.groups.map((value, index) => {
        return (
          <ListItem
            key={index}
            button
            onClick={() => {
              this.setState({ choosenGroupIndex: index, orderByGroups: false });
            }}
          >
            <ListItemText primary={value.name} />
          </ListItem>
        );
      });
    } else {
      return <CircularProgress />;
    }
  };

  renderContentPick = () => {
    if (this.state.orderByGroups) {
      return (
        <List className={this.props.classes.root} component="nav">
          <ListItem
            button
            onClick={() => {
              this.setState({ choosenGroupIndex: -1, orderByGroups: false });
            }}
          >
            <ListItemText primary="Alle" />
          </ListItem>

          {this.renderGroupsList()}
        </List>
      );
    } else {
      return (
        <React.Fragment>
          <List className={this.props.classes.root} component="nav">
            <ListItem
              button
              onClick={() => {
                this.setState({ orderByGroups: true });
              }}
            >
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary="Nach Gruppen Ordnen" />
            </ListItem>
          </List>
          <Divider />
          {this.props.groups !== undefined &&
          this.props.groups !== null &&
          this.state.choosenGroupIndex !== -1 ? (
            <Typography style={{ margin: "0px 10px" }} variant="overline">
              Gruppe:{this.props.groups[this.state.choosenGroupIndex].name}
            </Typography>
          ) : null}
          <List component="nav">
            {this.renderContentList(this.props.offlineContent)}
          </List>
        </React.Fragment>
      );
    }
  };

  //render methode
  render() {
    const { classes, content } = this.props;
    return (
      <React.Fragment>
        <ContentBox
          style={{ position: "relative" }}
          content={this.props.content}
          classes={this.props.classes}
          checked={this.state.newBox}
          newBoxPressed={this.props.addToTMPFeed}
          cancelBoxPressed={this.props.deleteFromTMPFeed}
          cardPressed={this.openDialog}
          activeAdd
        />
        <Dialog
          scroll="body"
          open={this.state.openDialog}
          onClose={() => this.setState({ openDialog: false })}
          onExit={() => {
            this.setState({ orderByGroups: false, choosenGroupIndex: -1 });
          }}
        >
          {this.renderContentPick()}
        </Dialog>
      </React.Fragment>
    );
  }
}

ContentCard.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withTheme(withStyles(styles)(ContentCard));
