import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface MetaMaskButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  address?: string | null;
}

function MetaMaskConnector({
  address,
  onConnect,
  onDisconnect,
}: MetaMaskButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const existAddress = localStorage.getItem('address');
    if (existAddress) {
      onConnect?.(existAddress);
    }

    setIsConnecting(false);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (accounts.length > 0) {
        const connectedAddress = accounts[0];
        onConnect?.(connectedAddress);
      }
    } catch (error) {
      console.error('[v0] Error connecting to MetaMask:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    onDisconnect?.();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (address) {
    return (
      <Button
        onClick={disconnectWallet}
        className='group relative overflow-hidden rounded-xl border-2 border-[#E2761B]/20 bg-gradient-to-br from-[#F6851B] to-[#E2761B] px-6 py-6 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
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
          <span className='font-mono text-sm'>{formatAddress(address)}</span>
          <div className='h-2 w-2 animate-pulse rounded-full bg-green-400' />
        </div>
      </Button>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className='group relative overflow-hidden rounded-xl border-2 border-[#E2761B]/20 bg-gradient-to-br from-[#F6851B] to-[#E2761B] px-8 py-6 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
    >
      <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

      <div className='relative flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:rotate-12'>
          <svg
            width='24'
            height='24'
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
            <path
              d='M24.3 18.5L22.5 21.5L31.5 21.9L31.2 12.3L24.3 18.5Z'
              fill='white'
              fillOpacity='0.9'
            />
            <path
              d='M15.7 18.5L8.7 12.3L8.5 21.9L17.5 21.5L15.7 18.5Z'
              fill='white'
              fillOpacity='0.9'
            />
          </svg>
        </div>

        <span className='text-base'>
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </span>
      </div>
    </Button>
  );
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

export default MetaMaskConnector;
