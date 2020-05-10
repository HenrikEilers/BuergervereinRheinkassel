import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

import {
  Create,
  Visibility,
  VisibilityOff,
  ExitToApp
} from "@material-ui/icons";

import Avatar from "@material-ui/core/Avatar";
import { withTheme } from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

import axios from "axios";

const styles = theme => ({
  wrapper: {
    width: "306px",
    margin: "auto",
    padding: "2px 0px"
  },
  paragraph: {
    padding: "0px 20px",
    margin: "20px 0px"

    //paddingBottom:"0px"
  },
  avparagraph: {
    "padding-top": "10px"
  },
  textField: {
    margin: "5px"
  },
  avatar: {
    width: "100px",
    height: "100px",
    margin: "5px auto",
    "font-size": "40px"
  },
  expAction: {
    height: "30px"
  },
  helper: {
    borderBottom: `1px solid ${theme.palette.divider}`
    //padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  text: {
    color: theme.palette.primary["800"]
  }
});

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: {
        Error: false,
        Success: false,
        Errortext: "",
        PanelOpen: false,
        newdata: ""
      },
      password: {
        Error: false,
        Success: false,
        Errortext: "",
        PanelOpen: false,
        olddata: "",
        newdata: "",
        repeatdata: "",
        visible: false
      },
      email: {
        Error: false,
        Success: false,
        Errortext: "",
        PanelOpen: false,
        newdata: ""
      }
    };
  }

  //methoden für änderung des Usernames

  tryChange = prop => {
    //axios anfrage an php
    this.setState({
      [prop]: {
        ...this.state[prop],
        Error: false,
        Success: false
      }
    });

    if (this.state[prop].newdata === "") {
      this.setState({
        [prop]: {
          ...this.state[prop],
          Error: true,
          Errortext: "Bitte geben sie etwas ein"
        }
      });
      return;
    }

    if (prop === "password") {
      if (this.state.password.olddata !== this.props.user.password) {
        this.setState({
          [prop]: {
            ...this.state[prop],
            Error: true,
            Errortext: "Das Passwort ist falsch"
          }
        });
        return;
      }
      if (this.state.password.newdata !== this.state.password.repeatdata) {
        this.setState({
          [prop]: {
            ...this.state[prop],
            Error: true,
            Errortext: "Die neuen Passwörter stimmen nicht überein"
          }
        });
        return;
      }
    }

    if (prop === "email") {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.state.email.newdata)) {
        this.setState({
          [prop]: {
            ...this.state[prop],
            Error: true,
            Errortext: "Das ist keine Valide Emailadresse"
          }
        });
        return;
      }
    }

    axios
      .post(
        "https://www.buergerverein-rheindoerfer.de/phpTest/SettingsPhp/settings.php",
        {
          authentication: {
            email: this.props.user.email,
            password: this.props.user.password
          },
          load: {
            [prop]: this.state[prop].newdata
          }
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        if (response.data.success === true) {
          this.props.changeUserState(prop, this.state[prop].newdata);
          this.setState({
            [prop]: {
              ...this.state[prop],
              Success: true
            }
          });
        } else {
          this.setState({
            [prop]: {
              ...this.state[prop],
              Error: true,
              Errortext: response.data.errortext
            }
          });
        }
        //this.setState({ data1: response.data });
      })
      .catch(err => console.log(err));
  };

  //Panel zum Änderen des Usernames
  usernamePanel = () => {
    const { classes } = this.props;

    return (
      <ExpansionPanel expanded={this.state.username.PanelOpen}>
        <ExpansionPanelSummary
          className={classes.helper}
          onClick={() =>
            this.setState({
              username: {
                ...this.state.username,
                PanelOpen: !this.state.username.PanelOpen
              }
            })
          }
          expandIcon={<Create />}
        >
          <Typography variant="subtitle1" className={classes.text}>
            Name Ändern ?
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails
          style={{
            padding: "20px 20px",
            paddingBottom: "10px",
            border: "solid 0px red"
          }}
        >
          <TextField
            id="email-textfield"
            label="Neuer Name"
            onChange={this.handleTextFieldChange("username", "newdata")}
            value={this.state.username.newdata}
            type="text"
            fullWidth
            variant="outlined"
            error={this.state.username.Error}
          />
        </ExpansionPanelDetails>
        {this.state.username.Error ? (
          <Typography
            style={{ padding: "0px 20px", paddingTop: "-5px" }}
            variant="body2"
            color="error"
          >
            {this.state.username.Errortext}
          </Typography>
        ) : null}
        {this.state.username.Success ? (
          <Typography
            style={{ color: "green", padding: "0px 20px", paddingTop: "-5px" }}
            variant="body2"
            color="inherit"
          >
            Änderung erfolgreich
          </Typography>
        ) : null}
        <Divider style={{ marginTop: "10px" }} />
        <ExpansionPanelActions className={classes.expAction}>
          <Button
            onClick={() =>
              this.setState({
                username: {
                  ...this.state.username,
                  Error: false,
                  Success: false,
                  PanelOpen: false,
                  errortext: "",
                  newdata: ""
                }
              })
            }
          >
            Abbrechen
          </Button>
          <Button
            onClick={() => this.tryChange("username")}
            className={classes.text}
          >
            Speichern
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  };

  passwordPanel = () => {
    const { classes } = this.props;

    return (
      <ExpansionPanel expanded={this.state.password.PanelOpen}>
        <ExpansionPanelSummary
          className={classes.helper}
          onClick={() =>
            this.setState({
              password: {
                ...this.state.password,
                PanelOpen: !this.state.password.PanelOpen
              }
            })
          }
          expandIcon={<Create />}
        >
          <Typography variant="subtitle1" className={classes.text}>
            Passwort Ändern ?
          </Typography>
        </ExpansionPanelSummary>

        <div
          style={{
            padding: "20px 20px",
            paddingBottom: "10px",
            border: "solid 0px red"
          }}
        >
          <TextField
            id="password-old"
            label="Altes Passwort"
            onChange={this.handleTextFieldChange("password", "olddata")}
            value={this.state.password.olddata}
            type={this.state.password.visible ? "text" : "password"}
            variant="outlined"
            error={this.state.password.Error}
            InputProps={{
              endAdornment: this.InputAdornmentPassword()
            }}
          />
        </div>
        <div
          style={{
            padding: "5px 20px",
            paddingBottom: "10px",
            border: "solid 0px red"
          }}
        >
          <TextField
            id="password"
            label="Neues Passwort"
            onChange={this.handleTextFieldChange("password", "newdata")}
            value={this.state.password.newdata}
            type={this.state.password.visible ? "text" : "password"}
            variant="outlined"
            error={this.state.password.Error}
            InputProps={{
              endAdornment: this.InputAdornmentPassword()
            }}
          />
        </div>
        <div
          style={{
            padding: "5px 20px",
            paddingBottom: "10px",
            border: "solid 0px red"
          }}
        >
          <TextField
            id="password-repeat"
            label="Wiederhole Passwort"
            onChange={this.handleTextFieldChange("password", "repeatdata")}
            value={this.state.password.repeatdata}
            type={this.state.password.visible ? "text" : "password"}
            variant="outlined"
            error={this.state.password.Error}
            InputProps={{
              endAdornment: this.InputAdornmentPassword()
            }}
          />
        </div>
        {this.state.password.Error ? (
          <Typography
            style={{ padding: "0px 20px" }}
            variant="body2"
            color="error"
          >
            {this.state.password.Errortext}
          </Typography>
        ) : null}
        {this.state.password.Success ? (
          <Typography
            style={{ color: "green", padding: "0px 20px" }}
            variant="body2"
            color="inherit"
          >
            Änderung erfolgreich
          </Typography>
        ) : null}
        <Divider style={{ marginTop: "10px" }} />
        <ExpansionPanelActions className={classes.expAction}>
          <Button
            onClick={() =>
              this.setState({
                password: {
                  ...this.state.password,
                  Error: false,
                  Success: false,
                  PanelOpen: false,
                  errortext: "",
                  newdata: ""
                }
              })
            }
          >
            Abbrechen
          </Button>
          <Button
            onClick={() => this.tryChange("password")}
            className={classes.text}
          >
            Speichern
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  };

  emailPanel = () => {
    const { classes } = this.props;

    return (
      <ExpansionPanel expanded={this.state.email.PanelOpen}>
        <ExpansionPanelSummary
          className={classes.helper}
          onClick={() =>
            this.setState({
              email: {
                ...this.state.email,
                PanelOpen: !this.state.email.PanelOpen
              }
            })
          }
          expandIcon={<Create />}
        >
          <Typography variant="subtitle1" className={classes.text}>
            Email Ändern ?
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails
          style={{
            padding: "20px 20px",
            paddingBottom: "10px",
            border: "solid 0px red"
          }}
        >
          <TextField
            id="outlined-password-input"
            label="Neuer Emailaddresse"
            onChange={this.handleTextFieldChange("email", "newdata")}
            value={this.state.email.newdata}
            type="email"
            fullWidth
            variant="outlined"
            error={this.state.email.Error}
          />
        </ExpansionPanelDetails>
        {this.state.email.Error ? (
          <Typography
            style={{ padding: "0px 20px" }}
            variant="body2"
            color="error"
          >
            {this.state.email.Errortext}
          </Typography>
        ) : null}
        {this.state.email.Success ? (
          <Typography
            style={{ color: "green", padding: "0px 20px" }}
            variant="body2"
            color="inherit"
          >
            Änderung erfolgreich
          </Typography>
        ) : null}
        <Divider style={{ marginTop: "10px" }} />
        <ExpansionPanelActions className={classes.expAction}>
          <Button
            onClick={() =>
              this.setState({
                email: {
                  ...this.state.email,
                  Success: false,
                  Error: false,
                  PanelOpen: false,
                  errortext: "",
                  newdata: ""
                }
              })
            }
          >
            Abbrechen
          </Button>
          <Button
            onClick={() => this.tryChange("email")}
            className={classes.text}
          >
            Speichern
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  };

  InputAdornmentPassword = () => (
    <InputAdornment position="end">
      <IconButton
        aria-label="Toggle password visibility"
        onClick={this.handleClickShowPassword}
        tabIndex="-1"
      >
        {this.state.password.visible ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );

  handleClickShowPassword = () => {
    this.setState({
      password: {
        ...this.state.password,
        visible: !this.state.password.visible
      }
    });
  };

  //methode zum ändern der Textfeld Values
  handleTextFieldChange = (prop1, prop2) => event => {
    this.setState({
      [prop1]: {
        ...this.state[prop1],
        [prop2]: event.target.value
      }
    });
  };

  //render methode
  render() {
    const { classes, user } = this.props;
    return (
      <Paper className={classes.wrapper}>
        {/*Avatar sowie Username Ausgabe*/}
        <div className={classes.avparagraph}>
          <Avatar className={classes.avatar}>
            {user.username.charAt(0).toUpperCase()}{" "}
          </Avatar>
          <Typography variant="h3">{user.username}</Typography>

          <div style={{ padding: "10px 10px", marginTop: "-10px" }}>
            <Typography variant="subtitle1" className={classes.text}>
              {this.props.user.email}
            </Typography>
            {this.props.user.rank === 0 ? (
              <Typography variant="subtitle1" className={classes.text}>
                Nicht angemeldet
              </Typography>
            ) : null}
            {this.props.user.rank === 1 ? (
              <Typography variant="subtitle1" className={classes.text}>
                Mitglied
              </Typography>
            ) : null}
            {this.props.user.rank === 2 ? (
              <Typography variant="subtitle1" className={classes.text}>
                Vorstands/Beiretsmitglied
              </Typography>
            ) : null}
            {this.props.user.rank === 3 ? (
              <Typography variant="subtitle1" className={classes.text}>
                Vorstand/Admin
              </Typography>
            ) : null}
          </div>
        </div>

        <Divider variant="middle" />
        {/*Panel zum Ändern des Usernames*/}
        <div className={classes.paragraph}>{this.usernamePanel()}</div>
        <div className={classes.paragraph}>{this.passwordPanel()}</div>
        <div className={classes.paragraph}>{this.emailPanel()}</div>
        <div className={classes.paragraph}>
          {this.props.islogedIn ? (
            <Button
              onClick={this.props.handleAbmelden}
              fullWidth
              style={{ backgroundColor: "red", color: "white" }}
            >
              Abmelden
              <ExitToApp style={{ fontSize: 20, marginLeft: "2px" }} />
            </Button>
          ) : null}
        </div>
      </Paper>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withTheme(withStyles(styles)(Settings));
