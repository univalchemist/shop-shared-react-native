/* istanbul ignore file */
//  /(?<=code:)(.*)(?=,)/; this regex not working when run app, so I do a work around by split it into 2 regex
const regGetStringCode = /(?=code:)(.*)(?=,)/i;
const regGetCode = /\d+/;

export const ERR_CANCEL = 13;
export const ERR_MANY_ATTEMP = 7;
export const ERR_BIOMETRIC_DISABLE = 9;

//TODO this info from react-native-keychain error callback, might useful in the future
export const errorMap = {
  ERR_MANY_ATTEMP: 'Too many attempts. Try again later.',
  ERR_CANCEL: 'Cancel',
  ERR_BIOMETRIC_DISABLE: 'Too many attempts. Fingerprint sensor disabled.',
};

export const getErrorCode = msg => {
  const arrParse = regGetStringCode.exec(msg);
  if (!arrParse) return arrParse;
  const arrCodeArr = regGetCode.exec(arrParse[0]);
  if (!arrCodeArr) return arrCodeArr;
  return parseInt(arrCodeArr[0]);
};
