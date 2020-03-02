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
    .then(response => {
      callback(response);
    })
    .catch(err => console.log(err));
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
    .then(response => {
      callback(response);
    })
    .catch(err => console.log(err));
};

export const postUploadPicture = (
  user,
  uploadFile,
  uploadName,
  uploadType,
  uploadImageSrc,
  uploadWidth,
  uploadHeight,
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

  axios
    .post(
      "https://www.buergerverein-rheindoerfer.de/phpTest/ContentManagerSet/uploadPicture.php",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          progress((progressEvent.loaded / progressEvent.total) * 100);
        }
      }
    )
    .then(response => {
      callback(response);
    })
    .catch(err => console.log(err));
};
