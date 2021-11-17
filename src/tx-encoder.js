import Hex from './hex'
import { TransactionDataError } from './errors'
import { TX_FIELDS, TX_TYPES, TX_TYPES_MAP } from './const'
import { splitAddress, validateAddress, validateKey } from './utils'
import BigNumber from 'bignumber.js'

export default class TxEncoder {
  constructor (obj) {
    this.obj = obj
    this.data = ''
    this.parsed = null
    this.encode(TX_FIELDS.TYPE)
  }

  #validateLength (fieldName, value, maxLength) {
    if (value.length > maxLength) {
      throw new TransactionDataError(`Length of ${fieldName} cannot exceed ${maxLength / 2} bytes`)
    }
  }

  encode (fieldName) {
    let data
    let val = this.obj[fieldName]
    if (typeof val === 'undefined' || val === null) {
      throw new TransactionDataError(`Undefined transaction filed ${fieldName}`)
    }

    switch (fieldName) {
      case TX_FIELDS.ADDRESS:
      case TX_FIELDS.SENDER: {
        if (!validateAddress(val)) {
          throw new TransactionDataError(`Invalid ADS address ${val}`)
        }
        const address = splitAddress(val)
        const node = Hex.fixByteOrder(this.pad(address.nodeId, 4))
        const user = Hex.fixByteOrder(this.pad(address.userAccountId, 8))
        data = node + user
        break
      }
      case TX_FIELDS.AMOUNT: {
        val = (new BigNumber(val)).toString(16)
        this.#validateLength(fieldName, val, 16)
        data = Hex.fixByteOrder(this.pad(val, 16))
        break
      }
      case TX_FIELDS.MESSAGE_ID:
      case TX_FIELDS.NODE_MESSAGE_ID: {
        val = val.toString(16)
        this.#validateLength(fieldName, val, 8)
        data = Hex.fixByteOrder(this.pad(val, 8))
        break
      }
      case TX_FIELDS.MSG: {
        if (this.obj[TX_FIELDS.TYPE] === TX_TYPES.SEND_ONE) {
          this.#validateLength(fieldName, val, 64)
          data = this.pad(val, 64)
        } else {
          let msg = val
          let len = msg.length
          if (len % 2 !== 0) {
            len += 1
            msg = `0${msg}`
          }
          len /= 2
          data = Hex.fixByteOrder(this.pad(len.toString(16), 4))
          data += msg
        }
        break
      }
      case TX_FIELDS.NODE_ID: {
        val = val.toString(16)
        this.#validateLength(fieldName, val, 4)
        data = Hex.fixByteOrder(this.pad(val, 4))
        break
      }
      case TX_FIELDS.PUBLIC_KEY: {
        if (!validateKey(val)) {
          throw new TransactionDataError(`Invalid public key ${val}`)
        }
        data = this.pad(val, 64)
        break
      }
      case TX_FIELDS.TIME: {
        const date = typeof val === 'object' ? val : new Date(val)
        const time = Math.floor(date.getTime() / 1000)
        data = Hex.fixByteOrder(this.pad(time.toString(16), 8))
        break
      }
      case TX_FIELDS.TYPE: {
        const type = Object.keys(TX_TYPES_MAP)
          .find(key => TX_TYPES_MAP[key] === val)
        data = type ? this.pad(type, 2) : null
        break
      }
      default:
        throw new TransactionDataError(`Invalid transaction field name ${fieldName}`)
    }
    this.parsed = data
    this.data += data

    return this
  }

  fill (charCount) {
    this.data += this.pad('', charCount)
    return this
  }

  get type () {
    return this.obj[TX_FIELDS.TYPE]
  }

  get lastEncodedField () {
    return this.parsed
  }

  get encodedData () {
    return this.data
  }

  pad = (field, length) => field.padStart(length, '0')
}
