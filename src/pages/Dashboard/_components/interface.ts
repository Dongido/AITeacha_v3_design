export interface Bank {
  id: string;
  name: string;
  code: string;
}

export interface UserBankAccountFromRedux {
  id: number;
  account_number: string;
  bank_name: string;
  account_name: string;
  bank_branch: string;
  country_code: string;
  bank_code: string;
  bank_id: string;
  currency: string;
}
export interface WithdrawalRequest {
  bankaccount_id: string;

  amount: number;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface NewAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
  bankBranch: string;
  countryCode?: string;
  bankCode?: string;
  bankId?: string;
  currency?: string;
}
export interface BankAccount {
  id?: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
  bankBranch: string;
  countryCode?: string;
  bankCode?: string;
  bankId?: string;
  currency?: string;
}
