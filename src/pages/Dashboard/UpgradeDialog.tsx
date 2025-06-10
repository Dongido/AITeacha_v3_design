import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "../../components/ui/Dialogue";
import { Button } from "../../components/ui/Button";

const PaymentMethodDialog: React.FC<{
  onSelectPaymentMethod: (
    method: "stripe" | "flutterwave",
    planName: "pro" | "premium" | "enterprise" | "admin"
  ) => void;
  planName: "pro" | "premium" | "enterprise" | "admin";
  isOpen: boolean;

  onClose: () => void;
  onOpenChange?: any;
  currency: string;
}> = ({
  onSelectPaymentMethod,
  planName,
  isOpen,
  onClose,
  onOpenChange,
  currency,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-10">
          <Button
            onClick={() => onSelectPaymentMethod("flutterwave", planName)}
            className="w-full py-2 text-2xl bg-white border border-gray-300 rounded-md flex items-center justify-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flutterwave_Logo.png/800px-Flutterwave_Logo.png"
              alt="Flutterwave Logo"
              className="h-12 ml-2"
            />
          </Button>
          {currency !== "NGN" && (
            <div>
              <Button
                onClick={() => onSelectPaymentMethod("stripe", planName)}
                className="w-full py-2 bg-white border text-2xl border-gray-300 rounded-md flex items-center justify-center"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png"
                  alt="Stripe Logo"
                  className="h-10 ml-2"
                />
              </Button>
              <div className="flex items-center justify-end mt-0 space-x-4">
                <span className="font-bold text-sm italic">
                  Stripe does'nt support payment with Verve
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full py-2 bg-red-800 rounded-md "
              onClick={onClose}
            >
              <span className="text-white"> Cancel</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
