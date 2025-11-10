import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pencil,
  Trash2,
  Plus,
  ArrowLeft,
  Calendar,
  CreditCard,
  ChevronLeft,
} from "lucide-react";
import PaymentSetup from "../stripe/payment-form";
import { useUser } from "@/context/usercontext";

const PaymentMethodModal = ({ open, onOpenChange, onSuccess }) => {
  const [screen, setScreen] = useState("select");
  const [selected, setSelected] = useState("card");
  const {user} = useUser()
  if (!open) return null;
  const paymentHandler = () => {
    onSuccess();
    onOpenChange();
  };
  const handleCardSubmit = (e) => {
    e.preventDefault();
    setScreen("select");
  }

  function PaymentForm(){
    return<>
     {screen === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-left text-secondary !font-poppins">
                Select Payment Method
              </DialogTitle>
            </DialogHeader>
            <div className="border-t mt-3 mb-4" />

            <RadioGroup
              value={selected}
              onValueChange={setSelected}
              className="space-y-3"
            >
              <Card className="flex flex-row items-center justify-between px-5 py-3 rounded-xl border hover:border-gray-400 transition">
                <div className="flex items-center gap-3">
                  <img src="/apple-pay.svg" alt="apple pay" />
                  <span className="font-medium">Apple Pay</span>
                </div>
                <RadioGroupItem value="apple" />
              </Card>

              <Card className="flex flex-row items-center justify-between px-5 py-3 rounded-xl border hover:border-gray-400 transition">
                <div className="flex items-center gap-3">
                  <img src="/pp-logo.svg" alt="paypal" />
                  <span className="font-medium">Paypal</span>
                </div>
                <RadioGroupItem value="paypal" />
              </Card>
              <div className="flex items-center justify-left gap-2">
                <Card className="flex flex-row items-center justify-between px-5 py-3 rounded-xl border hover:border-gray-400 transition w-[85%]">
                  <div className="flex items-center gap-3">
                    <img
                      src="/mc-card.svg"
                      alt="card"
                      className="w-10 h-15 object-contain"
                    />
                    <span className="tracking-widest font-medium">
                      •••• •••• •••• 2451
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="card" />
                  </div>
                </Card>
                <div className="flex items-center justify-between gap-3">
                  <Pencil
                    className="w-4 h-4 text-secondary cursor-pointer"
                    onClick={() => setScreen("add")}
                  />
                  <Trash2 className="w-4 h-4 text-secondary cursor-pointer" />
                </div>
              </div>
            </RadioGroup>

            <button
              onClick={() => setScreen("add")}
              className="w-full mt-4 py-4 bg-[#f5ede7] rounded-full cursor-pointer text-center text-sm font-medium flex items-center justify-center gap-2 text-tertiary hover:bg-[#e3d5ca] transition"
            >
              <Plus className="w-4 h-4" /> Add New Credit / Debit Card
            </button>

            <Button
              size="lg"
              onClick={paymentHandler}
              className="w-full mt-1"
              variant="secondary"
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-left gap-2">
              <button
                onClick={() => setScreen("select")}
                className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
              >
                <ChevronLeft className="w-6 h-6 mr-1" />
              </button>
              <DialogTitle className="text-lg font-semibold text-secondary !font-poppins">
                Add Card
              </DialogTitle>
              {/* <div className="w-6" />  */}
            </div>
            <div className="border-t mt-3 mb-4" />

            {/* FORM */}
            <form className="space-y-3 px-5" onSubmit={handleCardSubmit}>
              <p className="text-sm text-secondary">Enter Card Details</p>
              <Input placeholder="Name on Card" className="bg-white" />
              <Input placeholder="Card Number" className="bg-white" />

              <div className="flex gap-3">
                <div className="relative w-1/2">
                  <Input placeholder="MM / YY" className="bg-white" />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-secondary" />
                </div>
                <div className="relative w-1/2">
                  <Input placeholder="CVV" className="bg-white" />
                  <CreditCard className="absolute right-3 top-2.5 w-4 h-4 text-secondary" />
                </div>
              </div>

              <Input placeholder="ZIP Code" className="bg-white" />

              <div className="flex items-center space-x-2 mt-3">
                <Checkbox id="save" />
                <label
                  htmlFor="save"
                  className="text-sm text-secondary select-none"
                >
                  Save Card information
                </label>
              </div>

              <div className="flex justify-between mt-5">
                <Button
                  variant="outline"
                  onClick={() => setScreen("select")}
                  type="button"
                  className="w-[48%] border-[#5a0a0a] text-[#5a0a0a] hover:bg-[#f8f1ef]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-[48%] bg-[#5a0a0a] hover:bg-[#4a0808] text-white"
                >
                  Save
                </Button>
              </div>
            </form>
          </>
        )}
    </>
  }
  
console.log(user)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
      <DialogContent className="max-w-md rounded-2xl p-6 shadow-xl bg-white overflow-auto max-h-screen">
        <PaymentSetup userId={user?.attributes?.sub} />
      </DialogContent>
      </div>
    </Dialog>
  );
};
export default PaymentMethodModal;

