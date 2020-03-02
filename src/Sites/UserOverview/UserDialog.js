import {
  withStyles,
  Paper,
  Divider,
  Typography,
  TextField,
  Dialog,
  Radio,
  FormControlLabel,
  Collapse,
  Button
} from "@material-ui/core";

import { postRequest } from "../../actions.js";

import { withRouter } from "react-router-dom";

import React from "react";
import {} from "@material-ui/icons";

const styles = {};

class UserDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tmpEmail: "",
      tmpRank: -1,
      emailError: null,
      emailErrorText: "",
      rankError: null,
      rankErrorText: "",
      openDeleteAlert: false,
      deleteError: false,
      deleteErrorText: ""
    };
  }

  onChangeEmail = event => {
    const callback = response => {
      this.setState({
        emailError: null,
        emailErrorText: ""
      });
      if (response.data.success) {
        this.setState({
          emailError: false
        });
        this.props.changeEmailOrRank("email", this.state.tmpEmail);
      } else {
        this.setState({
          emailError: true,
          emailErrorText: response.data.errortext
        });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/userOverview/changeEmail.php",
      this.props.user,
      { UserOnEdit: this.props.userOnEdit, tmpEmail: this.state.tmpEmail },
      callback
    );
  };

  onChangeRank = () => {
    const callback = response => {
      this.setState({
        rankError: null,
        rankErrorText: ""
      });
      if (response.data.success) {
        this.setState({
          rankError: false
        });
        this.props.changeEmailOrRank("rank", this.state.tmpRank);
      } else {
        this.setState({
          rankError: true,
          rankErrorText: response.data.errortext
        });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/userOverview/changeRank.php",
      this.props.user,
      { UserOnEdit: this.props.userOnEdit, tmpRank: this.state.tmpRank },
      callback
    );
  };

  onDeleteUser = event => {
    this.setState({
      deleteError: false,
      deleteErrorText: ""
    });
    const callback = response => {
      console.log(response);
      if (response.data.success) {
        this.props.onClose();
        this.props.removeUser();
      } else {
        this.setState({
          deleteError: true,
          deleteErrorText: response.data.errortext
        });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/userOverview/deleteUser.php",
      this.props.user,
      { UserOnDelete: this.props.userOnEdit },
      callback
    );
  };

  render() {
    const emailregex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const { classes, user } = this.props;

    return (
      <React.Fragment>
        <Dialog
          fullWidth
          maxWidth="sm"
          scroll="body"
          open={this.props.open}
          onClose={this.props.onClose}
          onExit={() => {
            this.setState({
              tmpEmail: "",
              tmpRank: -1,
              emailError: null,
              emailErrorText: "",
              rankError: null,
              rankErrorText: "",
              openDeleteAlert: false,
              deleteError: false,
              deleteErrorText: ""
            });
          }}
        >
          <div style={{ padding: 15, paddingBottom: 7 }}>
            <Typography variant="h4">User Informationen</Typography>
            <div style={{ paddingLeft: 10 }}>
              <Typography>Name: {this.props.userOnEdit.username}</Typography>
              <Typography>Email: {this.props.userOnEdit.email}</Typography>
              <Typography>UserID: {this.props.userOnEdit.userID}</Typography>
              <Typography>Rang: {this.props.userOnEdit.rank}</Typography>
              <Typography>
                PW geändert: {this.props.userOnEdit.initialPW ? "nein" : "ja"}
              </Typography>
            </div>
          </div>
          <Divider />
          <div style={{ padding: 15, paddingTop: 7 }}>
            <Typography variant="h6">Email ändern</Typography>
            <Typography paragraph>
              Wenn die Email verändert wird, dann erhält die alte Email Addresse
              eine Mail mit allen Informationen.Auch die Identität des Users der
              die Änderungen vornimmt wird übertragen.
            </Typography>
            <TextField
              fullWidth
              style={{}}
              placeholder="Neue Email"
              value={this.state.tmpEmail}
              onChange={event =>
                this.setState({ tmpEmail: event.target.value })
              }
            />
            <Collapse in={emailregex.test(this.state.tmpEmail)}>
              <Button
                variant="outlined"
                onClick={this.onChangeEmail}
                fullWidth
                style={{
                  padding: 10,
                  marginTop: 10,
                  color: this.state.emailError === false ? "white" : "unset",
                  backgroundColor:
                    this.state.emailError === false ? "green" : "unset"
                }}
              >
                Email Ändern
              </Button>
            </Collapse>
            <Collapse in={this.state.emailError}>
              <Paper
                style={{ backgroundColor: "red", padding: 10, marginTop: 10 }}
              >
                <Typography style={{ color: "white" }}>
                  {this.state.emailErrorText}
                </Typography>
              </Paper>
            </Collapse>
          </div>
          <Divider />
          <div style={{ padding: 15, paddingTop: 7 }}>
            <Typography variant="h6">Rang Ändern</Typography>
            <Typography paragraph>
              Wenn der Rang verändert wird, dann erhält der User eine Mail. Dort
              wird der Neu Rang erklärt. Außerdem wird angezeigt wer die
              Änderung vorgenommen hat.
            </Typography>
            <div
              style={{
                display: "-webkit-flex",
                justifyContent: "space-around",
                WebkitJustifyContent: "space-around",
                flexDirection: "row",
                WebkitFlexDirection: "row",
                alignItems: "center",
                WebkitAlignItems: "center"
              }}
            >
              <FormControlLabel
                control={
                  <Radio
                    value={1}
                    checked={
                      this.state.tmpRank === 1 ||
                      (this.state.tmpRank === -1 &&
                        this.props.userOnEdit.rank === 1)
                    }
                    onChange={event => {
                      this.setState({ tmpRank: Number(event.target.value) });
                    }}
                    color="primary"
                  />
                }
                label="Mitglied"
                labelPlacement="top"
              />
              <FormControlLabel
                control={
                  <Radio
                    value={2}
                    checked={
                      this.state.tmpRank === 2 ||
                      (this.state.tmpRank === -1 &&
                        this.props.userOnEdit.rank === 2)
                    }
                    onChange={event => {
                      console.log(typeof this.state.tmpRank);
                      this.setState({ tmpRank: Number(event.target.value) });
                    }}
                    color="primary"
                  />
                }
                label="Beirat"
                labelPlacement="top"
              />
              <FormControlLabel
                control={
                  <Radio
                    value={3}
                    checked={
                      this.state.tmpRank === 3 ||
                      (this.state.tmpRank === -1 &&
                        this.props.userOnEdit.rank === 3)
                    }
                    onChange={event => {
                      this.setState({ tmpRank: Number(event.target.value) });
                    }}
                    color="primary"
                  />
                }
                label="Vorsitz/Admin"
                labelPlacement="top"
              />
            </div>
            <Collapse
              in={
                (this.state.tmpRank !== this.props.userOnEdit.rank &&
                  this.state.tmpRank !== -1) ||
                this.state.rankError !== null
              }
            >
              <Button
                variant="outlined"
                onClick={this.onChangeRank}
                fullWidth
                style={{
                  padding: 10,
                  marginTop: 10,
                  color: this.state.rankError === false ? "white" : "unset",
                  backgroundColor:
                    this.state.rankError === false ? "green" : "unset"
                }}
              >
                Rang Ändern
              </Button>
            </Collapse>
            <Collapse in={this.state.rankError}>
              <Paper
                style={{ backgroundColor: "red", padding: 10, marginTop: 10 }}
              >
                <Typography style={{ color: "white" }}>
                  {this.state.rankErrorText}
                </Typography>
              </Paper>
            </Collapse>
          </div>
          <Divider />
          <div style={{ padding: 15, paddingTop: 7 }}>
            <Typography variant="h6">User Löschen</Typography>
            <Typography>
              Der User der Gelöscht wird erhält eine Email mit Seinen
              persönlichen Daten die gelöscht werden. Ihm wird auch mitgeteilt
              wer die Löschung vorgenommen hat.
            </Typography>
            <Button
              fullWidth
              style={{ padding: 10, color: "white", backgroundColor: "red" }}
              onClick={() => {
                this.setState({ openDeleteAlert: true });
              }}
            >
              User Löschen
            </Button>
          </div>
        </Dialog>
        <Dialog
          fullWidth
          maxWidth="xs"
          scroll="body"
          open={this.state.openDeleteAlert}
          onClose={() => {
            this.setState({ openDeleteAlert: false });
          }}
        >
          <div style={{ padding: "15px" }}>
            <Button
              onClick={this.onDeleteUser}
              variant="outlined"
              fullWidth
              style={{
                color: "white",
                backgroundColor: "red",
                padding: 50,
                marginBottom: 10
              }}
            >
              User {this.props.userOnEdit.username} Wirklich Löschen
            </Button>
            <Collapse in={this.state.deleteError}>
              <Paper
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  marginBottom: 10
                }}
              >
                <Typography style={{ color: "white" }}>
                  {this.state.deleteErrorText}
                </Typography>
              </Paper>
            </Collapse>
            <Button
              onClick={() => {
                this.setState({ openDeleteAlert: false });
              }}
              variant="outlined"
              fullWidth
              style={{
                color: "white",
                backgroundColor: "green",
                padding: 25
              }}
            >
              Abbrechen
            </Button>
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(UserDialog));
