export function passwordPolicy(password) {
  let returnValue = true;
  let message = null;

  //zwei Zahlen
  const numberRegex = new RegExp(/\d{1}/, ["g"]);
  const checkNumber = password.match(numberRegex);
  if (checkNumber === null || checkNumber.length < 2) {
    returnValue = false;
    message = "Das Passwort muss mindestens zwei Zahlen enthalten";
  }

  //mindestens ein großgeschriebener Buchstabe
  const bigLetterRegex = new RegExp(/[A-Z]/, ["g"]);
  const checkBigLetter = password.match(bigLetterRegex);
  if (checkBigLetter === null) {
    returnValue = false;
    message =
      "Das Passwort muss mindestens einen Buchstaben in Großschreibung enthalten";
  }

  //mindestens ein kleingeschriebener Buchstabe
  const smallLetterRegex = new RegExp(/[a-z]/, ["g"]);
  const checkSmallLetter = password.match(smallLetterRegex);
  if (checkSmallLetter === null) {
    returnValue = false;
    message =
      "Das Passwort muss mindestens einen Buchstaben in Kleinschreibung enthalten";
  }

  //mindestens ein kleingeschriebener Buchstabe
  const specialCharRegex = new RegExp(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, [
    "g"
  ]);
  const specialCharCheck = password.match(specialCharRegex);
  if (specialCharCheck === null) {
    returnValue = false;
    message =
      "Das Passwort muss mindestens einen Sonderzeichen (@#$%^&*()_+-=[]{};':\"|,.<>/?\\) enthalten";
  }

  if (password.length < 8) {
    returnValue = false;
    message = "Passwort muss mindestens 8 Zeichen lang sein";
  }
  if (password.length > 20) {
    returnValue = false;
    message = "Passwort darf höchstens 20 Zeichen lang sein";
  }

  console.log(returnValue);
  console.log(message);
  return { conforms: returnValue, message };
}
