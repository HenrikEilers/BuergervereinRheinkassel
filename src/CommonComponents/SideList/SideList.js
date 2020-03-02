import {
  withStyles,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  ListItemIcon,
  Divider
} from "@material-ui/core";

import { Link, withRouter } from "react-router-dom";
import React from "react";
import {
  Person,
  Check,
  Folder,
  PieChart,
  Add,
  Home,
  RestoreFromTrash,
  Grade,
  FreeBreakfast,
  AccountCircle,
  VerifiedUser
} from "@material-ui/icons";

const styles = {
  root: {
    flexGrow: 1,
    WebkitFlexGrow: "1"
  },
  flex: {
    flexGrow: 1,
    WebkitFlexGrow: "1"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  loginBTN: {
    marginRight: 10
  },
  list: {
    width: 250
  },
  subheader: {
    backgroundcolor: "white",
    color: "pink"
  }
};

class SideList extends React.Component {
  userList = () => {
    return (
      <List
        subheader={
          <div>
            <ListSubheader component="div">Bürgerverein</ListSubheader>
          </div>
        }
      >
        <ListItem
          button
          component={Link}
          to="/"
          onClick={this.props.reloadFeed}
          selected={this.props.selectedIndex === 0}
        >
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText>Startseite</ListItemText>
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/koelle_Putz_Munter"
          selected={this.props.selectedIndex === 1}
        >
          <ListItemIcon>
            <RestoreFromTrash />
          </ListItemIcon>
          <ListItemText>Kölle Putz Munter</ListItemText>
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/sankt_Martin"
          selected={this.props.selectedIndex === 2}
        >
          <ListItemIcon>
            <Grade />
          </ListItemIcon>
          <ListItemText>Sankt Martin</ListItemText>
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/gluehwein_Abend"
          selected={this.props.selectedIndex === 3}
        >
          <ListItemIcon>
            <FreeBreakfast />
          </ListItemIcon>
          <ListItemText>Glühwein Abend</ListItemText>
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/impressum"
          selected={this.props.selectedIndex === 3}
        >
          <ListItemIcon>
            <VerifiedUser />
          </ListItemIcon>
          <ListItemText>Impressum</ListItemText>
        </ListItem>
      </List>
    );
  };

  MemberList = () => {
    return (
      <div>
        <Divider />
        <List
          subheader={
            <div>
              <ListSubheader component="div">Mitglieder Areal</ListSubheader>
            </div>
          }
        >
          <ListItem
            button
            component={Link}
            to="/settings"
            selected={this.props.selectedIndex === 4}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText>Profil</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/abstimmungen"
            selected={this.props.selectedIndex === 5}
          >
            <ListItemIcon>
              <PieChart />
            </ListItemIcon>
            <ListItemText>Themen Abstimmung</ListItemText>
          </ListItem>
        </List>
      </div>
    );
  };

  BeiratsList = () => {
    return (
      <div>
        <Divider />
        <List
          subheader={
            <div>
              <ListSubheader component="div">Beirats Areal</ListSubheader>
            </div>
          }
        >
          <ListItem
            button
            component={Link}
            to="/contentmanager/feed_management"
          >
            <ListItemIcon>
              <Check />
            </ListItemIcon>
            <ListItemText>Feed Management</ListItemText>
          </ListItem>
          <ListItem button component={Link} to="/contentmanager/content_folder">
            <ListItemIcon>
              <Folder />
            </ListItemIcon>
            <ListItemText>Content Folder</ListItemText>
          </ListItem>
        </List>
      </div>
    );
  };

  VorstandsList = () => {
    return (
      <div>
        <Divider />
        <List
          subheader={
            <div>
              <ListSubheader component="div">Vorstands Areal</ListSubheader>
            </div>
          }
        >
          <ListItem
            button
            component={Link}
            to="/registrierung"
            selected={this.props.selectedIndex === 8}
          >
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText>Registriere Neues Mitglied</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/user_verwaltung"
            selected={this.props.selectedIndex === 9}
          >
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText>User Verwaltung</ListItemText>
          </ListItem>
        </List>
      </div>
    );
  };

  render() {
    const {
      user: { rank },
      classes
    } = this.props;
    return (
      <div className={classes.list}>
        {this.userList()}
        {rank > 0 ? <div> {this.MemberList()} </div> : <div />}
        {rank > 1 ? <div> {this.BeiratsList()} </div> : <div />}
        {rank > 2 ? <div> {this.VorstandsList()} </div> : <div />}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(SideList));
