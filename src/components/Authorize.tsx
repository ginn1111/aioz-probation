import { ServiceKey } from '@/shared/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const Authorize = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const addresses = queryClient.getQueryData([
    ServiceKey.ETH_REQUEST_ACCOUNTS,
  ]) as Array<string> | null;

  if (!addresses?.filter(Boolean)?.length) return null;

  return children;
};

export default Authorize;
