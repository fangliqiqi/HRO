import CryptoJS from 'crypto-js'

export function encrypt(word, keyStr) {
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString()
}

export function format(str) {
  if (str.length >= 16) {
    return str.substring(0, 16)
  } else {
    var max = 16 - str.length;
    for (var i = 0; i < max; i++) {
      str += "Y"
    }
    return str
  }
}