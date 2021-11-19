const Ads = require('../dist/index.cjs')

// ---- decode ---------------------------------------------------------------------------------------------------------

test('decode type', () => {
  expect(Ads.decodeType('0301000000000001000000A1679B5B010000')).toEqual(Ads.TX_TYPES.BROADCAST)
})

test('decode sender', () => {
  expect(Ads.decodeSender('0301000000000001000000A1679B5B010000')).toEqual('0001-00000000-9B6F')
})

test('decode broadcast', () => {
  // {"type":"broadcast","sender":"0001-00000000-9B6F","messageId":1,"time":"2018-09-14T07:47:45.000Z","messageLength":1,"message":"00"}
  const data = '0301000000000001000000A1679B5B010000'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.BROADCAST)
  expect(parsedData[Ads.TX_FIELDS.MSG]).toBe('00')
  expect(parsedData[Ads.TX_FIELDS.MSG_LEN]).toBe(1)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(1)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536911265 * 1000))
})

test('decode broadcast no msg', () => {
  // {"run":"broadcast","message":"00"}
  const data = '0301000000000001000000A1679B5B0100'
  expect(() => {
    Ads.decodeCommand(data)
  }).toThrow('Invalid message data length; expected 2 - got 0')
})

test('decode broadcast invalid msg length', () => {
  // {"run":"broadcast","message":"00"}
  const data = '0301000000000001000000A1679B5B0100001'
  expect(() => {
    Ads.decodeCommand(data)
  }).toThrow('Invalid message data length; expected 2 - got 3')
})

test('decode change_account_key', () => {
  // {"run":"change_account_key",
  // "public_key":"EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E",
  // "confirm":
  // "1F0571D30661FB1D50BE0D61A0A0E97BAEFF8C030CD0269ADE49438A4AD4CF897
  // 367E21B100C694F220D922200B3AB852A377D8857A64C36CB1569311760F303"}
  const data = '090100000000000500000077CE485BEAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.CHANGE_ACCOUNT_KEY)
  expect(parsedData[Ads.TX_FIELDS.PUBLIC_KEY]).toBe(
    'EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E'
  )
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(5)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531498103 * 1000))
})

test('decode change_account_key extra data', () => {
  // {"run":"broadcast","message":"00"}
  const data = '090100000000000500000077CE485BEAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E1'
  expect(() => {
    Ads.decodeCommand(data)
  }).toThrow('Invalid extra data length; expected 0 - got 1')
})

test('decode change_node_key', () => {
  // {"run":"change_node_key",
  // "public_key":"EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E"}
  const data = '0A010000000000010000005CC2485B0000EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.CHANGE_NODE_KEY)
  expect(parsedData[Ads.TX_FIELDS.PUBLIC_KEY]).toBe(
    'EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E'
  )
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(1)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531495004 * 1000))
})

test('decode create_account', () => {
  // {"run":"create_account"}
  const data = '0601000000000004000000AB989B5B' +
    '010000000000A9C0D972D8AAB73805EC4A28291E052E3B5FAFE0ADC9D724917054E5E2690363'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.CREATE_ACCOUNT)
  expect(parsedData[Ads.TX_FIELDS.PUBLIC_KEY]).toBe(
    'A9C0D972D8AAB73805EC4A28291E052E3B5FAFE0ADC9D724917054E5E2690363'
  )
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(4)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536923819 * 1000))
})

test('decode create_node', () => {
  // {"run":"create_node"}
  const data = '070100000000000100000047C9485B'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.CREATE_NODE)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(1)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531496775 * 1000))
})

test('decode get_account', () => {
  // {"run":"get_account","address":"0001-00000000-9B6F"}
  const data = '100100000000000100010000001E6A9B5B'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_ACCOUNT)
  expect(parsedData[Ads.TX_FIELDS.ADDRESS]).toBe('0001-00000001-8B4E')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536911902 * 1000))
})

test('decode get_accounts', () => {
  // {"run":"get_accounts","node":2}
  const data = '180100000000009EA49B5B60A49B5B0200'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_ACCOUNTS)
  expect(parsedData[Ads.TX_FIELDS.NODE_ID]).toBe('0002')
  expect(parsedData[Ads.TX_FIELDS.BLOCK_ID]).toBe('5B9BA460')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536926878 * 1000))
})

test('decode get_block', () => {
  // {"run":"get_block"}
  const data = '1701000000000000AC9B5B27AC9B5B'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_BLOCK)
  expect(parsedData[Ads.TX_FIELDS.BLOCK_ID]).toBe('5B9BAC00')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536928807 * 1000))
})

