import {
  withStyles,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  InputBase,
  Collapse,
  Button
} from "@material-ui/core";

import { postRequest } from "../../actions.js";

import React from "react";
import {} from "@material-ui/icons";

const styles = theme => ({
  wrapper: {
    textAlign: "left",
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
  p: { display: "inline" },
  input: {
    padding: 0
  }
});

class ChangeImpressumg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      impressum: props.impressum,
      onSave: false,
      error: false,
      errorText: ""
    };
  }

  loadImpressum = () => {
    const callback = response => {
      if (response.data.success) {
        this.setState({
          impressum: response.data.impressum
        });
      } else {
        this.setState({
          error: true,
          errorText: response.data.errortext
        });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/getTopic/getTopic.php",
      this.props.user,
      { name: this.props.history.location.pathname.split("/")[2] },
      callback
    );
  };

  changeInput = (prop, value) => {
    const save = this.compareObject(
      { ...this.state.impressum, [prop]: value },
      this.props.impressum
    );
    this.setState({
      impressum: { ...this.state.impressum, [prop]: value },
      onSave: save
    });
  };

  compareObject = (object1, object2) => {
    for (const [prop, value] of Object.entries(object1)) {
      if (typeof value === "object") {
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

  getDifference = (object1, object2, category = "base") => {
    var re = [];
    for (const [prop, value] of Object.entries(object1)) {
      if (typeof value === "object") {
        const tmp = this.getDifference(value, object2[prop], prop);
        if (tmp !== null) {
          re = re.concat(tmp);
        }
      } else {
        if (value !== object2[prop]) {
          re.push({ kategorie: category, propname: prop, content: value });
        }
      }
    }
    if (re.length > 0) {
      return re;
    } else {
      return null;
    }
  };
  submitImpressum = () => {
    const load = this.getDifference(this.state.impressum, this.props.impressum);
    const callback = response => {
      console.log(response.data);
      if (response.data.success) {
        this.props.completeEdit(true);
      } else {
        this.setState({ error: true, errorText: response.data.errortext });
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/Impressum/changeImpressum.php",
      this.props.user,
      load,
      callback
    );
  };

  render() {
    const { classes } = this.props;
    //Im falle Eines Error wird eine Nachricht Angezeigt
    if (this.state.error) {
      return (
        <Paper style={{ padding: 10, backgroundColor: "red" }}>
          <Typography style={{ color: "white" }}>
            {this.state.errorText}
          </Typography>
        </Paper>
      );
    }

    return (
      <React.Fragment>
        <div className={classes.wrapper}>
          <Typography variant="h2">Impressum</Typography>
          <Collapse in={this.state.onSave}>
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              fullWidth
              onClick={this.submitImpressum}
            >
              Speichern
            </Button>
          </Collapse>
          <AngabenGemaess5TMG
            classes={this.props.classes}
            angabenGemaess5TMG={this.state.impressum.angabenGemaess5TMG}
            changeInput={value => this.changeInput("angabenGemaess5TMG", value)}
          />
          <Kontakt
            classes={this.props.classes}
            contact={this.state.impressum.contact}
            changeInput={value => this.changeInput("contact", value)}
          />
          <VerantwortlichFuerDenInhaltNach55Abs2RStV
            classes={this.props.classes}
            changeInput={value =>
              this.changeInput(
                "verantwortlichFuerDenInhaltNach55Abs2RStV",
                value
              )
            }
            verantwortlichFuerDenInhaltNach55Abs2RStV={
              this.state.impressum.verantwortlichFuerDenInhaltNach55Abs2RStV
            }
          />
        </div>
      </React.Fragment>
    );
  }
}

//angaben gemäß der Des Telemedie Gesetzt
function AngabenGemaess5TMG(props) {
  const changeInput = (prop, value) => {
    props.changeInput({ ...props.angabenGemaess5TMG, [prop]: value });
  };
  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h5">Angaben gemäß § 5 TMG</Typography>
      <div style={{ paddingLeft: "7px" }}>
        <Typography>
          Hier müssen die Notwendigen Informationen nach Telemediengesetz
          eingetragen werden
        </Typography>
        <InputFeld
          propname="organisation"
          name="Organisation"
          value={props.angabenGemaess5TMG}
          changeInput={props.changeInput}
          classes={props.classes}
        />
        <InputFeld
          propname="strasse"
          name="Straße und Hausnummer"
          value={props.angabenGemaess5TMG}
          changeInput={props.changeInput}
          classes={props.classes}
        />
        <InputFeld
          propname="spezifizierung"
          name="Adress Spezifizierung"
          value={props.angabenGemaess5TMG}
          changeInput={props.changeInput}
          classes={props.classes}
        />
        <InputFeld
          propname="plzStadt"
          name="Postleitzahl Stadt"
          value={props.angabenGemaess5TMG}
          changeInput={props.changeInput}
          classes={props.classes}
        />
      </div>
      <br />
      <div style={{ paddingLeft: "7px" }}>
        <InputFeld
          propname="vereinRegisterNummer"
          name="Vereinsregisternummer"
          value={props.angabenGemaess5TMG}
          changeInput={props.changeInput}
          classes={props.classes}
        />
        <InputFeld
          propname="registerGericht"
          name="Register Gericht"
          value={props.angabenGemaess5TMG}
          changeInput={props.changeInput}
          classes={props.classes}
        />
      </div>
      <br />
      <div style={{ paddingLeft: "7px" }}>
        <Typography variant="subtitle1">Vertreten durch:</Typography>
        <InputFeld
          propname="anwaltlicheVertretung"
          name="Anwaltliche Vertretung"
          value={props.angabenGemaess5TMG}
          changeInput={props.changeInput}
          classes={props.classes}
        />
      </div>
    </div>
  );
}

//Kontakt der Website
function Kontakt(props) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h5">Kontakt</Typography>
      <Typography>
        Hier müssen Kontakt Informationen angegeben werden
      </Typography>
      <div style={{ paddingLeft: "7px" }}>
        <InputFeld
          propname="telefonNummer"
          name="Telefon Nummer"
          value={props.contact}
          changeInput={props.changeInput}
          classes={props.classes}
        />
        <InputFeld
          propname="email"
          name="Email"
          value={props.contact}
          changeInput={props.changeInput}
          classes={props.classes}
        />
      </div>
    </div>
  );
}
//Verantwortlich für die Readaktionellen Leistungen die erbracht werden auf der Website
function VerantwortlichFuerDenInhaltNach55Abs2RStV(props) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h5">
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
      </Typography>
      <div style={{ paddingLeft: "7px" }}>
        <Typography>
          Hier müssen die Notwendigen Informationen nach 55Abs2RStV. Hier muss
          der Verantwortiche für den Inhalt der Seite gelistet sein.
        </Typography>
        <InputFeld
          propname="name"
          name="Name"
          value={props.verantwortlichFuerDenInhaltNach55Abs2RStV}
          changeInput={props.changeInput}
          classes={props.classes}
        />
        <InputFeld
          propname="strasseHausnummer"
          name="Straße und Hausnummer"
          value={props.verantwortlichFuerDenInhaltNach55Abs2RStV}
          changeInput={props.changeInput}
          classes={props.classes}
        />
        <InputFeld
          propname="spezifizierung"
          name="Address Spezifizierung"
          value={props.verantwortlichFuerDenInhaltNach55Abs2RStV}
          changeInput={props.changeInput}
          classes={props.classes}
        />
        <InputFeld
          propname="plzStadt"
          name="Postleitzahl + Stadt"
          value={props.verantwortlichFuerDenInhaltNach55Abs2RStV}
          changeInput={props.changeInput}
          classes={props.classes}
        />
      </div>
    </div>
  );
}

function InputFeld(props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: ""
        //border: "solid 2px red"
      }}
    >
      <Typography style={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
        {props.name}:
      </Typography>
      <InputBase
        classes={{ input: props.classes.input }}
        fullWidth
        margin="dense"
        variant="outlined"
        value={" " + props.value[props.propname]}
        onChange={event =>
          props.changeInput({
            ...props.value,
            [props.propname]: event.target.value.substring(1)
          })
        }
      />
    </div>
  );
}

export default withStyles(styles)(ChangeImpressumg);
