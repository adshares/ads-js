import BigNumber from 'bignumber.js'
import Crypto from './crypto'
import Tx from './tx'
import {
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
import TxEncoder from './tx-encoder'

export default class Ads {
  static BLOCK_LENGTH = 512
  static DIVIDEND_LENGTH = 2048
  static TOTAL_SUPPLY = new BigNumber('3875820600000000000')
  static DERIVATION_PATH = 'm/44\'/311\'/'
  static TX_MIN_FEE = 10000
  static TX_BROADCAST_FEE = 1000
  static TX_CHANGE_KEY_FEE = 10000000
  static TX_LOCAL_TRANSFER_FEE = 0.0005
  static TX_REMOTE_TRANSFER_FEE = 0.0005

  static addressChecksum = addressChecksum
  static compareAddresses = compareAddresses
  static compareAddressesByNode = compareAddressesByNode
  static formatAddress = formatAddress
  static splitAddress = splitAddress
  static validateAddress = validateAddress
  static validateEthAddress = validateEthAddress
  static validateKey = validateKey

  static Crypto = Crypto
  static Tx = Tx

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
  static formatAdsMoney (amount, precision = 4, trim = false, decimal = '.', thousand = ',') {
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
  static formatClickMoney (value, precision = 11, trim = false, decimal = '.', thousand = ',') {
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
  static strToClicks (value) {
    const matches = value.match(/^([0-9]*)[.,]?([0-9]{0,11})[0-9]*$/)
    return matches ? new BigNumber(matches[1] + matches[2].padEnd(11, '0')) : null
  }

  /**
   * Calculates transaction fee.
   *
   * @param command command data object
   * @returns {number}
   */
  static calculateFee (command) {
    const encoder = new TxEncoder(command)
    let length
    let fee = 0
    switch (command[Tx.TX_FIELDS.TYPE]) {
      case Tx.TX_TYPES.BROADCAST:
        length = (encoder.encode(Tx.TX_FIELDS.MSG).lastEncodedField.length / 2) - 2
        fee = Ads.TX_MIN_FEE
        if (length > 32) {
          fee += (length - 32) * Ads.TX_BROADCAST_FEE
        }
        break

      case Tx.TX_TYPES.CHANGE_ACCOUNT_KEY:
        fee = Ads.TX_CHANGE_KEY_FEE
        break

      case Tx.TX_TYPES.SEND_ONE:
        fee = command[Tx.TX_FIELDS.AMOUNT] * Ads.TX_LOCAL_TRANSFER_FEE
        if (!Ads.compareAddressesByNode(command[Tx.TX_FIELDS.SENDER],
          command[Tx.TX_FIELDS.ADDRESS])) {
          fee += command[Tx.TX_FIELDS.AMOUNT] * Ads.TX_REMOTE_TRANSFER_FEE
        }
        fee = Math.floor(fee)
        break
      default:
        break
    }

    return Math.max(Ads.TX_MIN_FEE, fee)
  }

  /**
   * Calculates transaction total amount.
   *
   * @param command command data object
   * @returns {number}
   */
  static calculateChargedAmount (command) {
    return Ads.calculateFee(command) + parseInt(command[Tx.TX_FIELDS.AMOUNT], 10)
  }

  /**
   * Calculates transaction received amount.
   *
   * @param externalFee external fee in clicks
   * @param command command data object
   * @returns {number}
   */
  static calculateReceivedAmount (externalFee, command) {
    return Math.max(0, parseInt(command[Tx.TX_FIELDS.AMOUNT], 10) - parseInt(externalFee, 10))
  }
}
