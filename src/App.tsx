import './App.css';
import MetaMaskConnector from '@/components/MetaMaskConnector';
import MakeTransactionDialog from '@/components/MakeTransactionDialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  return (
    <main className='flex flex-col items-center gap-4'>
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
        address={address}
        onDisconnect={() => {
          setAddress(null);
          localStorage.removeItem('address');
        }}
        onConnect={async address => {
          setAddress(address);
          localStorage.setItem('address', address);

          try {
            const chainId = (await window.ethereum?.request({
              method: 'eth_chainId',
            })) as string;
            setChainId(chainId);
          } catch (error) {
            console.log(error);
          }
        }}
      />
      {address && (
        <>
          <MakeTransactionDialog
            open={openModal}
            onOpenChange={setOpenModal}
            onClose={() => setOpenModal(false)}
          >
            <Button size='lg' onClick={() => setOpenModal(true)}>
              Make a transaction
            </Button>
          </MakeTransactionDialog>

          {chainId}
        </>
      )}
    </main>
  );
}

export default App;