test('decode get_blocks', () => {
  // {"run":"get_blocks"}
  const data = '130100000000003AAD9B5B20AD9B5B00000000'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_BLOCKS)
  expect(parsedData[Ads.TX_FIELDS.BLOCK_ID_FROM]).toBe('5B9BAD20')
  expect(parsedData[Ads.TX_FIELDS.BLOCK_ID_TO]).toBe('00000000')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536929082 * 1000))
})

test('decode get_broadcast', () => {
  // {"run":"get_broadcast"}
  const data = '12010000000000000000006FC39B5B'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_BROADCAST)
  expect(parsedData[Ads.TX_FIELDS.BLOCK_ID]).toBe('00000000')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536934767 * 1000))
})

test('decode get_fields', () => {
  // {"run":"get_fields","type":"get_broadcast"}
  const data = '1B'
  expect(() => {
    Ads.decodeCommand(data)
  }).toThrow('Transaction is not parsable')
})

test('decode get_log', () => {
  // {"run":"get_log"}
  const data = '11010000000000E3C59B5B'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_LOG)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536935395 * 1000))
})

test('decode get_message', () => {
  // {"run":"get_message", "block":"5B4893C0", "node":2, "node_msid":73}
  const data = '1A020001000000E693485BC093485B020049000000'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_MESSAGE)
  expect(parsedData[Ads.TX_FIELDS.BLOCK_ID]).toBe('5B4893C0')
  expect(parsedData[Ads.TX_FIELDS.NODE_ID]).toBe('0002')
  expect(parsedData[Ads.TX_FIELDS.NODE_MESSAGE_ID]).toBe(73)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0002-00000001-659C')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531483110 * 1000))
})

test('decode get_message_list', () => {
  // {"run":"get_message_list", "block":"5B4893C0"}
  const data = '19020001000000E693485BC093485B'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_MESSAGE_LIST)
  expect(parsedData[Ads.TX_FIELDS.BLOCK_ID]).toBe('5B4893C0')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0002-00000001-659C')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531483110 * 1000))
})

test('decode get_signatures', () => {
  // {"run":"get_signatures","block":"5B9BBF20"}
  const data = '1601000000000005CF9B5B20BF9B5B'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_SIGNATURES)
  expect(parsedData[Ads.TX_FIELDS.BLOCK_ID]).toBe('5B9BBF20')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536937733 * 1000))
})

test('decode get_transaction', () => {
  // {"run":"get_transaction", "txid":"0001:00000007:0002"}
  const data = '140100000000009253475B0100070000000200'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_TRANSACTION)
  expect(parsedData[Ads.TX_FIELDS.TRANSACTION_ID]).toBe('0001:00000007:0002')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531401106 * 1000))
})

test('decode get_vipkeys', () => {
  // {"run":"get_vipkeys",
  // "viphash":"2A4831F1459C42E2CCF5C4E202C3301F94C381B6FB253DFED21DD015180D9507"}
  const data = '150100000000008ECD9B5B2A4831F1459C42E2CCF5C4E202C3301F94C381B6FB253DFED21DD015180D9507'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.GET_VIPKEYS)
  expect(parsedData[Ads.TX_FIELDS.VIP_HASH]).toBe('2A4831F1459C42E2CCF5C4E202C3301F94C381B6FB253DFED21DD015180D9507')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1536937358 * 1000))
})

test('decode log_account', () => {
  // {"run":"log_account"}
  const data = '0F02000100000001000000D99E485B'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.LOG_ACCOUNT)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0002-00000001-659C')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(1)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531485913 * 1000))
})

test('decode retrieve_funds', () => {
  // {"run":"retrieve_funds", "address":"0002-00000001-659C"}
  const data = '0801000000000002000000BBC4485B020001000000'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.RETRIEVE_FUNDS)
  expect(parsedData[Ads.TX_FIELDS.ADDRESS]).toBe('0002-00000001-659C')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(2)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531495611 * 1000))
})

