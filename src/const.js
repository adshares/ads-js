/**
 * Response field names
 */
export const TX_FIELDS = {
  /** address */
  ADDRESS: 'address',
  /** transaction amount */
  AMOUNT: 'amount',
  /** block id */
  BLOCK_ID: 'blockId',
  /** block id */
  BLOCK_ID_FROM: 'blockIdFrom',
  /** block id */
  BLOCK_ID_TO: 'blockIdTo',
  /** message */
  MSG: 'message',
  /** message length */
  MSG_LEN: 'messageLength',
  /** number of sender transactions */
  MESSAGE_ID: 'messageId',
  /** node */
  NODE_ID: 'nodeId',
  /** number of node message */
  NODE_MESSAGE_ID: 'nodeMessageId',
  /** public key */
  PUBLIC_KEY: 'publicKey',
  /** sender address */
  SENDER: 'sender',
  /** account */
  STATUS_ACCOUNT: 'accountStatus',
  /** node status */
  STATUS_NODE: 'nodeStatus',
  /** transaction time */
  TIME: 'time',
  /** transaction id */
  TRANSACTION_ID: 'transactionId',
  /** transaction type */
  TYPE: 'type',
  /** vip hash */
  VIP_HASH: 'vipHash',
  /** number of wires */
  WIRE_COUNT: 'wireCount',
  /** wires */
  WIRES: 'wires'
}

/**
 * Transaction types
 */
export const TX_TYPES = {
  BROADCAST: 'broadcast',
  CHANGE_ACCOUNT_KEY: 'change_account_key',
  CHANGE_NODE_KEY: 'change_node_key',
  CREATE_ACCOUNT: 'create_account',
  CREATE_NODE: 'create_node',
  LOG_ACCOUNT: 'log_account',
  GET_ACCOUNT: 'get_account',
  GET_ACCOUNTS: 'get_accounts',
  FIND_ACCOUNTS: 'find_accounts',
  GET_BLOCK: 'get_block',
  GET_BLOCKS: 'get_blocks',
  GET_BROADCAST: 'get_broadcast',
  GET_FIELDS: 'get_fields',
  GET_LOG: 'get_log',
  GET_MESSAGE: 'get_message',
  GET_MESSAGE_LIST: 'get_message_list',
  GET_SIGNATURES: 'get_signatures',
  GET_TRANSACTION: 'get_transaction',
  GET_VIPKEYS: 'get_vipkeys',
  RETRIEVE_FUNDS: 'retrieve_funds',
  SEND_AGAIN: 'send_again',
  SEND_MANY: 'send_many',
  SEND_ONE: 'send_one',
  SET_ACCOUNT_STATUS: 'set_account_status',
  SET_NODE_STATUS: 'set_node_status',
  UNSET_ACCOUNT_STATUS: 'unset_account_status',
  UNSET_NODE_STATUS: 'unset_node_status'
}

/**
 * Transaction types map
 */
export const TX_TYPES_MAP = {
  '03': TX_TYPES.BROADCAST,
  '04': TX_TYPES.SEND_ONE,
  '05': TX_TYPES.SEND_MANY,
  '06': TX_TYPES.CREATE_ACCOUNT,
  '07': TX_TYPES.CREATE_NODE,
  '08': TX_TYPES.RETRIEVE_FUNDS,
  '09': TX_TYPES.CHANGE_ACCOUNT_KEY,
  '0A': TX_TYPES.CHANGE_NODE_KEY,
  '0B': TX_TYPES.SET_ACCOUNT_STATUS,
  '0C': TX_TYPES.SET_NODE_STATUS,
  '0D': TX_TYPES.UNSET_ACCOUNT_STATUS,
  '0E': TX_TYPES.UNSET_NODE_STATUS,
  '0F': TX_TYPES.LOG_ACCOUNT,
  10: TX_TYPES.GET_ACCOUNT,
  11: TX_TYPES.GET_LOG,
  12: TX_TYPES.GET_BROADCAST,
  13: TX_TYPES.GET_BLOCKS,
  14: TX_TYPES.GET_TRANSACTION,
  15: TX_TYPES.GET_VIPKEYS,
  16: TX_TYPES.GET_SIGNATURES,
  17: TX_TYPES.GET_BLOCK,
  18: TX_TYPES.GET_ACCOUNTS,
  19: TX_TYPES.GET_MESSAGE_LIST,
  '1A': TX_TYPES.GET_MESSAGE,
  '1B': TX_TYPES.GET_FIELDS
}

/**
 * Contract ABI
 */
