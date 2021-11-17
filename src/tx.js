import { TransactionDataError } from './errors'
import TxEncoder from './tx-encoder'
import { TX_FIELDS, TX_TYPES } from './const'
import TxDecoder from './tx-decoder'

export default class Tx {
  static TX_FIELDS = TX_FIELDS
  static TX_TYPES = TX_TYPES

  /**
   * Encodes command data.
   *
   * @param command command data object
   * @returns {string}
   */
  static encodeCommand (command) {
    const encoder = new TxEncoder(command)

    switch (encoder.type) {
      case TX_TYPES.BROADCAST:
        encoder.encode(TX_FIELDS.SENDER).encode(TX_FIELDS.MESSAGE_ID).encode(TX_FIELDS.TIME).encode(TX_FIELDS.MSG)
        break

      case TX_TYPES.CHANGE_ACCOUNT_KEY:
        encoder.encode(TX_FIELDS.SENDER).encode(TX_FIELDS.MESSAGE_ID).encode(TX_FIELDS.TIME).encode(TX_FIELDS.PUBLIC_KEY)
        break

      case TX_TYPES.CREATE_ACCOUNT:
        encoder.encode(TX_FIELDS.SENDER).encode(TX_FIELDS.MESSAGE_ID).encode(TX_FIELDS.TIME).encode(TX_FIELDS.NODE_ID).fill(8).encode(TX_FIELDS.PUBLIC_KEY)
        break

      case TX_TYPES.SEND_ONE:
        encoder.encode(TX_FIELDS.SENDER).encode(TX_FIELDS.MESSAGE_ID).encode(TX_FIELDS.TIME).encode(TX_FIELDS.ADDRESS).encode(TX_FIELDS.AMOUNT).encode(TX_FIELDS.MSG)
        break

      case TX_TYPES.CHANGE_NODE_KEY:
      case TX_TYPES.CREATE_NODE:
      case TX_TYPES.LOG_ACCOUNT:
      case TX_TYPES.GET_ACCOUNT:
      case TX_TYPES.GET_ACCOUNTS:
      case TX_TYPES.FIND_ACCOUNTS:
      case TX_TYPES.GET_BLOCK:
      case TX_TYPES.GET_BLOCKS:
      case TX_TYPES.GET_BROADCAST:
      case TX_TYPES.GET_FIELDS:
      case TX_TYPES.GET_LOG:
      case TX_TYPES.GET_MESSAGE:
      case TX_TYPES.GET_MESSAGE_LIST:
      case TX_TYPES.GET_SIGNATURES:
      case TX_TYPES.GET_TRANSACTION:
      case TX_TYPES.GET_VIPKEYS:
      case TX_TYPES.RETRIEVE_FUNDS:
      case TX_TYPES.SEND_AGAIN:
      case TX_TYPES.SEND_MANY:
      case TX_TYPES.SET_ACCOUNT_STATUS:
      case TX_TYPES.SET_NODE_STATUS:
      case TX_TYPES.UNSET_ACCOUNT_STATUS:
      case TX_TYPES.UNSET_NODE_STATUS:
      case TX_TYPES.GET_GATEWAYS:
      case TX_TYPES.GET_GATEWAY_FEE:
      case TX_TYPES.GET_TIMESTAMP:
        throw new TransactionDataError(`Unsupported type of transaction ${command[TX_FIELDS.TYPE]}`)

      default:
        throw new TransactionDataError(`Unknown type of transaction ${command[TX_FIELDS.TYPE]}`)
    }

    return encoder.encodedData.toUpperCase()
  }

  /**
   * Decodes command data.
   *
   * @param data string encoded command (hexadecimal characters)
   * @returns {object}
   */
  static decodeCommand (data) {
    const decoder = new TxDecoder(data)

    switch (decoder.type) {
      case TX_TYPES.BROADCAST:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.MSG_LEN).decode(TX_FIELDS.MSG)
        break

      case TX_TYPES.CHANGE_ACCOUNT_KEY:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.PUBLIC_KEY)
        break

