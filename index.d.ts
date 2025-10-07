declare global {
  type Nullable<T> = T | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type DefinedLate = any;

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

export {};
