import Hex from './hex'

export function crc16 (data) {
  const d = Hex.hexToByte(Hex.sanitizeHex(data))
  let crc = 0x1d0f
  for (const b of d) {
    let x = (crc >> 8) ^ b
    x ^= x >> 4
    crc = ((crc << 8) ^ ((x << 12)) ^ ((x << 5)) ^ (x)) & 0xFFFF
  }
  const result = `0000${crc.toString(16)}`
  return result.substr(result.length - 4)
}

/**
 * Calculates a ADS account address checksum.
 *
 * @param nodeId the node id (4 hexadecimal characters)
 * @param userAccountId the id of the user account (8 hexadecimal characters)
 * @returns {string} the account address checksum (4 hexadecimal characters)
 */
export function addressChecksum (nodeId, userAccountId) {
  return Hex.sanitizeHex(crc16(`${Hex.sanitizeHex(nodeId)}${Hex.sanitizeHex(userAccountId)}`))
}

/**
 * Formats ADS account address.
 *
 * @param nodeId node identifier
 * @param userAccountId user account identifier
 * @returns {string} formatted address
 */
export function formatAddress (nodeId, userAccountId) {
  return `${Hex.sanitizeHex(nodeId)}-${Hex.sanitizeHex(userAccountId)}-${addressChecksum(nodeId, userAccountId)}`
}

/**
 * Splits ADS account address into parts.
 *
 * @param address ADS account address
 * @returns {{nodeId: string, userAccountId: string, checksum: string}|null}
 */
export function splitAddress (address) {
  const addressRegexp = /^([0-9a-fA-F]{4})-([0-9a-fA-F]{8})-([0-9a-fA-F]{4}|XXXX)$/
  const matches = addressRegexp.exec(address)
  if (!matches) {
    return null
  }
  return {
    nodeId: Hex.sanitizeHex(matches[1]),
    userAccountId: Hex.sanitizeHex(matches[2]),
    checksum: matches[3] === 'XXXX'
      ? addressChecksum(matches[1], matches[2])
      : Hex.sanitizeHex(matches[3])
  }
}

/**
 * Compares two ADS account addresses.
 *
 * @param address1 ADS account address
 * @param address2 ADS account address
 * @returns {boolean}
 */
export function compareAddresses (address1, address2) {
  const a1 = splitAddress(address1)
  const a2 = splitAddress(address2)
  return a1 && a2 && a1.nodeId === a2.nodeId && a1.userAccountId === a2.userAccountId
}

/**
 * Compares two ADS account addresses (node number only).
 *
 * @param address1 ADS account address
 * @param address2 ADS account address
 * @returns {boolean}
 */
export function compareAddressesByNode (address1, address2) {
  const a1 = splitAddress(address1)
  const a2 = splitAddress(address2)
  return a1 && a2 && a1.nodeId === a2.nodeId
}

/**
 * Checks if ADS account address is valid.
 *
 * @param address ADS account address
 * @returns {boolean}
 */
export function validateAddress (address) {
  if (!address) {
    return false
  }
  const parts = splitAddress(address)
  if (!parts || !parts.nodeId || !parts.userAccountId || !parts.checksum) {
    return false
  }
  return parts.checksum === addressChecksum(parts.nodeId, parts.userAccountId)
}

/**
 * Checks if ADS public or secret key is valid.
 *
 * @param key (64 hexadecimal characters)
 * @returns {boolean}
 */
export function validateKey (key) {
  if (!key) {
    return false
  }
  const keyRegexp = /^[0-9a-fA-F]{64}$/
  return keyRegexp.test(key)
}

/**
 * Checks if ETH account address is valid.
 *
 * @param address e.g. 0001-00000001-8B4E
 * @returns {boolean}
 */
export function validateEthAddress (address) {
  if (!address) {
    return false
  }
  return /^(0x)?[0-9a-fA-F]{40}$/.test(address.trim())
}

export function formatNumber (amount, precision = 2, trim = true, decimal = '.', thousand = ',') {
  return (Number(amount) || 0).toFixed(precision)
    .replace(/([0-9]{2})(0+)$/, trim ? '$1' : '$1$2')
    .replace(/\d(?=(\d{3})+\.)/g, `$&${thousand}`)
    .replace('.', decimal)
}

export function formatPercent (amount, precision = 2, trim = false, decimal = '.', thousand = ',') {
  return `${formatNumber(100 * (Number(amount) || 0), precision, trim, decimal, thousand)}%`
}
