import {
  withStyles,
  Paper,
  Typography,
  CircularProgress,
  Button
} from "@material-ui/core";

import { postRequest } from "../../actions.js";

import React from "react";
import {} from "@material-ui/icons";

import ChangeImpressumg from "./ChangeImpressumg.js";

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
  }
});

class Impressum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      impressum: null,
      impressum1: {
        angabenGemaess5TMG: {
          organisation: "Bürgerverein Rheinkassel e.V.",
          strasse: "Amandus Straße",
          spezifizierung: "",
          plzStadt: "50769 Köln",
          vereinRegisterNummer: "vereinRegisterNummer",
          registerGericht: "registerGericht",
          anwaltlicheVertretung: "Anwalt Anwalt"
        },
        contact: {
          telefonNummer: "0221 1234567",
          email: "beispielMail@email.com"
        },
        verantwortlichFuerDenInhaltNach55Abs2RStV: {
          name: "Beispiel Redakteur",
          strasseHausnummer: "BeispielStraße 2",
          spezifizierung: "",
          plzStadt: "50769 Köln"
        }
      }
    };
  }

  loadImpressum = () => {
    const callback = response => {
      console.log(response.data);
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
      "https://www.buergerverein-rheindoerfer.de/phpTest/Impressum/getImpressum.php",
      this.props.user,
      {},
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
    //Läd Content und zeigt dabei Ladesymbol
    if (this.state.impressum === null) {
      this.loadImpressum();
      return (
        <div style={{ textAlign: "center", padding: 20 }}>
          <CircularProgress />
        </div>
      );
    }

    if (this.state.onEdit === true) {
      return (
        <ChangeImpressumg
          user={this.props.user}
          impressum={this.state.impressum}
          completeEdit={(reload = false) => {
            this.setState({
              onEdit: false,
              impressum: reload ? null : this.state.impressum
            });
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <div className={classes.wrapper}>
          <Typography variant="h2">Impressum</Typography>
          {this.state.impressum.angabenGemaess5TMG ? (
            <AngabenGemaess5TMG
              angabenGemaess5TMG={this.state.impressum.angabenGemaess5TMG}
            />
          ) : null}
          {this.state.impressum.contact ? (
            <Kontakt contact={this.state.impressum.contact} />
          ) : null}
          {this.state.impressum.verantwortlichFuerDenInhaltNach55Abs2RStV ? (
            <VerantwortlichFuerDenInhaltNach55Abs2RStV
              verantwortlichFuerDenInhaltNach55Abs2RStV={
                this.state.impressum.verantwortlichFuerDenInhaltNach55Abs2RStV
              }
            />
          ) : null}
          {this.props.user.rank > 1 ? (
            <Button
              variant="outlined"
              onClick={() => this.setState({ onEdit: true })}
            >
              Impressum Bearbeiten
            </Button>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

//angaben gemäß der Des Telemedie Gesetzt
function AngabenGemaess5TMG(props) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h5">Angaben gemäß § 5 TMG</Typography>
      <div style={{ paddingLeft: "7px" }}>
        <Typography>{props.angabenGemaess5TMG.organisation}</Typography>
        <Typography>{props.angabenGemaess5TMG.strasse}</Typography>
        <Typography>{props.angabenGemaess5TMG.spezifizierung}</Typography>
        <Typography>{props.angabenGemaess5TMG.plzStadt}</Typography>
      </div>
      <br />
      <div style={{ paddingLeft: "7px" }}>
        <Typography>{props.angabenGemaess5TMG.vereinRegisterNummer}</Typography>
        <Typography>{props.angabenGemaess5TMG.registerGericht}</Typography>
      </div>
      <br />
      <div style={{ paddingLeft: "7px" }}>
        <Typography variant="subtitle1">Vertreten durch:</Typography>
        <Typography>
          {props.angabenGemaess5TMG.anwaltlicheVertretung}
        </Typography>
      </div>
    </div>
  );
}

//Kontakt der Website
function Kontakt(props) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Typography variant="h5">Kontakt</Typography>
      <div style={{ paddingLeft: "7px" }}>
        {props.contact.telefonNummer ? (
          <Typography>Telefon Nummer: {props.contact.telefonNummer}</Typography>
        ) : null}
        {props.contact.email ? (
          <Typography>Email: {props.contact.email}</Typography>
        ) : null}
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
          {props.verantwortlichFuerDenInhaltNach55Abs2RStV.name}
        </Typography>
        <Typography>
          {props.verantwortlichFuerDenInhaltNach55Abs2RStV.strasseHausnummer}
        </Typography>
        <Typography>
          {props.verantwortlichFuerDenInhaltNach55Abs2RStV.spezifizierung}
        </Typography>
        <Typography>
          {props.verantwortlichFuerDenInhaltNach55Abs2RStV.plzStadt}
        </Typography>
      </div>
    </div>
  );
}
//Scheint nicht für uns relevant zu sein
function SchlichtungsStelle(props) {
  return (
    <div>
      <Typography variant="h5">
        Verbraucherstreitbeilegung/Universalschlichtungsstelle
      </Typography>
      <div style={{ paddingLeft: "7px" }}>
        <Typography>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </Typography>
      </div>
    </div>
  );
}

export default withStyles(styles)(Impressum);
