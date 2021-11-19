import NaCl from 'tweetnacl'
import CryptoJS from 'crypto-js'
import { byteToHex, hexToByte, stringToHex } from './hex'

const ED25519_CURVE = 'ed25519 seed'
const HARDENED_OFFSET = 0x80000000
const pathRegex = /^m(\/[0-9]+')+$/

function replaceDerive (val) { return val.replace('\'', '') }

function isValidPath (path) {
  if (!pathRegex.test(path)) {
    return false
  }
  return !path.split('/').slice(1).map(replaceDerive).some(isNaN)
}

function ckdPriv ({
  key,
  chainCode
}, index) {
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
 * Returns secret key derived from seed phrase.
 *
 * @param seed seed phrase
 * @returns {string} secret key (64 hexadecimal characters)
 */
export function getSecretKey (seed) {
  return CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex)
}

/**
 * Returns public key derived from secret key.
 *
 * @param secretKey secret key (64 hexadecimal characters)
 * @returns {string} public key (64 hexadecimal characters)
 */
export function getPublicKey (secretKey) {
  const { publicKey } = NaCl.sign.keyPair.fromSeed(hexToByte(secretKey))
  return byteToHex(publicKey)
}

/**
 * Returns master key derived from seed.
 *
 * @param seed private key seed (hexadecimal characters)
 * @returns {{chainCode: string, key: string}}
 */
export function getMasterKey (seed) {
  const hash = CryptoJS.HmacSHA512(
    CryptoJS.enc.Hex.parse(seed),
    ED25519_CURVE
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
export function getNextKey (path, seed) {
  if (!isValidPath(path)) {
    throw new Error('Invalid derivation path')
  }
  const {
    key,
    chainCode
  } = getMasterKey(seed)
  const segments = path.split('/')
    .slice(1)
    .map(replaceDerive)
    .map(el => parseInt(el, 10))
  return segments.reduce(
    (parentKeys, segment) => ckdPriv(parentKeys, segment + HARDENED_OFFSET),
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
export function sign (secretKey, data) {
  return byteToHex(NaCl.sign.detached(
    hexToByte(data),
    hexToByte(secretKey + getPublicKey(secretKey))
  ))
}

/**
 * Signs text with a secret key.
 *
 * @param secretKey secret key 32 bytes
 * @param text data text
 * @returns {string} signature 64 bytes
 */
export function signText (secretKey, text) {
  return sign(secretKey, stringToHex(text))
}

/**
 * Validates signature.
 *
 * @param signature (128 hexadecimal characters)
 * @param publicKey (64 hexadecimal characters)
 * @param data data (hexadecimal characters)
 * @returns {boolean}
 */
export function validateSignature (signature, publicKey, data) {
  return NaCl.sign.detached.verify(
    hexToByte(data),
    hexToByte(signature),
    hexToByte(publicKey)
  )
}
