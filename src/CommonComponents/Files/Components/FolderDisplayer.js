import { withStyles } from "@material-ui/core/styles";

import { Typography, Grid, Button, Divider, Collapse } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import React from "react";
const styles = (theme) => ({
  back3: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  back2: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  }
});

class FolderDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var display = [];
    for (let prop in this.props.content) {
      display.push({ name: prop, content: this.props.content[prop] });
    }

    return (
      <React.Fragment>
        <Path
          classes={this.props.classes}
          path={this.props.path}
          changeDirBack={this.props.changeDirBack}
        />
        <Grid container spacing={2}>
          {display.map((value, index) => {
            if (value.content.fileID === undefined) {
              return (
                <Folder
                  key={index}
                  displayedName={value.name}
                  onClick={() => {
                    this.props.onFolderPick(value.content, value.name);
                  }}
                />
              );
            } else {
              if (this.props.deactivateFiles) {
                return null;
              }
              return (
                <File
                  key={index}
                  displayedName={value.content.fileName}
                  onClick={() => {
                    this.props.onFilePick(value.content);
                  }}
                />
              );
            }
          })}
        </Grid>
      </React.Fragment>
    );
  }
}

function Folder(props) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Button
        fullWidth
        variant="outlined"
        style={{ padding: 10, textTransform: "none" }}
        startIcon={<FolderIcon />}
        onClick={props.onClick}
      >
        <Typography>{props.displayedName}</Typography>
      </Button>
    </Grid>
  );
}

function File(props) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Button
        fullWidth
        variant="outlined"
        style={{ padding: 10, textTransform: "none" }}
        startIcon={<InsertDriveFileIcon />}
        onClick={props.onClick}
      >
        <Typography>{props.displayedName}</Typography>
      </Button>
    </Grid>
  );
}

function Path(props) {
  var display = true;
  if (props.path.length === 1) {
    display = false;
  }
  var length;
  if (props.path.length < 4) {
    length = props.path.length - 1;
  } else {
    length = 3;
  }

  return (
    <Collapse in={display}>
      <Grid container>
        {length === 3 ? (
          <Grid zeroMinWidth item className={props.classes.back3} md={4}>
            <Button
              fullWidth
              endIcon={<ChevronRightIcon />}
              style={{ textTransform: "none" }}
              onClick={() => props.changeDirBack(props.path.length - 4)}
            >
              <Typography>{props.path[props.path.length - 4]}</Typography>
            </Button>
          </Grid>
        ) : null}
        {length >= 2 ? (
          <Grid
            zeroMinWidth
            item
            className={props.classes.back2}
            xs={false}
            sm={6}
            md={12 / length}
          >
            <Button
              fullWidth
              endIcon={<ChevronRightIcon />}
              style={{ textTransform: "none" }}
              onClick={() => props.changeDirBack(props.path.length - 3)}
            >
              <Typography>{props.path[props.path.length - 3]}</Typography>
            </Button>
          </Grid>
        ) : null}
        <Grid
          zeroMinWidth
          item
          xs={12}
          sm={length === 1 ? 12 : 6}
          md={length === 0 ? 12 : 12 / length}
        >
          <Button
            fullWidth
            endIcon={<ChevronRightIcon />}
            style={{ textTransform: "none" }}
            onClick={() => props.changeDirBack(props.path.length - 2)}
          >
            <Typography>{props.path[props.path.length - 2]}</Typography>
          </Button>
        </Grid>
      </Grid>
      <Divider style={{ margin: "10px 0px" }} />
    </Collapse>
  );
}

FolderDisplayer.propTypes = {};

export default withStyles(styles)(FolderDisplayer);