test('decode send_many', () => {
  // {"run":"send_many", "wires":{"0001-00000001-8B4E":"100","0001-00000002-BB2D":"100"}}
  const data = '050100000000000400000069C0485B020001000100000000A0724E1809000001000200000000A0724E18090000'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.SEND_MANY)
  expect(parsedData[Ads.TX_FIELDS.WIRE_COUNT]).toBe(2)

  const wires = parsedData[Ads.TX_FIELDS.WIRES]
  expect(wires[0][Ads.TX_FIELDS.ADDRESS]).toBe('0001-00000001-8B4E')
  expect(wires[0][Ads.TX_FIELDS.AMOUNT].toNumber()).toEqual(100 * 100000000000)
  expect(wires[1][Ads.TX_FIELDS.ADDRESS]).toBe('0001-00000002-BB2D')
  expect(wires[1][Ads.TX_FIELDS.AMOUNT].toNumber()).toEqual(100 * 100000000000)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(4)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1531494505 * 1000))
})

test('decode send_one', () => {
  // {"run":"send_one","address":"0001-00000001-8B4E","amount":"100000","message":"5465737420776961646F6D6F7363695465737420776961646F6D6F7363695454"}
  const data = '04010000000000010000006F0A645B0100010000000000C16FF2862300' +
    '0005737420776961646F6D6F7363695465737420776961646F6D6F7363695400'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.SEND_ONE)
  expect(parsedData[Ads.TX_FIELDS.ADDRESS]).toBe('0001-00000001-8B4E')
  expect(parsedData[Ads.TX_FIELDS.AMOUNT].toNumber()).toEqual(10000000000000000)
  expect(parsedData[Ads.TX_FIELDS.MSG]).toEqual('0005737420776961646F6D6F7363695465737420776961646F6D6F7363695400')
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(1)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1533282927 * 1000))
})

test('decode send_one msg to long', () => {
  // {"run":"send_one","address":"0001-00000001-8B4E","amount":"100000","message":"5465737420776961646F6D6F7363695465737420776961646F6D6F7363695454"}
  const data = '04010000000000010000006F0A645B0100010000000000C16FF2862300' +
    '0005737420776961646F6D6F7363695465737420776961646F6D6F7363695400123'
  expect(() => {
    Ads.decodeCommand(data)
  }).toThrow('Invalid message data length; expected 64 - got 67')
})

test('decode send_one msg to short', () => {
  // {"run":"send_one","address":"0001-00000001-8B4E","amount":"100000","message":"5465737420776961646F6D6F7363695465737420776961646F6D6F7363695454"}
  const data = '04010000000000010000006F0A645B0100010000000000C16FF2862300' +
    '0005737420776961646F6D6F7363695465737420776961646F6D6F73636954'
  expect(() => {
    Ads.decodeCommand(data)
  }).toThrow('Invalid message data length; expected 64 - got 62')
})

test('decode set_account_status', () => {
  // {"run":"set_account_status", "address":"0001-00000000-9B6F", "status":"2"}
  const data = '0B01000000000001000000A1B2285B0100000000000200'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.SET_ACCOUNT_STATUS)
  expect(parsedData[Ads.TX_FIELDS.ADDRESS]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.STATUS_ACCOUNT]).toBe(2)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(1)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1529393825 * 1000))
})

test('decode set_node_status', () => {
  // {"run":"set_node_status", "node":"14", "status":"2147483648"}
  const data = '0C0100000000007900000084B4285B0E0000000080'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.SET_NODE_STATUS)
  expect(parsedData[Ads.TX_FIELDS.NODE_ID]).toBe('000E')
  expect(parsedData[Ads.TX_FIELDS.STATUS_NODE]).toBe(2147483648)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(121)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1529394308 * 1000))
})

test('decode unset_account_status', () => {
  // {"run":"unset_account_status", "address":"0001-00000000-9B6F", "status":"32"}
  const data = '0D0100000000000A000000A4B2285B0100000000002000'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.UNSET_ACCOUNT_STATUS)
  expect(parsedData[Ads.TX_FIELDS.ADDRESS]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.STATUS_ACCOUNT]).toBe(32)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000000-9B6F')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(10)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1529393828 * 1000))
})

test('decode unset_node_status', () => {
  // {"run":"unset_node_status", "node":"3", "status":"2"}
  const data = '0E01000100000025000000C7B4285B030002000000'
  const parsedData = Ads.decodeCommand(data)
  expect(parsedData[Ads.TX_FIELDS.TYPE]).toBe(Ads.TX_TYPES.UNSET_NODE_STATUS)
  expect(parsedData[Ads.TX_FIELDS.NODE_ID]).toBe('0003')
  expect(parsedData[Ads.TX_FIELDS.STATUS_NODE]).toBe(2)
  // sender
  expect(parsedData[Ads.TX_FIELDS.SENDER]).toBe('0001-00000001-8B4E')
  expect(parsedData[Ads.TX_FIELDS.MESSAGE_ID]).toBe(37)
  expect(parsedData[Ads.TX_FIELDS.TIME]).toEqual(new Date(1529394375 * 1000))
})

