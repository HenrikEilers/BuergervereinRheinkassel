//Erstellt eine Object das die ordner Strucktur simuliert und gibt es zurück
export const createTree = (files) => {
  const fileTree = {};

  const createFolders = (path, file, obj) => {
    if (path.length !== 0) {
      if (obj[path[0]] === undefined) {
        obj[path[0]] = {};
      }
      var tmp = obj[path[0]];
      path.shift();
      createFolders(path, file, tmp);
    } else {
      obj[file.fileID] = file;
    }
  };
  fileTree.Dateien = {};
  for (var file of files) {
    var path = file.filePath.split("/");
    if (path[0] === "") {
      path.shift();
    }
    if (path[path.length - 1] === "") {
      path.pop();
    }
    createFolders(path, file, fileTree);
  }
  return fileTree;
};

//Wählt eine Bestimmten Ordner mit hilfe des path aus
export const gotoFolder = (path, files) => {
  if (files === null) {
    return null;
  }
  var temp = files;
  for (let folder of path) {
    if (temp[folder] !== undefined) {
      temp = temp[folder];
    } else {
      continue;
    }
  }
  return temp;
};
