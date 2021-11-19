import BigNumber from 'bignumber.js'
import { TX_FIELDS, TX_TYPES, TX_TYPES_MAP } from './const'
import { TransactionDataError } from './errors'
import { fixByteOrder } from './hex'
import { formatAddress } from './utils'

export default class TxDecoder {
  constructor (data) {
    this.data = data
    this.resp = {}
    this.parsed = null
    this.decode(TX_FIELDS.TYPE)
    if (this.type !== TX_TYPES.GET_FIELDS) {
      this.decode(TX_FIELDS.SENDER)
    }
  }

  #validateLength (fieldName, expectedLength, strict) {
    if ((this.data.length < expectedLength) || (strict && this.data.length > expectedLength)) {
      throw new TransactionDataError(
        `Invalid ${fieldName} data length; expected ${expectedLength} - got ${this.data.length}`)
    }
  }

  decode (fieldName) {
    let parsed
    switch (fieldName) {
      case TX_FIELDS.ADDRESS:
      case TX_FIELDS.SENDER: {
        this.#validateLength(fieldName, 12)
        const node = fixByteOrder(this.data.substr(0, 4))
        const user = fixByteOrder(this.data.substr(4, 8))
        parsed = formatAddress(node, user)
        this.data = this.data.substr(12)
        break
      }
      case TX_FIELDS.AMOUNT: {
        this.#validateLength(fieldName, 16)
        parsed = fixByteOrder(this.data.substr(0, 16))
        // parsed = formatMoney(parseInt(parsed, 16) / 100000000000, 11);
        // eslint-disable-next-line new-cap,no-undef
        parsed = new BigNumber(`0x${parsed}`)
        this.data = this.data.substr(16)
        break
      }
      case TX_FIELDS.BLOCK_ID:
      case TX_FIELDS.BLOCK_ID_FROM:
      case TX_FIELDS.BLOCK_ID_TO: {
        this.#validateLength(fieldName, 8)
        parsed = fixByteOrder(this.data.substr(0, 8))
        // parsed = new Date(parseInt(parsed, 16) * 1000);
        this.data = this.data.substr(8)
        break
      }
      case TX_FIELDS.TIME: {
        this.#validateLength(fieldName, 8)
        const time = fixByteOrder(this.data.substr(0, 8))
        parsed = new Date(parseInt(time, 16) * 1000)
        this.data = this.data.substr(8)
        break
      }
      case TX_FIELDS.MSG: {
        const expectedLength = (this.resp[TX_FIELDS.TYPE] === TX_TYPES.SEND_ONE) ? 64 : this.resp[TX_FIELDS.MSG_LEN] * 2
        this.#validateLength(fieldName, expectedLength, true)
        parsed = this.data
        this.data = ''
        break
      }
      case TX_FIELDS.MSG_LEN: {
        this.#validateLength(fieldName, 4)
        parsed = fixByteOrder(this.data.substr(0, 4))
        parsed = parseInt(parsed, 16)
        this.data = this.data.substr(4)
        break
      }
      case TX_FIELDS.MESSAGE_ID:
      case TX_FIELDS.NODE_MESSAGE_ID: {
        this.#validateLength(fieldName, 8)
        parsed = fixByteOrder(this.data.substr(0, 8))
        parsed = parseInt(parsed, 16)
        this.data = this.data.substr(8)
        break
      }
      case TX_FIELDS.NODE_ID: {
        this.#validateLength(fieldName, 4)
        parsed = fixByteOrder(this.data.substr(0, 4))
        this.data = this.data.substr(4)
        break
      }
      case TX_FIELDS.PUBLIC_KEY:
      case TX_FIELDS.VIP_HASH: {
        this.#validateLength(fieldName, 64)
        // intentional lack of reverse - key and hash are not reversed
        parsed = this.data.substr(0, 64)
        this.data = this.data.substr(64)
        break
      }
      case TX_FIELDS.STATUS_ACCOUNT: {
        this.#validateLength(fieldName, 4)
        parsed = fixByteOrder(this.data.substr(0, 4))
        parsed = parseInt(parsed, 16)
        this.data = this.data.substr(4)
        break
      }
      case TX_FIELDS.STATUS_NODE: {
        this.#validateLength(fieldName, 8)
        parsed = fixByteOrder(this.data.substr(0, 8))
        // node status has 32 bits
        // operation ' | 0' changes parsed type to int32
        /* eslint no-bitwise: ["error", { "int32Hint": true }] */
        parsed = parseInt(parsed, 16)
        this.data = this.data.substr(8)
        break
      }
      case TX_FIELDS.TRANSACTION_ID: {
        this.#validateLength(fieldName, 16)
        const node = fixByteOrder(this.data.substr(0, 4))
        const msgId = fixByteOrder(this.data.substr(4, 8))
        const txOffset = fixByteOrder(this.data.substr(12, 4))
        parsed = `${node}:${msgId}:${txOffset}`
        this.data = this.data.substr(16)
        break
      }
      case TX_FIELDS.TYPE: {
        this.#validateLength(fieldName, 2)
        // intentional lack of reverse - 1 byte does not need to be reversed
        const type = this.data.substr(0, 2)
        parsed = TX_TYPES_MAP[type]
        this.data = this.data.substr(2)
        break
      }
      case TX_FIELDS.WIRE_COUNT: {
        this.#validateLength(fieldName, 4)
        const count = fixByteOrder(this.data.substr(0, 4))
        parsed = parseInt(count, 16)
        this.data = this.data.substr(4)
        break
      }
      case TX_FIELDS.WIRES: {
        const count = this.resp[TX_FIELDS.WIRE_COUNT]
        const expLength = count * 28// 4+8+16(node+user+amount)
        this.#validateLength(fieldName, expLength)

        parsed = []
        for (let i = 0; i < count; i += 1) {
          const node = fixByteOrder(this.data.substr(0, 4))
          const user = fixByteOrder(this.data.substr(4, 8))
          const amount = fixByteOrder(this.data.substr(12, 16))
          const address = formatAddress(node, user)
          parsed.push({
            [TX_FIELDS.ADDRESS]: address,
            // eslint-disable-next-line new-cap,no-undef
            [TX_FIELDS.AMOUNT]: new BigNumber(`0x${amount}`)
          })
          this.data = this.data.substr(28)
        }
        break
      }

      default:
        throw new TransactionDataError('Invalid transaction field type')
    }

    this.resp[fieldName] = parsed
    this.parsed = parsed

    return this
  }

  skip (charCount) {
    this.parsed = this.data.substr(0, charCount)
    this.data = this.data.substr(charCount)
    return this
  }

  final () {
    this.#validateLength('extra', 0, true)
  }

  get type () {
    return this.resp[TX_FIELDS.TYPE]
  }

  get sender () {
    return this.resp[TX_FIELDS.SENDER]
  }

  get lastDecodedField () {
    return this.parsed
  }

  get decodedData () {
    return this.resp
  }
}