test('decode error `Unknown type`', () => {
  const data = 'FF00000100000001'
  expect(() => {
    Ads.decodeCommand(data)
  }).toThrow('Unknown type')
})

test('decode error `Invalid transaction data length`', () => {
  const data = '0E0100010000'
  expect(() => {
    Ads.decodeCommand(data)
  }).toThrow('Invalid sender data length; expected 12 - got 10')
})

// --- encode ----------------------------------------------------------------------------------------------------------

const broadcastCommand = {}
broadcastCommand[Ads.TX_FIELDS.TYPE] = Ads.TX_TYPES.BROADCAST
broadcastCommand[Ads.TX_FIELDS.SENDER] = '0001-00000000-9B6F'
broadcastCommand[Ads.TX_FIELDS.MESSAGE_ID] = 1
broadcastCommand[Ads.TX_FIELDS.TIME] = new Date(1536911265 * 1000)
broadcastCommand[Ads.TX_FIELDS.MSG] = '00'

test('encode broadcast', () => {
  expect(Ads.encodeCommand(broadcastCommand)).toBe('0301000000000001000000A1679B5B010000')
})

test('encode broadcast - timestamp', () => {
  const commnad = { ...broadcastCommand }
  commnad[Ads.TX_FIELDS.TIME] = 1536911265 * 1000
  expect(Ads.encodeCommand(commnad)).toBe('0301000000000001000000A1679B5B010000')
})

test('encode broadcast - datetime', () => {
  const commnad = { ...broadcastCommand }
  commnad[Ads.TX_FIELDS.TIME] = '2018-09-14T07:47:45.000Z'
  expect(Ads.encodeCommand(commnad)).toBe('0301000000000001000000A1679B5B010000')
})

test('encode broadcast - datetime with timezone', () => {
  const commnad = { ...broadcastCommand }
  commnad[Ads.TX_FIELDS.TIME] = '2018-09-14T09:47:45+02:00'
  expect(Ads.encodeCommand(commnad)).toBe('0301000000000001000000A1679B5B010000')
})

test('encode broadcast - prefix message', () => {
  const commnad = { ...broadcastCommand }
  commnad[Ads.TX_FIELDS.MSG] = '112FF00'
  expect(Ads.encodeCommand(commnad)).toBe('0301000000000001000000A1679B5B04000112FF00')
})

test('encode broadcast - empty data', () => {
  const commnad = {}
  commnad[Ads.TX_FIELDS.TYPE] = Ads.TX_TYPES.BROADCAST
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Undefined transaction filed sender')
})

test('encode broadcast - empty sender', () => {
  const commnad = { ...broadcastCommand }
  commnad[Ads.TX_FIELDS.SENDER] = null
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Undefined transaction filed sender')
})

test('encode broadcast - invalid sender', () => {
  const commnad = { ...broadcastCommand }
  commnad[Ads.TX_FIELDS.SENDER] = 'foo'
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Invalid ADS address foo')
})

test('encode broadcast - tool long message id', () => {
  const commnad = { ...broadcastCommand }
  commnad[Ads.TX_FIELDS.MESSAGE_ID] = 0xabcdef123
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Length of messageId cannot exceed 4 bytes')
})

const sendOneCommand = {}
sendOneCommand[Ads.TX_FIELDS.TYPE] = Ads.TX_TYPES.SEND_ONE
sendOneCommand[Ads.TX_FIELDS.SENDER] = '0001-00000000-9B6F'
sendOneCommand[Ads.TX_FIELDS.MESSAGE_ID] = 1
sendOneCommand[Ads.TX_FIELDS.TIME] = new Date(1533282927 * 1000)
sendOneCommand[Ads.TX_FIELDS.ADDRESS] = '0001-00000001-8B4E'
sendOneCommand[Ads.TX_FIELDS.AMOUNT] = 100
sendOneCommand[Ads.TX_FIELDS.MSG] = ''

test('encode send_one', () => {
  expect(Ads.encodeCommand(sendOneCommand))
    .toBe(
      '04010000000000010000006F0A645B01000100000064000000000000000000000000000000000000000000000000000000000000000000000000000000')
})

