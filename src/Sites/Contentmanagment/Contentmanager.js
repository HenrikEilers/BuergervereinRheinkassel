import { withStyles } from "@material-ui/core/styles";

import { Route, withRouter } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import React from "react";

import { CircularProgress } from "@material-ui/core";
import { postRequest } from "../../actions.js";

import Feedmanagement from "./Feedmanagement/Feedmanagement";
import ContentFolder from "./ContentFolder/ContentFolder";
import ContentCreator from "./ContentCreator/ContentCreator";

const styles = theme => ({
  root: {
    //width: "100%",
    //maxWidth: 360,
    //backgroundColor: theme.palette.background.paper
  }
});

class Contentmanager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offlineFeed: null,
      designView: true,
      offlineFeedTMP: null,
      feedHasToSave: false,
      feedHasToChange: false,
      feedErrorText: "",
      feedError: false,
      offlineGroup: null,
      content: {
        offlineContent: null,
        shownOfflineContent: null,
        sortedOfflineContent: null
      },
      search: "",
      choosenContent: null,
      shownGroupID: -1,
      chooseToEditIndex: -2
    };
    //abfragen der fedd daten für die höchste freigebes stufe
    //TODO adresse ändern und php mit Authentifizierungen ausstatten um auch eingeschränkte dataen abrufen zu können
    postRequest(
      "https://buergerverein-rheilaka.de/phpTest/getFeed.php",
      this.props.user,
      null,
      response => {
        const clone = this.bestCopyEver(response.data.feed);
        this.setState({
          offlineFeed: response.data.feed,
          offlineFeedTMP: clone
        });
      }
    );

    //Abfragen der Content Daten, also aller Daten die benötigt werden um ein thema zu identifizieren
    //TODO PHP backend erstellen, sowie SQL tabellen die benötigt werden
    postRequest(
      "https://buergerverein-rheilaka.de/phpTest/getContentHeads.php",
      this.props.user,
      null,
      response => {
        this.setState({
          content: {
            offlineContent: response.data.content,
            sortedOfflineContent: this.bestCopyEver(response.data.content),
            shownOfflineContent: this.bestCopyEver(response.data.content)
          },
          offlineGroup: response.data.group
        });
      }
    );
  }

  bestCopyEver = src => {
    return Object.assign([], src);
  };

  updateContentHeads = newContentHead => {
    const index = this.state.content.offlineContent.findIndex(value => {
      return value.ContentID === newContentHead.ContentID;
    });
    var content1 = null;
    if (index !== -1) {
      content1 = this.state.content.offlineContent.map((value, index1) => {
        if (index1 === index) {
          return newContentHead;
        }
        return value;
      });
    } else {
      content1 = this.state.content.offlineContent.concat(newContentHead);
    }
    this.setState({
      content: {
        offlineContent: content1,
        sortedOfflineContent: this.bestCopyEver(content1),
        shownOfflineContent: this.bestCopyEver(content1)
      }
    });
  };

  //Fügt das Ausgewählte Thema dem Feed Final hinzu
  addToFeed = () => {
    const callback = response => {
      if (response.data.success === true) {
        const clone = this.bestCopyEver(this.state.offlineFeedTMP);
        this.setState({
          offlineFeed: clone,
          feedHasToChange: false,
          feedHasToSave: false,
          feedErrorText: null,
          feedError: false
        });
        //Success aus geben
      } else {
        this.setState({
          feedError: true,
          feedErrorText: response.data.errortext,
          feedHasToChange: false,
          feedHasToSave: false
        });
        //Error mit Text ausgeben
      }
    };
    postRequest(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/addToFeed.php",
      this.props.user,
      { data: this.state.offlineFeedTMP },
      callback
    );
  };

  //Fügt das Ausgewählte Thema dem Content Final hinzu
  //TODO PHP backend muss erstellt werden + SQL Tabelle
  addToContent = data => {
    axios
      .post(
        "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/addToContent.php",
        {
          authentifaication: {
            email: this.props.user.email,
            password: this.props.user.password
          },
          load: {
            data
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
          //Success aus geben
        } else {
          //Error mit Text ausgeben
        }
      })
      .catch(err => console.log(err));
  };

  anythingChangedFeed = () => {
    if (this.state.offlineFeedTMP.length === this.state.offlineFeed.length) {
      for (let i = 0; i < this.state.offlineFeedTMP.length; i++) {
        if (
          this.state.offlineFeedTMP[i].ContentID ===
          this.state.offlineFeed[i].ContentID
        ) {
        } else {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  };

  FeedReady = () => {
    const tmp = this.state.offlineFeedTMP.find(data => data.ContentID === -1);
    if (tmp) {
      return false;
    } else {
      return true;
    }
  };

  setFeedCorrect = tmp => {
    return tmp.map((value, index) => {
      value = {
        ...value,
        FeedID: index
      };
      return value;
    });
  };

  addToTMPFeed = index => {
    const fillerContent = {
      name: "Was soll eingefügt werden",
      beschreibung: "wähle aus",
      imgcontent: ".",
      date: "heute",
      rank: 0,
      ContentID: -1
    };
    let tmp = this.state.offlineFeedTMP;
    tmp.splice(index, 0, fillerContent);
    tmp = tmp.map((value, index) => {
      const tmptmp = {
        ...value,
        FeedID: index + 1
      };
      return tmptmp;
    });
    this.setState({
      offlineFeedTMP: tmp,
      feedHasToChange: true,
      feedHasToSave: false
    });
    return;
  };

  deleteFromTMPFeed = index => {
    let tmp = this.state.offlineFeedTMP;
    tmp.splice(index - 1, 1);
    tmp = tmp.map((value, index1) => {
      const tmptmp = {
        ...value,
        FeedID: index1 + 1
      };
      return tmptmp;
    });
    this.setState({
      offlineFeedTMP: tmp
    });
    this.setState({
      feedHasToSave: this.anythingChangedFeed(),
      feedHasToChange: !this.FeedReady()
    });

    return;
  };

  changeFeedContent = (content, feedID) => {
    let tmp = this.state.offlineFeedTMP;
    tmp.splice(feedID - 1, 1, content);
    tmp = tmp.map((value, index1) => {
      const tmptmp = {
        ...value,
        FeedID: index1 + 1
      };
      return tmptmp;
    });
    this.setState({
      offlineFeedTMP: tmp
    });
    this.setState({
      feedHasToSave: this.anythingChangedFeed(),
      feedHasToChange: !this.FeedReady()
    });

    return;
  };

  handleSearchChange = event => {
    const searchedContent =
      event.target.value !== ""
        ? this.state.content.sortedOfflineContent.filter((value, index) => {
            if (
              value.name
                .toUpperCase()
                .search(event.target.value.toUpperCase()) !== -1
            ) {
              return true;
            } else {
              return false;
            }
          })
        : this.state.content.sortedOfflineContent;

    this.setState({
      search: event.target.value,
      content: {
        ...this.state.content,
        shownOfflineContent: this.bestCopyEver(searchedContent)
      }
    });
  };

  handleFolderAll = () => {
    const searchedContent =
      this.state.search !== ""
        ? this.state.content.offlineContent.filter((value, index) => {
            return (
              value.name
                .toUpperCase()
                .search(this.state.search.toUpperCase()) !== -1
            );
          })
        : this.bestCopyEver(this.state.content.offlineContent);

    this.setState({
      content: {
        ...this.state.content,
        sortedOfflineContent: this.bestCopyEver(
          this.state.content.offlineContent
        ),
        shownOfflineContent: this.bestCopyEver(searchedContent),
        shownGroupID: -1
      }
    });
  };

  handleFolderChange = groupID => {
    const gruppe = this.state.offlineGroup.find(value => {
      return groupID === value.GroupID;
    });
    const gruppenmitglieder = gruppe.gruppenmitglieder;

    const choosenContent = gruppenmitglieder.map((value1, index) => {
      return this.state.content.offlineContent.find(value => {
        return value1 === value.ContentID;
      });
    });
    const searchedContent =
      this.state.search !== ""
        ? choosenContent.filter((value, index) => {
            return (
              value.name
                .toUpperCase()
                .search(this.state.search.toUpperCase()) !== -1
            );
          })
        : this.bestCopyEver(choosenContent);

    this.setState({
      content: {
        ...this.state.content,
        sortedOfflineContent: this.bestCopyEver(choosenContent),
        shownOfflineContent: this.bestCopyEver(searchedContent)
      },
      shownGroupID: groupID
    });
  };

  //ändert die Zuasammensätzung einer Gruppe
  //oder fügt eine neue Gruppe hinzu
  editGroup = (name, GroupID, gruppenmitglieder, callback) => {
    const path = GroupID === -1 ? "addGroup" : "editGroup";
    axios
      .post(
        "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/ContentGroup/" +
          path +
          ".php",
        {
          authentication: {
            email: this.props.user.email,
            password: this.props.user.password
          },
          load: {
            content: {
              name: name,
              GroupID: GroupID,
              Groupmember: gruppenmitglieder
            }
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
          this.setState({
            offlineGroup: response.data.data
          });
          callback(response.data.GroupID);
          if (this.state.shownGroupID === response.data.GroupID) {
            this.handleFolderChange(GroupID);
          }
          //Success aus geben
        } else {
          //Error mit Text ausgeben
        }
        return response.data.success;
      })
      .catch(err => console.log(err));
  };

  deleteGroup = (GroupID, callback) => {
    axios
      .post(
        "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/ContentGroup/deleteGroup.php",
        {
          authentication: {
            email: this.props.user.email,
            password: this.props.user.password
          },
          load: {
            GroupID: GroupID
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
          this.setState({
            offlineGroup: response.data.data
          });

          if (this.state.shownGroupID === GroupID) {
            this.handleFolderAll();
          }
          //Success aus geben
        } else {
          //Error mit Text ausgeben
        }
        callback(response);
      })
      .catch(err => console.log(err));
  };

  //render methode
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Route
          exact
          path="/contentmanager/feed_management"
          render={() => {
            return (
              <Feedmanagement
                user={this.props.user}
                groups={this.state.offlineGroup}
                offlineFeed={this.state.offlineFeedTMP}
                offlineContent={this.state.content.offlineContent}
                changeFeedContent={this.changeFeedContent}
                addToFeed={this.addToFeed}
                addToTMPFeed={this.addToTMPFeed}
                deleteFromTMPFeed={this.deleteFromTMPFeed}
                feedHasToSave={this.state.feedHasToSave}
                feedHasToChange={this.state.feedHasToChange}
                error={this.state.feedError}
                errorText={this.state.feedErrorText}
              />
            );
          }}
        />
        <Route
          exact
          path="/contentmanager/content_folder"
          render={() => {
            return (
              <ContentFolder
                user={this.props.user}
                feed={this.state.offlineFeed}
                offlineContent={this.state.content.shownOfflineContent}
                offlineFullContent={this.state.content.offlineContent}
                group={this.state.offlineGroup}
                handleFolderChange={this.handleFolderChange}
                handleFolderAll={this.handleFolderAll}
                editFolder={this.editFolder}
                handleSearchChange={this.handleSearchChange}
                addToContent={this.addToContent}
                editGroup={this.editGroup}
                deleteGroup={this.deleteGroup}
                setIndex={index => {
                  this.setState({ chooseToEditIndex: index });
                }}
                updateContentHeads={content => {
                  this.setState({
                    content: {
                      offlineContent: content,
                      sortedOfflineContent: this.bestCopyEver(content),
                      shownOfflineContent: this.bestCopyEver(content)
                    }
                  });
                }}
              />
            );
          }}
        />
        <Route
          path="/contentmanager/content_creator"
          render={() => {
            if (this.state.content.offlineContent === null) {
              return (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <CircularProgress />
                </div>
              );
            } else {
              const indexFinden = () => {
                if (
                  this.props.location.pathname ===
                  "/contentmanager/content_creator/neu"
                ) {
                  return -1;
                }

                const t = this.state.content.offlineContent.findIndex(value => {
                  return (
                    this.props.location.pathname ===
                    "/contentmanager/content_creator/" + value.name
                  );
                });
                if (t !== -1) {
                  return t;
                } else {
                  return -3;
                }
              };
              const index =
                this.state.content.offlineContent === undefined
                  ? -2
                  : indexFinden();

              const newContent = {
                name: "",
                beschreibung: "",
                date: "0000-00-00",
                rank: 0,
                ContentID: -1,
                pictureID: -1,
                ueberschrift: "",
                beschreibungText: "",
                imgcontent: "none"
              };
              return (
                <ContentCreator
                  contentHead={
                    index >= 0
                      ? this.state.content.offlineContent[index]
                      : index === -1
                      ? newContent
                      : index === -2
                      ? { ContentID: -2 }
                      : { ContentID: -3 }
                  }
                  updateContentHeads={this.updateContentHeads}
                  //contentHead={{ ContentID: 1 }}
                  user={this.props.user}
                />
              );
            }
          }}
        />
      </div>
    );
  }
}

Contentmanager.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Contentmanager));
