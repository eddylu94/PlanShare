const generateConfirmationCode = () => {
  const CONFIRMATION_CODE_LENGTH = 5;

  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < CONFIRMATION_CODE_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const btoa = str => {
  return Buffer.from(str).toString("base64");
};

const generateHexString = () => {
  const HEX_STRING_LENGTH = 26;

  let ret = "";
  while (ret.length < HEX_STRING_LENGTH) {
    ret += Math.random()
      .toString(16)
      .substring(2);
  }
  return ret.substring(0, HEX_STRING_LENGTH);
};

const generateAuthKey = () => {
  return btoa(generateHexString());
};

const generateAuthToken = () => {
  return {
    date: new Date().getTime(),
    key: generateAuthKey()
  };
};

module.exports = {
  generateConfirmationCode,
  generateAuthToken
};
