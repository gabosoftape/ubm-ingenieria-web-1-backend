import * as CryptoJS from "crypto-js"

const Md5 = (world: string): CryptoJS.lib.WordArray => {
  return CryptoJS.MD5(world);
}

const catabumKey = Md5('drivercloud-prime')

export const Encrypt = (plainText: string): string => {
  const key = CryptoJS.enc.Utf8.parse(catabumKey.toString(CryptoJS.enc.Hex))
  const iv = CryptoJS.enc.Utf8.parse(catabumKey.toString(CryptoJS.enc.Hex).substring(0, 16))
  const cipher = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })
  return cipher.ciphertext.toString(CryptoJS.enc.Hex)
}

export const Decrypt = (encryptedHex: string): string => {
  const key = CryptoJS.enc.Utf8.parse(catabumKey.toString(CryptoJS.enc.Hex))
  const iv = CryptoJS.enc.Utf8.parse(catabumKey.toString(CryptoJS.enc.Hex).substring(0, 16))
  return CryptoJS.AES.decrypt({ciphertext: CryptoJS.enc.Hex.parse(encryptedHex)} as CryptoJS.lib.CipherParams, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  }).toString(CryptoJS.enc.Latin1)
}