export const ABI = [{
  inputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'constructor'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'owner',
    type: 'address'
  }, {
    indexed: true,
    internalType: 'address',
    name: 'spender',
    type: 'address'
  }, {
    indexed: false,
    internalType: 'uint256',
    name: 'value',
    type: 'uint256'
  }],
  name: 'Approval',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'MinterAdded',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'minter',
    type: 'address'
  }, {
    indexed: false,
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256'
  }],
  name: 'MinterApproval',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'MinterRemoved',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'OwnerAdded',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'OwnerRemoved',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: false,
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'Paused',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'PauserAdded',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'PauserRemoved',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'from',
    type: 'address'
  }, {
    indexed: true,
    internalType: 'address',
    name: 'to',
    type: 'address'
  }, {
    indexed: false,
    internalType: 'uint256',
    name: 'value',
    type: 'uint256'
  }],
  name: 'Transfer',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: false,
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'Unpaused',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'from',
    type: 'address'
  }, {
    indexed: true,
    internalType: 'uint64',
    name: 'to',
    type: 'uint64'
  }, {
    indexed: false,
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256'
  }, {
    indexed: false,
    internalType: 'uint128',
    name: 'message',
    type: 'uint128'
  }],
  name: 'Unwrap',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'to',
    type: 'address'
  }, {
    indexed: true,
    internalType: 'uint64',
    name: 'from',
    type: 'uint64'
  }, {
    indexed: false,
    internalType: 'uint64',
    name: 'txid',
    type: 'uint64'
  }, {
    indexed: false,
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256'
  }],
  name: 'Wrap',
  type: 'event'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'addMinter',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'addOwner',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'addPauser',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    internalType: 'address',
    name: 'owner',
    type: 'address'
  }, {
    internalType: 'address',
    name: 'spender',
    type: 'address'
  }],
  name: 'allowance',
  outputs: [{
    internalType: 'uint256',
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'spender',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'value',
    type: 'uint256'
  }],
  name: 'approve',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'balanceOf',
  outputs: [{
    internalType: 'uint256',
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'decimals',
  outputs: [{
    internalType: 'uint8',
    name: '',
    type: 'uint8'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'spender',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'subtractedValue',
    type: 'uint256'
  }],
  name: 'decreaseAllowance',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'minter',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'subtractedValue',
    type: 'uint256'
  }],
  name: 'decreaseMinterAllowance',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'spender',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'addedValue',
    type: 'uint256'
  }],
  name: 'increaseAllowance',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'minter',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'addedValue',
    type: 'uint256'
  }],
  name: 'increaseMinterAllowance',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'isMinter',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'isOwner',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'isPauser',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    internalType: 'address',
    name: 'minter',
    type: 'address'
  }],
  name: 'minterAllowance',
  outputs: [{
    internalType: 'uint256',
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'minter',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256'
  }],
  name: 'minterApprove',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'name',
  outputs: [{
    internalType: 'string',
    name: '',
    type: 'string'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'pause',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'paused',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'reclaimEther',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'contract IERC20',
    name: '_token',
    type: 'address'
  }],
  name: 'reclaimToken',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'removeMinter',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }],
  name: 'removePauser',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'renounceMinter',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'renounceOwner',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'renouncePauser',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'symbol',
  outputs: [{
    internalType: 'string',
    name: '',
    type: 'string'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'totalSupply',
  outputs: [{
    internalType: 'uint256',
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'to',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'value',
    type: 'uint256'
  }],
  name: 'transfer',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'from',
    type: 'address'
  }, {
    internalType: 'address',
    name: 'to',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'value',
    type: 'uint256'
  }],
  name: 'transferFrom',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'unpause',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256'
  }, {
    internalType: 'uint64',
    name: 'to',
    type: 'uint64'
  }],
  name: 'unwrap',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256'
  }, {
    internalType: 'uint64',
    name: 'to',
    type: 'uint64'
  }, {
    internalType: 'uint128',
    name: 'message',
    type: 'uint128'
  }],
  name: 'unwrapFrom',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256'
  }, {
    internalType: 'uint64',
    name: 'to',
    type: 'uint64'
  }, {
    internalType: 'uint128',
    name: 'message',
    type: 'uint128'
  }],
  name: 'unwrapMessage',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    internalType: 'address',
    name: 'account',
    type: 'address'
  }, {
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256'
  }, {
    internalType: 'uint64',
    name: 'from',
    type: 'uint64'
  }, {
    internalType: 'uint64',
    name: 'txid',
    type: 'uint64'
  }],
  name: 'wrapTo',
  outputs: [{
    internalType: 'bool',
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}]
