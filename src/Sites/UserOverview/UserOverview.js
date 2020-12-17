import {
  withStyles,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar
} from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Delete from "@material-ui/icons/Delete";

import { postRequest } from "../../actions.js";

import { withRouter } from "react-router-dom";
import UserDialog from "./UserDialog";

import React from "react";
import {} from "@material-ui/icons";

const styles = {
  wrapper: {
    display: "-webkit-flex",
    justifyContent: "center",
    WebkitJustifyContent: "center",
    flexDirection: "column",
    WebkitFlexDirection: "column",
    alignItems: "center",
    WebkitAlignItems: "center"
  },
  paper: {
    display: "-webkit-flex",
    flexDirection: "column",
    WebkitFlexDirection: "column",
    justifyContent: "center",
    WebkitJustifyContent: "center",
    width: "300px",
    marginBottom: 15
  }
};

class UserOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onData: false,
      openUserDialog: false,
      userSuccess: null,
      userList: [],
      chooseUser: {
        username: "",
        email: "",
        userID: -1,
        rank: -1,
        initialPW: null
      },
      deleteAlert: false
    };
  }

  removeUser = () => {
    const index = this.state.userList.findIndex((value) => {
      return value.userID === this.state.chooseUser.userID;
    });
    const tmpUserlist = this.state.userList;
    tmpUserlist.splice(index, 1);
    this.setState({ userList: tmpUserlist, deleteAlert: true });
  };

  changeEmailOrRank = (prop, content) => {
    const index = this.state.userList.findIndex((value) => {
      return value.userID === this.state.chooseUser.userID;
    });
    var tmpUserlist = this.state.userList;
    tmpUserlist[index][prop] = content;
    this.setState({
      userList: tmpUserlist,
      chooseUser: { ...this.state.chooseUser, [prop]: content }
    });
  };

  render() {
    const { classes } = this.props;
    if (!this.state.onData) {
      const callback = (response) => {
        if (response.data.success) {
          this.setState({
            onData: true,
            userSuccess: true,
            userList: response.data.userList
          });
        } else {
          this.setState({
            onData: true,
            userSuccess: false,
            errorText: response.data.errortext
          });
        }
      };
      postRequest(
        "https://www.buergerverein-rheindoerfer.de/phpTest/userOverview/getUser.php",
        this.props.user,
        this.state.table,
        callback
      );
      return <CircularProgress />;
    }
    if (!this.state.userSuccess) {
      return (
        <div className={classes.wrapper}>
          <Paper
            className={classes.paper}
            style={{
              display: "flex",
              color: "white",
              backgroundColor: "red",
              padding: 10
            }}
          >
            <Typography>{this.state.errorText}</Typography>
          </Paper>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className={classes.wrapper}>
          <Paper
            className={classes.paper}
            style={{ width: "unset", minWidth: 300, maxWidth: "90%" }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">UserID</TableCell>
                    <TableCell align="center">Rang</TableCell>
                    <TableCell align="center">PW geändert</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.userList.map((user, index) => (
                    <TableRow
                      onClick={() => {
                        this.setState({
                          openUserDialog: true,
                          chooseUser: user
                        });
                      }}
                      hover
                      key={index}
                    >
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell align="center">{user.userID}</TableCell>
                      <TableCell align="center">{user.rank}</TableCell>
                      <TableCell align="center">
                        {user.initialPW ? (
                          <Clear style={{ color: "red" }} />
                        ) : (
                          <Check style={{ color: "green" }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        <UserDialog
          open={this.state.openUserDialog}
          onClose={() => {
            this.setState({ openUserDialog: false });
          }}
          userOnEdit={this.state.chooseUser}
          user={this.props.user}
          removeUser={this.removeUser}
          changeEmailOrRank={this.changeEmailOrRank}
        />
        <Snackbar
          onClose={() => {
            this.setState({ deleteAlert: false });
          }}
          open={this.state.deleteAlert}
          message="Löschung Erfolgreich"
          action={<Delete />}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(UserOverview));
