import { withStyles } from "@material-ui/core/styles";

import {} from "@material-ui/core";

import FileUpload from "./Phase/FileUpload.js";
import FilePicker from "./Phase/FilePicker.js";
import FileDelete from "./Phase/FileDelete.js";
import FileEdit from "./Phase/FileEdit.js";
import FileChooseEdit from "./Phase/FileChooseEdit.js";
import FileChooseEditFolder from "./Phase/FileChooseEditFolder.js";
import FileChooseUploadFolder from "./Phase/FileChooseUploadFolder.js";

//Componenten Phasen
import {
  FILE_PICK,
  FILE_UPLOAD,
  FILE_CHOOSE_EDIT,
  FILE_EDIT,
  FILE_DELETE,
  FILE_EDIT_FOLDER,
  FILE_UPLOAD_FOLDER
} from "./constants.js";

import { NEW_UPLOAD_FILE } from "./constants.js";

import React from "react";
const styles = (theme) => ({});

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUnderEdit: null,
      compareFileUnderEdit: null,
      editFileID: -1,
      location: ["Dateien"],
      files: null,
      stateOfComponent: FILE_PICK,
      uploadFile: NEW_UPLOAD_FILE
    };
  }

  render() {
    switch (this.state.stateOfComponent) {
      case FILE_PICK:
        return (
          <FilePicker
            user={this.props.user}
            location={this.state.location}
            files={this.state.files}
            returnFileData={this.props.returnFileData}
            onEdit={(files, location) =>
              this.setState({
                stateOfComponent: FILE_CHOOSE_EDIT,
                location,
                files
              })
            }
            onUpload={(files, location) =>
              this.setState({
                stateOfComponent: FILE_UPLOAD,
                location,
                files: null,
                uploadFile: {
                  ...this.state.uploadFile,
                  uploadPath: location.join("/")
                }
              })
            }
          />
        );
      case FILE_UPLOAD:
        return (
          <FileUpload
            user={this.props.user}
            file={this.state.uploadFile}
            onBack={() => {
              this.setState({
                stateOfComponent: FILE_PICK,
                files: null,
                uploadFile: NEW_UPLOAD_FILE
              });
            }}
            onUpload={(file) => {
              this.setState({
                stateOfComponent: FILE_EDIT,
                choosenFile: file,
                uploadFile: NEW_UPLOAD_FILE,
                editFileID: file.fileID,
                files: null
              });
            }}
            onFolderChange={(file) =>
              this.setState({
                stateOfComponent: FILE_UPLOAD_FOLDER,
                uploadFile: file
              })
            }
          />
        );

      case FILE_DELETE:
        return (
          <FileDelete
            user={this.props.user}
            FileID={this.state.editFileID}
            onAbort={() => this.setState({ stateOfComponent: FILE_EDIT })}
            onDeleteBack={() => {
              this.setState({
                stateOfComponent: FILE_CHOOSE_EDIT,
                files: null,
                location: ["Dateien"]
              });
            }}
          />
        );

      case FILE_EDIT:
        return (
          <FileEdit
            user={this.props.user}
            file={this.state.fileUnderEdit}
            compareFile={this.state.compareFileUnderEdit}
            FileID={this.state.editFileID}
            onDelete={(fileUnderEdit, compareFileUnderEdit) =>
              this.setState({
                stateOfComponent: FILE_DELETE,
                fileUnderEdit,
                compareFileUnderEdit
              })
            }
            onBack={() => {
              this.setState({
                stateOfComponent: FILE_CHOOSE_EDIT,
                fileUnderEdit: null,
                editFileID: -1,
                files: null
              });
            }}
            onEdit={() => this.setState({ files: null })}
            onFolderChange={(fileUnderEdit, compareFileUnderEdit) => {
              this.setState({
                stateOfComponent: FILE_EDIT_FOLDER,
                fileUnderEdit,
                compareFileUnderEdit
              });
            }}
          />
        );

      case FILE_CHOOSE_EDIT:
        return (
          <FileChooseEdit
            user={this.props.user}
            location={this.state.location}
            files={this.state.files}
            onBack={(files, location) => {
              this.setState({
                stateOfComponent: FILE_PICK,
                files,
                location
              });
            }}
            onEdit={(choosenFile, location) =>
              this.setState({
                stateOfComponent: FILE_EDIT,
                editFileID: choosenFile.fileID,
                location,
                files: null
              })
            }
          />
        );
      case FILE_EDIT_FOLDER:
        return (
          <FileChooseEditFolder
            user={this.props.user}
            location={this.state.fileUnderEdit.filePath.split("/")}
            files={this.state.files}
            onBack={() => {
              this.setState({
                stateOfComponent: FILE_EDIT
              });
            }}
            onChoose={(path, files) =>
              this.setState({
                stateOfComponent: FILE_EDIT,
                fileUnderEdit: { ...this.state.fileUnderEdit, filePath: path },
                files
              })
            }
          />
        );
      case FILE_UPLOAD_FOLDER:
        return (
          <FileChooseUploadFolder
            user={this.props.user}
            location={
              this.state.uploadFile.filePath === NEW_UPLOAD_FILE.filePath
                ? ["Dateien"]
                : this.state.uploadFile.filePath.split("/")
            }
            files={this.state.files}
            onBack={() => {
              this.setState({
                stateOfComponent: FILE_UPLOAD
              });
            }}
            onChoose={(path, files) =>
              this.setState({
                stateOfComponent: FILE_UPLOAD,
                uploadFile: { ...this.state.uploadFile, filePath: path },
                files
              })
            }
          />
        );
      default:
        return null;
    }
  }
}

FileBrowser.propTypes = {};

export default withStyles(styles)(FileBrowser);
