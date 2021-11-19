import BigNumber from 'bignumber.js'
import TxEncoder from './tx-encoder'
import { compareAddressesByNode, formatNumber } from './utils'
import Tx from './tx'

export { default as Crypto } from './crypto'
export { Tx }
export {
  addressChecksum,
  compareAddresses,
  compareAddressesByNode,
  formatAddress,
  formatNumber,
  splitAddress,
  validateAddress,
  validateEthAddress,
  validateKey
} from './utils'

export const BLOCK_LENGTH = 512
export const DIVIDEND_LENGTH = 2048
export const TOTAL_SUPPLY = new BigNumber('3875820600000000000')
export const DERIVATION_PATH = 'm/44\'/311\'/'
export const TX_MIN_FEE = 10000
export const TX_BROADCAST_FEE = 1000
export const TX_CHANGE_KEY_FEE = 10000000
export const TX_LOCAL_TRANSFER_FEE = 0.0005
export const TX_REMOTE_TRANSFER_FEE = 0.0005

/**
 * Formats ADS amount
 *
 * @param amount
 * @param precision
 * @param trim
 * @param decimal
 * @param thousand
 * @returns {*}
 */
export function formatAdsMoney (amount, precision = 4, trim = false, decimal = '.', thousand = ',') {
  return formatNumber(amount, precision, trim, decimal, thousand)
}

/**
 * Formats ADS amount in clicks
 *
 * @param value
 * @param precision
 * @param trim
 * @param decimal
 * @param thousand
 * @returns {string}
 */
export function formatClickMoney (value, precision = 11, trim = false, decimal = '.', thousand = ',') {
  const p = Math.max(precision, 2)
  let v = value

  v = (`${v || '0'}`).padStart(11, '0')
  const l = v.length - 11
  const a = v.substr(0, l) || '0'
  const j = a.length > 3 ? a.length % 3 : 0
  let b = Math.round(parseInt((`${v}0`).substr(l, p + 1), 10) / 10)
    .toString()
    .padStart(p, '0')

  if (trim) {
    b = b.replace(/([0-9]{2})0+$/, '$1')
  }

  return (
    (j ? a.substr(0, j) + thousand : '') +
    a.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousand}`) +
    decimal +
    b
  )
}

/**
 * Converts ADS amount in clicks from string to number
 *
 * @param value
 * @returns {BigNumber|null}
 */
export function strToClicks (value) {
  const matches = value.match(/^([0-9]*)[.,]?([0-9]{0,11})[0-9]*$/)
  return matches ? new BigNumber(matches[1] + matches[2].padEnd(11, '0')) : null
}

/**
 * Calculates transaction fee.
 *
 * @param command command data object
 * @returns {number}
 */
export function calculateFee (command) {
  const encoder = new TxEncoder(command)
  let length
  let fee = 0
  switch (command[Tx.TX_FIELDS.TYPE]) {
    case Tx.TX_TYPES.BROADCAST:
      length = (encoder.encode(Tx.TX_FIELDS.MSG).lastEncodedField.length / 2) - 2
      fee = TX_MIN_FEE
      if (length > 32) {
        fee += (length - 32) * TX_BROADCAST_FEE
      }
      break

    case Tx.TX_TYPES.CHANGE_ACCOUNT_KEY:
      fee = TX_CHANGE_KEY_FEE
      break

    case Tx.TX_TYPES.SEND_ONE:
      fee = command[Tx.TX_FIELDS.AMOUNT] * TX_LOCAL_TRANSFER_FEE
      if (!compareAddressesByNode(command[Tx.TX_FIELDS.SENDER],
        command[Tx.TX_FIELDS.ADDRESS])) {
        fee += command[Tx.TX_FIELDS.AMOUNT] * TX_REMOTE_TRANSFER_FEE
      }
      fee = Math.floor(fee)
      break
    default:
      break
  }

  return Math.max(TX_MIN_FEE, fee)
}

/**
 * Calculates transaction total amount.
 *
 * @param command command data object
 * @returns {number}
 */
export function calculateChargedAmount (command) {
  return calculateFee(command) + parseInt(command[Tx.TX_FIELDS.AMOUNT], 10)
}

/**
 * Calculates transaction received amount.
 *
 * @param externalFee external fee in clicks
 * @param command command data object
 * @returns {number}
 */
export function calculateReceivedAmount (externalFee, command) {
  return Math.max(0, parseInt(command[Tx.TX_FIELDS.AMOUNT], 10) - parseInt(externalFee, 10))
}
