import { useEffect } from 'react';

const useEIP6963Listener = () => {
  useEffect(() => {
    window.addEventListener('eip6963:announceProvider', event => {
      console.log(event);
    });

    window.dispatchEvent(new Event('eip6963:requestProvider'));
  }, []);
};

export default useEIP6963Listener;
