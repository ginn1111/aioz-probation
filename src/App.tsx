import MakeTransactionDialog from '@/components/MakeTransactionDialog';
import MetaMaskConnector from '@/components/MetaMaskConnector';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type Account } from 'viem';
import './App.css';
import Authorize from './components/Authorize';
import CurrencyBalance from './components/CurrencyBalance';
import Loading from './components/ui/loading';
import useEIP6963Listener from './shared/hooks/useEIP6963Listener';
import { _1_ETH, ServiceKey, StorageKey } from './shared/lib/constants';
import {
  getBalance,
  getContractInfo,
  publicContract,
} from './shared/lib/contract-service';
import { ethGetBalance, ethRequestAccounts } from './shared/lib/eth-service';
import { hexToNumber } from './shared/lib/helpers/hex-to-number';
import { numberFormatZeroDigit } from './shared/lib/helpers/number-format';
import { getItem, removeItem } from './shared/lib/storage-service';

function App() {
  const [openModal, setOpenModal] = useState({
    sepolia: false,
    contract: false,
  });

  const { data } = useQuery({
    queryKey: [ServiceKey.ETH_REQUEST_ACCOUNTS],
    queryFn: ethRequestAccounts,
    enabled: false,
    initialData: () => [getItem(StorageKey.ADDRESS)],
  });
  const address = data?.[0] || '';

  const { data: balanceData, isFetching } = useQuery({
    queryKey: [ServiceKey.ETH_GET_BALANCE],
    queryFn: () => ethGetBalance(address),
    enabled: !!address,
  });

  const { error, data: contractInfo } = useQuery({
    queryKey: [ServiceKey.CONTRACT_GET_INFO],
    queryFn: getContractInfo,
    enabled: !!data,
  });

  const { data: contractBalance, isFetching: isFetchingContractBalance } =
    useQuery({
      queryKey: [ServiceKey.CONTRACT_BALANCE],
      queryFn: () => getBalance(address as unknown as Account),
      enabled: !!address,
    });

  const queryClient = useQueryClient();

  useEffect(() => {
    publicContract.watchEvent.Transfer(
      {
        to: address,
        from: address,
      },
      {
        onLogs: () => {
          queryClient.invalidateQueries({
            queryKey: [ServiceKey.CONTRACT_BALANCE],
          });
        },
      }
    );
  }, [address]);

  useEIP6963Listener();
  console.log(Number(contractBalance) / _1_ETH);

  return (
    <>
      <header className='flex items-center'>
        <Authorize>
          <Loading isLoading={isFetching}>
            <CurrencyBalance
              amount={numberFormatZeroDigit(
                hexToNumber(balanceData ?? '') / _1_ETH
              )}
              currency='SepoliaETH'
            />
          </Loading>

          {!error && (
            <Loading isLoading={isFetchingContractBalance} className='ml-auto'>
              <CurrencyBalance
                amount={numberFormatZeroDigit(Number(contractBalance) / _1_ETH)}
                currency={contractInfo?.[1]?.toString() ?? 'unknown'}
              />
            </Loading>
          )}
        </Authorize>
      </header>
      <main className='flex h-full flex-col items-center justify-center gap-4'>
        <div className='space-y-4'>
          <h1 className='from-foreground to-foreground/60 bg-gradient-to-br bg-clip-text text-5xl font-bold text-balance text-transparent md:text-6xl'>
            Connect Your Wallet
          </h1>
          <p className='text-muted-foreground mx-auto max-w-md text-lg text-pretty'>
            Connect with MetaMask to access Web3 features and start your
            decentralized journey
          </p>
        </div>

        <MetaMaskConnector
          onDisconnect={async () => {
            removeItem(StorageKey.ADDRESS);

            queryClient.resetQueries();
            queryClient.setQueryData(
              [ServiceKey.ETH_REQUEST_ACCOUNTS],
              () => null
            );
          }}
        />
        <Authorize>
          <div className='flex items-center gap-2'>
            <Loading isLoading={isFetching}>
              <MakeTransactionDialog
                open={openModal.sepolia}
                onOpenChange={isOpen =>
                  setOpenModal(prev => ({ ...prev, sepolia: isOpen }))
                }
                onClose={() =>
                  setOpenModal(prev => ({ ...prev, sepolia: false }))
                }
                type='sepolia'
              >
                <Button
                  size='lg'
                  onClick={() =>
                    setOpenModal(prev => ({ ...prev, sepolia: true }))
                  }
                >
                  Make a transaction in Sepolia
                </Button>
              </MakeTransactionDialog>
            </Loading>
            <Loading isLoading={isFetchingContractBalance}>
              {error ? (
                <p className='text-red-500'>Connect to contract fail!</p>
              ) : (
                <MakeTransactionDialog
                  type='contract'
                  open={openModal.contract}
                  onOpenChange={isOpen =>
                    setOpenModal(prev => ({ ...prev, contract: isOpen }))
                  }
                  onClose={() =>
                    setOpenModal(prev => ({ ...prev, contract: false }))
                  }
                >
                  <Button
                    size='lg'
                    onClick={() =>
                      setOpenModal(prev => ({ ...prev, contract: true }))
                    }
                  >
                    Make a transaction for contract
                  </Button>
                </MakeTransactionDialog>
              )}
            </Loading>
          </div>
        </Authorize>
        <p className='text-muted-foreground text-sm'>
          Don&apos;t have MetaMask?{' '}
          <a
            href='https://metamask.io/download/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary font-medium hover:underline'
          >
            Install it here
          </a>
        </p>
      </main>
    </>
  );
}

export default App;
