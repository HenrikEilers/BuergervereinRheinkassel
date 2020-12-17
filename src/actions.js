import axios from "axios";

export const postRequest = (url, user, load, callback) => {
  axios
    .post(
      url,
      {
        authentication: {
          email: user.email,
          password: user.password
        },
        load
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
    .then((response) => {
      //console.log({ request: load, response, url });
      callback(response);
    })
    .catch((err) => console.log(err));
};

export const getRequestwithAu = (url, user, callback) => {
  axios
    .post(
      url,
      {
        authentication: {
          email: user.email,
          password: user.password
        }
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
    .then((response) => {
      callback(response);
    })
    .catch((err) => console.log(err));
};

export const postUploadPicture = (
  user,
  uploadFile,
  uploadName,
  uploadType,
  uploadImageSrc,
  uploadWidth,
  uploadHeight,
  date,
  uploadGroups,
  callback,
  progress
) => {
  const formData = new FormData();

  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("uploadFile", uploadFile);
  formData.append("uploadName", uploadName);
  formData.append("uploadType", uploadType);

  formData.append("uploadWidth", uploadWidth);
  formData.append("uploadHeight", uploadHeight);
  formData.append("date", date);
  formData.append("uploadGroups", JSON.stringify(uploadGroups));

  axios
    .post(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/uploadPicture.php",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          progress((progressEvent.loaded / progressEvent.total) * 100);
        }
      }
    )
    .then((response) => {
      callback(response);
    })
    .catch((err) => console.log(err));
};

export const postUploadFile = (user, file, callback, progress) => {
  const formData = new FormData();

  formData.append("email", user.email);
  formData.append("password", user.password);
  formData.append("file", file.file);
  formData.append("fileName", file.fileName);
  formData.append("fileRank", file.fileRank);
  formData.append("filePath", file.filePath);

  axios
    .post(
      "https://www.buergerverein-rheindoerfer.de/phpTest/Files/fileUpload.php",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          progress((progressEvent.loaded / progressEvent.total) * 100);
        }
      }
    )
    .then((response) => {
      callback(response);
    })
    .catch((err) => console.log(err));
};

export const downloadFile = (user, fileID) => {
  const callback = (response) => {
    var fileDownload = require("js-file-download");
    fileDownload(
      response.data,
      response.headers["content-disposition"].substring(21)
    );
  };
  const load = { fileID };
  const url =
    "https://www.buergerverein-rheindoerfer.de/phpTest/Files/fileDownload.php";

  axios
    .post(
      url,
      {
        authentication: {
          email: user.email,
          password: user.password
        },
        load
      },
      {
        responseType: "blob",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
    .then((response) => {
      callback(response);
    })
    .catch((err) => console.log(err));
};

export const downloadDatenschutz = (user) => {
  const callback = (response) => {
    var fileDownload = require("js-file-download");
    fileDownload(
      response.data,
      response.headers["content-disposition"].substring(21)
    );
  };
  const url =
    "https://www.buergerverein-rheindoerfer.de/phpTest/Impressum/downloadDatenschutz.php";

  axios
    .post(
      url,
      {
        authentication: {
          email: user.email,
          password: user.password
        }
      },
      {
        responseType: "blob",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
    .then((response) => {
      callback(response);
    })
    .catch((err) => console.log(err));
};
