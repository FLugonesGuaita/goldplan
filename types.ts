export type Role = 'admin' | 'seller';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string; // Should not be stored long term
  role: Role;
  title: string;
  address: string;
  phone: string;
}

export interface QuoteData {
  planName: string;
  model: string;
  planType: string;
  brand: string;
  totalInstallments: string;
  installment1: string;
  installments2to12: string;
  installments13to84: string;
  pureInstallment: string;
  adjudication: string;
  guaranteedDelivery: string;
  extraordinaryPayment: string;
  totalPlanValue: string;
}
