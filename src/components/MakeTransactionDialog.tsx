import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState, type ReactNode } from 'react';
import {
  useForm,
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ServiceKey } from '@/shared/lib/constants';
import {
  ethGetTransactionReceipt,
  ethSendTransaction,
} from '@/shared/lib/eth-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z, ZodError, ZodType } from 'zod';
import { numberFormat } from '@/shared/lib/helpers/number-format';
import { transferTo } from '@/shared/lib/contract-service';

const MakeTransactionSchema = z.object({
  receipt: z
    .string()
    .min(5, { error: 'Pls enter receipt address' })
    .regex(/0x[a-fA-F0-9]{40}/, { error: 'Invalid format address!' }),
  amount: z.string().refine(
    value => {
      return Number(value) > 0;
    },
    {
      error: 'Invalid amount!',
    }
  ),
});

type MakeTransactionPayload = z.infer<typeof MakeTransactionSchema>;

const zodToHookFormErrors = (zodError: ZodError): FieldErrors => {
  const errors: FieldErrors = {};

  for (const issue of zodError.issues) {
    const path = issue.path.join('.') || 'root';
    errors[path] = {
      type: issue.code,
      message: issue.message,
    } as FieldError;
  }

  return errors;
};

const customResolver = <T = FieldValues,>(schema: ZodType) => {
  return async (
    values: T
  ): Promise<{
    values: T;
    errors: FieldErrors;
  }> => {
    try {
      const result = await schema.safeParseAsync(values);

      if (result.success) {
        return {
          values: result.data as T,
          errors: {},
        };
      } else {
        return {
          values: {} as T,
          errors: zodToHookFormErrors(result.error),
        };
      }
    } catch (error) {
      console.error('Resolver error: ', error);
      return {
        values: {} as T,
        errors: {
          root: {
            type: 'unknown',
            message: 'An unknown error occurred during validation',
          } as FieldError,
        },
      };
    }
  };
};

type MakeTransactionDialogProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  type: 'sepolia' | 'contract';
};

const MakeTransactionDialog = ({
  children,
  open,
  type,
  onOpenChange,
  onClose,
}: MakeTransactionDialogProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { data, mutateAsync } = useMutation({
    mutationKey: [ServiceKey.ETH_SEND_TRANSACTION],
    mutationFn: ethSendTransaction,
  });

  const { error, mutateAsync: sendTXToContract } = useMutation({
    mutationKey: [ServiceKey.SEND_TRANSACTION_TO_CONTRACT],
    mutationFn: transferTo,
  });

  console.log(error);

  useQuery({
    queryKey: [ServiceKey.ETH_GET_TRANSACTION_RECEIPT],
    queryFn: async () => {
      const receipt = await ethGetTransactionReceipt(data as string);

      if (receipt) {
        queryClient.invalidateQueries({
          queryKey: [ServiceKey.ETH_GET_BALANCE],
        });
        setIsConfirmed(true);
      }

      return receipt;
    },
    enabled: !!data,
    refetchInterval: isConfirmed ? false : 1_000,
  });

  const queryClient = useQueryClient();
  const address =
    (
      queryClient.getQueryData([
        ServiceKey.ETH_REQUEST_ACCOUNTS,
      ]) as Array<string> | null
    )?.[0] || '';

  const form = useForm<MakeTransactionPayload, unknown, MakeTransactionPayload>(
    {
      defaultValues: {
        receipt: '',
        amount: '',
      },
      resolver: customResolver(
        MakeTransactionSchema
      ) as unknown as Resolver<MakeTransactionPayload>,
    }
  );

  const handleMakeTransaction: SubmitHandler<
    MakeTransactionPayload
  > = values => {
    const payload = {
      from: address,
      to: values.receipt,
      value: values.amount,
    };
    onClose?.();
    setIsConfirmed(false);

    const toastOptions = {
      loading: 'Sending transaction...',
      success: () => {
        return 'Transaction sent!';
      },
      error: 'Transaction failed!',
    };

    if (type === 'sepolia') {
      queryClient.resetQueries({ queryKey: [ServiceKey.ETH_SEND_TRANSACTION] });

      toast.promise(() => mutateAsync(payload), toastOptions);
    } else {
      toast.promise(() => sendTXToContract(payload), toastOptions);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-4'>Make a transaction</DialogTitle>
          <Form {...form}>
            <form
              className='space-y-2'
              onSubmit={form.handleSubmit(handleMakeTransaction)}
            >
              <FormField
                control={form.control}
                name='receipt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='0xf.....' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={e =>
                          field.onChange(
                            e.target.value.replaceAll(/[^0-9]/g, '')
                          )
                        }
                        value={numberFormat(field.value)}
                        placeholder='10000'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='mt-4 flex justify-end gap-2'>
                <Button onClick={onClose} variant='outline' type='button'>
                  Cancel
                </Button>
                <Button type='submit'>Confirm</Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MakeTransactionDialog;
