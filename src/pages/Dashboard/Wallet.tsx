import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBankAccount,
  updateBankAccount,
  fetchUserBankAccounts,
} from "../../store/slices/bankSlice";
import { RootState, AppDispatch } from "../../store";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/Dialogue";
import { AiOutlinePlus } from "react-icons/ai";
import { Skeleton } from "../../components/ui/Skeleton";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Loader2 } from "lucide-react";
import { Country } from "country-state-city";
import { ICountry } from "country-state-city";
import {
  fetchBanksByCountry,
  verifyAccountNumber,
} from "../../api/bankaccount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../components/ui/Toast";
import { Bank, BankAccount } from "./_components/interface";

const BankAccountsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading, error } = useSelector(
    (state: RootState) => state.bank
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(
    null
  );
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [isFetchingBanks, setIsFetchingBanks] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );

  const [newAccount, setNewAccount] = useState<BankAccount>({
    accountNumber: "",
    bankName: "",
    accountName: "",
    bankBranch: "",
    countryCode: "",
    bankCode: "",
    bankId: "",
    currency: "",
  });

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [availableBanks, setAvailableBanks] = useState<Bank[]>([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
    dispatch(fetchUserBankAccounts());
  }, [dispatch]);

  useEffect(() => {
    const fetchBanks = async () => {
      if (newAccount.countryCode) {
        setIsFetchingBanks(true);
        try {
          const fetched = await fetchBanksByCountry(newAccount.countryCode);
          console.log(fetched);
          setAvailableBanks(fetched);
        } catch (err: any) {
          setAvailableBanks([]);
          setToastMessage(err.message || "Failed to fetch banks:");
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

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleSaveAccount = async () => {
    setIsSaving(true);
    try {
      const payload: BankAccount = {
        accountNumber: newAccount.accountNumber,
        bankName: newAccount.bankName,
        accountName: newAccount.accountName,
        bankBranch: newAccount.bankBranch,
        countryCode: newAccount.countryCode,
        bankCode: newAccount.bankCode,
        bankId: newAccount.bankId,
        currency: newAccount.currency,
      };

      console.log("Payload being sent:", payload);

      if (selectedAccountId) {
        await dispatch(
          updateBankAccount({ id: selectedAccountId, ...payload })
        ).unwrap();
      } else {
        await dispatch(addBankAccount(payload)).unwrap();
      }
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
      setSelectedAccountId(null);
      setIsDialogOpen(false);
      dispatch(fetchUserBankAccounts());
    } catch (error) {
      console.error("Error saving account:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddAccountDialog = () => {
    setNewAccount({
      accountNumber: "",
      bankName: "",
      accountName: "",
      bankBranch: "",
      countryCode: "",
      bankCode: "",
      currency: "",
    });
    setVerifiedAccountName(null);
    setVerificationError(null);
    setSelectedAccountId(null);
    setIsDialogOpen(true);
  };

  if (loading) {
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

  if (error) return <p>Error: {error}</p>;

  return (
    <ToastProvider>
      <div className="p-0 md:p-[30px]">
        <div className="flex items-center justify-between mb-[20px] gap-5">
          <h1 className="text-xl font-semibold m-0">Bank Accounts</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="rounded-full flex gap-2 items-center"
                variant={"gradient"}
                onClick={handleOpenAddAccountDialog}
              >
                <AiOutlinePlus size={20}/>
                Add New Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>
                {selectedAccountId ? "Update" : "Add"} Bank Account
              </DialogTitle>
              <DialogDescription>
                {selectedAccountId
                  ? "Update your bank account details."
                  : "Enter new bank account details."}
              </DialogDescription>

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
                className="rounded-full"
                placeholder="Account Number"
                value={newAccount.accountNumber}
                onChange={(e) => {
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
              {/* {verifiedAccountName && (
                <Input
                  type="text"
                  placeholder="Verified Account Name"
                  value={verifiedAccountName}
                  readOnly
                  className="mt-2 bg-gray-100"
                />
              )} */}

              <Input
                type="text"
                placeholder="Account Name (Auto-filled)"
                value={newAccount.accountName}
                readOnly
                className="bg-gray-100 rounded-full"
              />

              <Input
                type="text"
                placeholder="Bank Branch"
                className="rounded-full"
                value={newAccount.bankBranch}
                onChange={(e) =>
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
                className="rounded-full"
                variant={"gradient"}
                disabled={
                  isSaving ||
                  isVerifyingAccount ||
                  isFetchingBanks ||
                  !newAccount.accountName ||
                  !newAccount.currency ||
                  !newAccount.bankCode ||
                  !newAccount.accountNumber
                }
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : selectedAccountId ? (
                  "Update Account"
                ) : (
                  "Add Account"
                )}
              </Button>
              <DialogClose asChild>
                <Button
                  variant={"destructive"}
                  className="rounded-full w-full"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedAccountId(null);
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
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto my-4 mt-[30px]">
          <table className="min-w-full rounded-3xl border bg-white border-gray-300 shadow-md py-6">
            <thead className="border-b">
              <tr>
                <th className=" px-4 py-2">Bank Name</th>
                <th className=" px-4 py-2">Account Number</th>
                <th className=" px-4 py-2">Account Name</th>
                <th className=" px-4 py-2">Bank Branch</th>
                <th className=" px-4 py-2">Country</th>
                <th className=" px-4 py-2">Currency</th>
                <th className=" px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {accounts.map((account, index) => (
                <tr
                  key={account.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-white"}
                >
                  <td className=" px-4 py-2">{account.bank_name}</td>
                  <td className=" px-4 py-2">{account.account_number}</td>
                  <td className=" px-4 py-2">{account.account_name}</td>
                  <td className=" px-4 py-2">{account.bank_branch}</td>
                  <td className=" px-4 py-2">
                    {account.country_code || "N/A"}
                  </td>
                  <td className=" px-4 py-2">
                    {account.currency || "N/A"}
                  </td>
                  <td className=" px-4 py-2">
                    <Dialog
                      open={selectedAccountId === account.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setSelectedAccountId(null);
                        }
                      }}
                    >
                      <DialogTrigger
                        onClick={() => {
                          setSelectedAccountId(account.id);
                          setNewAccount({
                            accountNumber: account.account_number,
                            bankName: account.bank_name,
                            accountName: account.account_name,
                            bankBranch: account.bank_branch,
                            countryCode: account.country_code || "",
                            bankCode: account.bank_code || "",
                            bankId: account.bank_id || "",
                            currency: account.currency || "",
                          });
                          setVerifiedAccountName(account.account_name);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Button
                          variant={"outlined"}
                          className=" border border-gray-500 rounded-full"
                        >
                          Update
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default BankAccountsPage;
