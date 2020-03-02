import {
  withStyles,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Collapse
} from "@material-ui/core";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { postRequest } from "../../actions.js";

import { withRouter } from "react-router-dom";

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
  },
  textField: {
    margin: "5px 0px"
  },
  radioButtons: {}
};

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailError: false,
      success: null,
      errorText: "",
      table: { data: [], names: [] },
      tabelSet: false,
      fileSuccess: null,
      fileErrorText: "pakncicnk",
      tableError: false,
      tableWarning: false,
      tableResponse: [],
      openAnleitung: false,
      newUser: {
        email: "",
        username: "",
        rank: "1"
      }
    };
  }

  onFileChange = event => {
    const reader = new FileReader();
    reader.onload = file => {
      var tableTMP = [];
      const tmp = reader.result.replace(/\r/g, "");
      const ResponseString = tmp.split("\n");
      const names = ResponseString[0].split(";");
      for (let i = 0; i < ResponseString.length - 2; i++) {
        var tmpArray = ResponseString[i + 1].split(";");
        const tmpObject = {};
        for (let x in names) {
          tmpObject[names[x]] = tmpArray[x];
        }
        tableTMP[i] = tmpObject;
      }
      this.setState({
        table: { data: tableTMP, names },
        tabelSet: true
      });
    };
    reader.readAsText(event.target.files[0], "ISO-8859-1");
  };

  onClickSend = event => {
    console.log(typeof this.state.newUser.rank);
    const emailregex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (!emailregex.test(this.state.newUser.email)) {
      this.setState({ emailError: true });
    } else {
      this.setState({ emailError: false });

      const callback = response => {
        console.log(response);
        if (response.data.success) {
          if (response.data.addResponse.success !== 1) {
            this.setState({
              success: false,
              warning: response.data.addResponse.success === 2 ? true : false,
              errorText: response.data.addResponse.message
            });
          } else {
            this.setState({ success: true });
          }
        } else {
          this.setState({ success: false, errorText: response.data.errortext });
        }
      };
      postRequest(
        "https://www.buergerverein-rheindoerfer.de/phpTest/addUser/addUser.php",
        this.props.user,
        { newUser: this.state.newUser },
        callback
      );
    }
  };

  onAddByFile = () => {
    const callback = response => {
      console.log(response);
      if (response.data.success) {
        const error = response.data.tableError || response.data.tableWarning;

        //Festlegung der Error Übersichts Nachricht
        var errorText = "";
        if (response.data.tableError) {
          errorText = "Bei Ein Paar Usern sind Fehler aufgetreten";
        }
        if (response.data.tableWarning) {
          errorText = "Bei Ein Paar Usern sind Warnungen aufgetreten";
        }
        if (response.data.tableWarning && response.data.tableError) {
          errorText = "Es sind sowohl Fehler als auch Warnungen aufgetreten";
        }

        this.setState({
          fileSuccess: !error,
          fileErrorText: errorText,
          tableError: response.data.tableError,
          tableWarning: response.data.tableWarning,
          tableResponse: response.data.tableResponse
        });
      } else {
        this.setState({
          fileSuccess: false,
          fileErrorText: response.data.errortext
        });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/addUser/addUserByFile.php",
      this.props.user,
      this.state.table,
      callback
    );
  };

  render() {
    const { classes, user } = this.props;
    return (
      <React.Fragment>
        <div className={classes.wrapper}>
          <Paper className={classes.paper}>
            <div style={{ padding: "10px 0px", paddingBottom: "0px" }}>
              <Typography variant="h4" gutterBottom>
                Registrierung
              </Typography>
            </div>
            <Divider style={{ marginBottom: "5px" }} />
            <div style={{ padding: "0px 10px 10px 10px" }}>
              <TextField
                className={classes.textField}
                required
                label="Username"
                fullWidth
                onChange={event => {
                  this.setState({
                    newUser: {
                      ...this.state.newUser,
                      username: event.target.value
                    }
                  });
                }}
                value={this.state.newUser.username}
                //variant="outlined"
              />
              <TextField
                className={classes.textField}
                required
                error={this.state.emailError}
                label="Email"
                fullWidth
                onChange={event => {
                  this.setState({
                    newUser: {
                      ...this.state.newUser,
                      email: event.target.value
                    }
                  });
                }}
                value={this.state.newUser.email}
                //variant="outlined"
              />
              <FormControl
                style={{
                  display: "block",
                  textAlign: "left",
                  paddingTop: "10px",
                  paddingLeft: "5px"
                }}
              >
                <FormLabel style={{ color: "grey" }}>Rang</FormLabel>
                <RadioGroup
                  value={this.state.newUser.rank}
                  onChange={event => {
                    this.setState({
                      newUser: {
                        ...this.state.newUser,
                        rank: event.target.value
                      }
                    });
                  }}
                  className={classes.radioButtons}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio color="primary" />}
                    label="Mitglied"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio color="primary" />}
                    label="Beirat"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio color="primary" />}
                    label="Vorssitzender/Admin"
                    labelPlacement="end"
                  />
                </RadioGroup>
              </FormControl>
              <Button
                disabled={
                  this.state.newUser.username === "" ||
                  this.state.newUser.email === ""
                }
                onClick={this.onClickSend}
                variant="outlined"
                style={{
                  padding: 10,
                  backgroundColor: this.state.success ? "green" : null,
                  color: this.state.success ? "white" : null
                }}
                fullWidth
              >
                HinzuFügen
              </Button>
              <Collapse in={this.state.success === false}>
                <Paper
                  style={{
                    whiteSpace: "pre-wrap",
                    marginTop: "10px",
                    padding: 10,
                    backgroundColor: this.state.warning ? "orange" : "red"
                  }}
                >
                  <Typography style={{ color: "white" }}>
                    {this.state.errorText}
                  </Typography>
                </Paper>
              </Collapse>
            </div>
          </Paper>
          <Paper
            style={{ width: "unset", minWidth: 300, maxWidth: "90%" }}
            className={classes.paper}
          >
            <Typography
              style={{ padding: 10, paddingBottom: "0px" }}
              gutterBottom
              variant="h4"
            >
              Registrierung über CSV Datei
            </Typography>
            <Divider />
            <div style={{ padding: "10px" }}>
              <input
                type="file"
                name="file"
                id="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={this.onFileChange}
              />
              <Button
                variant="outlined"
                style={{
                  padding: 10
                }}
                fullWidth
                onClick={() => {
                  var x = document.getElementById("file");
                  x.click();
                }}
              >
                Wähle Datei
              </Button>
              <Collapse in={this.state.tabelSet}>
                <Button
                  fullWidth
                  style={{
                    padding: "10px",
                    margin: "10px 0px",
                    color: this.state.fileSuccess ? "white" : "unset",
                    backgroundColor: this.state.fileSuccess ? "green" : "unset"
                  }}
                  variant="outlined"
                  onClick={this.onAddByFile}
                >
                  Liste Hinzufügen
                </Button>
                <Collapse in={this.state.fileSuccess === false}>
                  <Paper
                    style={{
                      display: "-webkit-flex",
                      justifyContent: "center",
                      WebkitJustifyContent: "center",
                      alignItems: "center",
                      WebkitAlignItems: "center",
                      marginBottom: "10px",
                      padding: "10px",
                      color: "white",
                      backgroundColor:
                        this.state.tableWarning && !this.state.tableError
                          ? "orange"
                          : "red"
                    }}
                  >
                    <Typography style={{ width: "300px" }}>
                      {this.state.fileErrorText}
                    </Typography>
                  </Paper>
                </Collapse>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {this.state.table.names.map((name, index) => (
                          <TableCell key={index}>{name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.table.data.map((row, index) => (
                        <React.Fragment key={index}>
                          <TableRow
                            style={{
                              color:
                                this.state.tableWarning === true ||
                                this.state.tableError === true
                                  ? "white"
                                  : "unset",
                              backgroundColor:
                                this.state.tableWarning === true ||
                                this.state.tableError === true
                                  ? this.state.tableResponse[index].success ===
                                    1
                                    ? "green"
                                    : this.state.tableResponse[index]
                                        .success === 2
                                    ? "orange"
                                    : "red"
                                  : "unset"
                            }}
                          >
                            {this.state.table.names.map(name => (
                              <TableCell
                                style={{ color: "inherit" }}
                                key={name + index}
                              >
                                {row[name]}
                              </TableCell>
                            ))}
                          </TableRow>
                          {(this.state.tableWarning === true ||
                            this.state.tableError === true) &&
                          this.state.tableResponse[index].success !== 1 ? (
                            <tr>
                              <td style={{ padding: 0 }} colSpan="3">
                                <div
                                  style={{
                                    textAlign: "left",
                                    padding: 5,
                                    margin: 5,
                                    marginTop: -2,
                                    borderWidth: "2px",
                                    borderTopWidth: "0px",
                                    borderStyle: "solid",
                                    borderRadius: "0px 0px 10px 10px",
                                    borderColor:
                                      this.state.tableResponse[index]
                                        .success === 2
                                        ? "orange"
                                        : "red"
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    align="left"
                                    style={{
                                      textAlign: "left",
                                      whiteSpace: "pre-wrap",
                                      width: "100%"
                                    }}
                                  >
                                    {this.state.tableResponse[index].message}
                                  </Typography>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
              <Button
                fullWidth
                variant="outlined"
                style={{ padding: 10, marginTop: 10 }}
                onClick={() => {
                  this.setState({ openAnleitung: !this.state.openAnleitung });
                }}
              >
                {this.state.openAnleitung ? "Schließ " : "Öffne "}Anleitung
              </Button>
              <Collapse in={this.state.openAnleitung}>
                <div style={{ maxWidth: 400, textAlign: "left" }}>
                  <Typography component="div" align="left">
                    <ul>
                      <li>-Erstellen sie eine CSV datei( z.B in Exel)</li>
                      <li>In die erste Zeile kommen die Spaltennamen:</li>
                      <ul>
                        <li>Name</li>
                        <li>Email</li>
                        <li>Rang</li>
                      </ul>
                      <li>
                        In den unteren Zeilen werden die Daten der User
                        eingetragen
                      </li>
                      <li>Der Name kann beliebig gewählt werden</li>
                      <ul>
                        <li>
                          Sollte es beim Namen Dublikate geben, dann wird einen
                          Warnung ausgegeben aber der User wird trotzdem
                          eingefügt
                        </li>
                      </ul>
                      <li>Die Email:</li>
                      <ul>
                        <li>
                          Darf nicht von zwei Usern gleichzeitig genutzt werden
                        </li>
                        <li>
                          Sollte eine richtig abrufbare Adresse sein da der User
                          sein Passwort über sie bekommen wird
                        </li>
                      </ul>
                      <li>Der Rang:</li>
                      <ul>
                        <li>Es gibt drei Ränge</li>
                        <ul>
                          <li>"Mitglied":1</li>
                          <li>"Beirat":2</li>
                          <li>"Vorstand/Admin":3</li>
                        </ul>
                        <li>
                          Es werden sowohl die Bezeichungen als auch die Zahlen
                          akzeptiert
                        </li>
                      </ul>
                    </ul>
                    Beispiel:
                  </Typography>
                </div>
                <img
                  style={{ maxWidth: 400, width: "100%" }}
                  src="https://www.buergerverein-rheindoerfer.de/phpTest/addUser/example.jpg"
                  alt="Beispiel CSV Datei Bild"
                />
              </Collapse>
            </div>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(AddUser));
