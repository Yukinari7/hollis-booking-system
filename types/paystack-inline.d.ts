declare module '@paystack/inline-js' {
  const PaystackPop: {
    new (): {
      newTransaction(config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata?: Record<string, unknown>;
        onSuccess: (transaction: { reference: string }) => void;
        onClose: () => void;
      }): void;
    };
  };
  export default PaystackPop;
}
