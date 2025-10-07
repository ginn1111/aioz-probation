import { Button, type ButtonProps } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { ethRequestAccounts } from '@/shared/lib/eth-service';
import { getItem, setItem } from '@/shared/lib/storage-service';
import { ServiceKey, StorageKey } from '@/shared/lib/constants';
import { useEffect } from 'react';

interface MetaMaskConnectorProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  address?: string | null;
}

interface MetaMaskButtonProps extends ButtonProps {
  address?: Nullable<string>;
  isLoading?: boolean;
}

const MetaMaskButton = ({
  isLoading = false,
  address,
  ...props
}: MetaMaskButtonProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Button
      className='group relative overflow-hidden rounded-xl border-2 border-[#E2761B]/20 bg-gradient-to-br from-[#F6851B] to-[#E2761B] px-6 py-6 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
      {...props}
    >
      <div className='flex items-center gap-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm'>
          <svg
            width='20'
            height='20'
            viewBox='0 0 40 40'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M32.5 5L20.5 13.5L22.5 8.5L32.5 5Z'
              fill='white'
              fillOpacity='0.9'
            />
            <path
              d='M7.5 5L19.3 13.6L17.5 8.5L7.5 5Z'
              fill='white'
              fillOpacity='0.9'
            />
            <path
              d='M27.5 28.5L24.5 33.5L31.8 35.5L33.8 28.7L27.5 28.5Z'
              fill='white'
              fillOpacity='0.9'
            />
            <path
              d='M6.2 28.7L8.2 35.5L15.5 33.5L12.5 28.5L6.2 28.7Z'
              fill='white'
              fillOpacity='0.9'
            />
          </svg>
        </div>

        {address ? (
          <>
            <span className='font-mono text-sm'>{formatAddress(address)}</span>
            <div className='h-2 w-2 animate-pulse rounded-full bg-green-400' />
          </>
        ) : (
          <span className='text-base'>
            {isLoading ? 'Connecting...' : 'Connect MetaMask'}
          </span>
        )}
      </div>
    </Button>
  );
};

function MetaMaskConnector({ onDisconnect }: MetaMaskConnectorProps) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [ServiceKey.ETH_REQUEST_ACCOUNTS],
    queryFn: ethRequestAccounts,
    enabled: false,
    initialData: () => [getItem(StorageKey.ADDRESS)],
  });

  const address = data?.[0] || '';

  const connectWallet = () => {
    refetch();
  };

  useEffect(() => {
    if (address) {
      setItem(StorageKey.ADDRESS, address);
    }
  }, [address]);

  if (address) {
    return <MetaMaskButton onClick={onDisconnect} address={address} />;
  }

  return (
    <MetaMaskButton
      address={address}
      onClick={connectWallet}
      disabled={isLoading}
    />
  );
}

export default MetaMaskConnector;
