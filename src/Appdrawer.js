import { withStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import Snackbar from "@material-ui/core/Snackbar";

import CloseIcon from "@material-ui/icons/Close";

import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";

import React from "react";
import Login from "./Sites/Login/Login";
import Feed from "./CommonComponents/Feed/Feed";
import TopicSite from "./CommonComponents/TopicSite/TopicSite";
import Settings from "./Sites/Settings/Settings";
import Topic from "./Sites/Themen/Topic";

import SideList from "./CommonComponents/SideList/SideList";

import { Route, Link, withRouter } from "react-router-dom";

import { postRequest } from "./actions";

import Contentmanager from "./Sites/Contentmanagment/Contentmanager";
import ContentDisplayer from "./CommonComponents/ContentDisplayer/ContentDisplayer";
import AddUser from "./Sites/AddUser/AddUser";
import UserOverview from "./Sites/UserOverview/UserOverview";

const styles = theme => ({
  root: {
    flexGrow: 1,
    "-webkit-flex-grow": "1",
    [theme.breakpoints.up("xs")]: {
      marginTop: "70px"
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: "75px"
    }
  },
  grow: {
    flexGrow: 1,
    "-webkit-flex-grow": "1"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  appbar: {
    color: "white",
    background: "linear-gradient(45deg, rgb(33,150,243), rgb(33,203,243))"
  },
  avatar: {
    color: "white",
    background: "inherit",
    border: "solid 1px white"
  }
});

class Appdrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: false,
      islogedIn: false,
      changePW: false,
      feedContentHead: null,
      user: {
        email: "",
        password: "",
        username: "",
        rank: 0
      }
    };
  }

  handleAbmelden = () => {
    this.setState({
      islogedIn: false,
      user: {
        email: "",
        password: "",
        username: "",
        rank: 0
      }
    });
  };

  SiteName = () => {
    if (this.props.history.location.pathname === "/") return "Bürgerverein";

    let path = this.props.history.location.pathname.slice(1);
    var contentCreator = false;
    if (-1 !== path.lastIndexOf("content_creator")) {
      contentCreator = true;
    }

    const p = path.lastIndexOf("/");
    if (p !== -1) path = path.slice(p + 1);
    path = path.charAt(0).toUpperCase() + path.slice(1);
    for (let i = 0; i < path.length; i++) {
      if (path.charAt(i) === "_") {
        path =
          path.substr(0, i) +
          " " +
          path.charAt(i + 1).toUpperCase() +
          path.substr(i + 2);
      }
    }
    if (contentCreator) {
      return "ContentCreator";
    }
    return path;
  };

  setCredentials = (email, password, user1) => {
    user1.email = email;
    user1.password = password;
    this.setState({
      islogedIn: true,
      user: user1,
      feedContentHead: null
    });
  };

  toggleDrawer = open => () => {
    this.setState({
      left: open
    });
  };

  render() {
    const { classes } = this.props;

    if (this.state.feedContentHead === null) {
      postRequest(
        "https://buergerverein-rheilaka.de/phpTest/getFeed.php",
        this.state.user,
        null,
        response => {
          this.setState({ feedContentHead: response.data.feed });
        }
      );
    }

    return (
      <div>
        <div className={classes.root}>
          <AppBar position="fixed" color="inherit" className={classes.appbar}>
            <Toolbar>
              <IconButton
                onClick={this.toggleDrawer(true)}
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              >
                <MenuIcon style={{ color: "white" }} />
              </IconButton>
              <Typography
                onClick={() => {
                  this.props.history.push("/");
                }}
                variant="h6"
                color="inherit"
                className={classes.grow}
              >
                {this.SiteName()}
              </Typography>
              {!this.state.islogedIn ? (
                <Button
                  variant="outlined"
                  style={{ color: "white" }}
                  color="inherit"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
              ) : (
                <IconButton
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/settings"
                >
                  <AccountCircle style={{ color: "white" }} />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>
          <SwipeableDrawer
            open={this.state.left}
            onOpen={this.toggleDrawer(true)}
            onClose={this.toggleDrawer(false)}
          >
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer(false)}
              onKeyDown={this.toggleDrawer(false)}
            >
              <SideList
                user={this.state.user}
                reloadFeed={() => {
                  this.setState({ feedContentHead: null });
                }}
              />
            </div>
          </SwipeableDrawer>
        </div>

        {/*Routing Area*/}
        <Route
          exact
          path="/login"
          render={() => {
            return (
              <Login
                setCredentials={this.setCredentials}
                changePW={() => this.setState({ changePW: true })}
              />
            );
          }}
        />

        <Route
          exact
          path="/"
          render={() => (
            <Feed
              offlineData={false}
              user={this.state.user}
              feedAction={tmpContentHead => {
                this.props.history.push("/content/" + tmpContentHead.name);
              }}
            />
          )}
        />
        <Route
          exact
          path="/settings"
          render={() => (
            <Settings
              user={this.state.user}
              islogedIn={this.state.islogedIn}
              changeUserState={(prop, value) => {
                this.setState({ user: { ...this.state.user, [prop]: value } });
              }}
              handleAbmelden={this.handleAbmelden}
            />
          )}
        />
        <Route
          path="/contentmanager/"
          render={() => <Contentmanager user={this.state.user} />}
        />
        <Route
          path="/abstimmungen/"
          render={() => <Topic user={this.state.user} />}
        />
        <Route
          path="/content/"
          render={() => {
            return <Topic user={this.state.user} />;
          }}
        />
        <Route
          exact
          path="/registrierung"
          render={() => {
            return <AddUser user={this.state.user} />;
          }}
        />
        <Route
          exact
          path="/user_verwaltung"
          render={() => {
            return <UserOverview user={this.state.user} />;
          }}
        />
        <Snackbar
          open={this.state.changePW}
          onClose={() => {
            this.setState({ changePW: false });
          }}
          message={<span id="message-id">Bitte ändern sie Ihr Passwort</span>}
          action={
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={() => {
                this.setState({ changePW: false });
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <TopicSite />
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(Appdrawer));
