import { useEffect, useState } from "react";
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
import { Skeleton } from "../../components/ui/Skeleton";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const BankAccountsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading, error } = useSelector(
    (state: RootState) => state.bank
  );

  const [newAccount, setNewAccount] = useState({
    acoountNumber: "",
    bankName: "",
    accountName: "",
    bankBranch: "",
  });
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserBankAccounts());
  }, [dispatch]);

  const handleSaveAccount = async () => {
    try {
      if (selectedAccountId) {
        await dispatch(
          updateBankAccount({ id: selectedAccountId, ...newAccount })
        ).unwrap();
      } else {
        await dispatch(addBankAccount(newAccount)).unwrap();
      }
      setNewAccount({
        acoountNumber: "",
        bankName: "",
        accountName: "",
        bankBranch: "",
      });
      setSelectedAccountId(null);
      setIsDialogOpen(false);
      dispatch(fetchUserBankAccounts());
    } catch (error) {
      console.error("Error saving account:", error);
    }
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
    <div>
      <h1>Bank Accounts</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <Button className="rounded-full" variant={"gradient"}>
            Add New Bank Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>Enter new bank account details.</DialogDescription>
          <Input
            type="text"
            placeholder="Bank Name"
            value={newAccount.bankName}
            onChange={(e) =>
              setNewAccount({ ...newAccount, bankName: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Account Number"
            value={newAccount.acoountNumber}
            onChange={(e) =>
              setNewAccount({ ...newAccount, acoountNumber: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Account Name"
            value={newAccount.accountName}
            onChange={(e) =>
              setNewAccount({ ...newAccount, accountName: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Bank Branch"
            value={newAccount.bankBranch}
            onChange={(e) =>
              setNewAccount({ ...newAccount, bankBranch: e.target.value })
            }
          />
          <Button
            onClick={handleSaveAccount}
            className="rounded-md"
            variant={"gray"}
          >
            Add Account
          </Button>
          <DialogClose>
            <Button variant={"destructive"} className="rounded-md w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-300 shadow-md py-6 rounded-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Bank Name</th>
              <th className="border px-4 py-2">Account Number</th>
              <th className="border px-4 py-2">Account Name</th>
              <th className="border px-4 py-2">Bank Branch</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {accounts.map((account, index) => (
              <tr
                key={account.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="border px-4 py-2">{account.bank_name}</td>
                <td className="border px-4 py-2">{account.acoount_number}</td>
                <td className="border px-4 py-2">{account.account_name}</td>
                <td className="border px-4 py-2">{account.bank_branch}</td>
                <td className="border px-4 py-2">
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
                        setNewAccount({ ...account });
                      }}
                    >
                      <Button>Update</Button>
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
                      <Input
                        type="text"
                        placeholder="Bank Name"
                        value={newAccount.bankName}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            bankName: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="text"
                        placeholder="Account Number"
                        value={newAccount.acoountNumber}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            acoountNumber: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="text"
                        placeholder="Account Name"
                        value={newAccount.accountName}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            accountName: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="text"
                        placeholder="Bank Branch"
                        value={newAccount.bankBranch}
                        onChange={(e) =>
                          setNewAccount({
                            ...newAccount,
                            bankBranch: e.target.value,
                          })
                        }
                      />
                      <Button
                        onClick={handleSaveAccount}
                        variant={"gradient"}
                        className="rounded-md"
                      >
                        {selectedAccountId ? "Update" : "Add"} Account
                      </Button>
                      <DialogClose>
                        <Button
                          variant={"destructive"}
                          className="rounded-md w-full"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankAccountsPage;
