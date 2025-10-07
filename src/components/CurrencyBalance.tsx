type CurrencyBalanceProps = {
  amount: string;
  currency: string;
};

const CurrencyBalance = ({ amount, currency }: CurrencyBalanceProps) => {
  return (
    <div className='bg-meta-mask text-background flex items-baseline gap-1 rounded-full px-3 py-1'>
      <p className='text-sm font-bold'>{amount}</p>
      <p>{currency}</p>
    </div>
  );
};

export default CurrencyBalance;
