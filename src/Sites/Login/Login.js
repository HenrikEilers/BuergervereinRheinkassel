import React from "react";

import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { withRouter } from "react-router-dom";

import axios from "axios";

const styles = theme => ({
  loginCard: {
    width: "90%",
    margin: "75px auto",
    maxWidth: 400
  },
  inputContainer: {
    display: "-webkit-flex",
    flexWrap: "wrap",
    WebkitFlexWrap: "wrap",
    flexDirection: "column",
    WebkitFlexDirection: "column",
    alignItems: "center",
    WebkitAlignItems: "center"
  },
  textField: {
    flexBasis: 200,
    WebkitFlexBasis: "200"
  },
  input: {
    marginTop: 20,
    width: "100%"
  },
  button: {
    margin: "10px auto",
    marginTop: 20
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "henrik.eilers@online.de",
      password: "test@new",
      error: false,
      showPassword: false
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  tryLogin = () => {
    this.setState({ error: false });
    axios
      .post(
        "https://www.buergerverein-rheindoerfer.de/phpTest/hi.php",
        {
          email: this.state.email,
          password: this.state.password
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
          this.props.setCredentials(
            this.state.email,
            this.state.password,
            response.data.user
          );
          if (response.data.changePW) {
            this.props.changePW();
            this.props.history.push("/settings");
          } else {
            this.props.history.goBack();
          }
        } else {
          this.setState({ error: true });
        }
        //this.setState({ data1: response.data });
      })
      .catch(err => console.log(err));
    return false;
  };

  enterPressed = event => {
    if (event.charCode === 13) {
      //13 is the enter keycode
      this.tryLogin();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.loginCard} onKeyPress={this.enterPressed}>
        <Card className={classes.inputContainer}>
          <CardContent>
            <Typography variant="h3">Login</Typography>
            <FormControl className={classes.input} error={this.state.error}>
              <InputLabel htmlFor="adornment-password">Email</InputLabel>
              <Input
                id="email"
                type="text"
                value={this.state.email}
                onChange={this.handleChange("email")}
              />
            </FormControl>
            <FormControl className={classes.input} error={this.state.error}>
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                id="password"
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                onChange={this.handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      tabIndex="-1"
                    >
                      {this.state.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </CardContent>
          {this.state.error ? (
            <Typography variant="body1" color="error">
              Email oder Passwort falsch
            </Typography>
          ) : null}
          <Button
            autoFocus
            className={classes.button}
            variant="outlined"
            onClick={() => {
              this.tryLogin();
            }}
          >
            Click Here
          </Button>
        </Card>
      </div>
    );
  }
}
export default withStyles(styles)(withRouter(Login));
