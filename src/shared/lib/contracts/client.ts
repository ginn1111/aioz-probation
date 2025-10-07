import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Account,
} from 'viem';
import { sepolia } from 'viem/chains';

export const walletCreator = (account: Account) =>
  createWalletClient({
    account,
    chain: sepolia,
    transport: window.ethereum ? custom(window.ethereum) : http(),
  });

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: window.ethereum ? custom(window.ethereum) : http(),
});
