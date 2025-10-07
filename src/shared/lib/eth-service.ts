const provider = window.ethereum;

const ensureProvider = (args: { method: string; params?: unknown[] }) => {
  if (typeof provider === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  return provider.request(args);
};

export const ethRequestAccounts = () => {
  return ensureProvider({ method: 'eth_requestAccounts' }) as Promise<
    string[] | null
  >;
};

export const ethSendTransaction = (payload: {
  to: string;
  value: string;
  from: string;
}) => {
  return ensureProvider({
    method: 'eth_sendTransaction',
    params: [payload],
  });
};

export const ethGetBalance = (address: string) => {
  return ensureProvider({
    method: 'eth_getBalance',
    params: [address, 'latest'],
  }) as Promise<string>;
};

interface EthGetTransactionReceipt {
  blockHash: string;
  blockNumber: string;
  contractAddress: unknown;
  cumulativeGasUsed: string;
  from: string;
  gasUsed: string;
  blobGasUsed: string;
  effectiveGasPrice: string;
  blobGasPrice: string;
  logs: unknown[];
  logsBloom: string;
  status: string;
  to: string;
  transactionHash: string;
  transactionIndex: string;
}
export const ethGetTransactionReceipt = (hash: string) => {
  return ensureProvider({
    method: 'eth_getTransactionReceipt',
    params: [hash],
  }) as Promise<EthGetTransactionReceipt>;
};
