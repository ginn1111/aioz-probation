export const StorageKey = {
  ADDRESS: 'address',
} as const;

export const ServiceKey: Record<string, string> = {
  ETH_REQUEST_ACCOUNTS: 'eth_requestAccounts',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
  ETH_GET_BALANCE: 'eth_getBalance',
  ETH_GET_TRANSACTION_RECEIPT: 'eth_getTransactionReceipt',

  SEND_TRANSACTION_TO_CONTRACT: 'send_transaction_to_contract',
  CONTRACT_GET_INFO: 'contract_get_info',
  CONTRACT_BALANCE: 'contract_balance',
} as const;

export const _1_ETH = 1e18;