test('encode send_one with message', () => {
  const commnad = { ...sendOneCommand }
  commnad[Ads.TX_FIELDS.MSG] = '5465737420776961646f6d6f7363695465737420776961646f6d6f736'
  expect(Ads.encodeCommand(commnad))
    .toBe(
      '04010000000000010000006F0A645B010001000000640000000000000000000005465737420776961646F6D6F7363695465737420776961646F6D6F736')
})

test('encode send_one with text amount', () => {
  const commnad = { ...sendOneCommand }
  commnad[Ads.TX_FIELDS.AMOUNT] = '10000000000000000'
  expect(Ads.encodeCommand(commnad))
    .toBe(
      '04010000000000010000006F0A645B0100010000000000C16FF28623000000000000000000000000000000000000000000000000000000000000000000')
})

test('encode send_one - too big amount', () => {
  const commnad = { ...sendOneCommand }
  commnad[Ads.TX_FIELDS.AMOUNT] = '99999999999999999999'
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Length of amount cannot exceed 8 bytes')
})

test('encode send_one - invalid address', () => {
  const commnad = { ...sendOneCommand }
  commnad[Ads.TX_FIELDS.ADDRESS] = 'foo'
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Invalid ADS address foo')
})

const changeAccountKeyCommand = {}
changeAccountKeyCommand[Ads.TX_FIELDS.TYPE] = Ads.TX_TYPES.CHANGE_ACCOUNT_KEY
changeAccountKeyCommand[Ads.TX_FIELDS.SENDER] = '0001-00000000-9B6F'
changeAccountKeyCommand[Ads.TX_FIELDS.MESSAGE_ID] = 1
changeAccountKeyCommand[Ads.TX_FIELDS.TIME] = new Date(1533282927 * 1000)
changeAccountKeyCommand[Ads.TX_FIELDS.PUBLIC_KEY] = 'EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E'

test('encode change_account_key', () => {
  expect(Ads.encodeCommand(changeAccountKeyCommand))
    .toBe('09010000000000010000006F0A645BEAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E')
})

test('encode change_account_key - invalid public key', () => {
  const commnad = { ...changeAccountKeyCommand }
  commnad[Ads.TX_FIELDS.PUBLIC_KEY] = 'foo'
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Invalid public key foo')
})

test('encode change_account_key - too short public key', () => {
  const commnad = { ...changeAccountKeyCommand }
  commnad[Ads.TX_FIELDS.PUBLIC_KEY] = '09010000000000010000006F0A645BEAE1C8793B5597C4B3F490E76'
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Invalid public key')
})

test('encode change_account_key - too long public key', () => {
  const commnad = { ...changeAccountKeyCommand }
  commnad[Ads.TX_FIELDS.PUBLIC_KEY] = '09010000000000010000006F0A645BEAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0EFFF'
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Invalid public key')
})

const createAccountCommand = {}
createAccountCommand[Ads.TX_FIELDS.TYPE] = Ads.TX_TYPES.CREATE_ACCOUNT
createAccountCommand[Ads.TX_FIELDS.SENDER] = '0001-00000000-9B6F'
createAccountCommand[Ads.TX_FIELDS.MESSAGE_ID] = 4
createAccountCommand[Ads.TX_FIELDS.TIME] = new Date(1533282927 * 1000)
createAccountCommand[Ads.TX_FIELDS.NODE_ID] = 1
createAccountCommand[Ads.TX_FIELDS.PUBLIC_KEY] = 'A9C0D972D8AAB73805EC4A28291E052E3B5FAFE0ADC9D724917054E5E2690363'

test('encode create_account', () => {
  expect(Ads.encodeCommand(createAccountCommand))
    .toBe('06010000000000040000006F0A645B010000000000A9C0D972D8AAB73805EC4A28291E052E3B5FAFE0ADC9D724917054E5E2690363')
})

test('encode create_account - tool long node id', () => {
  const commnad = { ...createAccountCommand }
  commnad[Ads.TX_FIELDS.NODE_ID] = 0xabcde
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Length of nodeId cannot exceed 2 bytes')
})

test('encode invalid type', () => {
  const commnad = {}
  commnad[Ads.TX_FIELDS.TYPE] = Ads.TX_TYPES.SET_NODE_STATUS
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Unsupported type of transaction set_node_status')
})

test('encode invalid type', () => {
  const commnad = {}
  commnad[Ads.TX_FIELDS.TYPE] = 'foo'
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Unknown type of transaction foo')
})

test('encode no type', () => {
  const commnad = {}
  expect(() => {
    Ads.encodeCommand(commnad)
  }).toThrow('Undefined transaction filed type')
})
