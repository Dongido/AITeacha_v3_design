import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import {
  fetchUserBankAccounts,
  addBankAccount,
  requestWithdrawal,
  fetchWithdrawalRequests,
} from "../../../store/slices/bankSlice";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../../components/ui/Dialogue";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";
import { Skeleton } from "../../../components/ui/Skeleton";
import { withdrawalColumns } from "./column.withdrawals";
import BaseTable from "../../../components/table/BaseTable";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import {
  fetchBanksByCountry,
  verifyAccountNumber,
} from "../../../api/bankaccount";
import { ICountry, Country } from "country-state-city";
import {
  Bank,
  Withdrawal,
  NewAccount,
  WithdrawalRequest,
  UserBankAccountFromRedux,
} from "./interface";
import { Loader2 } from "lucide-react";

const Withdrawals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    accounts,
    loading: accountsLoading,
    requesting,
    error: accountsError,
    requestError,
  } = useSelector((state: RootState) => state.bank);

  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [withdrawalDetails, setWithdrawalDetails] = useState<WithdrawalRequest>(
    {
      bankaccount_id: "",
      amount: 0,
    }
  );

  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<NewAccount>({
    accountNumber: "",
    bankName: "",
    accountName: "",
    bankBranch: "",
    countryCode: "",
    bankCode: "",
    bankId: "",
    currency: "",
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);
  const [withdrawalsError, setWithdrawalsError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [availableBanks, setAvailableBanks] = useState<Bank[]>([]);
  const [isFetchingBanks, setIsFetchingBanks] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(
    null
  );
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State for filtering withdrawals
  const [filterStatus, setFilterStatus] = useState<
    "all" | "processing" | "paid" | "declined"
  >("all");

  useEffect(() => {
    setCountries(Country.getAllCountries());
    dispatch(fetchUserBankAccounts());

    const fetchWithdrawals = async () => {
      try {
        setWithdrawalsLoading(true);
        const data = await dispatch(fetchWithdrawalRequests()).unwrap();
        setWithdrawals(data);
        setWithdrawalsError(null);
      } catch (error: any) {
        setWithdrawalsError(error.message);
        console.error("Failed to fetch withdrawals:", error);
        setToastMessage(error.message || "Failed to fetch withdrawals.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setWithdrawalsLoading(false);
      }
    };
    fetchWithdrawals();
  }, [dispatch]);

  useEffect(() => {
    const fetchBanks = async () => {
      if (newAccount.countryCode) {
        setIsFetchingBanks(true);
        try {
          const fetched = await fetchBanksByCountry(newAccount.countryCode);
          setAvailableBanks(fetched);
        } catch (err: any) {
          setAvailableBanks([]);
          setToastMessage(err.message || "Failed to fetch banks.");
          setToastVariant("destructive");
          setToastOpen(true);
        } finally {
          setIsFetchingBanks(false);
        }
      } else {
        setAvailableBanks([]);
      }
    };
    fetchBanks();
  }, [newAccount.countryCode]);

  const handleAccountVerification = useCallback(async () => {
    if (newAccount.accountNumber && newAccount.bankCode) {
      setIsVerifyingAccount(true);
      setVerificationError(null);
      setVerifiedAccountName(null);
      try {
        const result = await verifyAccountNumber(
          newAccount.accountNumber,
          newAccount.bankCode
        );

        setVerifiedAccountName(result?.account_name || "N/A");
        setNewAccount((prev) => ({
          ...prev,
          accountName: result?.account_name || "",
        }));
      } catch (err: any) {
        setVerificationError(err.message || "Failed to verify account number.");
        setToastMessage(err.message || "Failed to verify account number.");
        setToastVariant("destructive");
        setToastOpen(true);
        setVerifiedAccountName(null);
        setNewAccount((prev) => ({ ...prev, accountName: "" }));
      } finally {
        setIsVerifyingAccount(false);
      }
    } else {
      setVerifiedAccountName(null);
      setVerificationError(null);
    }
  }, [newAccount.accountNumber, newAccount.bankCode]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      handleAccountVerification();
    }, 500);
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    newAccount.accountNumber,
    newAccount.bankCode,
    handleAccountVerification,
  ]);

  const handleRequestWithdrawal = async () => {
    if (!withdrawalDetails.bankaccount_id) {
      alert("Please select a bank account.");
      return;
    }
    if (withdrawalDetails.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await dispatch(requestWithdrawal(withdrawalDetails)).unwrap();
      setIsWithdrawalDialogOpen(false);
      setWithdrawalDetails({ bankaccount_id: "", amount: 0 });
      setToastMessage(`Withdrawal request submitted'.`);
      setToastVariant("default");
      setToastOpen(true);
      const data = await dispatch(fetchWithdrawalRequests()).unwrap();
      setWithdrawals(data);
    } catch (error: any) {
      console.error("Error requesting withdrawal:", error);
      setToastMessage(
        error || "Failed to make withdrawal request. Please try again."
      );
      setToastVariant("destructive");
      setToastOpen(true);
    }
  };

  const handleSaveAccount = async () => {
    setIsSavingAccount(true);
    try {
      const payload: NewAccount = {
        accountNumber: newAccount.accountNumber,
        bankName: newAccount.bankName,
        accountName: newAccount.accountName,
        bankBranch: newAccount.bankBranch,
        countryCode: newAccount.countryCode,
        bankCode: newAccount.bankCode,
        bankId: newAccount.bankId,
        currency: newAccount.currency,
      };

      await dispatch(addBankAccount(payload)).unwrap();
      setIsAddAccountDialogOpen(false);
      setNewAccount({
        accountNumber: "",
        bankName: "",
        accountName: "",
        bankBranch: "",
        countryCode: "",
        bankCode: "",
        bankId: "",
        currency: "",
      });
      setVerifiedAccountName(null);
      setVerificationError(null);

      dispatch(fetchUserBankAccounts());
      setIsWithdrawalDialogOpen(true);
      setToastMessage(`Bank Account saved successfully.`);
      setToastVariant("default");
      setToastOpen(true);
    } catch (error: any) {
      console.error("Error saving account:", error);
      setToastMessage(
        error.message || "Failed to add bank account. Please try again."
      );
      setToastVariant("destructive");
      setToastOpen(true);
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleOpenDialog = () => {
    setNewAccount({
      accountNumber: "",
      bankName: "",
      accountName: "",
      bankBranch: "",
      countryCode: "",
      bankCode: "",
      bankId: "",
      currency: "",
    });
    setVerifiedAccountName(null);
    setVerificationError(null);

    setWithdrawalDetails({ bankaccount_id: "", amount: 0 });

    if (accounts.length === 0) {
      setIsAddAccountDialogOpen(true);
    } else {
      setIsWithdrawalDialogOpen(true);
    }
  };

  const handleBankAccountSelectForWithdrawal = (accountId: string) => {
    setWithdrawalDetails({
      ...withdrawalDetails,
      bankaccount_id: accountId,
    });
  };

  // Filtered withdrawals based on status
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    if (filterStatus === "all") {
      return true;
    }
    return withdrawal.status.toLowerCase() === filterStatus;
  });

  if (accountsLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {[...Array(5)].map((_, index) => (
                <th key={index} className="p-4 border-b">
                  <Skeleton className="h-4 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {[...Array(5)].map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton className="h-4 w-full rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (accountsError) {
    return <p>Error: {accountsError}</p>;
  }

  return (
    <ToastProvider swipeDirection="right">
      <div className="p-2 md:p-6 lg:p-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Withdrawals</h1>
          <Button
            className="rounded-full"
            variant={"gradient"}
            onClick={handleOpenDialog}
          >
            Request New Withdrawal
          </Button>
        </div>

        <Dialog
          open={isWithdrawalDialogOpen}
          onOpenChange={setIsWithdrawalDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Withdrawal</DialogTitle>
              <DialogDescription className="text-lg font-semibold">
                Select an account and currency to withdraw funds.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label htmlFor="account-select" className="text-sm font-medium">
                Select Bank Account
              </label>
              <Select
                onValueChange={handleBankAccountSelectForWithdrawal}
                value={withdrawalDetails.bankaccount_id}
              >
                <SelectTrigger id="account-select" className="h-1/2">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.length > 0 ? (
                    accounts.map((account: any) => (
                      <SelectItem
                        key={account.id}
                        value={account.id.toString()}
                      >
                        {account.bank_name} - {account.account_number} (
                        {account.currency})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-accounts" disabled>
                      No bank accounts available. Please add one.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="amount-input" className="text-sm font-medium">
                Amount
              </label>
              <Input
                id="amount-input"
                type="number"
                placeholder="Enter amount"
                value={withdrawalDetails.amount || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWithdrawalDetails({
                    ...withdrawalDetails,
                    amount: Number(e.target.value),
                  })
                }
              />
            </div>

            <Button
              onClick={handleRequestWithdrawal}
              className="rounded-md"
              variant={"gradient"}
              disabled={
                requesting ||
                !withdrawalDetails.bankaccount_id ||
                withdrawalDetails.amount <= 0
              }
            >
              {requesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Requesting...
                </>
              ) : (
                "Submit Withdrawal Request"
              )}
            </Button>
            <DialogClose asChild>
              <Button variant={"destructive"} className="rounded-md w-full">
                Cancel
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAddAccountDialogOpen}
          onOpenChange={setIsAddAccountDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
              <DialogDescription>
                You need to add a bank account before you can make a withdrawal.
              </DialogDescription>
            </DialogHeader>

            <Select
              value={newAccount.countryCode}
              onValueChange={(value) => {
                setNewAccount({
                  ...newAccount,
                  countryCode: value,
                  bankCode: "",
                  bankId: "",
                  bankName: "",
                  accountName: "",
                  accountNumber: "",
                  currency: "",
                });
                setVerifiedAccountName(null);
                setVerificationError(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder-country" disabled>
                  Select Country
                </SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={newAccount.bankCode}
              onValueChange={(value) => {
                const selectedBank = availableBanks.find(
                  (bank) => bank.code === value
                );
                setNewAccount({
                  ...newAccount,
                  bankCode: value,
                  bankId: selectedBank ? selectedBank.id : "",
                  bankName: selectedBank ? selectedBank.name : "",
                  accountName: "",
                  accountNumber: "",
                });
                setVerifiedAccountName(null);
                setVerificationError(null);
              }}
              disabled={!newAccount.countryCode || isFetchingBanks}
            >
              <SelectTrigger disabled={isFetchingBanks}>
                {isFetchingBanks ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                    banks...
                  </div>
                ) : (
                  <SelectValue placeholder="Select Bank" />
                )}
              </SelectTrigger>
              <SelectContent>
                {isFetchingBanks ? (
                  <SelectItem value="loading-banks" disabled>
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                      banks...
                    </div>
                  </SelectItem>
                ) : availableBanks.length > 0 ? (
                  <>
                    <SelectItem value="placeholder-bank" disabled>
                      Select Bank
                    </SelectItem>
                    {availableBanks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </>
                ) : (
                  <SelectItem value="no-banks" disabled>
                    No banks available for selected country
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Account Number"
              value={newAccount.accountNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewAccount({ ...newAccount, accountNumber: e.target.value });
                setVerifiedAccountName(null);
                setVerificationError(null);
              }}
              disabled={!newAccount.bankCode || isFetchingBanks}
            />
            {isVerifyingAccount && (
              <p className="text-sm text-gray-500 flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
                account...
              </p>
            )}
            {verificationError && (
              <p className="text-sm text-red-500">{verificationError}</p>
            )}

            <Input
              type="text"
              placeholder="Account Name (Auto-filled)"
              value={newAccount.accountName}
              readOnly
              className="bg-gray-100"
            />

            <Input
              type="text"
              placeholder="Bank Branch"
              value={newAccount.bankBranch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewAccount({ ...newAccount, bankBranch: e.target.value })
              }
            />

            <Select
              value={newAccount.currency}
              onValueChange={(value) =>
                setNewAccount({ ...newAccount, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder-currency" disabled>
                  Select Currency
                </SelectItem>
                <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                <SelectItem value="USD">USD - United States Dollar</SelectItem>
                <SelectItem value="GBP">
                  GBP - British Pound Sterling
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleSaveAccount}
              className="rounded-md"
              variant={"gradient"}
              disabled={
                isSavingAccount ||
                isVerifyingAccount ||
                isFetchingBanks ||
                !newAccount.accountName ||
                !newAccount.currency ||
                !newAccount.bankCode ||
                !newAccount.countryCode ||
                !newAccount.accountNumber
              }
            >
              {isSavingAccount ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Account"
              )}
            </Button>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                className="rounded-md w-full"
                onClick={() => {
                  setIsAddAccountDialogOpen(false);
                  setNewAccount({
                    accountNumber: "",
                    bankName: "",
                    accountName: "",
                    bankBranch: "",
                    countryCode: "",
                    bankCode: "",
                    bankId: "",
                    currency: "",
                  });
                  setVerifiedAccountName(null);
                  setVerificationError(null);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <div className="mt-8">
          {/* Filter Section */}
          <div className="mb-4 flex items-center gap-4">
            <h2 className="text-xl font-semibold">Withdrawal History</h2>
            <Select
              value={filterStatus}
              onValueChange={(
                value: "all" | "processing" | "paid" | "declined"
              ) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {withdrawalsLoading ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    {[...Array(4)].map((_, index) => (
                      <th key={index} className="p-4 border-b">
                        <Skeleton className="h-4 w-20 rounded" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {[...Array(4)].map((_, colIndex) => (
                        <td key={colIndex} className="p-4">
                          <Skeleton className="h-4 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : withdrawalsError ? (
            <p className="text-red-500">Error: {withdrawalsError}</p>
          ) : filteredWithdrawals.length === 0 ? (
            <p>No withdrawal history found for the selected status.</p>
          ) : (
            <BaseTable data={filteredWithdrawals} columns={withdrawalColumns} />
          )}
        </div>
      </div>
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastVariant}
      >
        <ToastTitle>{toastMessage}</ToastTitle>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};
export default Withdrawals;
