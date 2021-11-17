import NaCl from 'tweetnacl'
import CryptoJS from 'crypto-js'
import Hex from './hex'

export class Crypto {
  static ED25519_CURVE = 'ed25519 seed'
  static HARDENED_OFFSET = 0x80000000
  static pathRegex = /^m(\/[0-9]+')+$/

  static replaceDerive = val => (val.replace('\'', ''))

  /**
   * Returns secret key derived from seed phrase.
   *
   * @param seed seed phrase
   * @returns {string} secret key (64 hexadecimal characters)
   */
  static getSecretKey = (seed) => {
    return CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex)
  }

  /**
   * Returns public key derived from secret key.
   *
   * @param secretKey secret key (64 hexadecimal characters)
   * @returns {string} public key (64 hexadecimal characters)
   */
  static getPublicKey = (secretKey) => {
    const { publicKey } = NaCl.sign.keyPair.fromSeed(Hex.hexToByte(secretKey))
    return Hex.byteToHex(publicKey)
  }

  static isValidPath = (path) => {
    if (!Crypto.pathRegex.test(path)) {
      return false
    }
    return !path.split('/').slice(1).map(Crypto.replaceDerive).some(isNaN)
  }

  static ckdPriv = ({
    key,
    chainCode
  }, index) => {
    const hash = CryptoJS.HmacSHA512(
      CryptoJS.enc.Hex.parse(`00${key}${index.toString(16)}`),
      CryptoJS.enc.Hex.parse(chainCode)
    ).toString(CryptoJS.enc.Hex)
    return {
      key: hash.slice(0, 64),
      chainCode: hash.slice(64)
    }
  }

  /**
   * Returns master key derived from seed.
   *
   * @param seed private key seed (hexadecimal characters)
   * @returns {{chainCode: string, key: string}}
   */
  static getMasterKey = (seed) => {
    const hash = CryptoJS.HmacSHA512(
      CryptoJS.enc.Hex.parse(seed),
      Crypto.ED25519_CURVE
    ).toString(CryptoJS.enc.Hex)
    return {
      key: hash.slice(0, 64),
      chainCode: hash.slice(64)
    }
  }

  /**
   * Returns next derived key from seed.
   *
   * @param path derive path
   * @param seed private key seed (hexadecimal characters)
   * @returns {{chainCode: string, key: string}}
   */
  static getNextKey = (path, seed) => {
    if (!Crypto.isValidPath(path)) {
      throw new Error('Invalid derivation path')
    }
    const {
      key,
      chainCode
    } = Crypto.getMasterKey(seed)
    const segments = path.split('/')
      .slice(1)
      .map(Crypto.replaceDerive)
      .map(el => parseInt(el, 10))
    return segments.reduce(
      (parentKeys, segment) => Crypto.ckdPriv(parentKeys, segment + Crypto.HARDENED_OFFSET),
      {
        key,
        chainCode
      }
    )
  }

  /**
   * Signs data with a secret key.
   *
   * @param secretKey secret key 32 bytes
   * @param data data (hexadecimal characters); in case of transaction: `tx.account_hashin` + `tx.data`
   * @returns {string} signature 64 bytes
   */
  static sign (secretKey, data) {
    return Hex.byteToHex(NaCl.sign.detached(
      Hex.hexToByte(data),
      Hex.hexToByte(secretKey + Crypto.getPublicKey(secretKey))
    ))
  }

  /**
   * Signs text with a secret key.
   *
   * @param secretKey secret key 32 bytes
   * @param text data text
   * @returns {string} signature 64 bytes
   */
  static signText (secretKey, text) {
    return Crypto.sign(secretKey, Hex.stringToHex(text))
  }

  /**
   * Validates signature.
   *
   * @param signature (128 hexadecimal characters)
   * @param publicKey (64 hexadecimal characters)
   * @param data data (hexadecimal characters)
   * @returns {boolean}
   */
  static validateSignature (signature, publicKey, data) {
    return NaCl.sign.detached.verify(
      Hex.hexToByte(data),
      Hex.hexToByte(signature),
      Hex.hexToByte(publicKey)
    )
  }
}

export default Crypto