      case TX_TYPES.CHANGE_NODE_KEY:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.NODE_ID).decode(TX_FIELDS.PUBLIC_KEY)
        break

      case TX_TYPES.CREATE_ACCOUNT:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.NODE_ID).skip(8).decode(TX_FIELDS.PUBLIC_KEY)
        break

      case TX_TYPES.CREATE_NODE:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME)
        break

      case TX_TYPES.GET_ACCOUNT:
        decoder.decode(TX_FIELDS.ADDRESS).decode(TX_FIELDS.TIME)
        break

      case TX_TYPES.GET_ACCOUNTS:
        decoder.decode(TX_FIELDS.TIME).decode(TX_FIELDS.BLOCK_ID)// previous block id
          .decode(TX_FIELDS.NODE_ID)
        break

      case TX_TYPES.GET_BLOCK:
        decoder.decode(TX_FIELDS.BLOCK_ID)// previous block id
          .decode(TX_FIELDS.TIME)
        break

      case TX_TYPES.GET_BLOCKS:
        decoder.decode(TX_FIELDS.TIME).decode(TX_FIELDS.BLOCK_ID_FROM).decode(TX_FIELDS.BLOCK_ID_TO)
        break

      case TX_TYPES.GET_BROADCAST:
        decoder.decode(TX_FIELDS.BLOCK_ID).decode(TX_FIELDS.TIME)
        break

      case TX_TYPES.GET_LOG:
        decoder.decode(TX_FIELDS.TIME)
        break

      case TX_TYPES.GET_MESSAGE:
        decoder.decode(TX_FIELDS.TIME).decode(TX_FIELDS.BLOCK_ID).decode(TX_FIELDS.NODE_ID).decode(TX_FIELDS.NODE_MESSAGE_ID)
        break

      case TX_TYPES.GET_MESSAGE_LIST:
        decoder.decode(TX_FIELDS.TIME).decode(TX_FIELDS.BLOCK_ID)
        break

      case TX_TYPES.GET_SIGNATURES:
        decoder.decode(TX_FIELDS.TIME).decode(TX_FIELDS.BLOCK_ID)
        break

      case TX_TYPES.GET_TRANSACTION:
        decoder.decode(TX_FIELDS.TIME).decode(TX_FIELDS.TRANSACTION_ID)
        break

      case TX_TYPES.GET_VIPKEYS:
        decoder.decode(TX_FIELDS.TIME).decode(TX_FIELDS.VIP_HASH)
        break

      case TX_TYPES.LOG_ACCOUNT:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME)
        break

      case TX_TYPES.RETRIEVE_FUNDS:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.ADDRESS)
        break

      case TX_TYPES.SEND_MANY:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.WIRE_COUNT).decode(TX_FIELDS.WIRES)
        break

      case TX_TYPES.SEND_ONE:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.ADDRESS).decode(TX_FIELDS.AMOUNT).decode(TX_FIELDS.MSG)
        break

      case TX_TYPES.SET_ACCOUNT_STATUS:
      case TX_TYPES.UNSET_ACCOUNT_STATUS:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.ADDRESS).decode(TX_FIELDS.STATUS_ACCOUNT)
        break

      case TX_TYPES.SET_NODE_STATUS:
      case TX_TYPES.UNSET_NODE_STATUS:
        decoder.decode(TX_FIELDS.MESSAGE_ID).decode(TX_FIELDS.TIME).decode(TX_FIELDS.NODE_ID).decode(TX_FIELDS.STATUS_NODE)
        break

      case TX_TYPES.GET_FIELDS:// function `get_fields` does not return `tx.data`
        throw new TransactionDataError('Transaction is not parsable')

      default:
        throw new TransactionDataError('Unknown type of transaction')
    }

    decoder.final()
    return decoder.decodedData
  }

  static decodeType (data) {
    return (new TxDecoder(data)).type
  }

  static decodeSender (data) {
    return (new TxDecoder(data)).sender
  }

  /**
   * Decode hex message.
   *
   * @param value message in hex
   * @param onlyPrintable decode only if printable
   * @returns {string}
   */
  static decodeMessage (value, onlyPrintable = true) {
    let hex = value === null || typeof value === 'undefined' ? '0' : value
    hex = hex.toString().trim().replace(/^0x/, '') // force conversion
    let str = ''
    for (let i = 0; i < hex.length; i += 2) {
      const chars = hex.substr(i, 2)
      const code = parseInt(chars, 16)
      if (code !== 0) {
        if (onlyPrintable && (code < 32 || code >= 127)) {
          str = '--- non-printable ---'
          break
        }
        str += String.fromCharCode(code)
      }
    }
    return str.length > 0 ? str : '--- empty ---'
  }
}
