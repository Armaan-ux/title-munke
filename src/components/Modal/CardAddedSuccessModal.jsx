import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/usercontext";

export default function CardAddedSuccessModal({
  open,
  onOpenChange,
  isLoading,
  showCloseIcon = true,
  onFailed,
  fromSignUp
}) {
  const navigate = useNavigate();
    const { user } = useUser();
   
  const subscribeHandler = () => {
    // onFailed();
    onOpenChange();

    //clear all query params using react router
    //dynamically get current url
    if(fromSignUp){
 navigate("/" + user.signInUserSession.idToken.payload["cognito:groups"][0]);
    }else{
      navigate(window.location.pathname, { replace: true });

    }

  };
  if (!open) return null;
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
        <DialogContent  showCloseButton={false}
          className="relative w-[360px] p-0 rounded-2xl bg-white border-none overflow-visible z-50"
          style={{
            top: "50% !important",
            left: "50% !important",
            transform: "translate(-50%, -50%) !important",
            position: "fixed",
            margin: 0,
          }}
        >
          {showCloseIcon && <Button
            onClick={() => onOpenChange(false)}
            className="absolute -top-3 -right-3 bg-white hover:bg-gray-100 rounded-full shadow-md p-1 z-50"
          >
            <X strokeWidth={3} className="w-4 h-4 text-[#2C1B13]" />
          </Button>}

          <div className="overflow-hidden rounded-2xl">
            <div className="relative bg-secondary text-white flex flex-col items-center justify-center py-5">
              <img src="/add-Card-Success.png" alt="success" />
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl font-semibold pt-4 !font-poppins">
                  <div className="flex flex-col items-center">
                    <p>Card Added</p>
                    <p>Successfully!</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-6 text-center">
              <p className="text-sm text-coffee-light text-600 mb-5 leading-relaxed">
                Your card details has been <br/>
                successfully added.
              </p>

              <Button
                onClick={subscribeHandler}
                className="w-32 bg-[#5A0A0A] hover:bg-[#460707] text-white rounded-lg py-2 text-sm"
                disabled={isLoading}
              >
                Continue
                  {isLoading && <Loader className="animate-spin ml-2" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
