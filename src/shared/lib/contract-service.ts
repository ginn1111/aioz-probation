import { getContract, parseUnits, type Account } from 'viem';
import { contractAddress } from './contracts';
import { celestiginAbi } from './contracts/abi';
import { publicClient, walletCreator } from './contracts/client';

let contract: DefinedLate = null;
export const publicContract = getContract({
  address: contractAddress,
  abi: celestiginAbi,
  client: publicClient,
});

const initContract = (address: Account) => {
  if (contract) return;

  const _contract = getContract({
    address: contractAddress,
    abi: celestiginAbi,
    client: walletCreator(address as unknown as Account),
  });

  contract = _contract;
};

export const getContractInfo = () => {
  return Promise.all([
    publicContract.read.decimals(),
    publicContract.read.symbol(),
  ]);
};

export const getBalance = (address: Account) => {
  initContract(address);

  return contract!.read.balanceOf([address]);
};

export const transferTo = ({
  from,
  to,
  value,
}: {
  from: string;
  to: string;
  value: string;
}) => {
  initContract(from as unknown as Account);

  return contract!.write.transfer([to, parseUnits(value, 18)]);
  // const walletClient = walletCreator(from as unknown as Account);
  //
  //
  // return walletClient.writeContract({
  //   address: contractAddress,
  //   abi: celestiginAbi,
  //   functionName: 'transfer',
  //   account: walletClient.account,
  //   args: [to, parseUnits(value, 18)],
  // });
};
